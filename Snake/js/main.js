window.addEventListener('load', init);

//snake segment size
const squareSize = 20;
let squareOffset = squareSize / 2;
const snakeInitialSize = 3;
const players = 2;

//global variables
let moveDelta = [];
let collectibles = [];
let score = [];
let snake = [];
let mainMusic = document.getElementById('main_music');
let winner = '';
let speed = 0;

let collectibleScores = [
	10, //apple
	15, //banana
	-10 //mine
]

let collectiblesRes = [
	"images/apple.png",
	"images/2000px-Bananas.svg.png",
	"images/mine.png"
];

let startPositions = [
	{
		x: 0,
		y: 260
	},
	{
		x: 980,
		y: 260
	}
]

function init(ev) {
	let startButton = document.getElementById('btnStartGame');
	startButton.addEventListener('click', StartButtonPress);

	document.addEventListener('keydown', PressingKey);
}

function StartButtonPress() {
	let startButton = document.getElementById('btnStartGame');
	startButton.parentNode.removeChild(startButton);
	selectDifficulty();
	BeginGame();
}

function RetryButtonPress() {
	let gameOverContainer = document.getElementById('gameOverContainer');
	gameOverContainer.parentNode.removeChild(gameOverContainer);
	BeginGame();
}

function selectDifficulty(){
	let select = document.getElementById('selectDifficulty');
	let label = document.getElementById('labelDifficulty');

	let selectedDifficulty = select.value;	//assigns value to selectedDifficulty

	if(selectedDifficulty === 'Easy'){speed = 150;}
	else if(selectedDifficulty === 'Normal'){speed = 100;}
	else {speed = 50;}

	select.parentNode.removeChild(select);	//hides the dropdown
	label.parentNode.removeChild(label);	//hides the label
}

function BeginGame() {
	let canvas = document.getElementById('snakeCanvas'),
		ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	canvas = document.getElementById('collectibleCanvas');
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ResetGameVariables();
	CreateSnakes();
 	mainMusic.play();

	function ResetGameVariables() {
		snake = [];
		score = [];
		moveDelta = [];
		collectibles = [];
		winner = '';

		for(let i = 0; i < players; i += 1){
			moveDelta.push({x: i === 0 ? squareSize:-squareSize, y: 0});
			snake.push([]);
			score.push(0);
		}

		for(let i = 0; i < 3; i += 1){
			collectibles.push({});
		}
	}
	
	function CreateSnakes() {
		let canvas = document.getElementById('snakeCanvas'),
			ctx = canvas.getContext('2d'),
			i = 0;

			for (i = snakeInitialSize - 1; i >= 0; i -= 1) {
				snake[0].push({
					x: startPositions[0].x - i * squareSize,
					y: startPositions[0].y
				});
			}

			for (i = snakeInitialSize - 1; i >= 0; i -= 1) {
				snake[1].push({
					x: startPositions[1].x + i * squareSize,
					y: startPositions[1].y
				});
			}
	}

	for(let i = 0; i < collectibles.length; i += 1){PlaceCollectible(i);}
	setTimeout(GameThinker, 500);
}

function PressingKey(ev) {
	let btn = ev.code;
	
	if (btn === "KeyW") {
		if (moveDelta[0].y === squareSize) {return;}
		moveDelta[0] = {x: 0, y: -squareSize};
	} else if (btn === "KeyS") {
		if (moveDelta[0].y === -squareSize) {return;}
		moveDelta[0] = {x: 0, y: squareSize};
	} else if (btn === "KeyA") {
		if (moveDelta[0].x === squareSize) {return;}
		moveDelta[0] = {x: -squareSize, y: 0};
	} else if (btn === "KeyD") {
		if (moveDelta[0].x === -squareSize) {return;}
		moveDelta[0] = {x: squareSize, y: 0};
	} else if (btn === "ArrowUp") {
		if (moveDelta[1].y === squareSize) {return;}
		moveDelta[1] = {x: 0, y: -squareSize};
	} else if (btn === "ArrowDown") {
		if (moveDelta[1].y === -squareSize) {return;}
		moveDelta[1] = {x: 0, y: squareSize};
	} else if (btn === "ArrowLeft") {
		if (moveDelta[1].x === squareSize) {return;}
		moveDelta[1] = {x: -squareSize, y: 0};
	} else if (btn === "ArrowRight") {
		if (moveDelta[1].x === -squareSize) {return;}
		moveDelta[1] = {x: squareSize, y: 0};
	}
}

function HandleCrashes(){
	for(let i = 0; i < players; i += 1){
		if(CheckIfSnakeCrashedIntoItself(i)){
			winner = 'Player ' + (GetOppositePlayer(i)+1) + ' wins!';
			return;
		}

		let crashedIntoOpponentAt = CheckIfSnakeCrashedIntoTheOtherOne(i);

		if(crashedIntoOpponentAt){
			if(CheckIfSnakesCrashHeadFirst()){ //snakes crash head first
				if(score[0] > score[1]) {winner = 'Player 1 wins!';}
				else if(score[0] < score[1]) {winner = 'Player 2 wins!';}
				else {winner = 'Draw!';}

				return;
			}

			let oppositePlr = GetOppositePlayer(i);
			snake[oppositePlr] = snake[oppositePlr].slice(crashedIntoOpponentAt-1);
		}
	}
}

