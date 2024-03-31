var num = 90;
var x = [];
var y = [];

function setup() {
  createCanvas(360, 480);
  noStroke();

  for (var i = 0; i < num; i++) {
    x[i] = 0;
    y[i] = 0;
  }
}

function draw() {
  background(0);
  // Copy array values from back to front
  // for (var i = num-1; i > 0; i--) {
  //   x[i] = x[i-1];
  //   y[i] = y[i-1];
  // }
  // https://sabe.io/blog/javascript-push-pop-shift-unshift-array-methods
  x.pop();
  y.pop();

  // x[0] = mouseX; // Set the first element
  // y[0] = mouseY; // Set the first element
  x.unshift(mouseX);
  y.unshift(mouseY);
  for (var i = 0; i < num; i++) {
    fill(i * 3);
    ellipse(x[i], y[i], 40, 40);
  }
}
