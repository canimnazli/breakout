/** @type {HTMLCanvasElement} */
const rulesBtn = document.getElementById('rules-btn');
const rules = document.getElementById('rules');
const closeBtn = document.getElementById('close-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRow = 6;
const brickColumn = 9;

//ball
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	r: 10,
	speed: 4,
	dx: 4,
	dy: -4,
};

const paddle = {
	x: canvas.width / 2 - 40,
	y: canvas.height - 20,
	w: 80,
	h: 10,
	speed: 10,
	dx: 0,
};
const bricks = [];
const brick = {
	offx: 45,
	offy: 60,
	w: 70,
	h: 20,
	padding: 10,
	visibility: true,
};

for (let i = 0; i < brickColumn; i++) {
	bricks[i] = [];
	for (let j = 0; j < brickRow; j++) {
		const x = i * (brick.w + brick.padding) + brick.offx;
		const y = j * (brick.h + brick.padding) + brick.offy;
		bricks[i][j] = { x, y, ...brick };
	}
}
function drawBrick() {
	bricks.forEach((column) => {
		column.forEach((row) => {
			ctx.beginPath();
			ctx.rect(row.x, row.y, row.w, row.h);
			ctx.fillStyle = row.visibility ? 'rgb(183, 89, 47)' : 'transparent';
			ctx.fill();
			ctx.closePath();
		});
	});
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
	ctx.fillStyle = '#0095dd';
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fillStyle = '#0095dd';
	ctx.fill();
	ctx.closePath();
}

function movePaddle() {
	paddle.x += paddle.dx;

	if (paddle.x + paddle.w > canvas.width) {
		paddle.x = canvas.width - paddle.w;
	}
	if (paddle.x < 0) {
		paddle.x = 0;
	}
}

function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;
	if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
		ball.dx *= -1;
	}
	if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
		ball.dy *= -1;
	}

	if (
		ball.x + ball.r > paddle.x &&
		ball.x - ball.r < paddle.x + paddle.w &&
		ball.y + ball.r > paddle.y
	) {
		ball.dy = -ball.speed;
		// brick.visibility = false;
	}

	bricks.forEach((column) => {
		column.forEach((brick) => {
			if (brick.visibility) {
				if (
					ball.x + ball.r > brick.x &&
					ball.x - ball.r < brick.x + brick.w &&
					ball.y + ball.r > brick.y &&
					ball.y - ball.r < brick.y + brick.h
				) {
					ball.dy *= -1;
					brick.visibility = false;

					increaseScore();
				}
			}
		});
	});

	if (ball.y + ball.r > canvas.height) {
		showAllBricks();
		score = 0;
	}
}

function increaseScore() {
	score++;
	if (score === brickColumn * brickRow) {
		showAllBricks();
	}
}
function showAllBricks() {
	bricks.forEach((column) => {
		column.forEach((brick) => {
			brick.visibility = true;
		});
	});
}

function keyDown(e) {
	if (e.key === 'ArrowRight') {
		paddle.dx = paddle.speed;
	}
	if (e.key === 'ArrowLeft') {
		paddle.dx = -paddle.speed;
	}
}
function keyUp(e) {
	if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
		paddle.dx = 0;
	}
}

function drawScore() {
	ctx.font = '20px Arial';
	ctx.fillStyle = 'red';
	ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawScore();
	drawPaddle();
	drawBrick();
}

function update() {
	movePaddle();
	moveBall();
	draw();
	requestAnimationFrame(update);
}
update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

rulesBtn.addEventListener('click', () => {
	rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
	rules.classList.remove('show');
});
