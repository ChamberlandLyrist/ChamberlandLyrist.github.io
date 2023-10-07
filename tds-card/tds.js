

// assume that all sizes are for a screen of 20 units
// ex: size 0.5 should be 0.5/20 units of size
let player = {
  size: 0.5/20,
  clr: "white",
  ammo: [],
  gun: [],
  x: 50,
  y: 50,
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
    set = subset(object.points,pl,2);
    lna = dist(unit.x,unit.y,set[0].x,set[0].y);
    lnb = dist(unit.x,unit.y,set[1].x,set[1].y);
    ab = dist(set[0].x,set[0].y,set[1].x,set[1].y);

    a = Math.sqrt(lna**2-unit.size**2);
    b = Math.sqrt(lnb**2-unit.size**2);

    if(a+b >= ab){
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


function setup() {
  display();
  player.x = wind.size/2;
  player.y = wind.size/2;
  player.size = player.size*wind.size;
}


function draw() {
  // display();
  background(30);
  fill("red");
  moveP();
  // barrier(player,border);
  circle(player.x,player.y,player.size);
  
}
