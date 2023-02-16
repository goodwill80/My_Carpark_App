import { useMemo, memo, useState, useEffect, useContext } from 'react';

import { CarparkContext } from '../Context/CarparkContext';

import { BsSkipBackwardCircleFill } from 'react-icons/bs';

import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from '@react-google-maps/api';

import Spinner from '../images/spinner.gif';

function MapSingleModal({
  id,
  item,
  carpark_number,
  address,
  lots,
  lat,
  lon,
  user,
  free_parking,
  timer,
  trigger,
}) {
  const { addToFavorite, favoriteCp } = useContext(CarparkContext);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });

  const isFav = favoriteCp.find((item) => item._id === id);

  const center = useMemo(
    () => ({ lat: Number(lat), lng: Number(lon) }),
    [lat, lon]
  );

  // const calculateRoute = async () => {
  //   try {
  //     console.log('calling direction service');
  //     const directionsService = new window.google.maps.DirectionsService();
  //     const results = await directionsService.route({
  //       origin: user.location,
  //       destination: address,
  //       travelMode: window.google.maps.TravelMode.DRIVING,
  //     });
  //     console.log(results);
  //     setDirectionsResponse(results);
  //   } catch (e) {
  //     console.log(e);
  //     console.log(e.message);
  //   }
  // };

  const calculateRoute = async () => {
    try {
      // console.log('this');
      let delayFactor = 0;
      const request = {
        origin: user.location,
        destination: address,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      const directionsService = new window.google.maps.DirectionsService();

      await directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result);
        } else if (status === 'OVER_QUERY_LIMIT') {
          delayFactor++;
          setTimeout(function () {
            calculateRoute();
          }, delayFactor * 1500);
        } else {
          console.log('Route: ' + status);
        }
      });
    } catch (e) {
      // console.log(e);
      console.log(e.message);
    }
  };

  useEffect(() => {
    // console.log('effect');
    setLoading(true);
    // calculateRoute();
    const calRoute = setTimeout(() => {
      calculateRoute();
      setLoading(false);
    }, timer);

    return () => clearInterval(calRoute);
  }, [trigger]);

  // trigger, triggerZoom;

  if (!isLoaded) {
    return (
      <div className="absolute">
        <img className="h-[200px]" src={Spinner} alt="spinner" />
      </div>
    );
  }

  return (
    <div>
      <input type="checkbox" id={`my-modal-${id}`} className="modal-toggle" />
      <label htmlFor={`my-modal-${id}`} className="modal cursor-pointer">
        <label className="modal-box relative h-[85vh] w-full" htmlFor="">
          <div className="relative flex justify-between space-x-4 py-2">
            <h3 className="ml-4 text-md font-bold text-red-900">
              Carpark {carpark_number}
            </h3>

            {loading && (
              <p className="animate-ping text-red-500 tracking-widest text-[12px]">
                Routing...
              </p>
            )}

            <button
              onClick={() => addToFavorite(item)}
              className={`text-sm border border-green-500 ${
                isFav ? 'bg-green-500 text-white' : 'text-green-500'
              } rounded-lg px-2 hover:border-green-900 hover:text-green-900`}
            >
              {isFav ? 'Fav' : 'Add to Fav'}
            </button>
          </div>

          <p className="text-sm ml-4 font-semibold">{address}</p>
          <p className="text-sm ml-4 text-red-600">{lots} lots remaining</p>
          <p className="text-sm ml-4 text-green-900 mb-2">
            Free parking - {free_parking}
          </p>

          <GoogleMap
            center={center}
            zoom={12}
            mapContainerStyle={{
              width: '100%',
              height: '60%',
              margin: '0 auto',
            }}
            onLoad={(map) => setMap(map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>

          <div className="mt-2 text-red-700 text-sm">
            <p>
              Shortest driving distance from your location:{' '}
              {loading ? (
                <span className="text-teal-400 font-semibold text-sm">
                  loading...
                </span>
              ) : (
                <span className="font-semibold">
                  {directionsResponse &&
                    directionsResponse.routes[0].legs[0].distance.text}
                </span>
              )}
            </p>
            <p>
              Estimated Time to reach destination:{' '}
              {loading ? (
                <span className="text-teal-400 font-semibold text-sm">
                  loading...
                </span>
              ) : (
                <span className="font-semibold">
                  {directionsResponse &&
                    directionsResponse.routes[0].legs[0].duration.text}
                </span>
              )}
            </p>
            <p>
              Trave Mode: <span className="font-semibold">DRVING</span>
            </p>
          </div>

          <div className="flex flex-col justify-center items-center">
            <BsSkipBackwardCircleFill
              onClick={() => map.panTo(center)}
              className="cursor-pointer mt-2"
              size={20}
            />

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${user.location}+singapore&destination=${address}+singapore&travelmode=driving`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <button className="btn btn-sm btn-success mt-2">
                Start Navigation
              </button>
            </a>
          </div>
        </label>
      </label>
    </div>
  );
}

export default memo(MapSingleModal);
