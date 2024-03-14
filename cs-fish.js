let img;
let fish_x = 500;
let scary;
let scary_x = 10;
let dog;
let puffl;
let puffr;
let puff_x = 450;
let puff_dir = -1;

let momDir = 0;

function preload() {
  img = loadImage("assets/Ocean_Sunfish.png");
  dog = loadImage("assets/Cute_dog.jpg");
  scary = loadImage("assets/fishy.png");
  // https://www.flaticon.com/free-icons/fish
  // https://pinetools.com/flip-image
  puffl = loadImage("assets/puffer-left.png");
  puffr = loadImage("assets/puffer-right.png");
}

function setup() {
  createCanvas(500, 400);
}

let baby_start_x = 118;
let baby_start_y = 90;
let baby_end_x = 450;
let baby_end_y = 300;
let baby_x = baby_start_x;
let baby_y = baby_start_y;
let baby_pos = 0.0; // until 1.0
let baby_move = 0.005;

function draw() {
  background(220);
  circle(200, 200, 25);
  ellipse(250, 60, 70, 80);
  for (let x = 75; x <= 275; x += 100) {
    square(150, x, 30);
  }
  let fish_width = 410;
  let fish_height = 511;

  image(dog, 0, 0, 200, 200);

  image(
    img,
    fish_x,
    200 - fish_height / 10 / 2,
    fish_width / 5,
    fish_height / 5
  );
  fish_x -= 3;
  if (fish_x < -fish_width / 5) {
    fish_x = 500;
  }

  let scary_w = 994;
  let scary_y = 360;
  let scary_scale = 7;
  image(scary, scary_x, 130, scary_w / scary_scale, scary_y / scary_scale);
  scary_x += 3;

  // wrap around
  if (scary_x > 500) {
    scary_x = -scary_w / scary_scale;
  }

  // bounce me off the wall
  let puff = puffl;
  image(puff, baby_end_x, baby_end_y, 50, 50);

  // find momma
  // if (baby_pos < 1) baby_pos += baby_move;
  // baby_x = baby_start_x + (baby_end_x - baby_start_x)*baby_pos;
  // baby_y = baby_start_y + (baby_end_y - baby_start_y)*baby_pos;
  baby_x += (baby_end_x - baby_x) / 100;
  baby_y += (baby_end_y - baby_y) / 100;

  image(puffr, baby_x, baby_y, 30, 30);
  let num = 8;
  let randomRotate = 0.008781;
  //baby_end_x += random(-num,num);
  //baby_end_y += random(-num,num);
  baby_end_x += cos((momDir / PI) * 180) * 5;
  baby_end_y += sin((momDir / PI) * 180) * 5;
  momDir += random(-randomRotate, randomRotate);
  bounceMamaFish();
}

function bounceMamaFish() {
  if (baby_end_x < 0) {
    baby_end_x = 0;
    momDir += 180;
  }
  if (baby_end_y < 0) {
    baby_end_y = 0;
    momDir += 180;
  }
  if (baby_end_x > 450) {
    baby_end_x = 450;
    momDir += 180;
  }
  if (baby_end_y > 350) {
    baby_end_y = 350;
    momDir += 180;
  }
}
