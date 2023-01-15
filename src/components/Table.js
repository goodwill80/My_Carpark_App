import { useState } from "react";
import styles from "./Table.module.css";

function Table({ results, carparksShownOnPage, copyArray, setCopyArray }) {
  
  const sortDistanceDesc = () => {
    const newArr = [...results];
    setCopyArray([
      ...newArr.sort(
        (a, b) =>
          b.distance - a.distance
      ),
    ]);
  };
  const sortLots = () => {
    const newArr = [...results];
    setCopyArray([
      ...newArr.sort(
        (a, b) =>
          a.carpark_info[0].lots_available - b.carpark_info[0].lots_available
      ),
    ]);
  };
  const sortTotalLots = () => {
    const newArr = [...results];
    setCopyArray([
      ...newArr.sort(
        (a, b) =>
          a.carpark_info[0].total_lots - b.carpark_info[0].total_lots
      ),
    ]);
  };
  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Carpark number</th>
            <th>Address</th>
            <th onClick={sortDistanceDesc}>Distance</th>
            <th onClick={sortLots}>Lots available</th>
            <th onClick={sortTotalLots}>Total lots</th>
            <th>Last updated</th>
            <th></th>
            <th>Free parking</th>
            <th>Night parking</th>
          </tr>
        </thead>
        <tbody>
          {copyArray.map((item, i) => (
            <>
              <tr key={i}>
                <td>{item.carpark_number}</td>
                <td>{item.address}</td>
                <td>{item.distance} KM</td>
                <td>{item.carpark_info[0].lots_available}</td>
                <td>{item.carpark_info[0].total_lots}</td>
                <td>{item.update_datetime.substring(0, 10)}</td>
                <td>{item.update_datetime.substring(11, 19)}</td>
                <td>{item.free_parking}</td>
                <td>{item.night_parking}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <br></br>
      <p>{results.length} results</p>
      <br></br>
    </div>
  );
}

export default Table;