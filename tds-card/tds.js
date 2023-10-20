

// Top Down Shooter Skeleton Code
// oct 20th
// Lyra Chamberlin (sher/her)

// use WASD to move around your guy(red circle), and left click to shoot a ball towards the mouse
// bullets will bounce twice before disapearing on the third collision(always disapears on collision w player)
// the hand of cards on the left of the screen 


// Extra for experts:




// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of size
let player = {
  xrat: 0,
  yrat: 0,
  srat: 0.4/20,
  clr: "red",
  deck: [],
  reserves: [],
  gun: [],
  speed: 0.1/20,
  body: null,
};

let aK = 65;
let dK = 68;
let wK = 87;
let sK = 83;

let maxSpeed = 0.05/20;

function moveP(player){

  let body = player.body;
  let pos = body.position;
  let a = keyIsDown(aK);
  let d = keyIsDown(dK);
  let w = keyIsDown(wK);
  let s = keyIsDown(sK);

  let spd = player.speed*wind.size*0.001;
  // console.log(spd);

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
    if (speed1 > maxSpeed*wind.size) {
      Matter.Body.setVelocity(body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), maxSpeed));
    }
  }else if(speed1 > 0.1) {
    Matter.Body.setVelocity(body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), 0));
  }

  player.xrat = pos.x / wind.size;
  player.yrat = pos.y / wind.size;

  // console.log(pos);
}



// Chat showed me how to use constructors and then I made it my own

// assume spd is in units per second
function Spades(n){
  this.variable = function(n){
    if (n>10){
      n = 10;
    }
    return n+1;
  };
  this.dmg = this.variable(n);
  this.range = {full:6/20, max: 6/20+2/20};
  this.dist = function(){
    return millis()+1000*(6/20);
  };
  this.toc = function(){
    return millis();
  };
  this.prev = {x:0, y:0};
  this.spd = 0.5/20;
  this.bounces = 2;
  // cool is in millis
  this.cool = 1*1000,
  this.uses = 1;
  this.bullets = 1;
  this.spread = 0;
  this.vector = null;
  this.body = null;
  this.srat = 0.15/20;
  this.clr =  "green";
  this.rank = n;
}

let card = {
  wrat: 4/20,
  hrat: 6/20,
  mrat: 1/20
};

function disCard(spot){
  rectMode(CENTER);
  stroke(0);
  strokeWeight(2);
  let w = card.wrat *wind.size;
  let h = card.hrat *wind.size;
  let margin = card.mrat*wind.size;
  let y = margin *spot/3;
  // fill(200);
  // console.log(y, wind.size);
  rect(uiEdge.maxX/2, 0 - (y-margin*5), w, h);
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
  bulls: [],
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
    player.gun = player.deck.splice(0,4);
    console.log("drew new hand",player.gun);
    reload.done = true;
  }
}

