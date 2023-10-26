

// Top Down Shooter Skeleton Code
// oct 20th
// Lyra Chamberlin (sher/her)

// use WASD to move around your guy(red circle), and left click to shoot a ball towards the mouse
// bullets will bounce twice before disapearing on the third collision(always disapears on collision w player)
// the hand of cards on the left of the screen are your ammo, takes time to reload


// Extra for experts:
// used Matter.js, introduced and demoed by ChatGPT, but I learned how to use it and applied it how I needed it



// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of sizelet aspect = {
let aspect = {
  m: 40,
  r: 40/20,
  c: 1/20
};

let player = {
  xrat: 0,
  yrat: 0,
  srat: 0.4*aspect.r,
  clr: "red",
  deck: [],
  reserves: [],
  gun: [],
  speed: 0.1*aspect.r,
  body: null,
};

let aK = 65;
let dK = 68;
let wK = 87;
let sK = 83;

let maxSpeed = 0.05*aspect.r;

function moveP(player){

  let body = player.body;
  let pos = body.position;
  let a = keyIsDown(aK);
  let d = keyIsDown(dK);
  let w = keyIsDown(wK);
  let s = keyIsDown(sK);

  let spd = player.speed/aspect.m*0.0001;
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
    if (speed1 > maxSpeed/aspect.m) {
      Matter.Body.setVelocity(body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), maxSpeed));
    }
  }else if(speed1 > 0.1) {
    Matter.Body.setVelocity(body, Matter.Vector.mult(Matter.Vector.normalise(velocity1), 0));
  }

  player.xrat = pos.x;
  player.yrat = pos.y;

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
  this.range = {full:6*aspect.r, max: 6*aspect.r+2*aspect.r};
  this.dist = (6*aspect.r)*1000;
  this.prev = {x:0, y:0};
  this.spd = 1*aspect.r;
  this.bounces = 2;
  // cool is in millis
  this.cool = 1*1000,
  this.uses = 1;
  this.bullets = 1;
  this.spread = 0;
  this.vector = null;
  this.body = null;
  this.srat = 0.15*aspect.r;
  this.clr =  "green";
  this.rank = n;
}

let cardF = {
  wrat: 4/20,
  hrat: 6/20,
  mrat: 1/20
};

function disCard(spot, card){
  rectMode(CORNER);
  stroke(0);
  strokeWeight(2);
  let w = cardF.wrat *wind.size;
  let h = cardF.hrat *wind.size;
  let margin = cardF.mrat*wind.size;
  // console.log(cardF.mrat, wind.size);
  let y = margin *spot/3;
  y =0 - (y-margin*2);
  let x = uiEdge.maxX/4;

  // console.log(margin, spot);
  // fill(200);
  // console.log(y, wind.size);
  // console.log(y-margin*2);
  
  rect(x, y, w, h);
  textAlign(LEFT,TOP);
  fill(0);
  stroke(255);
  textSize(1/20*wind.size);
  text(card.rank, x+margin/3, y+margin/3);
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
    // console.log("start of make:",millis());
    card.dist += millis();
    // console.log("made:",card);
    let shots = [];
    let shot;
    // card = card[0];
    let vect = aim();
    // console.log(vect);
    // console.log(card);
    let bs = card.srat;
    // console.log(bs);
    let ps = player.srat;
    // console.log(ps);
    let edge = ps + bs*2;
    // console.log(edge);
    let ppos = {x: player.xrat, y: player.yrat};
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
      // console.log(shot);
      card.xrat = shot.position.x ;
      card.yrat = shot.position.y ;
      bullets.bulls.push(card);
      // console.log("player",player.body.position.x,player.body.position.y);
      // console.log(shot.position.x-bs*2,shot.position.y-bs*2);

      // fro = player.body.position;
      // console.log(prev.x-fro.x,prev.y-fro.y);

      // const cheese = (card.vector.x + card.vector.y)/2;
      Matter.World.add(engine.world, [shot]);
      vect.x/

      Matter.Body.applyForce(shot, shot.position, {x: vect.x/(aspect.r*1000), y: vect.y/(aspect.r*1000)});
      console.log("card.spd:", card.spd);
      Matter.Body.setVelocity(shot, Matter.Vector.mult(Matter.Vector.normalise(shot.velocity), card.spd*100));
      
      
      // console.log(shot);
      // console.log(shot.velocity);
    }
    // console.log("end of make:",millis());

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
  let start = {x: player.xrat, y: player.yrat};
  let end = {x: mouseX/wind.size, y: mouseY/wind.size};
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
  // console.log(bullets);
  if (bullets.bulls.length > 0){
    for (let shot of bullets.bulls){
      // console.log(posB);
      disCircle(shot);
    }
  }
}
let toremove = {blanks:[],bodies:[]};
let tim = 0; 
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
    // console.log("tim:",millis()-tim);
    // const cheese = (b[shot].vector.x + b[shot].vector.y)/2;
    Matter.Body.setVelocity(b[shot].body, Matter.Vector.mult(Matter.Vector.normalise(vel), b[shot].spd));
    console.log("bullet moved:",b[shot]);
    // tim = millis()
    // last = b[shot].prev;
    // now = b[shot].body.position;
    // travel = dist(last.x, last.y, now.x, now.y);
    // console.log(travel, millis()-b[shot].toc);

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
      // console.log(objects);
      for (let obj of objects){
        // console.log(shot,obj);
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
  // console.log(w,h);
  wind.w = w;
  wind.h = h;
  wind.size = h;
  createCanvas(wind.w, wind.h);
}

