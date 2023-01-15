function Pagination({ totalPages, changePage, page }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex">
        {[...new Array(totalPages).fill(true)].map((item, index) => (
          <div
            onClick={() => changePage(index + 1)}
            key={index}
            className={`border border-green-300 rounded-md ${
              page === index + 1 ? 'bg-green-500 text-white' : ''
            } p-1 px-4 font-semibold hover:bg-green-500 hover:text-white cursor-pointer`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <p className="mt-2 font-bold text-gray-500 mb-4">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}

export default Pagination;
