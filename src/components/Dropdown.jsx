import { useState, useEffect, useRef } from "react";

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
    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
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
      <div onClick={() => handleOptionClick(option)} key={option.value}>
        {option.label}
      </div>
    );
  });

  return (
    <div ref={divEl}>
      <div onClick={handleClick}>
        {value?.label || "Select Preferred Distance"}
      </div>
      {/* if no option selected set "Select Preferred Distance" */}
      {isOpen && <div>{renderedOptions}</div>}
    </div>
  );
}

export default Dropdown;
