//TODO: JSDOC
module.exports = function manhattanDistance(start, lookupTable)
{
	return (start.board.reduce(
		(cost, row, y) => cost + row.reduce(
			(rowCost, cell, x) => rowCost + Math.abs(x - lookupTable[cell].x) + Math.abs(y - lookupTable[cell].y),
	0), 0));
}
