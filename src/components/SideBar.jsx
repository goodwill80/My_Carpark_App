import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CarparkContext } from '../Context/CarparkContext';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineGlobal } from 'react-icons/ai';

function SideBar() {
  const { signout, openSideBar, setOpenSideBar, setResults } =
    useContext(CarparkContext);
  const redirect = useNavigate();

  const logout = () => {
    signout();
    setResults([]);
    setOpenSideBar(() => false);

    redirect('/');
  };
  return (
    <div className="sidebar sticky top-0 min-h-full z-[50] shadow-lg">
      {/* Sidebar */}
      <div
        className={`${
          openSideBar ? 'visible translate-x-0 ' : 'invisible translate-x-full'
        } ease-in-out duration-300 fixed z-[30] right-0 min-h-full h-[100vh] bg-gray-900 text-teal-50 text-md w-full sm:w-[390px] md:z-[50] space-y-6 p-8`}
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
              *** New *** Come find me!
            </p>
            <p className="text-md text-green-200">
              Ever had difficulty of getting your passengers finding out your
              exact location? Try out our latest feature!
            </p>
            <h1 className="mt-6 font-semibold text-lg">
              Enter passenger's HP:
            </h1>
            <input
              type="text"
              placeholder="+65"
              className="input input-bordered input-primary w-full max-w-xs mt-3 text-gray-500"
            />
            <div className="flex justify-start mt-4 ml-2">
              <button className="btn btn-success btn-sm">Send</button>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-20 p-2 text-white border border-white rounded-md hover:text-green-300 hover:border-green-300"
          >
            Sign out
          </button>
        </nav>
      </div>
    </div>
  );
}

export default SideBar;
