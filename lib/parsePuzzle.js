var fs = require("fs");
var Puzzle = require("./Puzzle");
module.exports = function parsePuzzle(path) {
	try {
		var puzzle = fs.readFileSync(path).toString()
		//removing comments
		.replace(/#.+($|\n)/g, '$1')
		.split("\n")
		.map(line => line.split(/\s+/g).filter(x => x.length).map(cell => parseInt(cell) || Infinity))
		.filter(row => row.length);
		var size = puzzle.splice(0, 1)[0][0];
		return (new Puzzle(puzzle, size));
	}
	catch (err) {
		console.error("Err:", err);
		return (0);
	}
}
