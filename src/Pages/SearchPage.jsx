import { useContext, useState, useEffect } from 'react';
import { CarparkContext } from '../Context/CarparkContext';

import { GiHamburgerMenu } from 'react-icons/gi';

import Loading_icon from '../images/signal.gif';
import Loader from '../images/spinner.gif';
import HDB from '../images/HDB.png';

import * as geolib from 'geolib';
import axios from 'axios';

import Dropdown from '../components/Dropdown';
import Checkbox from '../components/Checkbox.jsx';
import Pagination from '../components/Pagination';
import Table from '../components/Table';
import MapModalFull from '../components/MapModalFull';

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

function SearchPage() {
  const { user, isLoading, carparks, triggerZoom, setTriggerZoom } =
    useContext(CarparkContext); // states from context
  const [results, setResults] = useState([]); // New list of carparks with distances
  const [preferredDist, setPreferredDist] = useState(1); // User's choice of distance radius
  const [query, setQuery] = useState(''); // Search field query entered by user
  const [selected, setSelected] = useState(null); //  //Dropdown List
  const [freeParking, setFreeParking] = useState(false); //Free Parking
  const [nightParking, setNightParking] = useState(false); //Night Parking
  const [resultsLoader, setResultsLoader] = useState(false);
  const [searchResultLocation, setSearchResultLocation] = useState('');
  const [copyArray, setCopyArray] = useState([]);
  const [querySearchCoords, setQuerySearchCoords] = useState(null);

  useEffect(() => {
    setCopyArray(results);
  }, [results]);

  // Pagination Logic
  const [numOfCpPerPage, setNumOfCpPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const lastIndex = page * numOfCpPerPage;
  const firstIndex = lastIndex - numOfCpPerPage;
  const carparksShownOnPage = copyArray?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(copyArray.length / numOfCpPerPage);

  // Pagination Change page
  const changePage = (number) => {
    setPage(number);
  };

  // Load Carparkss near User's position when btn clicked
  const loadCarParks = () => {
    setTriggerZoom(false);
    setQuerySearchCoords(null);
    setResultsLoader(true);
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

    const listLotsColour = filteredList.map((item) => {
      const colourLots =
        item.carpark_info[0].lots_available < 30
          ? item.carpark_info[0].lots_available < 10
            ? 'Red'
            : 'Yellow'
          : 'Green';
      return { ...item, colour: colourLots };
    });
    // console.log(listLotsColour);
    setResults(listLotsColour);
    setResultsLoader(false);
    setPage(1);
    setSearchResultLocation(user.location);
  };

  // Handler for search Form
  const searchHandler = (e) => {
    setQuery(e.target.value);
  };

  // Load Carparks based on user search
  const searchCp = async () => {
    try {
      setTriggerZoom(true);
      setResultsLoader(true);
      // filter distance
      const response = await axios.get(
        `${BASE_URL}${query}+singapore&key=${process.env.REACT_APP_API_KEY}`
      );
      const coords = response.data.results[0]?.geometry?.location;
      if (coords.hasOwnProperty('lat')) {
        setQuerySearchCoords(coords);
        setSearchResultLocation(query);
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

        const listLotsColour = filterCarparksByDist.map((item) => {
          const colourLots =
            item.carpark_info[0].lots_available < 30
              ? item.carpark_info[0].lots_available < 10
                ? 'Red'
                : 'Yellow'
              : 'Green';
          return { ...item, colour: colourLots };
        });

        console.log(listLotsColour);
        setResults(() => [...listLotsColour]);
        setResultsLoader(false);
        setPage(1);
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
      <div className="absolute top-3 right-8 p-4 cursor-pointer">
        <GiHamburgerMenu size={34} color={'gray'} />
      </div>

      <div className="absolute top-0 left-3 p-8 cursor-pointer w-[40%] sm:w-[30%] md:w-[25%] lg:w-[20%]">
        <img src={HDB} alt="HDB" />
      </div>

      {isLoading ? (
        <div className="h-[100vh] flex flex-col justify-center items-center pb-16">
          <img
            className="h-[250px] mix-blend-multiply"
            src={Loading_icon}
            alt="Loading_icon"
          />
          <p className="font-semibold text-gray-600">
            Retrieving your location. Please stay with us!
          </p>
        </div>
      ) : (
        user.name && (
          <div className="min-h-[100vh] h-auto flex flex-col justify-start items-center px-24 gap-4 pt-40">
            <div className="flex flex-col justify-center items-center">
              <p className="text-5xl tracking-wide text-center">
                Hello,{' '}
                <span className="font-bold text-red-400 text-6xl tracking-wide text-center">
                  {user.name}
                </span>
                !
              </p>

              <p className="font-bold mt-6 text-2xl text-center mb-4">
                We have found your location at
              </p>
              <p className="font-bold text-2xl text-green-600 text-center">
                {user.location}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center py-4 rounded-md sm:px-40 lg:pb-8 lg:shadow-sm md:w-[80vw]">
              <div>
                <h1 className="text-2xl text-orange-400 font-semibold text-center">
                  What would you like to do today?
                </h1>
              </div>
              <div className="flex flex-col justify-center gap-4 mt-4 mb-3 md:flex-row md:items-baseline">
                {/* 1. USER SERACH CP FROM OWN LOCATION */}
                <div className="flex flex-col justify-center items-center gap-2">
                  <h1 className="text-teal-700 font-semibold text-lg">
                    Find carparks near you!
                  </h1>
                  <button
                    className="btn btn-success btn-outline btn-sm h-[50px] w-[275px]"
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
                      className="input input-bordered w-[230px]"
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
              <div className="py-4">
                <Dropdown
                  options={options}
                  value={selected}
                  onChange={handleSelect}
                />
              </div>

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
            </div>
            {results.length > 0 ? (
              <>
                <p className="text-md text-gray-400 text-center">
                  {results.length} carparks found near "
                  <span>{searchResultLocation.replace('Singapore', 'SG')}</span>
                  "
                </p>
                <div className="flex justify-center items-center py-4">
                  <label
                    htmlFor="my-modal"
                    className="btn btn-sm btn-accent btn-outline"
                  >
                    Show Map
                  </label>
                  {/* <button className="btn btn-sm btn-accent">Show map</button> */}
                </div>
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
                  setCopyArray={setCopyArray}
                  copyArray={copyArray}
                />
              </>
            ) : (
              <>
                {resultsLoader ? (
                  <>
                    <img className="h-40 w-40" src={Loader} alt="Loader" />
                  </>
                ) : (
                  <>
                    <p className="text-orange-700 mt-16">No search results</p>
                  </>
                )}
              </>
            )}
            <MapModalFull
              results={results}
              user={user}
              triggerZoom={triggerZoom}
              querySearchCoords={querySearchCoords}
            />
          </div>
        )
      )}
    </>
  );
}

export default SearchPage;
