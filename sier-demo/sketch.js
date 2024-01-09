// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let startTriangle = [
  {x: 400, y: 50},
  {x: 50, y: 550},
  {x:750, y: 550}
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  sierpinkski(startTriangle, 1000);
}

function sierpinkski(points, degree){
  triangle(points[0].x, points[0].y,points[1].x, points[1].y,points[2].x, points[2].y);

  if (degree > 0) {
    // upper tri
    sierpinkski([
      points[0],
      midPoint(points[0],points[1]),
      midPoint(points[0],points[2])],
      degree-1);
    // left tri
    sierpinkski([
      points[1],
      midPoint(points[0],points[1]),
      midPoint(points[1],points[2])],
      degree-1);
      // right tri
      sierpinkski([
        points[2],
        midPoint(points[0],points[2]),
        midPoint(points[1],points[2])],
        degree-1);
  }
}

function midPoint(apoint,bpoint){
  let newX = (apoint.x + bpoint.x)/2;
  let newY = (apoint.y + bpoint.y)/2;
  return {x:newX,y:newY};
}