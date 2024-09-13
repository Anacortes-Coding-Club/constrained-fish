const fs = require("fs");

let wordList = fs
  .readFileSync("words_alpha.txt", "utf8")
  .split("\n")
  .map((word) => word.trim())
  .sort();

// wordList = fs
//   // https://www.spreadthewordlist.com/wordlist
//   .readFileSync("spreadthewordlist.txt", "utf8")
//   .split("\n")
//   .map((line) => line.trim().split(";"))
//   .filter(([a, b]) => Number(b) == 50)
//   .map((a) => a[0])
//   .sort();

// binary search wordList for a word
function searchWord(word) {
  let low = 0;
  let high = wordList.length - 1;
  let mid;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    if (wordList[mid] === word) {
      return [true, mid];
    }
    if (word < wordList[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return [false, low]; // return the location where it would be
}

function explore(row, col, word = "", visited = []) {
  let valid = [];
  // exclude out of bounds
  if (row < 0 || row >= puzzle.length || col < 0 || col >= puzzle[0].length) {
    return;
  }
  const current = row * 10 + col;
  // exclude visited
  if (visited.includes(current)) {
    return;
  }

  word += puzzle[row][col];
  visited = [...visited, current];
  if (word.length > 1) {
    // binary search
    let [found, index] = searchWord(word);
    // no potential words
    if (!wordList[index].startsWith(word)) {
      return;
    }
    // print valid words
    if (word.length > 3 && found) {
      //console.log(word);
      valid.push({ word: word, visited: visited });
    }
  }
  // continue exploring
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      let found_words = explore(row + i, col + j, word, visited);
      if (found_words) found_words.forEach((word) => valid.push(word));
    }
  }
  return valid;
}

const data = fs.readFileSync("strands.json", "utf8");
const strands = JSON.parse(data).strands;
let puzzle = strands[0].puzzle.map((row) => row.split(""));

//explore(0, 0);
//explore(0, puzzle[0].length - 1);

function spangrams(found, check) {
  // look for spangrams
  let span = found.filter(({ word, visited }) => {
    return visited.some(check);
  });
  if (span.length > 0) {
    //console.log("found", span.length, "up at index");
    console.dir(span);
  }
  return span;
}

for (let i = 0; i < puzzle[0].length; i++) {
  let found = explore(puzzle.length - 1, i);
  spangrams(found, (n) => n < 10);
  found = explore(0, i);
  spangrams(found, (n) => n >= 70);
}

for (let j = 0; j < puzzle.length; j++) {
  let found = explore(j, 0);
  spangrams(found, (n) => n % 10 == 7);
  found = explore(j, puzzle[0].length - 1);
  spangrams(found, (n) => n % 10 == 0);
}
