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
