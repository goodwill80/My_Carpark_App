import { useState } from 'react';

function Pagination({ totalPages, changePage, page }) {
  return (
    <div className="flex justify-center items-center">
      {[...new Array(totalPages).fill(true)].map((item, index) => (
        <div
          onClick={() => changePage(index + 1)}
          key={index}
          className={`border border-green-300 ${
            page === index + 1 ? 'bg-green-500 text-white' : ''
          } p-1 px-4 font-semibold hover:bg-green-500 hover:text-white cursor-pointer`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

export default Pagination;
