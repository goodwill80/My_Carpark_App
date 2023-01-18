import { useEffect, useState } from 'react';

import { FaSort } from 'react-icons/fa';

import Row from './Row';
import AfterSearchFilter from './AfterSearchFilter';

function Table({
  results,
  carparksShownOnPage,
  totalPages,
  page,
  copyArray,
  setCopyArray,
  setPage,
}) {
  const [switchDist, setSwitchDist] = useState(false);
  const [switchLots, setSwitchLots] = useState(false);
  const [switchTotalLots, setSwitchTotalLots] = useState(false);

  const classNameForTh = 'text-sm font-medium text-white px-8 py-4';

  useEffect(() => {
    if (carparksShownOnPage.length <= 0) {
      setPage(1);
    }
  }, [carparksShownOnPage.length]);

  const handlerDelete = (code) => {
    const filteredResult2 = copyArray.filter(
      (item) => item.carpark_number !== code
    );
    setCopyArray(filteredResult2);
  };

  // Carparks in Desc order based on dist
  const sortDistanceDesc = () => {
    const newArr = [...results];
    setCopyArray([...newArr.sort((a, b) => b.distance - a.distance)]);
  };

  // Carparks in Asc order based on dist
  const sortDistanceAsc = () => {
    const newArr = [...results];
    setCopyArray([...newArr.sort((a, b) => a.distance - b.distance)]);
  };

  // If switchDist is true, sort dist by Desc, else sort dist by Asc
  const toggleDistSort = () => {
    if (switchDist) {
      return sortDistanceDesc();
    } else {
      return sortDistanceAsc();
    }
  };

  // Click to toggle switchDist between true or false
  const switchToggleForDist = () => {
    setSwitchDist((prev) => !prev);
  };

  // UseEffect as EventListener to trigger dist sort upon change of switchDist
  useEffect(() => {
    toggleDistSort();
  }, [switchDist]);

  // Sort Lots by Asc
  const sortLotsByLowest = () => {
    const newArr = [...results];
    setCopyArray(() => [
      ...newArr.sort(
        (a, b) =>
          Number(a.carpark_info[0].lots_available) -
          Number(b.carpark_info[0].lots_available)
      ),
    ]);
  };

  // Sort Lots by Desc
  const sortLotsByHighest = () => {
    const newArr = [...results];
    setCopyArray(() => [
      ...newArr.sort(
        (a, b) =>
          Number(b.carpark_info[0].lots_available) -
          Number(a.carpark_info[0].lots_available)
      ),
    ]);
  };

  // Toggle sort functions
  const toggleSortLots = () => {
    if (switchLots) {
      return sortLotsByLowest();
    } else {
      return sortLotsByHighest();
    }
  };

  // Click to toggle true or false
  const switchToggleForLots = () => {
    setSwitchLots((prev) => !prev);
  };

  useEffect(() => {
    toggleSortLots();
  }, [switchLots]);

  const sortTotalLotsByDesc = () => {
    const newArr = [...results];
    setCopyArray([
      ...newArr.sort(
        (a, b) => a.carpark_info[0].total_lots - b.carpark_info[0].total_lots
      ),
    ]);
  };

  const sortTotalLotsByAsc = () => {
    const newArr = [...results];
    setCopyArray([
      ...newArr.sort(
        (a, b) => b.carpark_info[0].total_lots - a.carpark_info[0].total_lots
      ),
    ]);
  };

  const toggleTotalLots = () => {
    if (switchTotalLots) {
      return sortTotalLotsByDesc();
    } else {
      return sortTotalLotsByAsc();
    }
  };

  const toggleSwitchTotalLots = () => {
    setSwitchTotalLots((prev) => !prev);
  };

  useEffect(() => {
    toggleTotalLots();
  }, [switchTotalLots]);

  return (
    <div className="m-h-[320px] h-[680px]">
      {/* <AfterSearchFilter setCopyArray={setCopyArray} results={results} /> */}
      <table className="min-w-full w-full text-center shadow-lg">
        <thead className="border-b bg-gray-800 boder-gray-900 text-left">
          <tr>
            <th className={`${classNameForTh} hidden md:table-cell`}>CP</th>
            <th className={classNameForTh}>Address</th>
            <th
              onClick={switchToggleForDist}
              className={`${classNameForTh} cursor-pointer`}
            >
              <div className="flex items-baseline justify-center">
                Distance
                <FaSort size={18} className="pt-1" />
              </div>
            </th>
            <th
              onClick={switchToggleForLots}
              className={`${classNameForTh} hidden sm:table-cell`}
            >
              <div className="flex items-center justify-center">
                <p>Lots available</p>
                <FaSort size={18} className="pt-1" />
              </div>
            </th>
            <th
              onClick={toggleSwitchTotalLots}
              className={`${classNameForTh} cursor-pointer hidden lg:table-cell`}
            >
              <div className="items-baseline justify-center">
                <div className="flex justify-center items-center">
                  <p>Total lots</p>
                  <FaSort size={18} className="pt-1" />
                </div>
              </div>
            </th>
            <th className={`${classNameForTh} hidden lg:table-cell`}>
              Last updated
            </th>
            <th className={`${classNameForTh} hidden lg:table-cell`}>Time</th>
            <th className={`${classNameForTh} hidden lg:table-cell`}>
              Free parking
            </th>
            <th className={`${classNameForTh} hidden lg:table-cell`}>
              Night parking
            </th>
            <td className={`${classNameForTh} hidden sm:table-cell`}>Delete</td>
          </tr>
        </thead>
        <tbody>
          {carparksShownOnPage.map((item, i) => (
            <>
              <Row
                key={i}
                index={i}
                carpark_number={item.carpark_number}
                id={item._id}
                address={item.address}
                lat={item.lat}
                lon={item.lon}
                lots={item.carpark_info[0].lots_available}
                total_lots={item.carpark_info[0].total_lots}
                free_parking={item.free_parking}
                distance={item.distance}
                colour={item.colour}
                year={item.update_datetime.substring(0, 10)}
                time={item.update_datetime.substring(11, 19)}
                night_parking={item.night_parking}
                handlerDelete={handlerDelete}
                results={results}
              />
            </>
          ))}
        </tbody>
      </table>
      <br></br>
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-gray-500">
          Page {page} of {totalPages}
        </p>
      </div>

      <br></br>
    </div>
  );
}
export default Table;
