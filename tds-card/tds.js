


// NOTE:
// I couldn't get collisions working: so anything that uses Matter.js stuff was from ChatGPT, UNLESS OTHERWISE SPECIFIED

// Update: I am omewhat starting to understand Matter.js, will continue to ask Chat for info on functions and such tho





// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of size
let player = {
  size: 0,
  ratio: 0.5/20,
  clr: "red",
  ammo: [],
  gun: [],
  speed: 1/20,
  body: null
};

let aK = 65;
let dK = 68;
let wK = 87;
let sK = 83;

let maxSpeed = 5;

function moveP(){

  let velx = 0;
  let vely = 0;
  let a = keyIsDown(aK);
  let d = keyIsDown(dK);
  let w = keyIsDown(wK);
  let s = keyIsDown(sK);

  let spd = 0.01;

  // Apply a force to player when a key is pressed
  if (a) {
    Matter.Body.applyForce(player.body, { x: player.body.position.x, y: player.body.position.y }, { x: -1*spd, y: 0 });
  }
  if (d) {
    Matter.Body.applyForce(player.body, { x: player.body.position.x, y: player.body.position.y }, { x: spd, y: 0 });
  }
  if (w) {
    Matter.Body.applyForce(player.body, { x: player.body.position.x, y: player.body.position.y }, { x: 0, y: -1*spd });
  }
  if (s) {
    Matter.Body.applyForce(player.body, { x: player.body.position.x, y: player.body.position.y }, { x: 0, y: spd });
  }

  // Check and limit the speed of player
  const velocity1 = player.body.velocity;
  const speed1 = Matter.Vector.magnitude(velocity1);
  if (speed1 > maxSpeed) {
    Matter.Body.setVelocity(player.body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), maxSpeed));
  }

}



// Chat showed me how to use constructors and then I made it my own
function Spades(n){
  this.variable = function(n){
    return n+1;
  };
  this.dmg = this.variable(n);
  this.range = 6/20;
  this.spd = 6;
  this.bullets = 1;
  this.bounces = 1;
  this.uses = 1;
}

let bullets = {
  info: [],
  bodies: [],
  size: 0,
  ratio: 0.4/20
};


function MakeBullet(constructor,rank){
  if(game){
    let card = new constructor(rank);
    let shot;
    for (let n = 0; n<= card.bullets; n++){
    
      bullets.info.push(card);
      shot = Matter.Bodies.circle(player.body.x,player.body.y,bullets.size);
      bullets.bodies.push(shot);
    
      Matter.World.add(engine.world, [shot]);
    }
  }

}


let wind = {
  w: 0,
  h: 0,
  size: 0
};


let cnv;
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
  player.size = player.ratio*small;
  bullets.size = bullets.ratio*small;
  // console.log(bullets.size);
  // console.log(wind.size, w, h);
  createCanvas(wind.w, wind.h);
  
}


let engine;

let box2;
let border = [];
let thin = 0.001;
let long;

let game = false;

function setup() {
  display();

  // make {x:, y:}
  let spawn = wind.size/2

  // wrote this myself but it was mostly a change values kind of deal
  
  long = wind.size*2;
  // north
  border.push(Matter.Bodies.rectangle(0,0-thin,long,thin, {isStatic:true}));
  // east
  border.push(Matter.Bodies.rectangle(wind.size-thin,0,thin,long,{isStatic:true}));
  // south
  border.push(Matter.Bodies.rectangle(0,wind.size-thin,long,thin,{isStatic:true}));
  // west
  border.push(Matter.Bodies.rectangle(0-thin,0,thin,long, {isStatic:true}));

  engine = Matter.Engine.create();

  // Disable gravity by setting the gravity vector to {x: 0, y: 0}
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;


  Matter.Runner.run(engine);
  player.body = Matter.Bodies.circle(spawn, spawn, player.size);
  box2 = Matter.Bodies.rectangle(150, 150, 50, 50, {isStatic: true});

  Matter.World.add(engine.world, [player.body, box2]);

  for (let wall of border){
    Matter.World.add(engine.world, [wall])
  }

  game = true;
}



function draw() {
  // display();
  background(30);

  moveP();
  // Update p5.js sketch based on Matter.js physics
  let posP = player.body.position;
  let pos2 = box2.position;
  fill("red");
  ellipseMode(CORNER);
  ellipse(posP.x, posP.y, player.size*2);
  fill("blue");
  rect(pos2.x, pos2.y, 50, 50);

  if (mouseIsPressed===true){
    if (mouseButton === LEFT){
      MakeBullet(Spades,3);
    }
  } 

  let posB;
  console.log(bullets.bodies.length);
  if (bullets.bodies.length > 0){
    for (let shot of bullets.bodies){
      posB = shot.position;
      // console.log(posB);
      fill("green");
      circle(posB.x,posB.y,bullets.size);
    }
  }
  
  // // Check for collisions 
  // for (let wall of border){
  //   if (Matter.Collision.collides(player, wall)) {
  //     // Handle collision here
  //     console.log("Collision detected!");
  //   }
  // }
  
}
