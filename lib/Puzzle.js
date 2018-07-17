let neighbors = [{y: -1}, {x: 1}, {y: 1}, {x: -1}];
module.exports = class Puzzle
{
	constructor(board, size)
	{
		this.size = size;
		this.board = board;
		var numbers = [];
		if (board.length != size) throw new Error("Invalid size.");
		board.forEach((row, y)=> {
			if (row.length != size) throw new Error("Invalid size.");
			row.forEach((nbr, x) => {
				if (nbr === 0) this.emptyCell = {x, y};
				if (nbr < 0 || isNaN(nbr) || numbers.includes(nbr))
					throw new Error("Invalid board.");
				numbers.push(nbr);
			});
		});
		if (!this.emptyCell) throw new Error("No empty cell.");
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
			this.print()
			this.emptyCell = pos;
		}
	}

	print()
	{
		console.log('\n')
		this.board.forEach(row => {
			var line = row.join('|');
			console.log(line);
			console.log(line.split('').map(x => '-').join(''))
		})
		console.log('\n')
	}
}
