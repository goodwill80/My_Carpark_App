import { useContext, useState } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Loading_icon from '../images/Loading_icon.gif';
import * as geolib from 'geolib';
import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

function SearchPage() {
  const { user, isLoading, carparks } = useContext(CarparkContext);
  const [results, setResults] = useState([]);
  const [preferredDist, setPreferredDist] = useState(1);
  const [query, setQuery] = useState('');

  // Load CPs near User position
  const loadCarParks = () => {
    const userCoords = user.coordinates; // {lat: 33142, lon: 12312}
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
        setResults(() => [...filterCarparksByDist]);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      {isLoading ? (
        // <h1>Loading...</h1>
        <img src={Loading_icon} alt="Loading_icon" />
      ) : (
        user.name && (
          <>
            <h1>Search</h1>
            <p>Welcome, {user.name}</p>
            <p>We have found your location at {user.location}</p>
            {/* 1. USER SERACH CP FROM OWN LOCATION */}
            <button className="btn btn-sucess" onClick={loadCarParks}>
              Get carparks near me
            </button>
            {/* NEED TO INCLUDE DISTANCE, FREECARPARK, BASEMENT... filters */}

            {/* 2. USER TYPE IN SEARCH FIELD and SEARCH for CP */}
            <h2>Find Carpark at your preferred location</h2>
            <div className="flex flex-col items-center">
              <input
                name="query"
                value={query}
                onChange={searchHandler}
                type="text"
                placeholder="Search for your carpark"
              />
              <button onClick={searchCp}>Submit Search</button>
            </div>
          </>
        )
      )}
    </>
  );
}

export default SearchPage;
