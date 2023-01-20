import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import ReactWhatsapp from 'react-whatsapp';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineGlobal } from 'react-icons/ai';

import SosHelp from './SosHelp';

function SideBar({ user, setResults }) {
  const [number, setNumber] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);

  const { signout, openSideBar, setOpenSideBar } = useContext(CarparkContext);
  const redirect = useNavigate();

  useEffect(() => {
    if (number.length >= 8) {
      setButtonVisible(true);
    } else {
      setButtonVisible(false);
    }
  }, [number]);

  const logout = () => {
    signout();
    setResults([]);
    setOpenSideBar(() => false);

    redirect('/');
  };
  // https://sensational-zabaione-393a34.netlify.app
  const userLocation = user.location.replace(/\s/g, '%20');
  const message = `Hello, I've reached the destination! Please click this link to find where I'm parked.\n http://localhost:8888/passenger/${userLocation}/${user.name}`;
  // http://localhost:8888/

  return (
    <div className="sidebar sticky top-0 min-h-full z-[50] shadow-lg">
      {/* Sidebar */}
      <div
        className={`${
          openSideBar ? 'visible translate-x-0 ' : 'invisible translate-x-full'
        } ease-in-out overflow-scroll duration-300 top-0 fixed z-[30] right-0 min-h-full h-[100vh] bg-gray-900 text-teal-50 text-md w-full sm:w-[390px] md:z-[50] space-y-6 p-8`}
      >
        {/* Logo */}
        {/* <img className="cursor-pointer w-[60%]" src={HDB} alt="hdb" /> */}
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center space-x-2">
            <AiOutlineGlobal size={40} />
            <h1 className="font-bold text-2xl">Bulletin</h1>
          </div>

          <AiOutlineCloseCircle
            onClick={() => setOpenSideBar(false)}
            size={25}
            className="hover:text-red-500 cursor-pointer"
          />
        </div>

        {/* Nav */}
        <nav className="mt-12">
          <div>
            <p className="text-lg font-semibold text-yellow-400">
              1. *** New *** Come find me!
            </p>
            <p className="text-md text-green-200">
              Ever had difficulty locating a passenger?
            </p>
            <h1 className="mt-2 font-semibold text-lg">
              Enter passenger's HP:
            </h1>
            <input
              type="text"
              placeholder="Phone number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="input input-bordered input-primary w-full max-w-xs mt-3 text-gray-500"
            />
            <div className="flex justify-start mt-4 ml-2">
              {buttonVisible && (
                <ReactWhatsapp number={number} message={message}>
                  <p
                    onClick={() => setNumber('')}
                    className="btn btn-success btn-sm"
                  >
                    Send
                  </p>
                </ReactWhatsapp>
              )}
            </div>
          </div>
          <SosHelp user={user} />
          <div className="flex lg:justify-center lg:items-center">
            <button
              onClick={logout}
              className="mt-8 p-2 text-white border border-white rounded-md hover:text-green-300 hover:border-green-300 md:mt-7"
            >
              Sign out
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideBar;
