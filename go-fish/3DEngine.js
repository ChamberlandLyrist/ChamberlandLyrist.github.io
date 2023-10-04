let sideA = {
  x: 10,
  y: 10,
  z: 10,
  colour: "red",
};

let sideB = {
  x: 10,
  y: 10,
  z: 10,
  colour: "green",
};

let sideC = {
  x: 10,
  y: 10,
  z: 10,
  colour: "yellow",
};

function displaySide(side){
  let corner = 50;
  fill(side.colour);
  //    corner a x y,    corner b x  y,    corner c x y,   corner d x y
  quad(corner,corner,corner*2, corner,corner*2,corner*2,corner,corner*2);

}



function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  displaySide(sideA);
}
