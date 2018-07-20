let neighbors = [{y: -1}, {x: 1}, {y: 1}, {x: -1}];
function inversions(line, size)
{
	return (line.reduce((inv, n, i) => inv + line.slice(i).filter(x => n > x).length, 0));
}
module.exports = class Puzzle
{
	constructor(board, size)
	{
		this.size = size;
		this.board = board;
		var numbers = [];
		if (board.length != size) throw new Error("Invalid size.");
		board.forEach((row, y) => {
			if (row.length != size) throw new Error("Invalid size.");
			row.forEach((nbr, x) => {
				if (nbr === Infinity) this.emptyCell = {x, y};
				if (nbr < 1 || isNaN(nbr) || numbers.includes(nbr))
					throw new Error("Invalid board.");
				numbers.push(nbr);
			});
		});
		if (!this.emptyCell) throw new Error("No empty cell.");
		if (!this.isSolvable())  throw new Error("This puzzle is unsolvable.");
	}

	/**
	 * Swap the empty cell with one of its neighbor(represented as a number from 0 to 3):
	 *   0
	 * 3   1
	 *   2
	 */
	move(neighbor)
	{
		var pos = {
			x: this.emptyCell.x + (neighbors[neighbor].x || 0),
			y: this.emptyCell.y + (neighbors[neighbor].y || 0)
		};
		if (pos.x < 0 || pos.x === this.size || pos.y < 0 || pos.y === this.size)
			console.error("Invalid move.");
		else {
			this.board[this.emptyCell.y][this.emptyCell.x] = this.board[pos.y][pos.x];
			this.board[pos.y][pos.x] = 0;
			this.emptyCell = pos;
		}
	}

	print()
	{
		console.log('\n');
		this.board.forEach(row => {
			var line = row.join('|');
			console.log(line);
			console.log(line.split('').map(x => '-').join(''))
		});
		console.log('\n');
	}

	toLine(board = this.board)
	{
		if (!board.length || !board[0].length)
			return [];
		return (
		//top
		board[0]
		//right
		.concat(board.slice(1).map(x => x[board.length - 1]))
		//bottom
		.concat(board[board.length - 1].reverse().slice(1))
		//left
 		.concat(board.slice(1, -1).map(x => x[0]).reverse())
		//inner square
		.concat(this.toLine(board.slice(1, -1).map(x => x.slice(1, -1)))));
	}

	isSolvable()
	{
		var start = this.toLine();
		var goal = start.slice().sort((a, b) => a - b);
		var startInversions = inversions(start, this.size);
	    var goalInversions = inversions(goal, this.size);
	    if (!(this.size % 2)) {
			startInversions += start.indexOf(Infinity) / this.size;
			goalInversions += goal.indexOf(Infinity) / this.size;
	    }
	    return (startInversions % 2 == goalInversions % 2);
	}

	solve()
	{

	}
}