function HandleCollectibles(){
	for(let i = 0; i < players; i += 1){
		for(let j = 0; j < collectibles.length; j += 1){
			if(CheckIfSnakeSteppedOnCollectible(i, collectibles[j])){	
				score[i] += collectibleScores[j];

				if(j < collectibles.length - 1){ //collected apple/banana
					snake[i].push({
						x: snake[i][snake[i].length-1].x + moveDelta[i].x,
						y: snake[i][snake[i].length-1].y + moveDelta[i].y
					});
					document.getElementById('eatingFood').play();
				} else { //stepped on a mine
					snake[i] = snake[i].slice(1);

					if(snake[i].length < snakeInitialSize){
						winner = 'Player ' + (GetOppositePlayer(i)+1) + ' wins!';
						return;
					}

					DoExplosion(collectibles[j]);
				}

				let canvas = document.getElementById('collectibleCanvas'),
					ctx = canvas.getContext('2d');

				ctx.clearRect(collectibles[j].x, collectibles[j].y, squareSize, squareSize);

				collectibles[j] = {x: -squareSize, y: -squareSize};
				PlaceCollectible(j);
				UpdateScoreBoard();
			}
		}
	}
}

function GameThinker() {
	SnakesMove();
	DrawSnakes();

	HandleCrashes();
	HandleCollectibles();

	console.log(collectibles);
	console.log(snake);

	//why setTimeout instead of interval? because we'll be speeding up the snake as it grows
	if(winner === ''){
		setTimeout(GameThinker, speed - Math.round(Math.max(score[0], score[1]) / 10));
	} else {
		EndGame();
	}
}

function DoExplosion(bomb){
	let canvas = document.getElementById('snakeCanvas'),
		ctx = canvas.getContext('2d'),
		audio = new Audio('audio/EXPLOSION.mp3'),
		explosionpng = new Image();
	
	audio.play();
	explosionpng.src = "images/explosionpng.png";
	explosionpng.onload = drawexplosion;

	function drawexplosion()
	{
		ctx.drawImage(explosionpng, bomb.x, bomb.y, squareSize, squareSize);
	}
}

function DrawSnakes() {
	let canvas = document.getElementById('snakeCanvas'),
		ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.strokeStyle = 'rgb(0, 0, 0)';

	for(let i = 0; i < snake[0].length; i += 1){
		ctx.fillRect(snake[0][i].x, snake[0][i].y, squareSize, squareSize);
		ctx.strokeRect(snake[0][i].x, snake[0][i].y, squareSize, squareSize);
	}

	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.strokeStyle = 'rgb(255, 255, 255)';

	for(let i = 0; i < snake[1].length; i += 1){
		ctx.fillRect(snake[1][i].x, snake[1][i].y, squareSize, squareSize);
		ctx.strokeRect(snake[1][i].x, snake[1][i].y, squareSize, squareSize);
	}
}

function PlaceCollectible(cIndex) {
	let canvas = document.getElementById('collectibleCanvas'),
		ctx = canvas.getContext('2d'),
		cX = canvas.width,
		cY = canvas.height,
		fX = Math.floor((Math.random() * cX) + 1),
		fY = Math.floor((Math.random() * cY) + 1);

	SnapCollectibleToGrid();

	function SnapCollectibleToGrid() {
		fX = Math.round(fX / squareSize) * squareSize;
		fx = (fX + squareSize > cX) ? fX = cX - squareSize : fX;
		fY = Math.round(fY / squareSize) * squareSize;
		fY = (fY + squareSize > cY) ? fY = cY - squareSize : fY;
	}

	let fakeColl = {x: fX, y: fY};
	
	if(CheckIfCollectiblesStack(fakeColl)){
		PlaceCollectible(cIndex);
		return;
	}

	for(let i = 0; i < players; i += 1){
		if(CheckIfSnakeSteppedOnCollectible(i, fakeColl)){
			PlaceCollectible(cIndex);
			return;
		}
	}

	collectibles[cIndex] = {
		x: fX,
		y: fY
	};

	let image = new Image();

	image.src = collectiblesRes[cIndex];
 	image.onload = drawFood;

	function drawFood() {
 		ctx.drawImage(image, collectibles[cIndex].x, collectibles[cIndex].y, squareSize, squareSize);
 	}
}

function SnakesMove() {
	let prevHeadPos = [
		snake[0][snake[0].length - 1],
		snake[1][snake[1].length - 1]
	],
		nextHeadPos = [
			{x: prevHeadPos[0].x + moveDelta[0].x, y: prevHeadPos[0].y + moveDelta[0].y},
			{x: prevHeadPos[1].x + moveDelta[1].x, y: prevHeadPos[1].y + moveDelta[1].y}
		]

	for(let i = 0; i < players; i += 1){
		nextHeadPos[i] = CheckIfSnakeOverflows(nextHeadPos[i]);
		snake[i].push(nextHeadPos[i]);
		snake[i] = snake[i].slice(1);
	}
}

