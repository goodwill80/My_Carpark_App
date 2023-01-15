import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SVY21 } from '../svy21.js';

let cv = new SVY21();

// CP API with lots availability but no addresses (it contains carpark number)
const BASE_URL = 'https://api.data.gov.sg/v1/transport/carpark-availability';

// CP API with Addresses and Coordinates but no lots availability (it contains carpark number)
const BASE_URL2 =
  'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000&q=';

const API_KEY = process.env.REACT_APP_API_KEY;

export const CarparkContext = createContext();

function CarparkContextProvider({ children }) {
  const [carparks, setCarparks] = useState();
  const [user, setUser] = useState({
    name: '',
    email: '',
    agree: false,
    coordinates: {},
    raw_data: {},
    location: '', // in string
  });
  const [isLoading, setIsLoading] = useState(true);
  const [signIn, setSignIn] = useState(false);
  const [triggerZoom, setTriggerZoom] = useState(false);

  useEffect(() => {
    fetchCarparks();
  }, []);

  const fetchCarparks = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(BASE_URL),
        axios.get(BASE_URL2),
      ]);
      const carparkWithLots = res1.data.items[0].carpark_data; // [ {}, {}]
      const carparkWithAddr = res2.data.result.records; // [ {}, {}]

      const merge = carparkWithLots.map((item) => {
        const findMatching = carparkWithAddr.find(
          (cp) => cp.car_park_no === item.carpark_number
        );

        const coodinates = cv.computeLatLon(
          findMatching?.y_coord,
          findMatching?.x_coord
        );

        const newObj = findMatching
          ? {
              ...item,
              ...findMatching,
              lat: coodinates.lat.toFixed(7),
              lon: coodinates.lon.toFixed(7),
            }
          : {
              ...item,
              carpark_info: [],
              update_datetime: 'Not available',
              lat: coodinates.lat.toFixed(7),
              lon: coodinates.lon.toFixed(7),
            };
        return newObj;
      });
      setCarparks(merge);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getAddress = async (location) => {
    try {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      const address = response.data.results[0].formatted_address;
      setUser((prev) => {
        return { ...prev, location: address };
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  // Get the user permission on a form, once he clicks submit.
  const getUserData = async (form) => {
    try {
      await navigator.geolocation.getCurrentPosition((location) => {
        getAddress(location);
        setUser((prev) => {
          return {
            ...prev,
            name: form.name,
            email: form.email,
            raw_data: location,
            coordinates: {
              lat: location.coords.latitude,
              lon: location.coords.longitude,
            },
          };
        });
        setIsLoading(false);
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  const context = {
    carparks,
    getUserData,
    user,
    isLoading,
    setIsLoading,
    signIn,
    setSignIn,
    triggerZoom,
    setTriggerZoom,
  };

  return (
    <CarparkContext.Provider value={context}>
      {children}
    </CarparkContext.Provider>
  );
}

export default CarparkContextProvider;
