// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let points = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  for(let point of points){
    point.display();
    point.update();
    point.connectTo(points);
  }
  if (mouseIsPressed){
    newpoint();
  }
}

function mousePressed(){
  newpoint();
}

function newpoint(){
  let apoint = new MovingPoint(mouseX,mouseY);
  points.push(apoint);
}

let movespeed = -5;

class MovingPoint {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
    this.radius = 15;
    this.xtime = random(10000);
    this.dxtime = 0.01;
    this.ytime = random(10000);
    this.dytime = 0.01;
    this.reach = 150;
  }

  display(){
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
  }

  update() {
    let dx = noise(this.xtime);
    let dy = noise(this.ytime);
    this.xtime += this.dxtime;
    this.ytime += this.dytime;
    this.dx = map(dx, 0, 1, movespeed, Math.abs(movespeed));
    this.dy = map(dy, 0, 1, movespeed, Math.abs(movespeed));
    this.x += this.dx;
    this.y += this.dy;
  }

  connectTo(points){
    for (let otherPoint of points){
      if(this !== otherPoint){
        if (dist(this.x,this.y,otherPoint.x,otherPoint.y) <= this.reach){
          stroke(this.color);
          line(this.x, this.y, otherPoint.x, otherPoint.y);
        }
      }
    }
  }
}