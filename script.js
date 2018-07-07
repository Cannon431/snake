let canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');

class Game {
	constructor() {
		this.printHighScore();

		this.bgColor = 'black';
		this.score = 0;
		this.speed = 130;
		this.highScore = 0;
	}

	run() {
		this.printScore();
		this.clearCanvas();

		if (snake.body[0][0] == food.x && snake.body[0][1] == food.y) {	
			snake.draw();
			snake.eat();
		} else {
			snake.draw();
			food.draw();
			snake.move();
		}

		game.drawGrid();
	}

	drawGrid() {
		let cols = Math.round(canvas.width / 20);
		let rows = Math.round(canvas.height / 20);

		ctx.strokeStyle = this.bgColor;

		for (let i = 0; i <= rows; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * 20);
			ctx.lineTo(canvas.height, i * 20);
			ctx.stroke();
			ctx.closePath();
		}

		for (let i = 0; i <= cols; i++) {
			ctx.beginPath();
			ctx.moveTo(i * 20, 0);
			ctx.lineTo(i * 20, canvas.width);
			ctx.stroke();
			ctx.closePath();
		}
	}

	clearCanvas() {
		ctx.fillStyle = this.bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	printScore() {
		document.getElementById('score').innerHTML = `Score: ${this.score}`;
	}

	printHighScore() {
		let highScore = localStorage.getItem('snakeHighScore') || 0;
		document.getElementById('high-score').innerHTML = `High score: ${highScore}`;
	}

	end() {
		clearInterval(interval);

		if (this.score > localStorage.getItem('snakeHighScore')) {
			localStorage.setItem('snakeHighScore', this.score);
			this.printHighScore();
		}

		setTimeout(() => location.reload(), 1000);
	}
}

class Snake {
	constructor() {
		this.color = 'lime';
		this.speed = 20;
		this.size = 20;
		this.body = [[200, 200], [200, 220], [200, 240]];
		this.direction = [0, -this.speed];
	}

	move() {
		let newHead = this.body[0].slice();

		newHead[0] += this.direction[0];
		newHead[1] += this.direction[1];

		if (newHead[0] >= canvas.width) {
			newHead[0] = 0;
		}

		if (newHead[0] <= -this.size) {
			newHead[0] = canvas.width - this.size;
		}

		if (newHead[1] >= canvas.height) {
			newHead[1] = 0;
		}

		if (newHead[1] <= -this.size) {
			newHead[1] = canvas.height - this.size;
		}

		this.checkCollision(newHead);

		this.body.pop();
		this.body.unshift(newHead);
	}

	checkCollision(head) {
		for (let i = 1; i < this.body.length; i++) {
			if (head[0] == this.body[i][0] && head[1] == this.body[i][1]) {
				game.end();
			}
		}
	}

	draw() {
		ctx.fillStyle = this.color;
		for (let i = 0; i < this.body.length; i++) {
			ctx.fillRect(this.body[i][0], this.body[i][1], this.size = 20, this.size = 20);
		}
	}

	changeDirection(keyCode) {
		let oldDirection = this.direction,
			head = this.body[0],
			tile = this.body[1];

		switch (keyCode) {
			case 37: case 65:
				// Left
				if (this.direction.toString() != [this.speed, 0].toString()) {
					this.direction = [-this.speed, 0];
				}
				break;
			case 38: case 87:
				// Top
				if (this.direction.toString() != [0, this.speed].toString()) {
					this.direction = [0, -this.speed];
				}
				break;
			case 39: case 68:
				// Right
				if (this.direction.toString() != [-this.speed, 0].toString()) {
					this.direction = [this.speed, 0];
				}
				break;
			case 40: case 83:
				// Bottom
				if (this.direction.toString() != [0, -this.speed].toString()) {
					this.direction = [0, this.speed];
				}
				break;
		}

		if (this.direction.toString() != oldDirection.toString()) {
			if (head[0] + this.direction[0] == tile[0] && head[1] + this.direction[1] == tile[1]) {
				this.direction = oldDirection;
			}
		}
	}

	eat() {
		if (this.body[0][0] == food.x && this.body[0][1] == food.y) {
			game.score++;
			food = new Food();

			let newHead = this.body[0].slice();
			newHead[0] += this.direction[0];
			newHead[1] += this.direction[1];
			this.body.unshift(newHead);
		}
	}
}

class Food {
	constructor() {
		this.color = 'red';
		this.x = Math.floor(Math.random() * snake.size) * 20;
		this.y = Math.floor(Math.random() * snake.size) * 20;
		this.size = snake.size;
	}

	draw() {
		ctx.fillStyle =this.color;
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}

let game = new Game(), snake = new Snake(), food = new Food();

document.addEventListener('keydown', event => snake.changeDirection(event.keyCode));

let interval = setInterval(() => game.run(), game.speed);

game.run();
