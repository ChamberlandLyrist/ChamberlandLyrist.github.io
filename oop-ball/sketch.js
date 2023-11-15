// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball {
  constructor(x,y, life){
    this.x = x;
    this.y = y;
    this.radius = random(15,30);
    this.dx = random(-9,9);
    this.dy = random(-9,9);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.life = life;
  }

  display(){
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x,this.y, this.radius*2);
  }


  move(){
    for (let i = 0; i < 4; i++){
      this.x += this.dx/4;
      this.y += this.dy/4;
      this.life -= 1/4;
      this.bounce();
    }
  }

  bounce(){
    if (this.x + this.radius >= windowWidth || this.x - this.radius <=0){
      this.dx *= -1;
    }
    if (this.y +this.radius >= windowHeight || this.y - this.radius <=0){
      this.dy *= -1;
    }
  }
  bounceOff(otherball){
    let radsum = this.radius + otherball.radius;
    let space = dist(this.x,this.y, otherball.x, otherball.y);
    if (radsum >= space){
      let tempdx = this.dx;
      let tempdy = this.dy;

      this.dx = otherball.dx;
      this.dy = otherball.dy;

      otherball.dx = tempdx;
      otherball.dy = tempdy;

    }
  }
}


let ballz = [];

function mousePressed() {
  for(let i = 0; i <1; i++){
    more(40);
  }
}

function more(life){
  let theaBall = new Ball(mouseX, mouseY, life);
  ballz.push(theaBall);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  for (let bally of ballz){
    // if (bally.life > 0){
      bally.move();
      bally.display();
      for (let otherball of ballz){
        if(bally !== otherball){
          bally.bounceOff(otherball);
        }
      }
    // }
  }
  if (key === " "){
    for(let i = 0; i <1; i++){
      more(random(10,20));
    }
  }
}