function MakeBullet(player){
  if(game){
    let card = player.gun.splice(0,1)[0];
    console.log("made:",card);
    let shot;
    // card = card[0];
    let vect = aim();
    console.log(vect);
    // console.log(card);
    let bs = card.srat*wind.size;
    // console.log(bs);
    let ps = player.body.circleRadius;
    // console.log(ps);
    let edge = ps + bs*2;
    // console.log(edge);
    let ppos = player.body.position;
    // console.log(ppos);

    // let prev = player.body.position;
    // let fro = 0;
    let sumx;
    let sumy;

    for (let n = 0; n< card.bullets; n++){
      
      card.vector = vect;
      
      // note: idk why but it needs to be -bs*3 , that should be giving way more space than it needs, but the simulation wants what it wants
      // Chat showed me how to use restitution 

      sumx = ppos.x+ps+vect.x*edge-bs*3;
      sumy = ppos.y+ps+vect.y*edge-bs*3;
      card.prev = {x:sumx, y: sumy};
      // console.log(sumx,sumy);
      // console.log(card,body);
      card.body = Matter.Bodies.circle(sumx, sumy, bs,{restitution:1});
      shot = card.body;
      console.log(shot);
      card.xrat = shot.position.x / wind.size;
      card.yrat = shot.position.y / wind.size;
      bullets.bulls.push(card);
      // console.log("player",player.body.position.x,player.body.position.y);
      // console.log(shot.position.x-bs*2,shot.position.y-bs*2);

      // fro = player.body.position;
      // console.log(prev.x-fro.x,prev.y-fro.y);

      // const cheese = (card.vector.x + card.vector.y)/2;
      Matter.World.add(engine.world, [shot]);
      
      Matter.Body.applyForce(shot, shot.position, {x: vect.x/(wind.size*100), y: vect.y/(wind.size*100)});
      Matter.Body.setVelocity(shot, Matter.Vector.mult(Matter.Vector.normalise(shot.velocity), card.spd));
      
      
      // console.log(shot);
      // console.log(shot.velocity);
    }

    // console.log(card);
    cool = millis()+card.cool;

    if(player.gun.length === 0){
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
  let reticle = {x: end.x-(start.x), y: end.y-(start.y)};
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
  let bod;
  // console.log(bullets);
  if (bullets.bulls.length > 0){
    for (let shot of bullets.bulls){
      bod = shot.body;
      // console.log(posB);
      disCircle(shot.clr,bod);
    }
  }
}
let toremove = {blanks:[],bodies:[]};
function bullMove(){
  //make cleaner in future version
  let b = bullets.bulls;
  let last;
  let now;
  let travel;
  for (let shot in b){
    const vel = b[shot].body.velocity;
    bullfall(b[shot],toremove,shot);
    // if(Matter.Vector.magnitude(vel)< bullets.info[shot].spd){
    const cheese = (b[shot].vector.x + b[shot].vector.y)/2;
    Matter.Body.setVelocity(b[shot].body, Matter.Vector.mult(Matter.Vector.normalise(vel), b[shot].spd*wind.size));
    last = b[shot].prev;
    now = b[shot].body.position;
    travel = dist(last.x, last.y, now.x, now.y);
    console.log(travel, millis()-b[shot].toc);

    // }
  }
}
function bullCollide(){
  let shot;

  // console.log("bullets:",bullets);

  // Check for collisions 
  for (let place in bullets.bulls){
    shot = bullets.bulls[place];
    // console.log(shot);
    if (Matter.Collision.collides(shot.body, player.body)) {
      console.log("Hit player");
      toremove.bodies.push(shot.body);
      toremove.blanks.push(place);
    }else{
      for (let obj of objects){
        // console.log(obj);
        if (Matter.Collision.collides(shot.body, obj)) {
          // console.log(obj);
          // console.log("hit something wall like");
          bullImpact(toremove,place,shot);
        }
      }
    }
  }
  Matter.World.remove(engine.world, toremove.bodies);
  for (let blank of toremove.blanks){
    bullets.bulls.splice(blank,1);
    
  }
  toremove = {blanks:[],bodies:[]};
}
function bullImpact(list,place,shot){
  if(shot.bounces === 0){
    list.blanks.push(place);
    list.bodies.push(shot.body);
    // console.log("destroyed");
  }else {
    // console.log("bounced");
    shot.bounces --;
  }

}
let cheese = {
  blanks: [],
  bodies: []
};


function bullfall(bull, list, place){
  // let last = bull.prev;
  // let now = bull.body.position;
  // let moved = dist(last.x, last.y, now.x, now.y);
  // bull.travel += moved/wind.size;
  // if ()
  if (millis()>=bull.dist){
    console.log("too much");
    let fall = bull.spd*1000;
    if(millis()<=bull.dist+fall){
      bull.dmg = bull.dmg / (2 / (fall / bull.dist+fall-millis()));
    }else{
      bull.dmg = 0;
      list.bodies.push(bull.body);
      list.blanks.push(bullets.bulls.indexOf(bull));
      console.log("to far");
    }
    
  }
  

}

let wind = {
  w: 0,
  h: 0,
  size: 0
};

let wide = 40;
let tall = 20;
function reWind(){
  let w = windowWidth;
  let h = windowHeight;

  if(w/h !== wide/tall){
    if (w/wide < h/tall){
      h = w/wide*tall;
    }
    else{
      w = h/tall*wide;
    }
  }
  console.log(w,h);
  wind.w = w;
  wind.h = h;
  wind.size = h;
  createCanvas(wind.w, wind.h);
}

function display(){
  reWind();

  reUI();

  resize(player);
  for (let wall of border){
    resize(wall);
  }
  for (let shape of obstacles.shapes){
    resize(shape);
  }
  for (let bull of bullets.bulls){
    resize(bull);
  }
  // console.log(bullets.size);
  // console.log(wind.size, w, h);
  
}

// use .label (in .body)
function resize(thing){
  // console.log(thing);
  let body = thing.body;
  body.position = {x: uiEdge.maxX+thing.xrat*wind.size, y: thing.yrat*wind.size};
  let type = body.label;
  if ( type === "Circle Body"){
    body.circleRadius = thing.srat * wind.size;
  }
  else if(type === "Rectangle Body"){
    let width = thing.wrat*wind.size;
    let height = thing.hrat*wind.size;
    Matter.Body.scale(body, width/body.bounds.max.x, height/body.bounds.max.y);
    Matter.Body.setVertices(body, Matter.Vertices.fromPath("0 0 ${width} 0 ${width} ${hieght} 0 ${height}"));
  }

  

}

function disCircle(clr,body){
  // console.log(body);
  let pos = body.position;
  ellipseMode(RADIUS);
  strokeWeight(0);
  fill(clr);
  circle(pos.x,pos.y,body.circleRadius);
}
function disRect(info){
  let pos = info.body.position;
  rectMode(CENTER);
  strokeWeight(0);
  fill(info.clr);
  // console.log("pos:",pos);
  rect(pos.x,pos.y,info.wrat*wind.size, info.hrat*wind.size);
}

let engine;

let objects = [];

let obstacles = {
  shapes: [],
  base: {clr: "blue", xrat: 0, yrat: 0, body: 0, wrat: 0, hrat: 0}
};

// {clr: "blue", xrat: 2/20, yrat: 2/20, body: 0, wrat: 1/20, hrat: 1/20}
let state = [0, 1];
let thisxrat = 2/20;
let thisyrat = 2/20;
let thiswrat = 1/20;
let thishrat = 1/20;
let siderat = [{x:2/20, y:4/20}, {x:4/20,y:2/20}, {x:6/20, y:6/20}];
for (let rat of siderat){
  thisyrat = rat.y;
  thisxrat = rat.x;
  for (let xflip of state){
    for (let yflip of state){
      obstacles.shapes.push(structuredClone(obstacles.base));
      obstacles.shapes[obstacles.shapes.length-1].xrat = Math.abs(xflip - thisxrat);
      obstacles.shapes[obstacles.shapes.length-1].yrat = Math.abs(yflip - thisyrat);
      obstacles.shapes[obstacles.shapes.length-1].wrat = thiswrat;
      obstacles.shapes[obstacles.shapes.length-1].hrat = thishrat;
    // console.log(obstacles.shapes);
    }
  }
}


let spawn = {
  x:10/20, 
  y:10/20
};

let border = [];
let thin;
let long;

let uiEdge = {
  maxX: null,
  maxY: null,
  xrat: 1/4,
  yrat: 0,
};
function reUI(){
  // uiEdge.xrat = wind.w-wind.h;
  uiEdge.maxX = wind.w*uiEdge.xrat;
  uiEdge.maxY = wind.h*uiEdge.yrat;
}


let game = false;

function makeRectbody(shape){
  let x = uiEdge.maxX;
  let y = uiEdge.maxY;
  let bod = Matter.Bodies.rectangle(x + shape.xrat*wind.size, y + shape.yrat*wind.size, shape.wrat*wind.size, shape.hrat*wind.size, {isStatic: true});
  // console.log("bod:", bod);
  return bod;
}

function setup() {
  reWind();
  reUI();

  makeDeck(player,Spades);
  // console.log(player.deck);
  prepareDeck(player);

  // wrote this myself but it was mostly a change values kind of deal
  thin = wind.size/5;
  long = wind.size;
  let x = uiEdge.maxX;
  let y = uiEdge.maxY;
  // north
  // console.log(typeof (0+wind.size/2));
  border.push(Matter.Bodies.rectangle(x+wind.size/2,y-thin/2,long,thin, {isStatic:true}));
  // east
  border.push(Matter.Bodies.rectangle(x+wind.size+thin/2,y+wind.size/2,thin,long,{isStatic:true}));
  // south
  border.push(Matter.Bodies.rectangle(x+wind.size/2,y+wind.size+thin/2,long,thin,{isStatic:true}));
  // west
  border.push(Matter.Bodies.rectangle(x-thin/2,y+wind.size/2,thin,long, {isStatic:true}));


  //I learned about a little thing called restitution and that it makes things bouncy...
  engine = Matter.Engine.create({enableSleeping: false});

  // Disable gravity by setting the gravity vector to {x: 0, y: 0}
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  //chat said that changing the amount of updates per frame could help with my ethereal bullets, not sure what delta does
  Matter.Engine.update(engine, window.requestAnimationFrame, 50);

  Matter.Runner.run(engine);

  player.body = Matter.Bodies.circle(x + spawn.x*wind.size, y + spawn.y*wind.size, player.srat*wind.size);
  // console.log(player.body);
  player.xrat = player.body.position.x/wind.size;
  player.yrat = player.body.position.y/wind.size;
  Matter.World.add(engine.world, [player.body]);


  let shape;
  console.log(obstacles.shapes);
  for (let num in obstacles.shapes){
    shape = obstacles.shapes[num];
    obstacles.shapes[num].body = makeRectbody(shape);
    // console.log(shape.body);
    
  }
  // console.log(obstacles.shapes);
  for (let obj of obstacles.shapes){
    // console.log(obj.body);
    Matter.World.add(engine.world, obj.body);
    objects.push(obj.body);
  }
  
  
  for (let wall of border){
    objects.push(wall);
  }
  Matter.World.add(engine.world, border);

  game = true;

  // display();
}


function draw() {
  // display();
  background(30);


  if (player.reserves.length >=4){
    doReload(player);
  }


  rectMode(CORNER);
  strokeWeight(0);
  fill("orange");
  // console.log(wind.h, wind.w);
  rect(0,0,uiEdge.maxX,wind.h);
  // rect(0,0,wind.w,uiEdge.maxY);
  rect(uiEdge.maxX*3,0,wind.w,wind.h);
  // rect(0,uiEdge.maxY*3,wind.w,wind.h);

  let f = 20;
  let marg = 20;
  // console.log(player.gun);
  for (let place in player.gun){
    // console.log("yes");
    fill(f);
    disCard(player.gun.length-(place+1),marg);
    f += 75;
  }

  moveP(player);
  
  disCircle(player.clr,player.body);
  for(let shape of obstacles.shapes){
    // console.log(shape);
    disRect(shape);
  }


  


  if (reload.done){
    pShoot(player);
  }

  doBull();
  
}



