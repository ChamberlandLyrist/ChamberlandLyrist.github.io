

// Top Down Shooter Skeleton Code
// 


// I couldn't get window resizing to work properly in the earliest simplest versions of this code so I will revisit it in later versions, 
// for now there do be a bit of spaghetti code that doesn't need to be there.

// NOTE:
// I couldn't get collisions working: so anything that uses Matter.js stuff was from ChatGPT, UNLESS OTHERWISE SPECIFIED

// Update: I am omewhat starting to understand Matter.js, will continue to ask Chat for info on functions and such tho


// Note: writing this code was a complete scene, i can give the full story in person but i just want to be done with this for today...


// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of size
let player = {
  xrat: 0,
  yrat: 0,
  srat: 0.5/20,
  clr: "red",
  deck: [],
  reserves: [],
  gun: [],
  speed: 0.1/20,
  body: null,
  circle: true
};

let aK = 65;
let dK = 68;
let wK = 87;
let sK = 83;

let maxSpeed = 5;

function moveP(player){

  let body = player.body;
  let pos = body.position;
  let a = keyIsDown(aK);
  let d = keyIsDown(dK);
  let w = keyIsDown(wK);
  let s = keyIsDown(sK);

  let spd = player.speed*wind.size;

  //introduced by Chat
  // Apply a force to player when a key is pressed
  if (a) {
    Matter.Body.applyForce(body, { x: pos.x, y: pos.y }, { x: -1*spd, y: 0 });
  }
  if (d) {
    Matter.Body.applyForce(body, { x:pos.x, y: pos.y }, { x: spd, y: 0 });
  }
  if (w) {
    Matter.Body.applyForce(body, { x: pos.x, y: pos.y }, { x: 0, y: -1*spd });
  }
  if (s) {
    Matter.Body.applyForce(body, { x: pos.x, y: pos.y }, { x: 0, y: spd });
  }

  //introduced by Chat
  // Check and limit the speed of player
  const velocity1 = player.body.velocity;
  const speed1 = Matter.Vector.magnitude(velocity1);
  if(a||d||w||s){
    if (speed1 > maxSpeed) {
      Matter.Body.setVelocity(body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), maxSpeed));
    }
  }else if(speed1 > 0.1) {
    Matter.Body.setVelocity(body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), 0.1));
  }

  player.xrat = pos.x / wind.size;
  player.yrat = pos.y / wind.size;

}



// Chat showed me how to use constructors and then I made it my own

// assume spd is in units per second
function Spades(n){
  this.variable = function(n){
    return n+1;
  };
  this.dmg = this.variable(n);
  this.range = {full:6/20, max: 6/20+2/20};
  this.travel = 0;
  this.spd = 0.5/20;
  this.bounces = 2;
  // cool is in millis
  this.cool = 1*1000,
  this.uses = 1;
  this.bullets = 1;
  this.spread = 0;
  this.vector = null;
}


function makeDeck(player,suit){
  // let card;
  for (let rank = 2; rank <= 13; rank++){
    player.deck.push(new suit(rank));
    // card = new suit(rank);
    // player.deck.push(card);
    // console.log(card);
  }
}
function prepareDeck(player){
  player.reserves = player.deck;
  shuffle(player.reserves, true);
}


let bullets = {
  info: [],
  bodies: [],
  size: 0,
  ratio: 0.15/20
};

let released = true;
let cool = 0;

let reload = {
  time: 3*1000,
  wait: 0,
  done: false
};

function doReload(player){
  if (!reload.done && reload.wait <= millis()){
    player.hand = player.deck.splice(0,4);
    console.log("drew new hand",player.hand);
    reload.done = true;
  }
}

function MakeBullet(player){
  if(game){
    let card = player.hand.splice(0,1)[0];
    // card = card[0];
    let vect = aim();
    // console.log(card);
    let shot;
    let bs = bullets.size;
    let ps = player.size;
    let edge = ps + bs*2;

    // let prev = player.body.position;
    // let fro = 0;

    for (let n = 0; n< card.bullets; n++){
      
      card.vector = vect;

      bullets.info.push(card);
      
      // note: idk why but it needs to be bs*3.4, that should be giving way more space than it needs, but the simulation wants what it wants
      // Chat showed me how to use restitution 
      shot = Matter.Bodies.circle(player.body.position.x+ps+vect.x*edge-bs*3.4, player.body.position.y+ps+vect.y*edge-bs*3.4, bullets.size,{restitution:5});
      // console.log("player",player.body.position.x,player.body.position.y);
      // console.log(shot.position.x-bs*2,shot.position.y-bs*2);

      // fro = player.body.position;
      // console.log(prev.x-fro.x,prev.y-fro.y);

      bullets.bodies.push(shot);
      const cheese = (card.vector.x + card.vector.y)/2;
      Matter.World.add(engine.world, [shot]);
      // setTimeout(() => {
        Matter.Body.applyForce(shot, shot.position, {x: vect.x/(wind.size*100), y: vect.y/(wind.size*100)});
        Matter.Body.setVelocity(shot, Matter.Vector.mult(Matter.Vector.normalise(shot.velocity), card.spd));
      // }, 100); // Add a delay of 100 milliseconds
      
      // console.log(shot);
      // console.log(shot.velocity);
    }

    // console.log(card);
    cool = millis()+card.cool;

    if(player.hand.length === 0){
      reload.wait = millis()+reload.time;
      reload.done = false;
      console.log("empty hand, reloading");
    }

  }
}

