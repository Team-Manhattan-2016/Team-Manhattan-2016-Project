window.addEventListener('load', init);

//snake segment size
const squareSize = 20;

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
	setTimeout(SnakeThinker, 100-score);

	console.log(currentFood);
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

	snake.push(nextHeadPos);

	//if snake stepped on food, update score and create food elsewhere
	if(CheckIfSnakeSteppedOnFood()){
		PlaceFood();
		score += 10;
	} else { //else continue moving snake
		snake = snake.slice(1);
	}
}

function PlaceFood() {
	//while(CheckIfSnakeSteppedOnFood())
	//{
		console.log('hiii');
		let canvas = document.getElementById('gameCanvas'),
			cX = canvas.width,
			cY = canvas.height,
			fX = Math.floor((Math.random() * cX) + 1),
			fY = Math.floor((Math.random() * cY) + 1);

		if(fX < squareSize / 2) {
			fX += squareSize / 2;
		} else if(fX > cX - squareSize / 2) {
			fX -= cX - (cX - squareSize / 2); 
		}

		if(fY < squareSize / 2) {
			fY += squareSize / 2;
		} else if(fY > cY - squareSize / 2) {
			fY -= cY - (cY - squareSize / 2); 
		}

		currentFood = {x: fX, y: fY};
	//}
}

function CheckIfSnakeSteppedOnFood() {
	for(let i = 0; i < snake.length; i += 1){
		let segment = snake[i];

		if(Math.abs(segment.x - currentFood.x) < squareSize / 2
		&& Math.abs(segment.y - currentFood.y) < squareSize / 2) {
			return true;
		}
	}

	return false;
}