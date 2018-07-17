var parsePuzzle = require("./lib/parsePuzzle");
if (typeof process.argv[2] != "undefined")
{
	var puzzle = parsePuzzle(process.argv[2]);
}
