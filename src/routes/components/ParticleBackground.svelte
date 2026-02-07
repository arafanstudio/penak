<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: Particle[] = [];
	let mouse = { x: -1000, y: -1000 };
	let width: number;
	let height: number;
	let animationFrame: number;

	class Particle {
		x: number;
		y: number;
		size: number;
		baseX: number;
		baseY: number;
		vx: number;
		vy: number;
		density: number;
		color: string;

		constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.baseX = x;
			this.baseY = y;
			this.size = Math.random() * 2 + 0.5;
			// Continuous movement velocity
			this.vx = (Math.random() - 0.5) * 0.5;
			this.vy = (Math.random() - 0.5) * 0.5;
			this.density = (Math.random() * 20) + 10;
			this.color = 'rgba(254, 240, 138, 0.25)'; // soft yellow
		}

		draw() {
			if (!ctx) return;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}

		update() {
			// Continuous floating movement
			this.x += this.vx;
			this.y += this.vy;
			this.baseX += this.vx;
			this.baseY += this.vy;

			// Wrap around screen
			if (this.x < 0) { this.x = width; this.baseX = width; }
			if (this.x > width) { this.x = 0; this.baseX = 0; }
			if (this.y < 0) { this.y = height; this.baseY = height; }
			if (this.y > height) { this.y = 0; this.baseY = 0; }

			// Mouse interaction
			let dx = mouse.x - this.x;
			let dy = mouse.y - this.y;
			let distance = Math.sqrt(dx * dx + dy * dy);
			let maxDistance = 120;

			if (distance < maxDistance) {
				let forceDirectionX = dx / distance;
				let forceDirectionY = dy / distance;
				let force = (maxDistance - distance) / maxDistance;
				let directionX = forceDirectionX * force * this.density;
				let directionY = forceDirectionY * force * this.density;
				
				this.x -= directionX;
				this.y -= directionY;
			} else {
				// Return to base path
				if (this.x !== this.baseX) {
					let dx = this.x - this.baseX;
					this.x -= dx / 20;
				}
				if (this.y !== this.baseY) {
					let dy = this.y - this.baseY;
					this.y -= dy / 20;
				}
			}
		}
	}

	function init() {
		particles = [];
		const numberOfParticles = (width * height) / 12000;
		for (let i = 0; i < numberOfParticles; i++) {
			let x = Math.random() * width;
			let y = Math.random() * height;
			particles.push(new Particle(x, y));
		}
	}

	function animate() {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		for (let i = 0; i < particles.length; i++) {
			particles[i].update();
			particles[i].draw();
		}
		animationFrame = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (!parent) return;
		width = parent.offsetWidth;
		height = parent.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		init();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
	}

	function handleMouseLeave() {
		mouse.x = -1000;
		mouse.y = -1000;
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		handleResize();
		animate();

		const parent = canvas.parentElement;
		if (parent) {
			parent.addEventListener('mousemove', handleMouseMove);
			parent.addEventListener('mouseleave', handleMouseLeave);
		}

		window.addEventListener('resize', handleResize);
		
		return () => {
			window.removeEventListener('resize', handleResize);
			if (parent) {
				parent.removeEventListener('mousemove', handleMouseMove);
				parent.removeEventListener('mouseleave', handleMouseLeave);
			}
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 w-full h-full pointer-events-none z-0"
></canvas>

<style>
	canvas {
		filter: blur(0.5px);
	}
</style>
