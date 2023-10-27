let grid;
const GRID_SIZE = 10;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);

  if (height > width) {
    cellSize = width/GRID_SIZE;
  }
  else {
    cellSize = height/GRID_SIZE;
  }
}
let start = false;
let lost = false;
function draw() {
  background(220);
  displayGrid();
  if (!lost && start){
    
    keyTyped();
    
  }
}

function mousePressed() {
  let y = Math.floor(mouseY/cellSize);
  let x = Math.floor(mouseX/cellSize);

  activateCell(x, y);
  // if not started, start
  if (!start){
    start = true;
    for(let y in grid){
      for (let x in grid){
        grid[y][x].
      }
    }
  }
  // toggleCell(x, y);   //current cell
}

function toggleCell(x, y) {
  //check that we are within the grid, then toggle
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    if (grid[y][x] === 0) {
      grid[y][x] = 1;
    }
    else if (grid[y][x] === 1) {
      grid[y][x] = 0;
    }
  }
}

function activateCell(x, y){
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    if (grid[y][x].open === false) {
      grid[y][x].open = true;
      if(grid[y][x].bomb === 1){
        lost = true;
      }
      else{
// floodfill
      }
    }
  }
}

function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let box = grid[y][x];
      if (box.open === 1) {
        fill("white");
      }
      else if (box.open === 0) {
        fill("grey");
      }
      else if (box.open === "bomb"){
        fill("grey");
        if (lost){
          fill("black");
          ellipseMode(CORNER);
          circle(x*cellSize, y*cellSize, cellSize*0.8);
        }
        
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  let bombs = 10;
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      // check to see if it was the origin box
      if (grid[y][x].open === false){
        // make bomb if bombs left
        if (random(100) > 50 && bombs > 0) {
          bombs --;
          newGrid[y].push({open: 0, adj: 0, bomb: 1, flag: 0});
        }
        // don't make bomb
        else{
          newGrid[y].push({open: 0, adj: 0, bomb: 0, flag: 0});
        }
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push({open: false, adj: 0, bomb: 0, flag: 0});
    }
  }
  return newGrid;
}

function keyTyped() {
  if (key === "r") {
    generateRandomGrid(GRID_SIZE,GRID_SIZE);
  }
  else if (key === "e") {
    generateEmptyGrid(GRID_SIZE,GRID_SIZE);
  }
  else if (key === " ") {
    key = "";
    grid = nextTurn();
  }
}

let shift = [-1,0,1];
function nextTurn(){
  let nextGrid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  // look at every cell
  for (let y = 0; y < GRID_SIZE; y++){
    for (let x = 0; x < GRID_SIZE; x++){
      // console.log(y,x);
      if (grid[y][x].open === 0 && grid[y][x].flag === 0){
        let neighbours = allNeighbours(x,y,bomb);
        let self = grid[y][x];
        neighbours -= self;
        if (self === 0){
          // new
          if(neighbours === 3){
            nextGrid[y][x].bomb = 1;
          }
        }
        else if (neighbours === 2 || neighbours === 3){
          // stay alive
          nextGrid[y][x].bomb = 1;
        }
        else {
          // die
          nextGrid[y][x].bomb = 0;
        }
      }
    }
  }
  return nextGrid;
}

function allNeighbours(x,y,check,precheck){
  // count neighbours
  let neighbours = 0;
  // look at all cells around in a 3x3 grid
  for (let shifty of shift){
    for (let shiftx of shift){
      // console.log(grid, y, x, shifty, shiftx);
      neighbours += checkNeighbour(x+shiftx,y+shifty,check);
    }
  }
  return neighbours;
}

function checkNeighbour(x,y,check){
  // detect edge cases
  // console.log(x,y,x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE);
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && grid[y][x].flag === 0) {
    let state = grid[y][x].check;
    console.log(state);
    return state;
  }
  else{
    return 0;
  }
}