# Stands Solver

Here is a first go at a solver for the NYT game [Strands](https://www.nytimes.com/games/strands)
Rather than running on the web, this uses [node.js](https://nodejs.org/en) to load the dictionary. 

It's just a start, because it finds too many words! From a given start point (0-indexed) rows and columns, the `explore` function finds many words. For the sample puzzle, starting from the bottom row, column 4, indeed finds the spangram "illumination" ... and 32 other words!

So where to go from here? We could teach it a few more rules. For example, it appears that spangrams always start and end on the edge, but the instructions say it only needs touch opposite sides of the board.

A more promising rule is that "no theme words overlap" which sounds like no "X" crossing? Though it may just mean no re-using letters. The 'no "X" crossing' rule is a little tricky to code, but certainly possible. It would still find many words, and may not be correct.

And here's a start of a UI: [strands.html](strands.html)
Further work could continue this to be a puzzle solver, rather than a single word finder. For each word found, we could then recursively start a new exploration with those positions already visited. This might be computationally expensive. How can we optimize this? Maybe by finding candidate spangrams first, and then filling in the rest of the board.

This is a task for another day. 🙂
