// 2d grid
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// let grid = [
//   [1,0,0,1],
//   [0,0,0,1],
//   [1,1,0,1],
//   [0,1,0,1]
// ];
let tilesize;
const GRID_SIZE = 20;

let grid;

function makeGrid(){
  grid = [];
  let cheese;
  let frommage;
  for (let n = 0; n <= GRID_SIZE; n++){
    cheese = [];
    for (let i = 0; i <= GRID_SIZE; i++){
      if (random(100) < 50){
        frommage = 0;
      }else{
        frommage = 1;
      }
      cheese.push(frommage);
    }
    grid.push(cheese);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  makeGrid();

  let smoll;
  if(width<=height){
    smoll = width;
  }else{
    smoll = height;
  }
  tilesize = smoll/grid.length;

  
}


function draw() {
  background(220);
  // makeGrid();
  // toggle();
  dispGrid();
}



function mouseClicked(){
  let x = Math.floor(mouseX/tilesize);
  let y = Math.floor(mouseY/tilesize);
  if (grid[y][x] === 0){
    grid[y][x] = 1;
  }else{
    grid[y][x] = 0;
  }
}

function dispGrid(){
  // strokeWeight(0);
  for (let y in grid){
    for (let x in grid[y]){
      if (grid[y][x] === 1){
        fill(0);
        stroke(0);
      }else{
        fill(60);
        stroke(60);
      }
      rect(tilesize*x, tilesize*y, tilesize, tilesize);
    }
  }
}