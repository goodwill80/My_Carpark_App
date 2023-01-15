import { GoLocation } from 'react-icons/go';

function Table({ results, carparksShownOnPage, totalPages, page }) {
  const classNameForCol =
    'text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap';
  const classNameForTh = 'text-sm font-medium text-white px-8 py-4';

  return (
    <div className="m-h-[320px] h-[680px]">
      <table className="min-w-full w-full text-center shadow-lg">
        <thead className="border-b bg-gray-800 boder-gray-900 text-left">
          <tr>
            <th className={classNameForTh}>CP</th>
            <th className={classNameForTh}>Address</th>
            <th className={classNameForTh}>Distance</th>
            <th className={classNameForTh}>Lots available</th>
            <th className={classNameForTh}>Total lots</th>
            <th className={classNameForTh}>Last updated</th>
            <th className={classNameForTh}>Time</th>
            <th className={classNameForTh}>Free parking</th>
            <th className={classNameForTh}>Night parking</th>
          </tr>
        </thead>
        <tbody>
          {carparksShownOnPage.map((item, i) => (
            <>
              <tr
                key={i}
                className={`border-b text-left  ${
                  i % 2
                    ? 'bg-blue-100 border-blue-200'
                    : 'bg-green-100 border-green-200'
                } `}
              >
                <td className={classNameForCol}>{item.carpark_number}</td>
                <td className={classNameForCol}>
                  <div className="flex items-baseline gap-2 cursor-pointer">
                    <GoLocation color={'red'} size={18} />
                    {item.address.replace('BLK', '')}
                  </div>
                </td>
                <td className={classNameForCol}>{item.distance} KM</td>
                <td className={classNameForCol}>
                  {item.carpark_info[0].lots_available}
                </td>
                <td className={classNameForCol}>
                  {item.carpark_info[0].total_lots}
                </td>
                <td className={classNameForCol}>
                  {item.update_datetime.substring(0, 10)}
                </td>
                <td className={classNameForCol}>
                  {item.update_datetime.substring(11, 19)}
                </td>
                <td className={classNameForCol}>{item.free_parking}</td>
                <td className={classNameForCol}>{item.night_parking}</td>
              </tr>
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
