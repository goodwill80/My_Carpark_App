import { useContext, useState } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Loading_icon from '../images/spinner.gif';
import * as geolib from 'geolib';
import axios from 'axios';

import Dropdown from '../components/Dropdown';
import Checkbox from '../components/Checkbox.jsx';
import Pagination from '../components/Pagination';
import Table from '../components/Table';

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

function SearchPage() {
  const { user, isLoading, carparks } = useContext(CarparkContext); // states from context
  const [results, setResults] = useState([]); // New list of carparks with distances
  const [preferredDist, setPreferredDist] = useState(1); // User's choice of distance radius
  const [query, setQuery] = useState(''); // Search field query entered by user
  const [selected, setSelected] = useState(null); //  //Dropdown List
  const [freeParking, setFreeParking] = useState(false); //Free Parking
  const [nightParking, setNightParking] = useState(false); //Night Parking

  // Pagination Logic
  const [numOfCpPerPage, setNumOfCpPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const lastIndex = page * numOfCpPerPage;
  const firstIndex = lastIndex - numOfCpPerPage;
  const carparksShownOnPage = results?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(results.length / numOfCpPerPage);

  // Pagination Change page
  const changePage = (number) => {
    setPage(number);
  };

  // Load Carparkss near User's position when btn clicked
  const loadCarParks = () => {
    const userCoords = user.coordinates;
    // Loop all car parks and calculate dist
    const userCarparks = carparks.map((item) => {
      const distance =
        geolib.getDistance(userCoords, { lat: item.lat, lon: item.lon }) / 1000;
      const newObj = { ...item, distance: distance };
      return newObj;
    });

    //filter functions
    const filteredList = userCarparks
      .filter((item) => item.distance < preferredDist)
      .filter((item) => (freeParking ? item.free_parking !== 'NO' : true))
      .filter((item) => (nightParking ? item.night_parking !== 'NO' : true))
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
      // filter distance
      const response = await axios.get(
        `${BASE_URL}${query}+singapore&key=${process.env.REACT_APP_API_KEY}`
      );
      const coords = response.data.results[0]?.geometry?.location;
      if (coords.hasOwnProperty('lat')) {
        const carparkList = carparks.map((item) => {
          const dist =
            geolib.getDistance(coords, { lat: item.lat, lon: item.lon }) / 1000;
          return { ...item, distance: dist };
        });

        //filter functions
        const filterCarparksByDist = carparkList
          .filter((item) => item.distance < preferredDist)
          .sort((a, b) => a.distance - b.distance)
          .filter((item) => (freeParking ? item.free_parking !== 'NO' : true))
          .filter((item) =>
            nightParking ? item.night_parking !== 'NO' : true
          );

        console.log(filterCarparksByDist);
        setResults(() => [...filterCarparksByDist]);
        setQuery('');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  //setState for filtering distance
  const handleSelect = (option) => {
    setSelected(option);
    setPreferredDist(option.value);
  };

  // filter options
  const options = [
    { label: 'Within 1 KM', value: '1' },
    { label: 'Within 2 KM', value: '2' },
    { label: 'Within 3 KM', value: '3' },
    { label: 'Within 4 KM', value: '4' },
    { label: 'Within 5 KM', value: '5' },
    { label: 'Within 6 KM', value: '6' },
    { label: 'Within 7 KM', value: '7' },
    { label: 'Within 8 KM', value: '8' },
    { label: 'Within 9 KM', value: '9' },
    { label: 'Within 10 KM', value: '10' },
  ];
  //setState for Free and Night Parking
  const handleFreeParkingChange = () => {
    setFreeParking((prev) => !prev);
  };
  const handleNightParkingChange = () => {
    setNightParking((prev) => !prev);
  };

  return (
    <>
      {isLoading ? (
        <div className="h-[100vh] flex justify-center items-center">
          <img className="h-[250px]" src={Loading_icon} alt="Loading_icon" />
        </div>
      ) : (
        user.name && (
          <div className="min-h-[100vh] h-auto flex flex-col justify-start items-center px-24 gap-4 mt-12">
            <div className="flex flex-col justify-center items-center">
              <p className="text-5xl tracking-wide">
                Hello,{' '}
                <span className="font-bold text-red-400 text-6xl tracking-wide">
                  {user.name}
                </span>
                !
              </p>

              <p className="font-bold mt-6 text-2xl">
                We have found your location at
              </p>
              <p className="font-bold text-2xl text-green-600">
                {user.location}
              </p>
            </div>
            <div>
              <h1 className="text-2xl text-orange-400 font-semibold mt-2">
                What would you like to do today?
              </h1>
            </div>
            <div className="flex justify-center items-baseline gap-6">
              {/* 1. USER SERACH CP FROM OWN LOCATION */}
              <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-teal-700 font-semibold text-lg">
                  Find carparks near you!
                </h1>
                <button
                  className="btn btn-success btn-outline btn-sm h-[50px] w-[265px]"
                  onClick={loadCarParks}
                >
                  Generate nearest Carparks
                </button>
              </div>

              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bold text-3xl">OR</h1>
              </div>

              {/* 2. USER TYPE IN SEARCH FIELD and SEARCH for CP */}
              <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-teal-700 font-semibold text-lg">
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
              </div>
            </div>
            {/* FILTERS FOR USERS */}
            <Dropdown
              options={options}
              value={selected}
              onChange={handleSelect}
            />
            <div className="flex justify-center items-center gap-4">
              <Checkbox
                label="Free Parking"
                handleChange={handleFreeParkingChange}
                value={freeParking}
              />
              <Checkbox
                label="Night Parking"
                handleChange={handleNightParkingChange}
                value={nightParking}
              />
            </div>

            {results.length > 0 ? (
              <>
                <p className="text-md text-gray-400">
                  {results.length} carparks found
                </p>
                <button className="btn btn-outline btn-accent btn-sm">
                  Show Map
                </button>
                <Pagination
                  results={results}
                  totalPages={totalPages}
                  changePage={changePage}
                  page={page}
                />
                <Table
                  carparksShownOnPage={carparksShownOnPage}
                  results={results}
                  totalPages={totalPages}
                  page={page}
                />
              </>
            ) : (
              <p className="text-orange-700 mt-16">No search results</p>
            )}
          </div>
        )
      )}
    </>
  );
}

export default SearchPage;
