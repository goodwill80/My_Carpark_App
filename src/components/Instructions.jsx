import React from 'react';

function Instructions() {
  return (
    <div className="flex flex-col text-sm mt-4 text-center w-[80%] md:w-[60%] text-blue-500 font-semibold">
      <p className="text-black font-semibold">
        Please enable your location settings in browser and device.
      </p>
      <p>Viewing is best experienced using Chrome.</p>
    </div>
  );
}

export default Instructions;
