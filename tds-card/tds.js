

// assume that all sizes are for a screen of 100 units
// ex: size 0.5 should be 0.5 units of size
let player = {
  size: 0.5/100,
  clr: "white",
  ammo: [],
  gun: [],
  x: 0,
  y: 0,
  speed: 0.5/100
};

function moveP(){
  let velx = 0;
  let vely = 0;
  let a = keyIsDown(65);
  if (a){
    velx -= player.speed;
  }
  let d = keyIsDown(68);
  if (d){
    velx += player.speed;
  }
  let w = keyIsDown(87);
  if (w){
    vely -=player.speed;
  }
  let s = keyIsDown(83);
  if (s){
    vely +=player.speed;
  }
  let spd = player.speed/(velx+vely);
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


let border = {
  lx: 0,
  ly: 0,
  hx: 0,
  hy: 0
};



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
  wind.h;
  if (w<=h){
    wind.size = w;
  }else{
    wind.size = h;
  }
  createCanvas(wind.w, wind.h);
}


function setup() {
  display();
  player.x = wind.size/2;
  player.y = wind.size/2;

}

function draw() {
  display();
  background(220);
  fill("red");
  circle(player.x,player.y,player.size*100);
  moveP();
}

