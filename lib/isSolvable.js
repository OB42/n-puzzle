function inversions(line, size)
{
	return (line.reduce((inv, n, i) => inv + line.slice(i).filter(x => n > x).length, 0));
}
//buggy...
module.exports = function isSolvable(puzzle, goal = puzzle.line.slice().sort((a, b) => a - b))
{
	var start = puzzle.line;
	var startInversions = inversions(start, puzzle.size);
	var goalInversions = inversions(goal, puzzle.size);
	if (!(puzzle.size % 2)) {
		startInversions += start.indexOf(Infinity) / puzzle.size;
		goalInversions += goal.indexOf(Infinity) / puzzle.size;
	}
	return (startInversions % 2 == goalInversions % 2);
}
