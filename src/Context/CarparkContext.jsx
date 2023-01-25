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
  const [carparks, setCarparks] = useState(); // All carparks from the 2 govt APIs
  const [user, setUser] = useState(initialUserState); // User sign in data
  const [isLoading, setIsLoading] = useState(true); // Initial loader after sign-in
  const [signIn, setSignIn] = useState(false); // Sign-in and redirect routing condition
  const [triggerZoom, setTriggerZoom] = useState(false); // Trigger different zooms on map based on search locations
  const [openSideBar, setOpenSideBar] = useState(false); // Open and close sidebar
  const [favoriteCp, setFavoriteCp] = useState([]); // Add favorite carparks

  const [counter, setCounter] = useState(60); // For passenger page
  const [countdown, setCountdown] = useState(1800); // For data refresh

  useEffect(() => {
    const favoriteCarparks =
      JSON.parse(localStorage.getItem('favoriteCarparks')) || [];
    setFavoriteCp(favoriteCarparks);
  }, []);

  // Add Favorite Carpark
  const addToFavorite = (item) => {
    const check = favoriteCp.find((cp) => cp._id === item._id);
    if (check) {
      Swal.fire({
        title: 'CP is already in Favorites',
        icon: 'error',
        confirmButtonText: 'okay!',
      });
      return;
    }
    const newFavList = [...favoriteCp, item];
    localStorage.setItem('favoriteCarparks', JSON.stringify(newFavList));
    setFavoriteCp([...newFavList]);
    Swal.fire({
      title: 'Added to favorites',
      icon: 'success',
      confirmButtonText: 'Great!',
    });
  };

  const removeFrFavorite = (id) => {
    const fav = favoriteCp.find((item) => item._id === id);
    const newList = fav
      ? favoriteCp.filter((item) => item._id !== id)
      : favoriteCp;
    localStorage.setItem('favoriteCarparks', JSON.stringify(newList));
    setFavoriteCp([...newList]);
    Swal.fire({
      title: 'Removed from favorites',
      icon: 'success',
      confirmButtonText: 'Great!',
    });
  };

  // Load all Carparks on sign-in Page and refresh every half hour
  useEffect(() => {
    fetchCarparks();
    const halfHourRefresh = setInterval(() => {
      fetchCarparks();
    }, 1800000);
    return () => clearInterval(halfHourRefresh);
  }, []);

  useEffect(() => {
    const timerToRefresh = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerToRefresh);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setCountdown(() => 1800);
      Swal.fire({
        title: 'Carpark data updated!',
        icon: 'success',
        confirmButtonText: 'Okay!',
      });
    }
  }, [countdown]);

  // Fetch APIs for all CPs
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

  // Heper method for getUserData below to convert coords to string string address using geocoding
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
  // Get user cords and state all details in user state
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

  const resetPosition = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      getAddress(location);
      setUser((prev) => {
        return {
          ...prev,
          raw_data: location,
          coordinates: {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          },
        };
      });
      setIsLoading(false);
    });
  };

  // Reset of all tiggers back to default
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
    resetPosition,
    counter,
    setCounter,
    countdown,
    addToFavorite,
    favoriteCp,
    removeFrFavorite,
  };

  return (
    <CarparkContext.Provider value={context}>
      {children}
    </CarparkContext.Provider>
  );
}

export default CarparkContextProvider;