function display(){
  reWind();

  reUI();

  // make the border walls have same info/formatting as rest of bodies

  // resize(player);
  // // console.log(player);
  // for (let wall of border){
  //   resize({body: wall});
  // }
  // for (let shape of obstacles.shapes){
  //   resize(shape);
  // }
  // for (let bull of bullets.bulls){
  //   resize(bull);
  // }
  // // console.log(bullets.size);
  // // console.log(wind.size, w, h);
  
}

// // use .label (in .body)
// function resize(thing){
//   // console.log(thing);
//   let body = thing.body;
//   // body.position = {x: uiEdge.maxX+thing.xrat*wind.size, y: thing.yrat*wind.size};
//   let type = body.label;
//   if ( type === "Circle Body"){
//     // console.log("circle");
//     // body.circleRadius = thing.srat * wind.size;
//   }
//   else if(type === "Rectangle Body"){
//     let width = thing.wrat*wind.size;
//     let height = thing.hrat*wind.size;
//     // Matter.Body.scale(body, width/body.bounds.max.x, height/body.bounds.max.y);
//     // Matter.Body.setVertices(body, Matter.Vertices.fromPath("0 0 ${width} 0 ${width} ${hieght} 0 ${height}"));
    
//   }
// }

function disCircle(info){
  // console.log(body);
  let x = uiEdge.maxX;
  let y = uiEdge.maxY;
  ellipseMode(RADIUS);
  strokeWeight(0);
  fill(info.clr);
  let thing = wind.size/aspect.m;
  circle(x + info.xrat*thing, y + info.yrat*thing, info.srat*thing);
}
function disRect(info){
  let x = uiEdge.maxX;
  let y = uiEdge.maxY;
  rectMode(CENTER);
  strokeWeight(1);
  fill(info.clr);
  let thing = wind.size/aspect.m;
  // console.log("shit",info, info.xrat*thing);
  rect(x + info.xrat*thing, y + info.yrat*thing, info.wrat*thing, info.hrat*thing);
}

let engine;

let objects = [];

let obstacles = {
  shapes: [],
  base: {clr: "blue", xrat: 0, yrat: 0, body: 0, wrat: 0, hrat: 0}
};

// {clr: "blue", xrat: 2/20, yrat: 2/20, body: 0, wrat: 1/20, hrat: 1/20}
let state = [0, 1];
let thisxrat ;
let thisyrat ;
let thiswrat = 1*aspect.r;
let thishrat = 1*aspect.r;
let posrat = [{x:2*aspect.r, y:4*aspect.r}, {x:4*aspect.r,y:2*aspect.r}, {x:6*aspect.r, y:6*aspect.r}];
for (let rat of posrat){
  thisyrat = rat.y;
  thisxrat = rat.x;
  for (let xflip of state){
    for (let yflip of state){
      // console.log("flips:",xflip,yflip);
      // console.log(thisxrat,thisyrat);
      obstacles.shapes.push(structuredClone(obstacles.base));
      obstacles.shapes[obstacles.shapes.length-1].xrat = Math.abs(xflip - thisxrat);
      obstacles.shapes[obstacles.shapes.length-1].yrat = Math.abs(yflip - thisyrat);
      obstacles.shapes[obstacles.shapes.length-1].wrat = thiswrat;
      obstacles.shapes[obstacles.shapes.length-1].hrat = thishrat;
      // console.log(obstacles.shapes[obstacles.shapes.length-1]);
    }
  }
}


let spawn = {
  x:10*aspect.r, 
  y:10*aspect.r
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
  // let x = uiEdge.maxX;
  // let y = uiEdge.maxY;
  // console.log(x,y);
  let bod = Matter.Bodies.rectangle(shape.xrat, shape.yrat, shape.wrat, shape.hrat, {isStatic: true});
  // console.log("bod:", bod);
  return bod;
}



function setup() {
  reWind();
  reUI();

  makeDeck(player,Spades);
  // console.log(player.deck);
  prepareDeck(player);

  // idk why these nummbers but it works
  let thin = 2 *aspect.r;
  let long = 20 *aspect.r;
  // let y = uiEdge.maxY;
  // console.log(typeof (0+wind.size/2));

  // north
  border.push(Matter.Bodies.rectangle(long/2,-thin/2,long,thin, {isStatic:true}));
  // east
  border.push(Matter.Bodies.rectangle(long+thin/2,long/2,thin,long,{isStatic:true}));
  // south
  border.push(Matter.Bodies.rectangle(long/2,long+thin/2,long,thin,{isStatic:true}));
  // west
  border.push(Matter.Bodies.rectangle(-thin/2,long/2,thin,long, {isStatic:true}));

  console.log(border);
  for (let wall in border){
    console.log("wall pos:",border[wall].pos);
  }


  //I learned about a little thing called restitution and that it makes things bouncy...
  engine = Matter.Engine.create({enableSleeping: false});

  // Disable gravity by setting the gravity vector to {x: 0, y: 0}
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  //chat said that changing the amount of updates per frame could help with my ethereal bullets, not sure what delta does
  Matter.Engine.update(engine, window.requestAnimationFrame, 50);

  Matter.Runner.run(engine);

  player.body = Matter.Bodies.circle(spawn.x, spawn.y, player.srat);
  console.log(player.body);
  player.xrat = player.body.position.x/aspect.m;
  player.yrat = player.body.position.y/aspect.m;
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

  let f = 40;
  // console.log(player.gun);
  for (let place in player.gun){
    // console.log("yes");
    fill(f);
    disCard(player.gun.length-(place+1),player.gun[place]);
    f += 35;
  }

  moveP(player);
  disCircle(player);
  for(let shape of obstacles.shapes){
    // console.log(shape);
    disRect(shape);
  }


  


  if (reload.done){
    pShoot(player);
  }

  doBull();

  for (let wall in border){
    if (Matter.Collision.collides(player.body, border[wall])){
      console.log("hit a border");
    }
  }
  
}



