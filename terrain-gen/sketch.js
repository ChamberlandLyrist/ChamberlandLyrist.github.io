// Terrain Generation
// oct 23 2023

let blocks = [];
let xOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnRect();
}

function draw() {
  background(220);
  if (keyIsDown(RIGHT_ARROW)){
    xOffset += 1;
  }

  dispRect();
}

function dispRect(){
  fill("black");
  for (let i = xOffset; i < width -xOffset; i++){
    let thisr = blocks[i];
    rect(thisr.x - xOffset,thisr.y, 1,windowHeight);
  }
}

function spawnRect() {
  let time = 0;
  for (let x = 0; x < windowWidth; x++, time+= 0.001){
    let h = noise(time)*windowHeight;
    let thisRect = {
      x: x,
      y: h
    };
    blocks.push(thisRect);
  }

}