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

//Music
let mainMusic=document.getElementById('main_music');

function init(ev) {
	let startButton = document.getElementById('btnStartGame');
	startButton.addEventListener('click', StartButtonPress);

	document.addEventListener('keydown', PressingKey);
}

function StartButtonPress() {
	let startButton = document.getElementById('btnStartGame');
	startButton.parentNode.removeChild(startButton);
	BeginGame();
}

function RetryButtonPress() {
	let gameOverContainer = document.getElementById('gameOverContainer');
	gameOverContainer.parentNode.removeChild(gameOverContainer);
	BeginGame();
}

function BeginGame() {
	ResetGameVariables();
	CreateSnake();
 mainMusic.play();

	function ResetGameVariables() {
		snake = [];
		score = 0;

		//snake initial direction - down
		moveDelta = {
			x: 0,
			y: squareSize
		};
	}

	function CreateSnake() {
		let canvas = document.getElementById('gameCanvas'),
			ctx = canvas.getContext('2d'),
			middleX = canvas.width / 2,
			middleY = canvas.height / 2,
			i = 0;

		//initialize snake (pointing down)
		for (i = snakeInitialSize - 1; i >= 0; i -= 1) {
			snake.push({
				x: middleX,
				y: middleY - i * squareSize
			});
		}
	}

	setTimeout(PlaceFood, 100);
	setTimeout(SnakeThinker, 500);
}

function PressingKey(ev) {
	let btn = ev.code;

	if (btn === "ArrowUp") {
		//if previous direction was down, don't allow the player to press up
		if (moveDelta.y === squareSize) {
			return;
		}

		moveDelta = {
			x: 0,
			y: -squareSize
		};
	} else if (btn === "ArrowDown") {
		//if previous direction was up, don't allow the player to press down
		if (moveDelta.y === -squareSize) {
			return;
		}

		moveDelta = {
			x: 0,
			y: squareSize
		};
	} else if (btn === "ArrowLeft") {
		//if previous direction was right, don't allow the player to press left
		if (moveDelta.x === squareSize) {
			return;
		}

		moveDelta = {
			x: -squareSize,
			y: 0
		};
	} else if (btn === "ArrowRight") {
		//if previous direction was left, don't allow the player to press right
		if (moveDelta.x === -squareSize) {
			return;
		}

		moveDelta = {
			x: squareSize,
			y: 0
		};
	}
}

function SnakeThinker() {
	//make snake move
	SnakeMove();

	//draw current snake
	DrawSnake();

	if (CheckIfSnakeCrashedIntoItself()) {
		EndGame();
		return;
	}

	//why setTimeout instead of interval? because we'll be speeding up the snake as it grows
	setTimeout(SnakeThinker, 100 - score / 10);
}

function DrawSnake() {
	let canvas = document.getElementById('gameCanvas'),
		ctx = canvas.getContext('2d'),
		i = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.strokeStyle = 'rgb(255, 255, 255)';

	for (i = 0; i < snake.length; i += 1) {
		ctx.fillRect(snake[i].x, snake[i].y, squareSize, squareSize);
		ctx.strokeRect(snake[i].x, snake[i].y, squareSize, squareSize);
	}

	//draw some food too
	var image = new Image();

	function drawFood() {
		//ctx.drawImage(image, currentFood.x - 10, currentFood.y - 10);
		ctx.drawImage(image, currentFood.x, currentFood.y, squareSize, squareSize);
	}

	image.src = "images/apple.png";
	image.onload = drawFood;
}

function SnakeMove() {
	let prevHeadPos = snake[snake.length - 1],
		nextHeadPos = {
			x: prevHeadPos.x + moveDelta.x,
			y: prevHeadPos.y + moveDelta.y
		}

	nextHeadPos = CheckIfSnakeOverflows(nextHeadPos);

	snake.push(nextHeadPos);

	//if snake stepped on food, update score and create food elsewhere
	if (CheckIfSnakeSteppedOnFood(currentFood)) {
		currentFood = {
			x: -squareSize,
			y: -squareSize
		};
		PlaceFood();
		score += 10;
		document.getElementById('eatingFood').play();
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

	if (headPos.x < 0) {
		newX = cX;
	} else if (headPos.x + squareSize > cX) {
		newX = 0;
	}

	if (headPos.y < 0) {
		newY = cY;
	} else if (headPos.y + squareSize > cY) {
		newY = 0;
	}

	return {
		x: newX,
		y: newY
	};
}

function PlaceFood() {
	let canvas = document.getElementById('gameCanvas'),
		cX = canvas.width,
		cY = canvas.height,
		fX = Math.floor((Math.random() * cX) + 1),
		fY = Math.floor((Math.random() * cY) + 1);

	if (fX + squareSize > cX) {
		fX = cX - squareSize;
	}

	if (fY + squareSize > cY) {
		fY = cY - squareSize;
	}

	let fakeFood = {
		x: fX,
		y: fY
	};

	//this is in case the newly created food is placed on the snake itself
	//in that case, don't create food just yet, call PlaceFood again (until the new food is not on the snake)
	if (CheckIfSnakeSteppedOnFood(fakeFood)) {
		PlaceFood();
		return;
	}

	currentFood = {
		x: fX,
		y: fY
	};
}

function CheckIfSnakeSteppedOnFood(food) {
	for (let i = 0; i < snake.length; i += 1) {
		let segment = snake[i];

		if (Math.abs((segment.x + squareOffset) - (food.x + squareOffset)) < squareSize &&
			Math.abs((segment.y + squareOffset) - (food.y + squareOffset)) < squareSize) {
			return true;
		}
	}

	return false;
}

function CheckIfSnakeCrashedIntoItself() {
	let headPos = snake[snake.length - 1],
		i = 0;

	for (i = 0; i < snake.length - 1; i += 1) {
		let segment = snake[i];

		if (Math.abs((segment.x + squareOffset) - (headPos.x + squareOffset)) < squareSize &&
			Math.abs((segment.y + squareOffset) - (headPos.y + squareOffset)) < squareSize) {
			return true;
		}
	}

	return false;
}

function EndGame() {
	let fragment,
		div,
		span,
		button,
		body;

	document.getElementById('gameOver').play();
	fragment = document.createDocumentFragment();
	div = document.createElement('div');
	div.setAttribute('id', 'gameOverContainer');
	div.setAttribute('class', 'window');
	div.innerHTML = 'Game Over';

	span = document.createElement('span');
	span.setAttribute('id', 'scoreSpan');

	span.innerHTML = 'Your score: ';
	span.innerHTML += score;

	button = document.createElement('button');
	button.setAttribute('id', 'tryAgainButton');
	button.innerHTML = 'Try again';
	button.addEventListener('click', RetryButtonPress);

	div.appendChild(span);
	div.appendChild(button);
	fragment.appendChild(div);

  mainMusic.pause();
	mainMusic.currentTime = 0;
	document.body.appendChild(fragment);
}
