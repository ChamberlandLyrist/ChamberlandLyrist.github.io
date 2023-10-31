let grid;
const GRID_SIZE = {
  h: 10,
  w: 15
};
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = generateStartGrid(GRID_SIZE.w, GRID_SIZE.h);

  if (height > width) {
    cellSize = width/GRID_SIZE.w;
  }
  else {
    cellSize = height/GRID_SIZE.h;
  }
}

let start = false;
let lost = false;

function draw() {
  background(220);
  displayGrid();
  // if (!lost && start){
    
  // }
}

function mousePressed() {
  let y = Math.floor(mouseY/cellSize);
  let x = Math.floor(mouseX/cellSize);

  if(grid[y][x].open === false){
    activateCell(x, y);
    // if not started, start
    if (!start){
      start = true;
      grid = generateRandomGrid(GRID_SIZE.w,GRID_SIZE.h);
      floodFill(x,y);
    }
    else{
      grid = nextTurn();
    }
    // toggleCell(x, y);   //current cell
  }
}

function toggleCell(x, y) {
  //check that we are within the grid, then toggle
  if (x >= 0 && x < GRID_SIZE.w && y >= 0 && y < GRID_SIZE.h) {
    if (grid[y][x] === 0) {
      grid[y][x] = 1;
    }
    else if (grid[y][x] === 1) {
      grid[y][x] = 0;
    }
  }
}

let flood;

function activateCell(x, y){
  if (x >= 0 && x < GRID_SIZE.w && y >= 0 && y < GRID_SIZE.h) {
    let box = grid[y][x];
    if (box.open === false) {
      box.open = true;
      if(box.bomb === 1){
        lost = true;
      }
      if(start){
        floodFill(x,y);
      }
    }
  }
}

function floodFill(x,y){
  flood = [];
  // console.log("begin flood", x, y);
  for (let shifty of shift){
    for (let shiftx of shift){
      let row = y+shifty;
      let col = x+shiftx;                                                 
      if (col >= 0 && col < GRID_SIZE.w && row >= 0 && row < GRID_SIZE.h && Math.abs(shiftx) !== Math.abs(shifty)){
        let box = grid[row][col];  
                          //if neither a flag or a bomb is present
        if (!box.open && box.flag+box.bomb === 0){
          // console.log("floodfilled:",x,y);
          flood.push({x: col, y: row});
          activateCell(col,row);
        }
      }
    }
  }
  let thisflood = flood;
  // console.log("thisflood",thisflood);
  for (let pos of thisflood){
    // console.log(pos);
    floodFill(pos.x,pos.y);
  }
}

function displayGrid() {
  for (let y = 0; y < GRID_SIZE.h; y++) {
    for (let x = 0; x < GRID_SIZE.w; x++) {
      let box = grid[y][x];
      // console.log(x,y);
      let row = y*cellSize;
      let col = x*cellSize;
      box.adj = allNeighbours(x,y);
      if (box.open === true) {
        fill("white");
        rect(col, row, cellSize);
        fill("red");
        textAlign(LEFT,TOP);
        textSize(cellSize);
        text(box.adj, col, row);
      }
      else if (box.open === false) {
        fill("grey");
        rect(col, row, cellSize);
      }
      if (box.bomb === 1){
        // if (lost){
        fill("black");
        ellipseMode(CORNER);
        circle(col+cellSize/8, row+cellSize/8, cellSize*0.8);
        // }
      }
      
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  let bombs = 70;
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      // check to see if it was the origin box
      if (grid[y][x].open === false){
        // make bomb if bombs left
        if (random(100) > 40 && bombs >0) {
          bombs --;
          // console.log("bomb",x,y);
          newGrid[y].push({open: false, adj: 0, bomb: 1, flag: 0});
        }
        // don't make bomb
        else{
          // console.log("no bomb",x,y);
          newGrid[y].push({open: false, adj: 0, bomb: 0, flag: 0});
        }
      }
      else{
        newGrid[y].push(grid[y][x]);
      }
    }
  }
  return newGrid;
}

function generateStartGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push({open: false, adj: 0, bomb: 0, flag: 0});
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push({adj: 0, bomb: 0, flag: 0});
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
  let nextGrid = generateEmptyGrid(GRID_SIZE.w, GRID_SIZE.h);
  // look at every cell
  for (let y = 0; y < GRID_SIZE.h; y++){
    for (let x = 0; x < GRID_SIZE.w; x++){
      // console.log(y,x);
      if (!grid[y][x].open && grid[y][x].flag === 0){
        let neighbours = allNeighbours(x,y);
        let self = grid[y][x].bomb;
        neighbours -= self;
        console.log("neigh:",neighbours);
        if (self === 0){
          // new
          if(neighbours === 3){
            nextGrid[y][x] = structuredClone(grid[y][x]);
            nextGrid[y][x].bomb = 1;
          }
        }
        else if (neighbours === 2 || neighbours === 3){
          // stay alive
          nextGrid[y][x] = structuredClone(grid[y][x]);
          nextGrid[y][x].bomb = 1;
        }
        else {
          // die
          nextGrid[y][x] = structuredClone(grid[y][x]);
          nextGrid[y][x].bomb = 0;
        }
      }
    }
  }
  return nextGrid;
}

function allNeighbours(x,y){
  // count neighbours
  let neighbours = 0;
  // look at all cells around in a 3x3 grid
  for (let shifty of shift){
    for (let shiftx of shift){
      // console.log(y, x, shifty, shiftx);
      neighbours += checkNeighbour(x+shiftx,y+shifty);
    }
  }
  console.log("neighbours:", neighbours);

  return neighbours;
}

function checkNeighbour(x,y){
  // detect edge cases
  // console.log(x,y,x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE);
  // console.log(grid[y][x]);
  if (x >= 0 && x < GRID_SIZE.w && y >= 0 && y < GRID_SIZE.h && grid[y][x].flag === 0) {
    let state = grid[y][x].bomb;
    console.log("state:",state);
    return state;
  }
  else{
    return 0;
  }
}