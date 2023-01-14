
// for (let c = 0; c < document.getElementsByTagName("th").length; c++){
//     document.getElementsByTagName("th")[c].addEventListener("click", item(c))
// }

// function item(c){
//     return function(){
//         console.log(c);
//         SortTable(c);
//     }
// }
// function SortTable(c) {
//     var table, rows, switching, i, x, y, shouldSwitch;
//     table = document.getElementById("myTable");
//     switching = true;
//     /* Make a loop that will continue until
//     no switching has been done: */
//     while (switching) {
//       // Start by saying: no switching is done:
//       switching = false;
//       rows = table.rows;
//       /* Loop through all table rows (except the
//       first, which contains table headers): */
//       for (i = 1; i < (rows.length - 1); i++) {
//         // Start by saying there should be no switching:
//         shouldSwitch = false;
//         /* Get the two elements you want to compare,
//         one from current row and one from the next: */
//         x = rows[i].getElementsByTagName("td")[c];
//         y = rows[i + 1].getElementsByTagName("td")[c];
//         // Check if the two rows should switch place:
//         if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//           // If so, mark as a switch and break the loop:
//           shouldSwitch = true;
//           break;
//         }
//         // if (Number(x.innerHTML) > Number(y.innerHTML)) {
//         //     shouldSwitch = true;
//         //     break;
//         //   }
//       }
//       if (shouldSwitch) {
//         /* If a switch has been marked, make the switch
//         and mark that a switch has been done: */
//         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//         switching = true;
//       }
//     }
//   }

//   export default SortTable;

// function SortTable(c) {
//     var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
//     table = document.getElementById("myTable2");
//     switching = true;
//     // Set the sorting direction to ascending:
//     dir = "asc";
//     /* Make a loop that will continue until
//     no switching has been done: */
//     while (switching) {
//       // Start by saying: no switching is done:
//       switching = false;
//       rows = table.rows;
//       /* Loop through all table rows (except the
//       first, which contains table headers): */
//       for (i = 1; i < (rows.length - 1); i++) {
//         // Start by saying there should be no switching:
//         shouldSwitch = false;
//         /* Get the two elements you want to compare,
//         one from current row and one from the next: */
//         x = rows[i].getElementsByTagName("TD")[c];
//         y = rows[i + 1].getElementsByTagName("TD")[c];
//         /* Check if the two rows should switch place,
//         based on the direction, asc or desc: */
//         if (dir == "asc") {
//           if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//             // If so, mark as a switch and break the loop:
//             shouldSwitch = true;
//             break;
//           }
//         } else if (dir == "desc") {
//           if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
//             // If so, mark as a switch and break the loop:
//             shouldSwitch = true;
//             break;
//           }
//         }
//       }
//       if (shouldSwitch) {
//         /* If a switch has been marked, make the switch
//         and mark that a switch has been done: */
//         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//         switching = true;
//         // Each time a switch is done, increase this count by 1:
//         switchcount ++;
//       } else {
//         /* If no switching has been done AND the direction is "asc",
//         set the direction to "desc" and run the while loop again. */
//         if (switchcount == 0 && dir == "asc") {
//           dir = "desc";
//           switching = true;
//         }
//       }
//     }
//   }
//   export default SortTable;