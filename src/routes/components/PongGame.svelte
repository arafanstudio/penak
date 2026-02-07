<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	// Reduced dimensions to fit better in terminal
	const width = 500;
	const height = 300;
	const paddleWidth = 8;
	const paddleHeight = 60;
	const ballSize = 6;

	let playerY = height / 2 - paddleHeight / 2;
	let computerY = height / 2 - paddleHeight / 2;
	let ballX = width / 2;
	let ballY = height / 2;
	let ballDX = 3.5;
	let ballDY = 3.5;
		let playerScore = 0;
		let computerScore = 0;
		let gameOver = false;
		let winner = '';
	
		let keys: Record<string, boolean> = {};

	function resetBall() {
		ballX = width / 2;
		ballY = height / 2;
		ballDX = -ballDX;
		ballDY = (Math.random() - 0.5) * 6;
	}

		function update() {
			if (gameOver) return;
			// Player movement with W and S keys
			if ((keys['w'] || keys['W']) && playerY > 0) playerY -= 5;
			if ((keys['s'] || keys['S']) && playerY < height - paddleHeight) playerY += 5;

		// Computer movement (simple AI)
		const computerCenter = computerY + paddleHeight / 2;
		if (computerCenter < ballY - 10 && computerY < height - paddleHeight) computerY += 3.5;
		if (computerCenter > ballY + 10 && computerY > 0) computerY -= 3.5;

		// Ball movement
		ballX += ballDX;
		ballY += ballDY;

		// Ball collision (top/bottom)
		if (ballY < 0 || ballY > height - ballSize) ballDY = -ballDY;

		// Ball collision (paddles)
		if (
			ballX < paddleWidth &&
			ballY > playerY &&
			ballY < playerY + paddleHeight
		) {
			ballDX = -ballDX;
			ballX = paddleWidth;
		}

		if (
			ballX > width - paddleWidth - ballSize &&
			ballY > computerY &&
			ballY < computerY + paddleHeight
		) {
			ballDX = -ballDX;
			ballX = width - paddleWidth - ballSize;
		}

			// Scoring
			if (ballX < 0) {
				computerScore++;
				if (computerScore >= 5) {
					gameOver = true;
					winner = 'COMPUTER';
				} else {
					resetBall();
				}
			}
			if (ballX > width) {
				playerScore++;
				if (playerScore >= 5) {
					gameOver = true;
					winner = 'PLAYER';
				} else {
					resetBall();
				}
			}
		}

		function draw() {
			if (!ctx) return;
	
			// Clear canvas
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, width, height);

			if (gameOver) {
				ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
				ctx.fillRect(0, 0, width, height);
				ctx.fillStyle = '#facc15';
				ctx.font = '30px monospace';
				ctx.textAlign = 'center';
				ctx.fillText('GAME OVER', width / 2, height / 2 - 10);
				ctx.font = '16px monospace';
				ctx.fillText(`${winner} WINS!`, width / 2, height / 2 + 20);
				ctx.fillText('Press R to restart', width / 2, height / 2 + 50);
				ctx.textAlign = 'left'; // Reset
				return;
			}

		// Draw middle line
		ctx.setLineDash([5, 10]);
		ctx.beginPath();
		ctx.moveTo(width / 2, 0);
		ctx.lineTo(width / 2, height);
		ctx.strokeStyle = 'rgba(250, 204, 21, 0.2)';
		ctx.stroke();
		ctx.setLineDash([]);

		// Draw paddles
		ctx.fillStyle = '#facc15';
		ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
		ctx.fillRect(width - paddleWidth, computerY, paddleWidth, paddleHeight);

		// Draw ball
		ctx.fillRect(ballX, ballY, ballSize, ballSize);

		// Draw scores
		ctx.font = '24px monospace';
		ctx.fillText(playerScore.toString(), width / 4, 40);
		ctx.fillText(computerScore.toString(), (3 * width) / 4, 40);
	}

	function gameLoop() {
		update();
		draw();
		animationFrameId = requestAnimationFrame(gameLoop);
	}

		function handleKeyDown(e: KeyboardEvent) {
			const key = e.key.toLowerCase();
			keys[e.key] = true;

			if (gameOver && key === 'r') {
				playerScore = 0;
				computerScore = 0;
				gameOver = false;
				resetBall();
				return;
			}

			if (e.key === 'Escape') {
				dispatch('exit');
			}
		}

	function handleKeyUp(e: KeyboardEvent) {
		keys[e.key] = false;
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		gameLoop();
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
		cancelAnimationFrame(animationFrameId);
	});
</script>

<div class="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden border border-yellow-200/30">
	<div class="absolute top-2 left-4 text-yellow-200/50 text-[10px] font-mono">
		W/S to move • ESC to exit
	</div>
	<canvas
		bind:this={canvas}
		{width}
		{height}
		class="max-w-full h-auto border border-yellow-200/10"
	></canvas>
</div>
