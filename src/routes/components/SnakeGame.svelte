<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	const width = 500;
	const height = 300;
	const gridSize = 20;
	const tileCountX = width / gridSize;
	const tileCountY = height / gridSize;

	let snake = [{ x: 10, y: 10 }];
	let food = { x: 15, y: 10 };
	let dx = 0;
	let dy = 0;
	let nextDx = 0;
	let nextDy = 0;
	let score = 0;
	let gameOver = false;
	let lastUpdateTime = 0;
	const updateInterval = 100; // ms

	function resetGame() {
		snake = [{ x: 10, y: 10 }];
		food = getRandomFoodPosition();
		dx = 0;
		dy = 0;
		nextDx = 0;
		nextDy = 0;
		score = 0;
		gameOver = false;
	}

	function getRandomFoodPosition() {
		let newFood;
		while (true) {
			newFood = {
				x: Math.floor(Math.random() * tileCountX),
				y: Math.floor(Math.random() * tileCountY)
			};
			// Check if food is on snake
			const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
			if (!onSnake) break;
		}
		return newFood;
	}

	function update(timestamp: number) {
		if (gameOver) return;

		if (timestamp - lastUpdateTime < updateInterval) return;
		lastUpdateTime = timestamp;

		// Update direction from nextDx/nextDy to prevent 180 degree turns in one tick
		dx = nextDx;
		dy = nextDy;

		if (dx === 0 && dy === 0) return;

		const head = { x: snake[0].x + dx, y: snake[0].y + dy };

		// Wall collision
		if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
			gameOver = true;
			return;
		}

		// Self collision
		if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
			gameOver = true;
			return;
		}

		snake.unshift(head);

		// Food collision
		if (head.x === food.x && head.y === food.y) {
			score += 10;
			food = getRandomFoodPosition();
		} else {
			snake.pop();
		}
	}

	function draw() {
		if (!ctx) return;

		// Clear canvas
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, width, height);

		// Draw grid (optional, very faint)
		ctx.strokeStyle = 'rgba(250, 204, 21, 0.05)';
		for (let i = 0; i < width; i += gridSize) {
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineTo(i, height);
			ctx.stroke();
		}
		for (let i = 0; i < height; i += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(width, i);
			ctx.stroke();
		}

		// Draw snake
		snake.forEach((segment, index) => {
			ctx.fillStyle = index === 0 ? '#facc15' : '#ca8a04';
			ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
		});

		// Draw food
		ctx.fillStyle = '#ef4444';
		ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);

		// Draw score
		ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
		ctx.font = '16px monospace';
		ctx.textAlign = 'right';
		ctx.fillText(`Score: ${score}`, width - 10, 25);
		ctx.textAlign = 'left'; // Reset for other text

		if (gameOver) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
			ctx.fillRect(0, 0, width, height);
			ctx.fillStyle = '#facc15';
			ctx.font = '30px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('GAME OVER', width / 2, height / 2 - 10);
			ctx.font = '16px monospace';
			ctx.fillText(`Final Score: ${score}`, width / 2, height / 2 + 20);
			ctx.fillText('Press R to restart', width / 2, height / 2 + 50);
		}
	}

	function gameLoop(timestamp: number) {
		update(timestamp);
		draw();
		animationFrameId = requestAnimationFrame(gameLoop);
	}

	function handleKeyDown(e: KeyboardEvent) {
		const key = e.key.toLowerCase();
		
		if (gameOver && key === 'r') {
			resetGame();
			return;
		}

		if (key === 'escape') {
			dispatch('exit');
			return;
		}

		// Prevent 180 degree turns - WASD only
		if (key === 'w' && dy === 0) {
			nextDx = 0;
			nextDy = -1;
		} else if (key === 's' && dy === 0) {
			nextDx = 0;
			nextDy = 1;
		} else if (key === 'a' && dx === 0) {
			nextDx = -1;
			nextDy = 0;
		} else if (key === 'd' && dx === 0) {
			nextDx = 1;
			nextDy = 0;
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		window.addEventListener('keydown', handleKeyDown);
		animationFrameId = requestAnimationFrame(gameLoop);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyDown);
		cancelAnimationFrame(animationFrameId);
	});
</script>

<div class="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden border border-yellow-200/30">
	<div class="absolute top-2 left-4 text-yellow-200/50 text-[10px] font-mono">
		WASD to move • ESC to exit
	</div>
	<canvas
		bind:this={canvas}
		{width}
		{height}
		class="max-w-full h-auto border border-yellow-200/10"
	></canvas>
</div>
