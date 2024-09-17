/* PLU February 2023 Programming Contest, problem 2
 * https://www.plu.edu/computer-science/hs-programming-contest/
 * https://www.cs.plu.edu/~blahakd/HSProgrammingContest/Contest2023/Problems%20Novice%20-%202023.pdf
 */
const WIDTH = 7;
const HEIGHT = 4;
const PIECES = 4;

let output = '';

function edge(border = '|', fill = ' ') {
  let row = border;
  for (let i = 0; i < WIDTH - 2; i++) row += fill;
  row += border;
  row += '\n';
  return row;
}

const end = edge('.', '-');
const middle = edge();
const joint = edge('|', '-');

for (let i = 0; i < PIECES; i++) {
  for (let j = 0; j < HEIGHT - 1; j++) {
    let row = middle;
    if (i === 0 && j === 0) row = end;
    else if (j === 0) row = joint;
    output += row;
  }
}
output += end;

console.log(output);
