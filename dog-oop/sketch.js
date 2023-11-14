// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


class Dog {
  constructor(name, colour, breed, age, size) {
    this.name = name;
    this.colour = colour;
    this.breed = breed;
    this.age = age;
    this.size = size;
  }

  bark(){
    console.log(this.name + " moaned for you.");
  }
}


let femboy = new Dog("Ash", "white", "very breedable", 17, "snack");
let bitch = new Dog("Wess","asian", "breedable", 19, "meal");


class Guy {
  constructor(size, shape, colour, speed){
    // this.drawing = shape;
    this.shade = colour;
    this.thicc = size;
    this.speed = speed;
    this.x = width/2;
    this.y = height/2;
  }

  display(){
    // if (drawing === 1)
    fill(this.shade);
    // strokeWeight(0);
    circle(this.x,this.y,this.thicc);
  }

  move(){
    let move = random(4);
    for (let i = 0; i <4; i ++){
      if (move < 1){
        this.x -=this.speed/4;
      }
      else if (move < 2){
        this.y -= this.speed/4;
      }
      else if (move < 3){
        this.x += this.speed/4;
      }
      else if (move < 4){
        this.y += this.speed/4;
      }
      this.display();
    }
  }
}

let cheese;


function setup() {
  createCanvas(windowWidth, windowHeight);
  femboy.bark();
  bitch.bark();
  cheese = new Guy(20, "circle", "red", 10);
}

function draw() {
  // background(220);
  cheese.move();
  cheese.display();
}
