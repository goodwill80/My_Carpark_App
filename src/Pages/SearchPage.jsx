import { useContext, useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { CarparkContext } from '../Context/CarparkContext';

import { GiHamburgerMenu } from 'react-icons/gi';
import { TbSteeringWheel } from 'react-icons/tb';
import { MdFavorite } from 'react-icons/md';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiFillCar } from 'react-icons/ai';

import Loading_icon from '../images/signal.gif';
import Loader from '../images/spinner.gif';
import Logo from '../images/Logo.png';
import Drivers from '../images/drivers.png';

import * as geolib from 'geolib';
import axios from 'axios';
import Swal from 'sweetalert2';

import SideBar from '../components/SideBar';
import Dropdown from '../components/Dropdown';
import Checkbox from '../components/Checkbox.jsx';
import Pagination from '../components/Pagination';
import Table from '../components/Table';
import MapModalFull from '../components/MapModalFull';

function SearchPage() {
  const {
    user,
    isLoading,
    carparks,
    triggerZoom,
    setTriggerZoom,
    setOpenSideBar,
    resetPosition,
    setIsLoading,
    countdown,
  } = useContext(CarparkContext); // states from context
  const [results, setResults] = useState([]); // New list of carparks with distances
  const [preferredDist, setPreferredDist] = useState(1); // User's choice of distance radius
  const [query, setQuery] = useState(''); // Search field query entered by user
  const [selected, setSelected] = useState(null); //  //Dropdown List
  const [freeParking, setFreeParking] = useState(false); //Free Parking
  const [nightParking, setNightParking] = useState(false); //Night Parking
  const [resultsLoader, setResultsLoader] = useState(false); // For loading of seacrch results
  const [searchResultLocation, setSearchResultLocation] = useState(''); // For storing of results
  const [copyArray, setCopyArray] = useState([]); // Copy of search results for sorting and pagination
  const [querySearchCoords, setQuerySearchCoords] = useState(null); // For display of search results

  useEffect(() => {
    setCopyArray(results);
  }, [results]);

  // Countdown to data refresh
  let minutes = Math.floor(countdown / 60);

  // Pagination Logic
  const [numOfCpPerPage, setNumOfCpPerPage] = useState(8);
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
      setResultsLoader(true);
      const response = await axios.get(
        `/.netlify/functions/geocodeAddrApi?query=${query}`
      );

      if (!response.data) {
        setResultsLoader(false);
        setTriggerZoom(false);
        Swal.fire({
          title:
            'Opps, there is either no inputs or map service is unavailable.',
          icon: 'error',
          confirmButtonText: 'Damn!',
        });
        return;
      }

      const coords = response.data;
      if (coords.hasOwnProperty('lat')) {
        // Storing the query coords to state for marker on google map
        setQuerySearchCoords(coords);
        // Storing the query string to be shown in search results
        setSearchResultLocation(query);
        // Loop thru all cps and calculate dist bet each and the searched cp
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

        // console.log(listLotsColour);
        setResults(() => [...listLotsColour]);
        setResultsLoader(false);
        setPage(1);
        setTriggerZoom(true);
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

  const reloadOwnPosition = () => {
    setIsLoading(() => true);
    resetPosition();
  };

  return (
    <div className="relative">
      {/* HAMBURGER */}
      {!isLoading && (
        <div className="sticky top-0">
          <div className="fixed top-0 right-0 p-4 flex space-x-4 cursor-pointer z-50">
            <GiHamburgerMenu
              onClick={() => setOpenSideBar(true)}
              size={34}
              color={'gray'}
            />
          </div>
        </div>
      )}
      {/* LOGO */}
      <div className="absolute top-0 left-1 p-2 w-[55%] sm:w-[40%] md:w-[40%] lg:w-[25%]">
        <div className="flex justify-center items-center">
          <img className="mix-blend-multiply" src={Logo} alt="logo" />
        </div>

        {results.length > 0 && (
          <div>
            <p className="ml-8 text-center text-[11px] text-red-400 w-[80%] font-semibold">
              <span className="bg-red-500 text-[9px] text-red-500 w-2 h-2 rounded-full p-[0.5px] px-[3px] mr-1 animate-ping">
                1
              </span>
              {minutes} min(s) remaining prior to next data refresh. Please
              resubmit query upon refresh, for viewing of updated lot info.
            </p>
            <div className="hidden justify-start items-center pl-[110px] xl:flex">
              <img
                className="absolute w-[120px] opacity-80 top-44 shadow-xl rounded-full"
                src={Drivers}
                alt="drivers"
              />
            </div>
          </div>
        )}
      </div>
      <SideBar setResults={setResults} user={user} />

      {isLoading ? (
        <div className="h-[100vh] flex flex-col justify-center items-center pb-16">
          <img
            className="h-[250px] mix-blend-multiply"
            src={Loading_icon}
            alt="Loading_icon"
          />
          <p className="font-semibold text-gray-600 px-2">
            Retrieving your location. Please stay with us!
          </p>
        </div>
      ) : (
        user.name && (
          <div
            onClick={() => setOpenSideBar(false)}
            className="min-h-[100vh] h-auto flex flex-col justify-start items-center px-24 gap-4 pt-40"
          >
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center">
                <p className="text-5xl tracking-wider text-center font-bold text-gray-700 pt-8">
                  Hello,{' '}
                  <span className="font-bold text-blue-400 text-6xl tracking-wider text-center">
                    {user.name}
                  </span>
                  !
                </p>
                <BsEmojiSmile
                  className="hidden lg:flex pl-2 pt-1 animate-bounce"
                  size={45}
                  color={'orange'}
                />
              </div>
              <p className="font-bold mt-6 text-2xl text-center mb-4 text-gray-700">
                We have found your location at:
              </p>
              <p className="font-bold text-2xl text-green-500 tracking-wider text-center">
                {user.location.replace('BLK', '').substring(0, 30)}
                {!user.location && 'Somewhere in Singapore'}
              </p>
            </div>
            <div className="flex gap-2">
              {new Array(8).fill(true).map((item, index) => (
                <TbSteeringWheel
                  className="hover:pb-1"
                  key={index}
                  size={25}
                  color={'gray'}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center items-center mt-2 cursor-pointer">
              <AiFillCar
                className="hover:scale-110 ease-in duration-300"
                onClick={reloadOwnPosition}
                size={35}
                color={'red'}
              />
              <p className="font-bold text-gray-700 tracking-wider hover:text-gray-400">
                Reload Location
              </p>
            </div>

            <div className="flex flex-col justify-center items-center py-4 rounded-md sm:px-40 lg:pb-8 lg:shadow-sm md:w-[80vw]">
              <div>
                <h1 className="text-2xl text-orange-400 font-bold text-center tracking-wider">
                  What would you like to do today?
                </h1>
                <Link to="/favorites">
                  <div className="flex justify-center items-center gap-2 font-semibold tracking-wider text-red-400 cursor-pointer hover:underline hover:scale-110 ease-in duration-300">
                    Go to my favorites
                    <MdFavorite
                      className="animate-pulse"
                      size={20}
                      color={'red'}
                    />
                  </div>
                </Link>
              </div>
              <div className="flex flex-col justify-center gap-4 mt-4 mb-3 md:flex-row md:items-baseline">
                {/* 1. USER SERACH CP FROM OWN LOCATION */}
                <div className="flex flex-col justify-center items-center gap-2">
                  <h1 className="text-gray-700 font-semibold text-lg tracking-wider">
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
                  <h1 className="font-bold text-3xl text-gray-700">OR</h1>
                </div>

                {/* 2. USER TYPE IN SEARCH FIELD and SEARCH for CP */}
                <div className="flex flex-col justify-center items-center gap-2">
                  <h1 className="text-gray-700 font-semibold text-lg tracking-wider">
                    Search other locations!
                  </h1>
                  {/* Search Form Input field */}
                  <div className="z-[10] input-group flex justify-center">
                    <input
                      name={query}
                      value={query}
                      onChange={searchHandler}
                      type="text"
                      placeholder="Name of location or street"
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
                  {copyArray.length} carparks found near "
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
                  setPage={setPage}
                  user={user}
                  triggerZoom={triggerZoom}
                  querySearchCoords={querySearchCoords}
                />
              </>
            ) : (
              <>
                {resultsLoader ? (
                  <div>
                    <img
                      className="h-40 w-40 justify-center items-center"
                      src={Loader}
                      alt="Loader"
                    />
                  </div>
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
    </div>
  );
}

export default memo(SearchPage);
