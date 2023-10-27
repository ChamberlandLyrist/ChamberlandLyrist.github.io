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

function draw() {
  background(220);
  keyTyped();
  displayGrid();
}

function mousePressed() {
  let y = Math.floor(mouseY/cellSize);
  let x = Math.floor(mouseX/cellSize);

  toggleCell(x, y);   //current cell
  // toggleCell(x, y-1); //north neighbour
  // toggleCell(x, y+1); //south neighbour
  // toggleCell(x+1, y); //east neighbour
  // toggleCell(x-1, y); //west neighbour
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

function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else if (grid[y][x] === 1) {
        fill("black");
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
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
      newGrid[y].push(0);
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

function nextTurn(){
  let nextGrid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  let shift = [-1,0,1];
  // look at every cell
  for (let y = 0; y < GRID_SIZE; y++){
    for (let x = 0; x < GRID_SIZE; x++){
      // console.log(y,x);
      // count neighbours
      let neighbours = 0;
      // look at all cells around in a 3x3 grid
      for (let shifty of shift){
        for (let shiftx of shift){
          // console.log(grid, y, x, shifty, shiftx);
          neighbours += checkNeighbour(x+shiftx,y+shifty);
          
        }
      }
      let self = grid[y][x];
      neighbours -= self;
      if (self === 0){
        // new
        if(neighbours === 3){
          nextGrid[y][x] = 1;
        }
      }
      else if (neighbours === 2 || neighbours === 3){
        // stay alive
        nextGrid[y][x] = 1;
      }
      else {
        // die
        nextGrid[y][x] = 0;
      }
    }
  }
  return nextGrid;
}

function checkNeighbour(x,y){
  // detect edge cases
  console.log(x,y,x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE);
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    console.log(grid[y][x]);
    return grid[y][x];
  }
  else{
    return 0;
  }
}