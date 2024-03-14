var angle = 0.0;
var offset = 60;
var scalar = 40;
var speed = 0.05;

// fishies from https://www.flaticon.com/free-icons/fish
let fish;
let puffer;
let angel;

function preload() {
  fish = loadImage("assets/clown-fish.png");
  puffer = loadImage("assets/puffer-fish.png");
  angel = loadImage("assets/fish.png");
}

function setup() {
  createCanvas(240, 120);
}

function draw() {
  background(250);
  const y1 = offset + sin(angle) * scalar;
  const y2 = offset + sin(angle + 0.4) * scalar;
  const y3 = offset + sin(angle + 0.8) * scalar;
  // ellipse(80, y1, 40, 40);
  // ellipse(120, y2, 40, 40);
  //ellipse( 160, y3, 40, 40);
  image(angel, 80 - 20, y1 - 20, 40, 40);
  image(puffer, 120 - 20, y2 - 20, 40, 40);
  image(fish, 160 - 20, y3 - 20, 40, 40);
  angle += speed;
  //print(angle);
}
