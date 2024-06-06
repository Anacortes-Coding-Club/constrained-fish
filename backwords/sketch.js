let centerX = 200;
let centerY = 200;
let windowScale = 1;

let inputPtA = "";
let inputPtB = "";
let inputSide = 0;

const Instructions =
  "BACKWORDS - DIRECTIONS:  The object of a BACKWORDS puzzle is to identify two mystery words that go together to form a single compound word/expression (such as dog pound, sundown, or high-rise). \n\nTo determine the first word, use the three words in column one as clues.  Each of the three words go with the mystery word to form a compound word (Note:  The mystery word may go before or after the clue word, such as homework or rest home).  To determine the second mystery word, use the clue words in column two.  If you have the correct answer, the word from Column 1 will go with the word from Column 2 to form a compound word/expression.";

const backword = {
  Clue: "",
  AnswerA: "",
  AnswerB: "",

  A1: "",
  A2: "",
  A3: "",

  B1: "",
  B2: "",
  B3: "",
};

let table;
function preload() {
  table = loadTable("backwords.csv", "csv", "header");
}

function loadTodaysBackword() {
  //table.getRowCount()
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var row = (day + 2) % table.getRowCount();

  backword.Clue = table.getString(row, 0);
  backword.AnswerA = table.getString(row, 1).toLowerCase();
  backword.AnswerB = table.getString(row, 2).toLowerCase();

  backword.A1 = table.getString(row, 3);
  backword.A2 = table.getString(row, 4);
  backword.A3 = table.getString(row, 5);

  backword.B1 = table.getString(row, 6);
  backword.B2 = table.getString(row, 7);
  backword.B3 = table.getString(row, 8);
}

function setup() {
  createCanvas(400, 400);
  windowResized();

  //let h5 = createElement('h5', '<input type="text" value="Submit" style="line-height: 0.1in; width: 1in;">');
  //h5.position(30, 15);

  textFont("Courier New");
  textWrap(WORD);

  //let h5 = createElement('h5', 'p5*js');
  //h5.position(centerX, centerY);
  loadTodaysBackword();
}
let delTimer = 0;

let inMenu = true;
let state = [0, 0];

let start;
let delta;
let isEnd = false;

function draw() {
  background(220);

  if (state[0] == 1 && state[1] == 1) {
    isEnd = true;

    //do any end things here
  }

  if (inMenu) {
    if (keyIsPressed || mouseIsPressed) {
      inMenu = false;
      start = Date.now();
    }

    //textBoxW(Instructions,0,0,210,210,8,10,200);
    scaledRect(0, 0, 210, 210, 10);
    fill(0);
    textSize(8 * windowScale);
    textAlign(CENTER, CENTER);
    text(
      Instructions.substring(0, 115),
      centerX - 100 * windowScale,
      centerY - 75 * windowScale,
      200 * windowScale
    );
    text(
      Instructions.substring(115, 229),
      centerX - 100 * windowScale,
      centerY - 40 * windowScale,
      200 * windowScale
    );
    text(
      Instructions.substring(229, 343),
      centerX - 100 * windowScale,
      centerY - 5 * windowScale,
      200 * windowScale
    );
    text(
      Instructions.substring(343, 463),
      centerX - 100 * windowScale,
      centerY + 25 * windowScale,
      200 * windowScale
    );
    text(
      Instructions.substring(463, 572),
      centerX - 100 * windowScale,
      centerY + 55 * windowScale,
      200 * windowScale
    );
    text(
      Instructions.substring(572, Instructions.length),
      centerX - 100 * windowScale,
      centerY + 80 * windowScale,
      200 * windowScale
    );
    fill(255);
  }

  textBox("BACKWORDS", 0, -180, 400, 40, 24, 0); //Title

  if (!inMenu) {
    backspaceControl();

    fill(255);

    textBox(backword.Clue, 0, -105, 210, 30, 12, 5); //Hint

    textBox(backword.A1, -55, -35, 100, 30, 12, 5); //row 1
    textBox(backword.A2, -55, 0, 100, 30, 12, 5);
    textBox(backword.A3, -55, 35, 100, 30, 12, 5);

    textBox(backword.B1, 55, -35, 100, 30, 12, 5); //row 2
    textBox(backword.B2, 55, 0, 100, 30, 12, 5);
    textBox(backword.B3, 55, 35, 100, 30, 12, 5);

    if (!isEnd) {
      delta = Date.now() - start;
    }
    var d = floor(delta / 100) / 10;
    if ((floor(delta / 100) / 10) % 1 == 0) {
      d += ".0";
    }
    textBox(d, 0, 180, 200, 40, 24, 0); //timer

    if (inputSide == 0) fill(200);
    if (state[0] == 1) fill(50, 220, 50);
    textBox(inputPtA, -55, -70, 100, 30, 12, 5); //a
    fill(255);

    if (inputSide == 1) fill(200);
    if (state[1] == 1) fill(50, 220, 50);
    textBox(inputPtB, 55, -70, 100, 30, 12, 5); //b
  }
}

