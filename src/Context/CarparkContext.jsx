import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SVY21 } from '../svy21.js';

import Swal from 'sweetalert2';

let cv = new SVY21();

// CP API with lots availability but no addresses (it contains carpark number)
const BASE_URL = '/.netlify/functions/carparkAvailApi';

// CP API with Addresses and Coordinates but no lots availability (it contains carpark number)
const BASE_URL2 = '/.netlify/functions/carparkAddrApi';

export const CarparkContext = createContext();

const initialUserState = {
  name: '',
  email: '',
  agree: false,
  coordinates: {},
  raw_data: {},
  location: '', // in string
};

function CarparkContextProvider({ children }) {
  const [carparks, setCarparks] = useState();
  const [user, setUser] = useState(initialUserState);
  const [isLoading, setIsLoading] = useState(true);
  const [signIn, setSignIn] = useState(false);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);

  useEffect(() => {
    fetchCarparks();
    const halfHourRefresh = setInterval(() => {
      fetchCarparks();
    }, 1800000);
    return () => clearInterval(halfHourRefresh);
  }, []);

  const fetchCarparks = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(BASE_URL),
        axios.get(BASE_URL2),
      ]);
      const carparkWithLots = res1.data; // [ {}, {}]
      const carparkWithAddr = res2.data; // [ {}, {}]

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
        `/.netlify/functions/geocodeLatLngApi?latitude=${latitude}&&longtitude=${longitude}`
      );
      const address = response.data;
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

  const signout = () => {
    setSignIn(() => false);
    setIsLoading(true);
    setUser(() => initialUserState);
    setOpenSideBar(false);
    Swal.fire({
      title: 'You have signed out successfully!',
      text: 'You are most welcome back again!',
      icon: 'success',
      confirmButtonText: 'Great!',
    });
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
    signout,
    openSideBar,
    setOpenSideBar,
    fetchCarparks,
  };

  return (
    <CarparkContext.Provider value={context}>
      {children}
    </CarparkContext.Provider>
  );
}

export default CarparkContextProvider;
