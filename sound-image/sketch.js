// Images and sounds demo
// 

let cat;
let meow;
function preload(){
  cat = loadImage("catto.png");
  meow = loadSound("Meow.ogg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  imageMode(CENTER);
  image(cat, mouseX,mouseY, 50,50);


}

function mousePressed(){
  meow.play();
}
