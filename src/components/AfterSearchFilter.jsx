import { useState, useEffect } from 'react';

function AfterSearchFilter({ setCopyArray, results }) {
  const [dropDown, setDropDown] = useState('');

  const onChangeHander = (e) => {
    setDropDown(e.target.value);
  };

  useEffect(() => {
    switch (dropDown) {
      case 'all':
        setCopyArray(() => results);
        break;
      case 'free-parking':
        const freeFilter = results.filter((item) => item.free_parking !== 'NO');
        setCopyArray(() => [...freeFilter]);
        break;
      case 'night-parking':
        const nightFilter = results.filter(
          (item) => item.night_parking !== 'NO'
        );
        setCopyArray(() => [...nightFilter]);
        break;
      case 'with-lots':
        const lotsFilter = results.filter(
          (item) => item.carpark_info[0].lots_available > 0
        );
        setCopyArray(() => [...lotsFilter]);
        break;
      default:
        return;
    }
  }, [dropDown]);

  return (
    <div className="flex justify-center items-center pb-5">
      <select
        onChange={onChangeHander}
        value={dropDown}
        className="select select-success w-[170px] max-w-xs text-center"
      >
        <option value="">Filter by:</option>
        <option value="all">All</option>
        <option value="free-parking">Free Parking</option>
        <option value="night-parking">Night Parking</option>
        <option value="with-lots">CPs with lots</option>
      </select>
    </div>
  );
}

export default AfterSearchFilter;
