import { Link } from 'react-router-dom';
import { useContext, useState, memo } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Logo from '../images/Logo.png';

import MapSingleModal from '../components/MapSingleModal';

import { GoLocation } from 'react-icons/go';
import { RiDeleteBin2Fill } from 'react-icons/ri';

function Favorites() {
  const { favoriteCp, user, triggerZoom, removeFrFavorite } =
    useContext(CarparkContext);
  const [trigger, setTrigger] = useState(false);

  const toggle = () => {
    setTrigger(!trigger);
  };

  const time = 500;

  return (
    <div className="min-h-[100vh] flex flex-col px-10">
      <div className="flex flex-col justify-center items-center py-10">
        <img
          className="mix-blend-multiply w-[50%] h-[50%]"
          src={Logo}
          alt="logo"
        />
        <p className="text-teal-500 font-bold text-2xl">My Favorite Carparks</p>
        <Link to="/search">
          <p className="mt-5 p-2 px-4 border border-blue-400 text-blue-400 rounded-md text-sm">
            Back
          </p>
        </Link>
      </div>
      {favoriteCp.length > 0 ? (
        <div className="overflow-x-auto flex flex-col justify-center items-center">
          <table className="table w-[70%]">
            {/* <!-- head --> */}
            <thead>
              <tr className="font-semibold text-gray-400">
                <th className="hidden sm:table-cell">CP</th>
                <th>Address</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {favoriteCp &&
                favoriteCp.map((item, index) => (
                  <tr key={index}>
                    <td className="font-semibold text-sm hidden sm:table-cell">
                      {item.carpark_number}
                    </td>
                    <td>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <label
                          htmlFor={`my-modal-${item._id}`}
                          className="border-none flex gap-4 cursor-pointer"
                        >
                          <GoLocation
                            onClick={toggle}
                            color={'red'}
                            size={20}
                          />
                          <p className="text-sm">
                            {item.address.replace('BLK', '').substring(0, 17)}
                          </p>
                        </label>
                      </div>

                      <MapSingleModal
                        item={item}
                        timer={900 + index * time}
                        id={item._id}
                        carpark_number={item.carpark_number}
                        lat={item.lat}
                        lon={item.lon}
                        user={user}
                        address={item.address}
                        lots={item.carpark_info[0].lots_available}
                        free_parking={item.free_parking}
                        // results={results}
                        triggerZoom={triggerZoom}
                        trigger={trigger}
                      />
                    </td>
                    <td>
                      <RiDeleteBin2Fill
                        onClick={() => removeFrFavorite(item._id)}
                        color={'red'}
                        size={20}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-600 text-center text-lg">No records found</p>
      )}
    </div>
  );
}

export default memo(Favorites);
