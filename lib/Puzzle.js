var isSolvable = require('./isSolvable');
var heuristics = {
	manhattan: require("./manhattan")
};
let neighbors = [{y: -1}, {x: 1}, {y: 1}, {x: -1}];
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
		this.line = this.toLine();
		this.lineStr = this.line.toString();
		//if (!isSolvable(this)) throw new Error("This puzzle is unsolvable.");
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
		{
			console.error("Invalid move.");
		}
		else {
			this.board[this.emptyCell.y][this.emptyCell.x] = this.board[pos.y][pos.x];
			this.board[pos.y][pos.x] = Infinity;
			this.emptyCell = pos;
			//probably too slow
			this.line = this.toLine();
			this.lineStr = this.line.toString();
		}
	}

	print()
	{
		console.log('\n');
		this.board.forEach(row => {
			var line = row.join('	').replace('Infinity', 0);
			console.log(line);
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
		.concat(board[board.length - 1].slice(0, -1).reverse())
		//left
 		.concat(board.slice(1, -1).map(x => x[0]).reverse())
		//inner square
		.concat(this.toLine(board.slice(1, -1).map(x => x.slice(1, -1)))));
	}

	clone()
	{
		var tmp = Object.create(this);
		tmp.board = this.board.map(x => x.slice());
		tmp.emptyCell = Object.assign({}, this.emptyCell);
		tmp.size = this.size;
		tmp.line = this.line.slice();
		return (tmp);
	}

	solve(goal = this.line.slice().sort((a, b) => a - b))
	{
		var manhattanLookupTable = {};
		this.board.map((e, y) => e.map((e, x) => {
			manhattanLookupTable[goal[this.line.indexOf(e)]] = {x, y};
		}));
		var closed = {}, open = {}, cameFrom = {}, fScore = {}, gScore = {};
		open[this.line] = this.clone();
		gScore[this.line] = 0;
		fScore[this.line] = heuristics.manhattan(this, manhattanLookupTable);
		var timeComplexity = 0;
		var sizeComplexity = 0;

		while (Object.keys(open).length)
		{
			if (Object.keys(open).length + Object.keys(cameFrom).length > sizeComplexity)
				sizeComplexity = Object.keys(open).length  + Object.keys(cameFrom).length;
			var current = getCurrent(fScore, open);
			if (current.lineStr == goal.toString())
			{
				console.log("SOLVED");
				console.log("Time Complexity:", timeComplexity);
				console.log("Size Complexity:", sizeComplexity);
				current.print();
				//return getPath(cameFrom, current)
				return;
			}
			delete open[current.lineStr];
			closed[current.lineStr] = 1;
			for (var dir = 0; dir < 4; dir++)
			{
				var pos = {
					x: current.emptyCell.x + (neighbors[dir].x || 0),
					y: current.emptyCell.y + (neighbors[dir].y || 0)
				};
				if (pos.x > -1 && pos.x < this.size && pos.y > -1 && pos.y < this.size)
				{
					var neighbor = current.clone();
					neighbor.move(dir);
					if (closed[neighbor.lineStr])
						continue;
					var score = gScore[current.lineStr] + 1;
					if (!open[neighbor.lineStr])
					{
						open[neighbor.lineStr] = neighbor.clone();
						timeComplexity++;
					}
					else if (score >= gScore[neighbor.lineStr])
						continue;
					cameFrom[neighbor.lineStr] = current.clone();
					gScore[neighbor.lineStr] = score;
					fScore[neighbor.lineStr] = score + heuristics.manhattan(neighbor, manhattanLookupTable);
				}
			}
		}
	}
}

function getCurrent(fScore, open)
{
	var min = Infinity;
	var current;
	for (var i in open)
	{
		if (fScore[open[i].lineStr] < min)
		{
			current = open[i];
			min = fScore[open[i].lineStr];
		}
	}
	return (current);
}
