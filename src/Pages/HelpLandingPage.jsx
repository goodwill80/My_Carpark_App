import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import Signal from '../images/signal.gif';

function HelpLanding() {
  const [loading, setLoading] = useState(false);
  const { userlocale, username } = useParams();
  const [origin, setOrigin] = useState('');

  const getAddress = async (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const response = await axios.get(
      `/.netlify/functions/geocodeLatLngApi?latitude=${latitude}&&longtitude=${longitude}`
    );
    const address = response.data;
    setOrigin(address);
  };

  const getOrigin = () => {
    setLoading(() => true);
    navigator.geolocation.getCurrentPosition((location) => {
      getAddress(location);
      setLoading(() => false);
    });
    setOrigin('');
  };

  useEffect(() => {
    getOrigin();
  }, []);

  return (
    <div className="min-h-full h-[100vh] w-full flex flex-col justify-center items-center gap-4">
      {loading ? (
        <img className="mix-blend-multiply" src={Signal} alt="Loading.." />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-400">HDB Carpark App</h1>
          <h1 className="font-bold text-4xl text-red-600">
            {username} is in trouble and needs your help!!!
          </h1>
          <h1 className="font-bold text-2xl text-blue-400">
            We have received his SOS and sent you a route to reach his location
          </h1>
          <p className="font-semibold">By clicking on the button below</p>
          <p className="text-red-400 font-semibold">
            You have agreed to the terms of releasing your location to us
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${origin}+singapore&destination=${userlocale}+singapore&travelmode=driving`}
          >
            <button className="btn btn-circle px-4 text-white hover:bg-green-500 hover:border-green-500">
              Go
            </button>
          </a>
        </>
      )}
    </div>
  );
}

export default HelpLanding;
