<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	const COLS = 10;
	const ROWS = 20;
	const BLOCK_SIZE = 14; // Smaller to fit in terminal
	const width = COLS * BLOCK_SIZE;
	const height = ROWS * BLOCK_SIZE;

	const SHAPES = [
		[[1, 1, 1, 1]], // I
		[[1, 1], [1, 1]], // O
		[[0, 1, 0], [1, 1, 1]], // T
		[[1, 0, 0], [1, 1, 1]], // L
		[[0, 0, 1], [1, 1, 1]], // J
		[[0, 1, 1], [1, 1, 0]], // S
		[[1, 1, 0], [0, 1, 1]]  // Z
	];

	const COLORS = [
		'#facc15', // yellow-400
		'#eab308', // yellow-500
		'#ca8a04', // yellow-600
		'#a16207', // yellow-700
		'#854d0e', // yellow-800
		'#713f12', // yellow-900
		'#fef08a'  // yellow-200
	];

	let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
	let currentPiece = null;
	let currentPos = { x: 0, y: 0 };
	let currentType = 0;
	let score = 0;
	let gameOver = false;
	let lastDropTime = 0;
	let dropInterval = 800;

	function createPiece() {
		const type = Math.floor(Math.random() * SHAPES.length);
		const shape = SHAPES[type];
		currentType = type;
		currentPiece = shape;
		currentPos = {
			x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
			y: 0
		};

		if (checkCollision(currentPos.x, currentPos.y, currentPiece)) {
			gameOver = true;
		}
	}

	function checkCollision(x: number, y: number, piece: number[][]) {
		for (let r = 0; r < piece.length; r++) {
			for (let c = 0; c < piece[r].length; c++) {
				if (piece[r][c]) {
					let newX = x + c;
					let newY = y + r;
					if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
						return true;
					}
				}
			}
		}
		return false;
	}

	function rotate(piece: number[][]) {
		const newPiece = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
		return newPiece;
	}

	function merge() {
		currentPiece.forEach((row, r) => {
			row.forEach((value, c) => {
				if (value) {
					board[currentPos.y + r][currentPos.x + c] = currentType + 1;
				}
			});
		});
	}

	function clearLines() {
		let linesCleared = 0;
		for (let r = ROWS - 1; r >= 0; r--) {
			if (board[r].every(cell => cell !== 0)) {
				board.splice(r, 1);
				board.unshift(Array(COLS).fill(0));
				linesCleared++;
				r++;
			}
		}
		if (linesCleared > 0) {
			score += [0, 100, 300, 500, 800][linesCleared];
			dropInterval = Math.max(100, 800 - Math.floor(score / 500) * 50);
		}
	}

	function drop() {
		if (gameOver) return;
		if (!checkCollision(currentPos.x, currentPos.y + 1, currentPiece)) {
			currentPos.y++;
		} else {
			merge();
			clearLines();
			createPiece();
		}
	}

	function move(dir: number) {
		if (!checkCollision(currentPos.x + dir, currentPos.y, currentPiece)) {
			currentPos.x += dir;
		}
	}

	function handleRotate() {
		const rotated = rotate(currentPiece);
		if (!checkCollision(currentPos.x, currentPos.y, rotated)) {
			currentPiece = rotated;
		}
	}

	function update(timestamp: number) {
		if (gameOver) return;
		if (timestamp - lastDropTime > dropInterval) {
			drop();
			lastDropTime = timestamp;
		}
	}

	function draw() {
		if (!ctx) return;

		// Clear
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw board
		board.forEach((row, r) => {
			row.forEach((cell, c) => {
				if (cell) {
					ctx.fillStyle = COLORS[cell - 1];
					ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
				} else {
					ctx.strokeStyle = 'rgba(250, 204, 21, 0.05)';
					ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
				}
			});
		});

		// Draw current piece
		if (currentPiece) {
			ctx.fillStyle = COLORS[currentType];
			currentPiece.forEach((row, r) => {
				row.forEach((value, c) => {
					if (value) {
						ctx.fillRect((currentPos.x + c) * BLOCK_SIZE, (currentPos.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
					}
				});
			});
		}

		// Draw score
		ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
		ctx.font = '12px monospace';
		ctx.textAlign = 'left';
		ctx.fillText(`Score: ${score}`, 5, 15);

		if (gameOver) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#facc15';
			ctx.font = '16px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
			ctx.font = '12px monospace';
			ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
			ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 30);
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
			board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
			score = 0;
			gameOver = false;
			createPiece();
			return;
		}

		if (key === 'escape') {
			dispatch('exit');
			return;
		}

		if (gameOver) return;

		if (key === 'a') move(-1);
		if (key === 'd') move(1);
		if (key === 's') drop();
		if (key === 'w') handleRotate();
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		createPiece();
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
		A/D: Move • W: Rotate • S: Drop • ESC: Exit
	</div>
	<canvas
		bind:this={canvas}
		{width}
		{height}
		class="border border-yellow-200/10"
	></canvas>
</div>
