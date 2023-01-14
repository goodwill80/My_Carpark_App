import { useState, useEffect, useRef } from 'react';
// import { GoChevronDown } from 'react-icons/go';
import Panel from './Panel';

function Dropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef();
  //divEl is reference to a divElement

  useEffect(() => {
    const handler = (e) => {
      if (!divEl.current) {
        return;
        //if not divElement
      }
      if (!divEl.current.contains(e.target)) {
        setIsOpen(false);
      }
      //close dropdown list if user did not select
    };
    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('click', handler);
      //clean up click eventHandler
    };
  }, []);

  const handleClick = () => {
    //check current state and set state to the opposite of current
    setIsOpen((currentIsOpen) => !currentIsOpen);
  };

  const handleOptionClick = (option) => {
    //close dropdown
    setIsOpen(false);
    //what option did the user click on?
    onChange(option);
  };

  const renderedOptions = options.map((option) => {
    return (
      <div
        className="hover:bg-sky-100 rounded cursor-pointer p-1"
        onClick={() => handleOptionClick(option)}
        key={option.value}
      >
        {option.label}
      </div>
    );
  });

  return (
    <div
      ref={divEl}
      className="w-56 relative shadow-lg border rounded-md border-green-500 hover:border-emerald-300 text-teal-400 font-semibold text-center"
    >
      <Panel
        className="flex justify-start items center cursor-pointer"
        onClick={handleClick}
      >
        <p className="text-semibold">
          {value?.label || 'Select preferred distance'}
        </p>
        {/* <GoChevronDown className="text-lg" /> */}
      </Panel>
      {/* if no option selected set "Select Preferred Distance" */}
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  );
}

export default Dropdown;