function CheckIfSnakeOverflows(headPos) {
	let canvas = document.getElementById('snakeCanvas'),
		cX = canvas.width,
		cY = canvas.height,
		newX = headPos.x,
		newY = headPos.y;

	if (headPos.x < 0) {newX = cX;} 
	else if (headPos.x + squareSize > cX) {newX = 0;}

	if (headPos.y < 0) {newY = cY;} 
	else if (headPos.y + squareSize > cY) {newY = 0;}

	return {x: newX, y: newY};
}

function CheckIfCollectiblesStack(collectible) {
	for (let i = 0; i < collectibles.length; i += 1) {
		let coll = collectibles[i];

		if (Math.abs((coll.x + squareOffset) - (collectible.x + squareOffset)) < squareSize &&
			Math.abs((coll.y + squareOffset) - (collectible.y + squareOffset)) < squareSize) {
			return true;
		}
	}

	return false;
}

function CheckIfSnakeSteppedOnCollectible(plr, collectible) {
	for (let i = 0; i < snake[plr].length; i += 1) {
		let segment = snake[plr][i];

		if (Math.abs((segment.x + squareOffset) - (collectible.x + squareOffset)) < squareSize &&
			Math.abs((segment.y + squareOffset) - (collectible.y + squareOffset)) < squareSize) {
			return true;
		}
	}

	return false;
}

function CheckIfSnakeCrashedIntoItself(plr) {
	let headPos = snake[plr][snake[plr].length - 1],
		i = 0;

	for (i = 0; i < snake[plr].length - 1; i += 1) {
		let segment = snake[plr][i];

		if (Math.abs((segment.x + squareOffset) - (headPos.x + squareOffset)) < squareSize &&
			Math.abs((segment.y + squareOffset) - (headPos.y + squareOffset)) < squareSize) {
			return true;
		}
	}

	return false;
}

function CheckIfSnakeCrashedIntoTheOtherOne(plr) {
	let headPos = snake[plr][snake[plr].length - 1],
		i = 0,
		oppositePlayer = GetOppositePlayer(plr);

	for (i = 0; i < snake[oppositePlayer].length - 1; i += 1) {
		let segment = snake[oppositePlayer][i];

		if (Math.abs((segment.x + squareOffset) - (headPos.x + squareOffset)) < squareSize &&
			Math.abs((segment.y + squareOffset) - (headPos.y + squareOffset)) < squareSize) {
			return i+1;
		}
	}

	return false;
}

function CheckIfSnakesCrashHeadFirst(){
	if(Math.abs((snake[0][snake[0].length-1].x + squareOffset) - (snake[1][snake[1].length-1].x + squareOffset)) <= squareSize &&
	Math.abs((snake[0][snake[0].length-1].y + squareOffset) - (snake[1][snake[1].length-1].y + squareOffset)) <= squareSize
	&& (snake[0][snake[0].length-1].x === snake[1][snake[1].length-1].x || snake[0][snake[0].length-1].y === snake[1][snake[1].length-1].y)){
		return true;
	}

	return false;
}

function CheckIfSnakesCrashCentipedeStyle(){
	if(moveDelta[0].x === moveDelta[1].x && moveDelta[0].y === moveDelta[1].y){
		return true;
	}

	return false;
}

function GetOppositePlayer(plr){
	return plr === 1 ? 0 : 1;
}

function UpdateScoreBoard(){
	let whiteSnakeScore = document.getElementById('whiteSnake'),
		blackSnakeScore = document.getElementById('blackSnake');

	whiteSnakeScore.innerHTML = score[0];
	blackSnakeScore.innerHTML = score[1];
}

function EndGame() {
	let fragment,
		div,
		span,
		span2,
		button,
		body;

	document.getElementById('gameOver').play();
	fragment = document.createDocumentFragment();
	div = document.createElement('div');
	div.setAttribute('id', 'gameOverContainer');
	div.setAttribute('class', 'window');
	div.innerHTML = winner;

	span = document.createElement('span');
	span.setAttribute('id', 'scoreSpan');
	span2 = document.createElement('span');
	span2.setAttribute('id', 'scoreSpan2');

	span.innerHTML = 'Player 1 score: ';
	span.innerHTML += score[0];
	span2.innerHTML = 'Player 2 score: ';
	span2.innerHTML += score[1];

	button = document.createElement('button');
	button.setAttribute('id', 'tryAgainButton');
	button.innerHTML = 'Try again';
	button.addEventListener('click', RetryButtonPress);

	div.appendChild(span);
	div.appendChild(span2);
	div.appendChild(button);
	fragment.appendChild(div);

  	mainMusic.pause();
	mainMusic.currentTime = 0;
	document.body.appendChild(fragment);
}
