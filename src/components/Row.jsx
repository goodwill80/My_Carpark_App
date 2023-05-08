import { useState, useContext, memo } from 'react';

import { GoLocation } from 'react-icons/go';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiOutlineArrowTrendingDown } from 'react-icons/hi2';

import { CarparkContext } from '../Context/CarparkContext';
import MapSingleModal from './MapSingleModal';

function Row({
  index,
  item,
  carpark_number,
  id,
  address,
  lat,
  lon,
  lots,
  free_parking,
  distance,
  colour,
  total_lots,
  year,
  time,
  night_parking,
  handlerDelete,
  results,
  timer,
}) {
  const { triggerZoom, user } = useContext(CarparkContext);
  const [trigger, setTrigger] = useState(false);
  const classNameForCol =
    'text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap';

  const toggle = () => {
    // console.log('trigger');
    setTrigger(!trigger);
  };

  return (
    <>
      <tr
        className={`border-b text-left  ${
          index % 2
            ? 'bg-blue-100 border-blue-200'
            : 'bg-green-100 border-green-200'
        } `}
      >
        <td className={`${classNameForCol} hidden md:table-cell`}>
          {carpark_number}
        </td>
        <td className={classNameForCol}>
          <div className="flex items-baseline gap-2 cursor-pointer">
            <label
              htmlFor={`my-modal-${id}`}
              className="border-none flex gap-4 cursor-pointer"
            >
              <GoLocation onClick={toggle} color={'red'} size={18} />
              {address.replace('BLK', '').substring(0, 15)}
            </label>
            <MapSingleModal
              item={item}
              id={id}
              carpark_number={carpark_number}
              lat={lat}
              lon={lon}
              user={user}
              address={address}
              lots={lots}
              free_parking={free_parking}
              results={results}
              triggerZoom={triggerZoom}
              trigger={trigger}
              timer={timer}
            />
          </div>
        </td>
        <td className={classNameForCol}>{distance} KM</td>
        <td
          className={`text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap cursor-pointer text-center hidden sm:table-cell`}
        >
          <div className="flex justify-center items-center gap-1">
            <p
              className={
                colour === 'Red'
                  ? 'text-red-800 font-bold text-sm'
                  : colour === 'Green'
                  ? 'text-green-700'
                  : 'text-yellow-600'
              }
            >
              {lots}
            </p>
            {colour === 'Yellow' || colour === 'Red' ? (
              <HiOutlineArrowTrendingDown
                className="animate-ping"
                size={15}
                color={'red'}
              />
            ) : (
              ''
            )}
          </div>
        </td>

        <td className={`${classNameForCol} hidden lg:table-cell`}>
          {total_lots}
        </td>
        <td className={`${classNameForCol} hidden lg:table-cell`}>{year}</td>
        <td className={`${classNameForCol} hidden lg:table-cell`}>{time}</td>
        <td className={`${classNameForCol} hidden lg:table-cell`}>
          {free_parking === 'SUN & PH FR 7AM-10.30PM'
            ? 'ONLY SUN & PH'
            : free_parking}
        </td>
        <td className={`${classNameForCol} hidden lg:table-cell`}>
          {night_parking}
        </td>
        <td
          className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap cursor-pointer text-center hidden sm:table-cell"
          onClick={() => handlerDelete(carpark_number)}
        >
          <RiDeleteBin6Line size={20} color={'red'} />
        </td>
      </tr>
    </>
  );
}

export default memo(Row);