function pShoot(player){
  if (mouseIsPressed===true){
    if (mouseButton === LEFT && released && cool <= millis()){
      MakeBullet(player);
      released = false;
    }
  } else {
    released = true;
  }
}


function aim(){
  let start = player.body.position;
  let end = {x: mouseX, y: mouseY};
  let reticle = {x: end.x-(start.x+player.size), y: end.y-(start.y+player.size)};
  // console.log(reticle);
  let vector = Matter.Vector.normalise(reticle);
  // console.log(vector);
  return vector;
}


function doBull(){
  bullMove();
  bullCollide();
  bullDraw();
}

function bullDraw(){
  let posB;
  // console.log(bullets);
  if (bullets.bodies.length > 0){
    for (let shot of bullets.bodies){
      posB = shot.position;
      // console.log(posB);
      fill("green");
      ellipseMode(RADIUS);
      circle(posB.x,posB.y,bullets.size);
    }
  }
}
function bullMove(){
  //make cleaner in future version
  for (let shot in bullets.bodies){
    const vel = bullets.bodies[shot].velocity
    // if(Matter.Vector.magnitude(vel)< bullets.info[shot].spd){
    const cheese = (bullets.info[shot].vector.x + bullets.info[shot].vector.y)/2;
    Matter.Body.setVelocity(bullets.bodies[shot], Matter.Vector.mult(Matter.Vector.normalise(vel), bullets.info[shot].spd*wind.size));

    // }
  }
}
function bullCollide(){
  let toremove = {blanks:[],bodies:[]};
  let shot;

  // Check for collisions 
  for (let place in bullets.bodies){
    shot = bullets.bodies[place];
    if (Matter.Collision.collides(shot, player.body)) {
      console.log("Hit player");
      toremove.bodies.push(shot);
      toremove.blanks.push(place);
    }else{
      for (let obj of objects){
        if (Matter.Collision.collides(shot, obj)) {
          // console.log("hit something wall like");
          bullImpact(toremove,place,shot);
        }
      }
    }
  }
  Matter.World.remove(engine.world, toremove.bodies);
  for (let blank of toremove.blanks){
    bullets.bodies.splice(blank,1);
    bullets.info.splice(blank,1);
  }
}
function bullImpact(list,place,shot){
  let info = bullets.info[place]
  if(info.bounces === 0){
    list.blanks.push(place);
    list.bodies.push(shot);
    // console.log("destroyed");
  }else {
    // console.log("bounced");
    info.bounces --;
  }

}


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
  player.size = player.ratio*small;
  bullets.size = bullets.ratio*small;
  // console.log(bullets.size);
  // console.log(wind.size, w, h);
  createCanvas(wind.size, wind.size);
}

// use .label (in .body)
function resize(thing){
  let body = thing.body;
  body.position = {x: thing.xrat*wind.size, y: thing.yrat*wind.size};
  
  if (thing.circle){
    body.circleRadius = thing.srat * wind.size;
  }

}

function disCircle(clr,body){
  let pos = body.position;
  ellipseMode(RADIUS);
  strokeWeight(0);
  fill(clr);
  circle(pos.x,pos.y,body.circleRadius);
}
function disRect(clr,body){

}

let engine;

let objects = [];

let obstacles = [{xrat: 0, yrat: 0, body: null, wrat: 0.7/20, hrat: 0.7/20, circle: false}];
let border = [];
let thin;
let long;

let game = false;

function setup() {
  display();

  makeDeck(player,Spades);
  // console.log(player.deck);
  prepareDeck(player);
  



  // make {x:, y:}
  let spawn = wind.size/2;

  // wrote this myself but it was mostly a change values kind of deal
  thin = wind.size/5;
  long = wind.size;
  // north
  border.push(Matter.Bodies.rectangle(0+wind.size/2,0-thin/2,long,thin, {isStatic:true}));
  // east
  border.push(Matter.Bodies.rectangle(0+wind.size+thin/2,0+wind.size/2,thin,long,{isStatic:true}));
  // south
  border.push(Matter.Bodies.rectangle(0+wind.size/2,0+wind.size+thin/2,long,thin,{isStatic:true}));
  // west
  border.push(Matter.Bodies.rectangle(0-thin/2,0+wind.size/2,thin,long, {isStatic:true}));


  //I learned about a little thing called restitution and that it makes things bouncy...
  engine = Matter.Engine.create({enableSleeping: false});

  // Disable gravity by setting the gravity vector to {x: 0, y: 0}
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  //chat said that changing the amount of updates per frame could help with my ethereal bullets, not sure what delta does
  Matter.Engine.update(engine, window.requestAnimationFrame, 50);

  Matter.Runner.run(engine);

  player.body = Matter.Bodies.circle(spawn, spawn, player.srat*wind.size);
  console.log(player.body);
  Matter.World.add(engine.world, [player.body]);

  obstacles[0].body = Matter.Bodies.rectangle(150, 150, 50, 50, {isStatic: true});
  console.log(obstacles[0].body);

  for (let obj of [obstacles]){
    objects.push(obj);
  }
  Matter.World.add(engine.world, obstacles);

  for (let wall of border){
    objects.push(wall);
  }
  Matter.World.add(engine.world, border)

  game = true;
}


function draw() {
  // display();
  background(30);


  doReload(player);

  moveP();
  
  disCircle(player.clr,player.body);
  

  // fill("blue");
  // rectMode(CENTER);
  // rect(pos2.x, pos2.y, 50, 50);

  
  pShoot(player);

  doBull();
  
}



