import {useParams} from "react-router-dom";
import {useState, useEffect} from 'react';
import axios from 'axios';
import signal from "../images/signal.gif";

function PassengerLandingPage() {
const [passengerAddress, setPassengerAddress] = useState('');
const [isLoading, setIsLoading] = useState(false);

const {driveraddress, drivername} = useParams();
console.log(driveraddress, drivername);

const API_KEY = process.env.REACT_APP_API_KEY;

// href={`https://www.google.com/maps/dir/?api=1&origin=${passengerAddress}+singapore&destination=${driverAddress}+singapore&travelmode=walking`}

const getAddress = async (location) => {
    try {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      const address = response.data.results[0].formatted_address;
      setPassengerAddress(address);
    } catch (e) {
      console.log(e.message);
    }
  };

  // Get the user permission on a form, once he clicks submit.
  const getPassengerCoordinates = () => {
    setIsLoading(() => true);
    navigator.geolocation.getCurrentPosition((location) => {
        getAddress(location)
        setIsLoading(() => false);
    })
  };

  useEffect(() => {
    getPassengerCoordinates();
  }, []) 

  return (
   
  <div className="min-h-[100vh] h-[100vh] flex flex-col justify-center items-center">
    {isLoading ? (<img className="mix-blend-multiply" src={signal} alt="signal gif"/>) : ( 
    <>
    <h1 className="text-3xl text-blue-500">HDB Carpark App</h1>
    <p className="text-lg font-bold">Hello, {drivername} has sent you their current position.</p>
    <p className="text-md">Please click on the button below to navigate to their location.</p>
    <button className="btn btn-success btn-sm mt-3">
      <a href={`https://www.google.com/maps/dir/?api=1&origin=${passengerAddress}+singapore&destination=${driveraddress}+singapore&travelmode=walking`}>
      Let's go
      </a>
      </button>
      </>)}
  </div>
  
    

  );
}

export default PassengerLandingPage;