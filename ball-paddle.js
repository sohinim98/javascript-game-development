'use strict';
			// canvas
			let canvas = document.getElementById("ballPaddleCanvas");
			let ctx = canvas.getContext("2d");
			
			// ball
			let x = canvas.width/2;
			let y = canvas.height-30;
			let dx = 2;
			let dy = -2;
			let ballRadius = 10;

			// paddle
			let paddleHeight = 10;
			let paddleWidth = 100;
			let paddleX = (canvas.width-paddleWidth)/2;
			let rightPressed = false;
			let leftPressed = false;

			// bricks
			let brickRowCount = 3;
			let brickColumnCount = 6;
			let brickWidth = 75;
			let brickHeight = 20;
			let brickPadding = 10;
			let brickOffsetTop = 30;
			let brickOffsetLeft = 30;
			let score = 0;
			let lives = 3;

			/* The bricks are in a 2D array that contains the brick columns (col), which in turn contain
		the brick rows (row), which in turn will each contain an object containing the x and y
		positions to paint each on the screen. */

		let bricks = [];
		for(let col=0; col<brickColumnCount; col++) {
				bricks[col] = [];
				for(let row=0; row<brickRowCount; row++) {
						bricks[col][row] = { x: 0, y: 0, status: 1 };
				}
		}

			function createBall() {
				ctx.beginPath();
				ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
				ctx.fillStyle = "#3399FF";
				ctx.fill();
				ctx.closePath();
			}

			function createPaddle() {
				ctx.beginPath();
				ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleWidth);
				ctx.fillStyle = "#D2691E";
				ctx.fill();
				ctx.closePath();
			}

			function createBricks() {
				for(let col=0; col<brickColumnCount; col++) {
					let brickX = (col*(brickWidth+brickPadding))+brickOffsetLeft;
					for(let row=0; row<brickRowCount; row++) {
						if(bricks[col][row].status == 1) {
							let brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
							bricks[col][row].x = brickX;
							bricks[col][row].y = brickY;
							ctx.beginPath();
							ctx.rect(brickX, brickY, brickWidth, brickHeight);
							ctx.fillStyle = "#FF8000";
							ctx.fill();
							ctx.closePath();
						}
					}
				}
			}

			function collision() {
				for(let col=0; col<brickColumnCount; col++) {
					for(let row=0; row<brickRowCount; row++) {
						let brick = bricks[col][row];
						if (brick.status === 1) {
							if (x > brick.x && x < brick.x+brickWidth && y > brick.y && y < brick.y+brickHeight) {
								dy = -dy;
								brick.status = 0;
								score++;
							if(score === brickColumnCount * brickRowCount) {
								alert("YOU WIN, CONGRATULATIONS!");
								document.location.reload();
							}
						}
						}
					}
				}
			}

			function createScore() {
				ctx.font = "16px Arial";
				ctx.fillStyle = "#000000";
				ctx.fillText("Score: "+score, 8, 20);
			}

			function createLives() {
				ctx.font = "16px Arial";
				ctx.fillStyle = "#000000";
				ctx.fillText("Lives: "+lives, canvas.width-65, 20);
			}

			function draw() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				createBricks();
				createBall();
				createPaddle();
				collision();
				createScore();
				createLives();
				x += dx;
				y += dy;
				if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
					dx = -dx;
				}
				if(y + dy < ballRadius) {
					dy = -dy;
				}
				else if(y + dy > canvas.height-ballRadius) {
					if(x > paddleX && x < paddleX + paddleWidth) {
						// within the paddle
						dy = -dy;
					}
					else {
						lives--;
						if(!lives) {
							alert("GAME OVER");
							document.location.reload(); // restarting the game by reloading the page
						} else {
							//reset
							x = canvas.width/2;
							y - canvas.height-30;
							dx = 2;
							dy = -2;
						}
					}
				}
				if(rightPressed && paddleX < canvas.width-paddleWidth) {
					paddleX += 7
				}
				else if(leftPressed && paddleWidth > 0) {
					paddleX -= 7;
				}
		}

		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);

		function keyDownHandler(e) {
			if(e.keyCode == 39) {
				rightPressed = true;
			}
			else if(e.keyCode == 37) {
				leftPressed = true;
			}
		}

		function keyUpHandler(e) {
			if(e.keyCode == 39) {
				rightPressed = false;
			}
			else if(e.keyCode == 37) {
				leftPressed = false;
			}
		}

		function mouseMoveHandler(e) {
			let relativeX = e.clientX - canvas.offsetLeft;
			if(relativeX > 0 && relativeX < canvas.width) {
				paddleX = relativeX - paddleWidth/2; // so the movement is actually relative to the paddle
			}
		}

		setInterval(draw, 10);
