$(document).ready(function() {
	// get the canvas element
	var canvas = $('#gameCanvas')[0];
	var ctx = canvas.getContext('2d');
	var width = $('#gameCanvas').width();
	var height = $('#gameCanvas').height();
	var i, length, snakePositionX, snakePositionY, tail, currentSnake;

	// set the snake
	var snakeArr;

	// controller size of the snake
	var cw = 30;

	function snakeCreate() {
		// initial empty array
		snakeArr = [];

		// initial length of the snake
		length = 3;

		// set startUp position of the snake
		for (i = length - 1; i >= 0; i -= 1) {
			snakeArr.push({
				x: i,
				y: 10
			});
		}
	}

	function snakePrint() {
		// set the canvas style on each interval based on the canvas class
		if (canvas.className === 'bgButtonChange') {
			ctx.fillStyle = 'black';
			ctx.strokeStyle = 'white';
		} else {
			ctx.fillStyle = 'white';
			ctx.strokeStyle = 'black';
		}

		ctx.fillRect(0, 0, width, height);
		ctx.strokeRect(0, 0, width, height);

		// get the position of the first element of the snake - the head
		snakePositionX = snakeArr[0].x;
		snakePositionY = snakeArr[1].y;

		// get the new position of the head
		snakePositionX += 1;

		// removes the last cell of the snake - the tail
		tail = snakeArr.pop();

		// set the position of the head
		tail.x = snakePositionX;

		// remove the tail and sets it up on first position
		snakeArr.unshift(tail);

		length = snakeArr.length;

		for (i = 0; i < length; i += 1) {
			currentSnake = snakeArr[i];
			// set color of the body
			ctx.fillStyle = 'green';
			ctx.fillRect(currentSnake.x * cw, currentSnake.y * cw, cw, cw);
			// set border for each part of the body
			ctx.strokeStyle = 'white';
			ctx.strokeRect(currentSnake.x * cw, currentSnake.y * cw, cw, cw);
		}
	}

	snakeCreate();
	game_loop = setInterval(snakePrint, 80);
});