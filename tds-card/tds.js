

// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5 units of size
let player = {
  size: 0.5/20,
  clr: "white",
  ammo: [],
  gun: [],
  x: 0,
  y: 0,
  speed: 0.5/20
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


let border = {
  gl: true,
  lx: 0,
  ly: 0,
  hx: 0,
  hy: 0
};

function barrier(unit, object){
  if(object.gl){
    if(unit.x+unit.size*wind.size>=object.lx){
      unit.x = object.lx-unit.size*wind.size;
    }
    if(unit.x-unit.size*wind.size<=object.hx){
      unit.x = object.lx+unit.size*wind.size;
    }
    if(unit.y+unit.size*wind.size>=object.ly){
      unit.y = object.ly+unit.size*wind.size;
    }
    if(unit.y-unit.size*wind.size<=object.hy){
      unit.y = object.ly+unit.size*wind.size;
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
  border.lx,border.ly= small;
  
  // console.log(wind.size, w, h);
  createCanvas(wind.w, wind.h);
}


function setup() {
  display();
  player.x = wind.size/2;
  player.y = wind.size/2;

}


function draw() {
  // display();
  background(30);
  fill("red");
  moveP();
  barrier(player,border);
  circle(player.x,player.y,player.size*wind.size);
  
}

