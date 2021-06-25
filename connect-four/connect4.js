"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for(let y = 0; y < HEIGHT; y++){
    board.push(Array.from({length: WIDTH}, value => null));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  /**
   * make table row element and makes clickable
   */
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  /**
   * makes the individual cells for top
   */
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    //Create a table row element and assign to a "row" variable
    let tableRow = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // Create a table cell element and assign to a "cell" variable
      let cell = document.createElement("td");
      // add an id, y-x, to the above table cell element
      // you'll use this later, so make sure you use y-x
      cell.setAttribute("id", `${y}-${x}`);
      // append the table cell to the table row
      tableRow.append(cell);
    }
    // append the row to the html board
    htmlBoard.append(tableRow);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let rowCount = HEIGHT-1;
  while (rowCount >= 0) {
      if(board[rowCount][x]===null){
      return rowCount;
    }
    else {
      rowCount--;
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board 
*/

function placeInTable(y, x) {
  
  let piece = document.createElement("div");
  piece.setAttribute("class", "p" + currPlayer);
  piece.classList.add("piece");
  document.getElementById(`${y}-${x}`).append(piece);
  
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message, setting a timeout so it places the piece on the HTML board before sending the alert
  setTimeout(function(){alert(msg)},100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  
  // place piece in board and add to HTML table
  // add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;
  
  
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  
  // check if all cells in board are filled; if so call, call endGame
  
  if(board[0].every(cell => cell !== null)){
      return endGame("the game is a tie");
  }

  // switch currPlayer 1 <-> 2
  
  currPlayer = (currplayer===1 ? 2 : 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    //check if every element of the array if they are the same and are in bound
    // pass the some if condition to a variable to make it easier to read.
    let inBounds = cells.some( ([y,x]) => {
      return (y < 0 || y >= HEIGHT) || (x < 0 || x >= WIDTH)});
    
    let isFourConnected = cells.every( ([y,x]) => {
      return board[y][x] === currPlayer});
    
    if(inBounds){
        return false;
    }
    if(isFourConnected){
        return true;
    }
    return false;

  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x + 3],[y + 1, x + 2],[y + 2, x + 1],[y + 3, x]];
      let diagDR = [[y, x],[y + 1, x + 1],[y + 2, x + 2],[y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        //remove event listener so user cannot keep clicking after game is over. 
        document.getElementById("column-top").removeEventListener("click", handleClick);
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