function scaledRect(x1, y1, x2, y2, s) {
  let a = x2 / 2;
  let b = y2 / 2;
  rect(
    centerX + (x1 - a) * windowScale,
    centerY + (y1 - b) * windowScale,
    x2 * windowScale,
    y2 * windowScale,
    windowScale * s
  );
}

function textBox(label, x1, y1, x2, y2, s1, s2) {
  scaledRect(x1, y1, x2, y2, s2);
  fill(0);
  textSize(s1 * windowScale);
  textAlign(CENTER, CENTER);
  text(label, centerX + x1 * windowScale, centerY + y1 * windowScale);
  fill(255);
}

function textBoxW(label, x1, y1, x2, y2, s1, s2, w) {
  scaledRect(x1, y1, x2, y2, s2);
  fill(0);
  textSize(s1 * windowScale);
  textAlign(CENTER, CENTER);
  text(
    label,
    centerX + (x1 - w / 2) * windowScale,
    centerY + y1 * windowScale,
    w * windowScale
  );
  fill(255);
}

function backspaceControl() {
  if (keyIsDown(BACKSPACE)) delTimer++;
  else delTimer = 0;

  if (delTimer == 15) {
    if (inputSide == 0 && state[0] != 1) inputPtA = "";
    else if (state[1] != 1) inputPtB = "";
  }
}

function keyTyped() {
  if (key != " " && keyCode != ENTER) {
    if (state[0] + state[1] == 2) {
      return;
    }
    if (inputSide == 0 && inputPtA.length < 9) inputPtA += key.toLowerCase();
    else if (inputSide == 1 && inputPtB.length < 9)
      inputPtB += key.toLowerCase();
  }

  if (inputPtA == backword.AnswerA) state[0] = 1;
  if (inputPtB == backword.AnswerB) state[1] = 1;

  if (state[1] == 1) {
    inputSide = 0;
  }
  if (state[0] == 1) {
    inputSide = 1;
  }

  //if(inputPtA.length > 20)
  //  inputPtA = inputPtA.substring(0,20);
  //if(inputPtB.length > 20)
  //  inputPtB = inputPtB.substring(0,20);
}

function keyPressed() {
  if (keyCode == BACKSPACE) {
    if (inputSide == 0 && state[0] != 1)
      inputPtA = inputPtA.substring(0, inputPtA.length - 1);
    else if (state[1] != 1)
      inputPtB = inputPtB.substring(0, inputPtB.length - 1);
  }

  if (keyCode == LEFT_ARROW) {
    inputSide = 0;
  }
  if (keyCode == RIGHT_ARROW) {
    inputSide = 1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  if (windowWidth < windowHeight) windowScale = windowWidth / 400;
  else windowScale = windowHeight / 400;
}
