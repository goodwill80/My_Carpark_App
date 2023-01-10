import { useContext, useState } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Loading_icon from '../images/spinner.gif';
import * as geolib from 'geolib';
import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

function SearchPage() {
  const { user, isLoading, carparks } = useContext(CarparkContext); // states from context
  const [results, setResults] = useState([]); // New list of carparks with distances
  const [preferredDist, setPreferredDist] = useState(1); // User's choice of distance radius
  const [query, setQuery] = useState(''); // Search field query entered by user

  // Load Carparkss near User's position when btn clicked
  const loadCarParks = () => {
    const userCoords = user.coordinates;
    console.log(userCoords);
    // Loop all car parks and calculate dist
    const userCarparks = carparks.map((item) => {
      const distance =
        geolib.getDistance(userCoords, { lat: item.lat, lon: item.lon }) / 1000;
      const newObj = { ...item, distance: distance };
      return newObj;
    });
    const filteredList = userCarparks
      .filter((item) => item.distance < preferredDist)
      .sort((a, b) => a.distance - b.distance);
    console.log(filteredList);
    setResults(filteredList);
  };

  // Handler for search Form
  const searchHandler = (e) => {
    setQuery(e.target.value);
  };

  // Load Carparks based on user search
  const searchCp = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${query}+singapore&key=AIzaSyC6nZH6flUP0rUUJpy9mtaJE3LLxwAA8wo`
      );
      const coords = response.data.results[0]?.geometry?.location;
      if (coords.hasOwnProperty('lat')) {
        const carparkList = carparks.map((item) => {
          const dist =
            geolib.getDistance(coords, { lat: item.lat, lon: item.lon }) / 1000;
          return { ...item, distance: dist };
        });
        const filterCarparksByDist = carparkList.filter(
          (item) => item.distance <= preferredDist
        );
        console.log(filterCarparksByDist);
        setResults(() => [...filterCarparksByDist]);
        setQuery('');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="h-[100vh] flex justify-between items-center">
          <img className="h-[250px]" src={Loading_icon} alt="Loading_icon" />
        </div>
      ) : (
        user.name && (
          <div className="min-h-[100vh] h-auto flex flex-col justify-start items-center px-24 gap-4 mt-12">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-4">Search for Carparks</h1>
              <p>
                Hello,{' '}
                <span className="font-bold text-xl text-orange-400">
                  {user.name}
                </span>
                !
              </p>

              <p className="font-semibold">We have found your location at</p>
              <p className="text-blue-400 font-bold">{user.location}</p>
            </div>
            <div>
              <h1 className="text-2xl text-red-400 font-semibold">
                What would you like to do today?
              </h1>
            </div>
            {/* 1. USER SERACH CP FROM OWN LOCATION */}
            <h1 className="text-green-700 font-semibold">
              Find Carpark near you!
            </h1>
            <button
              className="btn btn-success btn-outline btn-sm"
              onClick={loadCarParks}
            >
              Generate nearest Carparks
            </button>
            <div className="flex">
              <h1 className="font-bold text-lg">OR</h1>
            </div>
            {/* 2. USER TYPE IN SEARCH FIELD and SEARCH for CP */}
            <h1 className="text-green-700 font-semibold">
              Search other locations!
            </h1>
            {/* Search Form Input field */}
            <div className="input-group flex justify-center">
              <input
                name={query}
                value={query}
                onChange={searchHandler}
                type="text"
                placeholder="Type in steet name…"
                className="input input-bordered"
              />
              <button onClick={searchCp} className="btn btn-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 border border-red-400 h-[100px] w-[500px] flex justify-center items-center">
              Here are where the search filters are i.e. distance radius, free
              parking...
            </div>
          </div>
        )
      )}
    </>
  );
}

export default SearchPage;
