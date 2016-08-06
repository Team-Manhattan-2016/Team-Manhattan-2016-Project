window.addEventListener('load', init);

//snake segment size
const squareSize = 20;

let squareOffset = squareSize / 2;

const snakeInitialSize = 3;

//updating this when a new key is pressed
let moveDelta = {};

let currentFood = {};

let score = 0;

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

	PlaceFood();
}

function SnakeThinker() {
	//make snake move
	SnakeMove();
	
	//draw current snake
	DrawSnake();

	//why setTimeout instead of interval? because we'll be speeding up the snake as it grows
	setTimeout(SnakeThinker, 100-score/10);
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

	//draw some food too
	ctx.fillStyle = 'rgb(155, 0, 0)';
	ctx.fillRect(currentFood.x, currentFood.y, squareSize, squareSize);
	ctx.strokeRect(currentFood.x, currentFood.y, squareSize, squareSize);
}

function SnakeMove() {
	let prevHeadPos = snake[snake.length-1],
		nextHeadPos = {
		x: prevHeadPos.x + moveDelta.x,
		y: prevHeadPos.y + moveDelta.y
	}

	nextHeadPos = CheckIfSnakeOverflows(nextHeadPos);

	snake.push(nextHeadPos);

	//if snake stepped on food, update score and create food elsewhere
	if(CheckIfSnakeSteppedOnFood()){
		PlaceFood();
		score += 10;
	} else { //else continue moving snake
		snake = snake.slice(1);
	}
}

function CheckIfSnakeOverflows(headPos) {
	let canvas = document.getElementById('gameCanvas'),
			cX = canvas.width,
			cY = canvas.height,
			newX = headPos.x,
			newY = headPos.y;

	if(headPos.x < 0) {
		newX = cX;
	} else if(headPos.x > cX) {
		newX = 0;
	}

	if(headPos.y < 0) {
		newY = cY;
	} else if(headPos.y > cY) {
		newY = 0;
	}

	return {x: newX, y: newY};
}

function PlaceFood() {
	//while(CheckIfSnakeSteppedOnFood())
	//{
		let canvas = document.getElementById('gameCanvas'),
			cX = canvas.width,
			cY = canvas.height,
			fX = Math.floor((Math.random() * cX) + 1),
			fY = Math.floor((Math.random() * cY) + 1);
		
		if(fX + squareSize > cX) {
			fX = cX - squareSize;
		}

		if(fY + squareSize > cY) {
			fY = cY - squareSize;
		}

		currentFood = {x: fX, y: fY};
	//}
}

function CheckIfSnakeSteppedOnFood() {
	for(let i = 0; i < snake.length; i += 1){
		let segment = snake[i];

		if(Math.abs((segment.x + squareOffset) - (currentFood.x + squareOffset)) < squareSize
		&& Math.abs((segment.y + squareOffset) - (currentFood.y + squareOffset)) < squareSize) {
			return true;
		}
	}

	return false;
}