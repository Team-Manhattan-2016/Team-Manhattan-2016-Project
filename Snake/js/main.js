window.addEventListener('load', init);

//snake segment size
const squareSize = 10;

const snakeInitialSize = 3;

//updating this when a new key is pressed
let moveDelta = {};

//the snake will be an array of objects
//each object will have x and y properties
let snake = [];

function init(ev) {
	document.addEventListener('keydown', PressingKey);

	setTimeout(CreateSnake, 100);
	setTimeout(SnakeThinker, 500);
}

function PressingKey(ev) {
	let btn = ev.code;

	if(btn === "ArrowUp"){
		moveDelta = {x: 0, y: -squareSize};
	} else if(btn === "ArrowDown"){
		moveDelta = {x: 0, y: squareSize};
	} else if(btn === "ArrowLeft"){
		moveDelta = {x: -squareSize, y: 0};
	} else if(btn === "ArrowRight"){
		moveDelta = {x: squareSize, y: 0};
	}
}

function CreateSnake() {
	let canvas = document.getElementById('gameCanvas'),
		ctx = canvas.getContext('2d'),
		middleX = canvas.width / 2,
		middleY = canvas.height / 2,
		i = 0;

	//initialize snake (pointing down)
	for(i = snakeInitialSize - 1; i >= 0; i -= 1) {
		snake.push({x: middleX, y: middleY - i*squareSize});
	}

	//snake initial direction - down
	moveDelta = {x: 0, y: squareSize};
}

function SnakeThinker() {
	//make snake move
	SnakeMove();
	
	//draw current snake
	DrawSnake();

	//why setTimeout instead of interval? because we'll be speeding up the snake as it grows
	setTimeout(SnakeThinker, 100);
}

function DrawSnake() {
	let canvas = document.getElementById('gameCanvas'),
		ctx = canvas.getContext('2d'),
		i = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.strokeStyle = 'rgb(255, 255, 255)';

	for(i = 0; i < snake.length; i += 1) {
		ctx.fillRect(snake[i].x, snake[i].y, squareSize, squareSize);
		ctx.strokeRect(snake[i].x, snake[i].y, squareSize, squareSize);
	}
}

function SnakeMove() {
	let prevHeadPos = snake[snake.length-1],
		nextHeadPos = {
		x: prevHeadPos.x + moveDelta.x,
		y: prevHeadPos.y + moveDelta.y
	}

	snake.push(nextHeadPos);
	snake = snake.slice(1);
}