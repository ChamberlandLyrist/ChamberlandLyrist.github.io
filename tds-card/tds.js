


// NOTE:
// I couldn't get collisions working: so anything that uses Matter.js stuff was from ChatGPT, UNLESS OTHERWISE SPECIFIED





// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of size
let player = {
  size: 0.5/20,
  clr: "white",
  ammo: [],
  gun: [],
  x: 50,
  y: 50,
  speed: 1/20
};

let aK = 65;
let dK = 68;
let wK = 87;
let sK = 83;
function moveP(){
  let velx = 0;
  let vely = 0;
  let a =keyIsDown(aK);
  let d = keyIsDown(dK);
  let w =keyIsDown(wK);
  let s =keyIsDown(sK);
  if (a){
    velx -= 1;
  }
  if (d){
    velx += 1;
  }
  if (w){
    vely -= 1;
  }
  if (s){
    vely += 1;
  }

  let spd = 1;
  if (velx+vely>0){
    player.speed/(velx+vely);
  }
  if(a){
    player.x -= spd;
  }
  if(d){
    player.x += spd;
  }
  if(w){
    player.y -= spd;
  }
  if(s){
    player.y += spd;
  }
}


let maxSpeed = 5;

function moveB(){

  let velx = 0;
  let vely = 0;
  let a =keyIsDown(aK);
  let d = keyIsDown(dK);
  let w =keyIsDown(wK);
  let s =keyIsDown(sK);
  if (a){
    velx -= 1;
  }
  if (d){
    velx += 1;
  }
  if (w){
    vely -= 1;
  }
  if (s){
    vely += 1;
  }

  let spd = 0.01;
  if (velx+vely>0){
    spd = 0.01/(velx+vely);
  }


  // Apply a force to box1 when a key is pressed
  if (a) {
    Matter.Body.applyForce(box1, { x: box1.position.x, y: box1.position.y }, { x: -1*spd, y: 0 });
  }
  if (d) {
    Matter.Body.applyForce(box1, { x: box1.position.x, y: box1.position.y }, { x: spd, y: 0 });
  }
  if (w) {
    Matter.Body.applyForce(box1, { x: box1.position.x, y: box1.position.y }, { x: 0, y: -1*spd });
  }
  if (s) {
    Matter.Body.applyForce(box1, { x: box1.position.x, y: box1.position.y }, { x: 0, y: spd });
  }

  // Check and limit the speed of box1
  const velocity1 = box1.velocity;
  const speed1 = Matter.Vector.magnitude(velocity1);
  if (speed1 > maxSpeed) {
    Matter.Body.setVelocity(box1, Matter.Vector.mult(Matter.Vector.normalise(velocity1), maxSpeed));
  }

}


let border = {
  gl: true,
  points: [{x:0, y:0},{x:0,y:100},{x:100,y:0},{x:100,y:100}]
};

function edge(){
  border.points[1].y, border.points[3].y = wind.size;
  border.points[2].x, border.points[3].x = wind.size;
}

function barrier(unit, object){
  let set;

  let lna;
  let lnb;
  let ab;
  let a;
  let b;
  for (let pl=0; pl<=object.points.length; pl++){
    if (pl===object.points.length){
      set = [object.points[pl],object.points[0]];
    }else{
      set = subset(object.points[pl],2);
    }
    lna = dist(unit.x,unit.y,set[0].x,set[0].y);
    lnb = dist(unit.x,unit.y,set[1].x,set[1].y);
    ab = dist(set[0].x,set[0].y,set[1].x,set[1].y);

    a = Math.sqrt(lna**2-unit.size**2);
    b = Math.sqrt(lnb**2-unit.size**2);

    if(a+b <= ab){
      fill("blue");
    }

  }

}




let bullets = [];

let wind = {
  w: 0,
  h: 0,
  size: 0
};


function display(){
  let w = windowWidth;
  let h = windowHeight;
  wind.w = w;
  wind.h = h;
  let small;
  if (w<=h){
    small = w;
  }
  else{
    small = h;
  }
  wind.size = small;
  edge();
  
  // console.log(wind.size, w, h);
  createCanvas(wind.w, wind.h);
}


let engine;
let box1;
let box2;

function setup() {
  display();

  engine = Matter.Engine.create();

  // Disable gravity by setting the gravity vector to {x: 0, y: 0}
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;


  Matter.Runner.run(engine);
  box1 = Matter.Bodies.circle(100, 100, 25);
  box2 = Matter.Bodies.rectangle(150, 150, 50, 50, {isStatic: true});
  // player = Matter.Bodies.circle()
  Matter.World.add(engine.world, [box1, box2]);


  player.x = wind.size/2;
  player.y = wind.size/2;
  player.size = player.size*wind.size;
}


function draw() {
  // display();
  background(30);


  moveB();
  // Update p5.js sketch based on Matter.js physics
  let pos1 = box1.position;
  let pos2 = box2.position;
  fill("red");
  ellipseMode(CORNER);
  ellipse(pos1.x, pos1.y, 50);
  fill("blue");
  rect(pos2.x, pos2.y, 50, 50);
  
  // Check for collisions (you may need more advanced collision handling)
  if (Matter.Collision.collides(box1, box2)) {
    // Handle collision here
    console.log("Collision detected!");
  }

  // // Check for collision using Matter.Bounds.overlaps
  // if (Matter.Bounds.overlaps(box1.bounds, box2.bounds)) {
  //   // Handle collision here
  //   console.log("Collision detected!");
  // }



  // fill("red");
  // moveP();
  // barrier(player,border);
  // circle(player.x,player.y,player.size);
  
}
