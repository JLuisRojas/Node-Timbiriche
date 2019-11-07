function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

class Cell {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;

		// No player owns this cell
		this.player = null;
		this.hasPlayer = false;

		// Initialize the lines values
		this.t = false;
		this.b = false;
		this.r = false;
		this.l = false;
	}

	drawCircle(ctx, x, y) {
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2*Math.PI, false);
		ctx.fillStyle = "#000";
		ctx.fill();
	}

	draw(ctx) {
		this.drawCircle(ctx, this.x - this.size/2, this.y - this.size/2);
		this.drawCircle(ctx, this.x + this.size/2, this.y - this.size/2);
		this.drawCircle(ctx, this.x - this.size/2, this.y + this.size/2);
		this.drawCircle(ctx, this.x + this.size/2, this.y + this.size/2);

		if(this.t == true) {
			this.drawSide("t", ctx, 10, "#000");
		}
		if(this.r == true) {
			this.drawSide("r", ctx, 10, "#000");
		}
		if(this.b == true) {
			this.drawSide("b", ctx, 10, "#000");
		}
		if(this.l == true) {
			this.drawSide("l", ctx, 10, "#000");
		}

		if(this.hasPlayer) {
			ctx.font = "30px Arial";
			ctx.fillText(this.player, this.x-8, this.y+8);
		}
	}
	
	// returns the pair of points of the nearest line to the mouse
	getNearestLine(x, y) {
		var nearest_side = "";
		let side = 0;
		if(Math.abs((this.x+this.size/2) - x) < Math.abs(x -(this.x-this.size/2))) {
			nearest_side = "r";
			side = Math.abs((this.x+this.size/2) - x);
		} else {
			nearest_side = "l";
			side = Math.abs(x - (this.x-this.size/2));
		}

		let nearest_top = "";
		let topBot = 0;
		if(Math.abs((this.y + this.size/2) - y) < Math.abs(y -(this.y-this.size/2))) {
			nearest_top = "b";
			topBot = Math.abs((this.y+this.size/2) - y);
		} else {
			nearest_top = "t";
			topBot = Math.abs(y - (this.y-this.size/2));
		}

		var nearest  = "";
		if(side < topBot) {
			nearest = nearest_side;
		} else {
			nearest = nearest_top;
		}

		return this.getLine(nearest);
	}

	// returns the pair of points of a line in the cube
	getLine(side) {
		var p1 = {};
		var p2 = {};
			
		switch(side) {
			case "r":
				p1 = {x: this.x + this.size/2, y: this.y - this.size/2};
				p2 = {x: this.x + this.size/2, y: this.y + this.size/2};
				break;

			case "l":
				p1 = {x: this.x - this.size/2, y: this.y - this.size/2};
				p2 = {x: this.x - this.size/2, y: this.y + this.size/2};
				break;

			case "t":
				p1 = {x: this.x - this.size/2, y: this.y - this.size/2};
				p2 = {x: this.x + this.size/2, y: this.y - this.size/2};
				break;

			case "b":
				p1 = {x: this.x - this.size/2, y: this.y + this.size/2};
				p2 = {x: this.x + this.size/2, y: this.y + this.size/2};
				break;
		}

		return {p1, p2, side};
	}

	click(side, player) {
		switch(side) {
			case "r":
				this.r = true;
				break;

			case "l":
				this.l = true;
				break;

			case "t":
				this.t = true;
				break;

			case "b":
				this.b = true;
				break;
		}
		if(!this.hasPlayer&&this.r&&this.l&&this.t&&this.b) {
			this.hasPlayer = true;
			this.player = player

			return 1;
		}

		return 0;
	}

	checkSide(side) {
		var res = false;
		switch(side) {
			case "r":
				res = this.r;
				break;

			case "l":
				res = this.l;
				break;

			case "t":
				res = this.t;
				break;

			case "b":
				res = this.b;
				break;
		}

		return res;
	}

	drawSide(side, ctx, stroke, color) {
		var line = this.getLine(side);

		var p1 = line.p1;
		var p2 = line.p2;

		ctx.fillSyle = color; 
		if(p1.x == p2.x) {
			ctx.fillRect(p1.x-stroke/2, p1.y, stroke, this.size);
		} else {
			ctx.fillRect(p1.x, p1.y-stroke/2, this.size, stroke);
		}
	}
}

// Class that represnets the Timbiriche board
class Timbiriche {
	constructor(width, height, cellSize) {
		this.line = null;
		this.width = width;
		this.height = height;
		this.cellSize = cellSize;

		this.countX = Math.floor(width / cellSize);
		this.countY = Math.floor(height / cellSize);

		this.currentX = 0;
		this.currentY = 0;

		// Creates matrix of cells
		this.matrix = []
		for(var r = 0; r < this.countY; r++) {
			this.matrix[r] = []
			for(var c = 0; c < this.countX; c++) {
				var x = c*this.cellSize + this.cellSize/2;
				var y = r*this.cellSize + this.cellSize/2;

				this.matrix[r][c] = new Cell(x, y, this.cellSize);
			}
		}
	}

	draw(ctx) {
		for(var r = 0; r < this.countY; r++) {
			for(var c = 0; c < this.countX; c++) {
				this.matrix[r][c].draw(ctx);
			}
		}
	}
	
	// Previews how the line will be shown
	previewLine(ctx, mouseX, mouseY) {
		var cell = this.getCell(mouseX, mouseY);
		var line = cell.getNearestLine(mouseX, mouseY);

		if(this.line != line) {
			this.line = line;

			ctx.clearRect(0, 0, this.width, this.height);
			cell.drawSide(line.side, ctx, 10, "#000");

			this.draw(ctx);
		}
	}

	signal(mouseX, mouseY, player) {
		//if(this.line != null) {
			//var cell = this.matrix[this.currentY][this.currentX];
			var result = 0;
			var cell = this.getCell(mouseX, mouseY);
			var line = cell.getNearestLine(mouseX, mouseY);

			if(!cell.checkSide(line.side)) {
			result += cell.click(line.side, player)

			var offset = 0;
			var sideCell = null;

			switch(line.side) {
				case "t":
					offset = this.currentY - 1;
					offset = clamp(offset, 0, this.countY - 1);
					if(offset != this.currentY) {
						result += this.matrix[offset][this.currentX].click("b", player);
					}
					break;
				case "b":
					offset = this.currentY + 1;
					offset = clamp(offset, 0, this.countY - 1);
					if(offset != this.currentY) {
						result += this.matrix[offset][this.currentX].click("t", player);
					}
					break;
				case "r":
					offset = this.currentX + 1;
					offset = clamp(offset, 0, this.countX - 1);
					if(offset != this.currentX) {
						result += this.matrix[this.currentY][offset].click("l", player);
					}
					break;
				case "l":
					offset = this.currentX - 1;
					offset = clamp(offset, 0, this.countX - 1);
					if(offset != this.currentX) {
						result += this.matrix[this.currentY][offset].click("r", player);
					}
					break;
			}

			ctx.clearRect(0, 0, this.width, this.height);
			this.draw(ctx);

			return result;
			} else {
				return 1;
			}


		//}
	}

	// Gets the cell at a current position
	getCell(x, y) {
		var gridX = Math.floor(x/this.cellSize);
		var gridY = Math.floor(y/this.cellSize);

		if(gridX >= this.countX) {
			gridX = this.countX - 1;
		}
		if(gridY >= this.countY) {
			gridY = this.countY - 1;
		}

		this.currentX = gridX;
		this.currentY = gridY;

		return this.matrix[gridY][gridX];
	}
}
