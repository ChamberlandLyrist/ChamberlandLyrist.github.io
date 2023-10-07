


// NOTE:
// I couldn't get collisions working: so anything that uses Matter.js stuff was from ChatGPT, UNLESS OTHERWISE SPECIFIED

// Update: I am omewhat starting to understand Matter.js, will continue to ask Chat for info on functions and such tho





// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of size
let playerInfo = {
  size: 0.5/20,
  clr: "red",
  ammo: [],
  gun: [],
  speed: 1/20
};

let aK = 65;
let dK = 68;
let wK = 87;
let sK = 83;

let maxSpeed = 5;

function moveP(){

  let velx = 0;
  let vely = 0;
  let a =keyIsDown(aK);
  let d = keyIsDown(dK);
  let w =keyIsDown(wK);
  let s =keyIsDown(sK);

  let spd = 0.01;

  // Apply a force to player when a key is pressed
  if (a) {
    Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: -1*spd, y: 0 });
  }
  if (d) {
    Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: spd, y: 0 });
  }
  if (w) {
    Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: 0, y: -1*spd });
  }
  if (s) {
    Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: 0, y: spd });
  }

  // Check and limit the speed of player
  const velocity1 = player.velocity;
  const speed1 = Matter.Vector.magnitude(velocity1);
  if (speed1 > maxSpeed) {
    Matter.Body.setVelocity(player, Matter.Vector.mult(Matter.Vector.normalise(velocity1), maxSpeed));
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
  playerInfo.size = playerInfo.size*small;
  // console.log(wind.size, w, h);
  createCanvas(wind.w, wind.h);
}


let engine;
let player;
let box2;
let border = [];
let thin = 0.1;
let long;

function setup() {
  display();

  // make {x:, y:}
  let spawn = wind.size/2

  // wrote this myself but it was mostly a change values kind of deal
  
  long = wind.size;
  // north
  border.push(Matter.Bodies.rectangle(0,0,long,thin, {isStatic:true}));
  // east
  border.push(Matter.Bodies.rectangle(long,0,thin,long,{isStatic:true}));
  // south
  border.push(Matter.Bodies.rectangle(0,long,long,thin,{isStatic:true}));
  // west
  border.push(Matter.Bodies.rectangle(0,0,thin,long, {isStatic:true}));

  engine = Matter.Engine.create();

  // Disable gravity by setting the gravity vector to {x: 0, y: 0}
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;


  Matter.Runner.run(engine);
  player = Matter.Bodies.circle(spawn, spawn, playerInfo.size);
  box2 = Matter.Bodies.rectangle(150, 150, 50, 50, {isStatic: true});

  Matter.World.add(engine.world, [player, box2]);

  for (let wall of border){
    Matter.World.add(engine.world, [wall])
  }

}



function draw() {
  // display();
  background(30);

  moveP();
  // Update p5.js sketch based on Matter.js physics
  let posP = player.position;
  let pos2 = box2.position;
  fill("red");
  ellipseMode(CORNER);
  ellipse(posP.x, posP.y, 50);
  fill("blue");
  rect(pos2.x, pos2.y, 50, 50);
  
  // Check for collisions 
  for (let wall of border){
    if (Matter.Collision.collides(player, wall)) {
      // Handle collision here
      console.log("Collision detected!");
    }
  }
  
}
