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
    if (word.length > 3 && found) console.log(word);
  }
  // continue exploring
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      explore(row + i, col + j, word, visited);
    }
  }
}

const data = fs.readFileSync("strands.json", "utf8");
const strands = JSON.parse(data).strands;
let puzzle = strands[3].puzzle.map((row) => row.split(""));

//explore(0, 0);
//explore(0, puzzle[0].length - 1);
explore(puzzle.length - 1, 3);
