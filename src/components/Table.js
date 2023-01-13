import styles from "./Table.module.css";

function Table({ results }) {
  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick='sortTable(0)'>Carpark number</th>
            <th onClick='sortTable(1)'>Address</th>
            <th>Distance</th>
            <th>Lots available</th>
            <th>Total lots</th>
            <th>Last updated</th>
            <th></th>
            <th>Free parking</th>
            <th>Night parking</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, i) => (
            <>
              <tr key={i}>
                <td>{item.carpark_number}</td>
                <td>{item.address}</td>
                <td>{item.distance} KM</td>
                <td>{item.carpark_info[0].lots_available}</td>
                <td>{item.carpark_info[0].total_lots}</td>
                {/* {item.carpark_info.map((item2, j) => (
                  <tr key={j}>
                    <td>{item2.lots_available}</td>
                  </tr>
                ))} */}
                <td>{item.update_datetime.substring(0,10)}</td>
                <td>{item.update_datetime.substring(11,19)}</td>
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
