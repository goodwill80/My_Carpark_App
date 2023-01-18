import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import signal from '../images/signal.gif';

function PassengerLandingPage() {
  const [passengerAddress, setPassengerAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { driveraddress, drivername } = useParams();
  console.log(driveraddress, drivername);

  const getAddress = async (location) => {
    try {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const response = await axios.get(
        `/.netlify/functions/geocodeLatLngApi?latitude=${latitude}&&longtitude=${longitude}`
      );
      const address = response.data;
      setPassengerAddress(address);
    } catch (e) {
      console.log(e.message);
    }
  };

  // Get the user permission on a form, once he clicks submit.
  const getPassengerCoordinates = () => {
    setIsLoading(() => true);
    navigator.geolocation.getCurrentPosition((location) => {
      getAddress(location);
      setIsLoading(() => false);
    });
  };

  useEffect(() => {
    getPassengerCoordinates();
  }, []);

  return (
    <div className="min-h-[100vh] h-[100vh] flex flex-col justify-center items-center gap-8">
      {isLoading ? (
        <img className="mix-blend-multiply" src={signal} alt="signal gif" />
      ) : (
        <>
          <h1 className="text-4xl font-bold text-red-300 text-center px-3">
            HDB Carpark App
          </h1>
          <p className="text-blue-400 text-2xl font-bold text-center px-4">
            Hello, {drivername ? drivername : 'someone'} has sent you his/her
            current position.
          </p>
          <p className="text-md text-semibold text-center px-16">
            Please click on the button below to navigate to his/her location.
          </p>
          <p className="text-lg text-bold text-red-700 text-center px-16">
            You acknowledged that by doing so, we will be extracting your
            current location
          </p>
          <button className="btn btn-success btn-sm mt-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${passengerAddress}+singapore&destination=${driveraddress}+singapore&travelmode=walking`}
            >
              Let's go
            </a>
          </button>
        </>
      )}
    </div>
  );
}

export default PassengerLandingPage;
