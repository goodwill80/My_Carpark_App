import { useEffect, useMemo, useState } from 'react';
import styles from './MapModalFull.module.css';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { BsSkipBackwardCircleFill } from 'react-icons/bs';

import Spinner from '../images/spinner.gif';

function MapModalFull({ results, user, triggerZoom, querySearchCoords }) {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [zoom, setZoom] = useState(10);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });

  useEffect(() => {
    if (!triggerZoom) {
      setZoom(() => 15);
    } else {
      setZoom(() => 11);
    }
    return () => setZoom(10);
  }, [triggerZoom]);

  const center = useMemo(
    () => ({ lat: user.coordinates.lat, lng: user.coordinates.lon }),
    []
  );

  const openInfo = (item) => {
    setSelectedMarker(item);
  };

  if (!isLoaded) {
    return (
      <div className="absolute top-32 flex justify-center items-center w-[100%]">
        <img className="h-[200px]" src={Spinner} alt="spinner" />
      </div>
    );
  }

  return (
    <>
      {/* MODAL */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative w-[100vw] max-w-7xl h-full flex flex-col justify-center items-center">
          <h1 className="text-2xl pb-2 font-bold text-teal-600 hidden md:block">
            Map view
          </h1>
          <GoogleMap
            center={center}
            zoom={zoom}
            mapContainerStyle={{ width: '90%', height: '100%' }}
            onLoad={(map) => setMap(map)}
            options={
              {
                //   zoomControl: false,
                //   streetViewControl: false,
                //   mapTypeControl: false,
                //   fullscreenControl: false,
              }
            }
          >
            {/* YOUR LOCATION */}
            <Marker
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              }}
              position={{
                lat: Number(user.coordinates.lat),
                lng: Number(user.coordinates.lon),
              }}
              label={{
                color: 'teal',
                fontWeight: 'semibold',
                fontSize: '10px',
                text: 'CURRENT LOCATION',
                className: `${styles.marker}`,
              }}
            />
            {/* SEARCH LOCATION */}
            {querySearchCoords ? (
              <Marker
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                }}
                position={querySearchCoords}
                label={{
                  color: 'teal',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  text: 'SEARCH LOCATION',
                  className: `${styles.marker}`,
                }}
              />
            ) : (
              ''
            )}
            {/* CARPARKS LOCATIONS */}
            {results.map((item, index) => (
              <Marker
                key={index}
                position={{ lat: Number(item.lat), lng: Number(item.lon) }}
                onClick={() => openInfo(item)}
              />
            ))}
            {/* Info Window on Click */}
            {selectedMarker && (
              <div className="relative p-4">
                <InfoWindow
                  position={{
                    lat: Number(selectedMarker.lat),
                    lng: Number(selectedMarker.lon),
                  }}
                >
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-center font-bold text-blue-700">
                      {selectedMarker.address
                        .substring(0, 25)
                        .replace('BLK', '')}
                    </h1>
                    <p className="text-center font-semibold">
                      CP {selectedMarker.car_park_no}
                    </p>
                    <p className="text-center text-blue-500 font-semibold">
                      {selectedMarker.distance}km from searched location
                    </p>
                    <p className="text-center font-bold">
                      {selectedMarker.carpark_info[0].lots_available} lots
                      available
                    </p>
                    <p className="mt-1 text-blue-600 underline hover:text-blue-900 cursor-pointer">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${user.location}+singapore&destination=${selectedMarker.address}+singapore&travelmode=driving`}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        Navigate
                      </a>
                    </p>
                    <button
                      className="btn btn-xs mt-4"
                      onClick={() => openInfo(null)}
                    >
                      Close
                    </button>
                    <div className="w-6 h-6 absolute top-0 right-0 z-30 bg-white"></div>
                  </div>
                </InfoWindow>
              </div>
            )}
          </GoogleMap>
          <div className="flex md:flex-col md:items-center justify-center items-baseline gap-3">
            <div className="flex flex-col justify-center items-center">
              <BsSkipBackwardCircleFill
                onClick={() => map.panTo(center)}
                className="cursor-pointer mt-3"
                size={20}
              />
              <p className="hidden md:flex">Back</p>
            </div>
            {/* <div className="modal-action">
              <label
                htmlFor="my-modal"
                className="btn btn-success hidden md:flex md:btn-md md:text-md"
              >
                Close
              </label>
            </div> */}
            <div className="modal-action absolute top-0 right-5 cursor-pointer">
              <label htmlFor="my-modal" className="font-bold cursor-pointer">
                X
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapModalFull;
