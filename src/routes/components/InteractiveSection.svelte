<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { Terminal, Copy, RotateCcw } from 'lucide-svelte';
	import PongGame from './PongGame.svelte';
	import SnakeGame from './SnakeGame.svelte';
	import TetrisGame from './TetrisGame.svelte';
	import ParticleBackground from './ParticleBackground.svelte';

	gsap.registerPlugin(ScrollTrigger);

	interface TerminalLine {
		type: 'input' | 'output' | 'system';
		content: string;
		isTyping?: boolean;
	}

	let terminalRef: HTMLElement;
	let inputRef: HTMLInputElement;
	let outputRef: HTMLElement;
	let currentInput = '';
	let terminalLines: TerminalLine[] = [];
	let isAutoTyping = false;
	let isPlayingPong = false;
	let isPlayingSnake = false;
	let isPlayingTetris = false;
	let autoTypeTimeout: NodeJS.Timeout;
	let idleTimeout: NodeJS.Timeout;

	const commands = {
		ls: {
			output: [
				'penak-apparel/          Pre-Order Management System',
				'penak-shortener/        URL Shortener & Analytics',
				'penak-dev/              Custom Web Development',
				'penak-store/            E-commerce Platform',
				'penak-docs/             Documentation & Guides'
			],
			description: 'List all available services'
		},
		help: {
			output: [
				'Available commands:',
				'  ls              - List all services',
				'  order <service> - Place an order (try: order apparel)',
				'  info <service>  - Get service details',
				'  contact         - Contact information',
				'  game            - List available games',
				'  play <game>     - Play a game (try: play pong)',
				'  clear           - Clear terminal',
				'  about           - About Penak Online'
			],
			description: 'Show available commands'
		},
		game: {
			output: [
				'Available games:',
				'  pong            - Classic Pong game',
				'  snake           - Retro Snake game',
				'  tetris          - Classic Tetris game',
				'',
				'Type "play <game>" to start!'
			],
			description: 'List available games'
		},
		about: {
			output: [
				'╔════════════════════════════════════════╗',
				'║         PENAK ONLINE v1.0              ║',
				'║  Making Digital Life More Comfortable  ║',
				'╚════════════════════════════════════════╝',
				'',
				'Built with ❤️ by the Penak Dev Team',
				'Tech Stack: Svelte + GSAP + Node.js',
				'Status: Production Ready ✓'
			],
			description: 'About Penak Online'
		},
		contact: {
			output: [
				'📧 Email: hello@penak.online',
				'💬 Discord: discord.gg/penak',
				'🐦 Twitter: @penak_online',
				'📱 WhatsApp: +62 812-3456-7890',
				'🌐 Website: penak.online'
			],
			description: 'Contact information'
		},
		clear: {
			output: [],
			description: 'Clear terminal'
		}
	};

	const orderCommands: Record<string, string[]> = {
		apparel: [
			'📦 Penak Apparel - Pre-Order System',
			'Link: https://apparel.penak.online',
			'Status: ✓ Active',
			'Features: Easy management, real-time tracking, secure payment'
		],
		shortener: [
			'🔗 Penak Shortener - URL Shortener',
			'Link: https://short.penak.online',
			'Status: ✓ Active',
			'Features: Analytics, custom aliases, QR codes'
		],
		dev: [
			'💻 Penak Dev - Custom Development',
			'Link: https://dev.penak.online',
			'Status: ✓ Active',
			'Features: Full-stack solutions, responsive design, SEO-ready'
		],
		store: [
			'🛍️ Penak Store - E-commerce Platform',
			'Link: https://store.penak.online',
			'Status: Coming Soon 🚀',
			'Features: Inventory management, multi-channel selling'
		]
	};

	const infoCommands: Record<string, string[]> = {
		apparel: [
			'Service: Penak Apparel',
			'Description: Comprehensive pre-order management system',
			'Perfect for: Merchandise sellers, limited edition drops',
			'Key Features:',
			'  • Automated order processing',
			'  • Real-time inventory tracking',
			'  • Secure payment gateway',
			'  • Customer notifications'
		],
		shortener: [
			'Service: Penak Shortener',
			'Description: Powerful URL shortening with analytics',
			'Perfect for: Marketing campaigns, social media',
			'Key Features:',
			'  • Custom short URLs',
			'  • Click analytics & tracking',
			'  • QR code generation',
			'  • Real-time statistics'
		],
		dev: [
			'Service: Penak Dev',
			'Description: Custom web development services',
			'Perfect for: Startups, enterprises, digital transformation',
			'Tech Stack:',
			'  • Frontend: React, Svelte, Vue',
			'  • Backend: Node.js, Python, Go',
			'  • Database: PostgreSQL, MongoDB',
			'  • Deployment: AWS, Vercel, Docker'
		],
		store: [
			'Service: Penak Store',
			'Description: Modern e-commerce platform',
			'Perfect for: Online retailers, dropshippers',
			'Coming Soon Features:',
			'  • Multi-vendor support',
			'  • Advanced inventory management',
			'  • Payment gateway integration',
			'  • Mobile-optimized checkout'
		]
	};

	const autoIntroduction = [
		'$ Welcome to Penak Online Terminal',
		'$ Type "help" to see available commands',
		'$ Or try: ls, order apparel, info dev',
		'$ Type "about" to learn more about us',
		'$ ',
		'$ Initializing ecosystem...',
		'$ ✓ All services operational',
		'$ ✓ Ready to serve you'
	];

	function addLine(type: TerminalLine['type'], content: string, isTyping = false) {
		terminalLines = [...terminalLines, { type, content, isTyping }];
		scrollToBottom();
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (outputRef) {
				outputRef.scrollTop = outputRef.scrollHeight;
			}
		}, 0);
	}

	function typeText(text: string, callback?: () => void) {
		isAutoTyping = true;
		let index = 0;
		const lineIndex = terminalLines.length - 1;

		const typeNextChar = () => {
			if (index < text.length) {
				terminalLines[lineIndex].content = text.substring(0, index + 1);
				terminalLines = terminalLines;
				index++;
				autoTypeTimeout = setTimeout(typeNextChar, 30);
			} else {
				terminalLines[lineIndex].isTyping = false;
				terminalLines = terminalLines;
				isAutoTyping = false;
				scrollToBottom();
				if (callback) callback();
			}
		};

		typeNextChar();
	}

	function processCommand(cmd: string) {
		const trimmedCmd = cmd.trim().toLowerCase();

		if (!trimmedCmd) return;

		// Add user input
		addLine('input', `$ ${cmd}`);
		currentInput = '';

		if (trimmedCmd === 'clear') {
			terminalLines = [];
			return;
		}

		if (trimmedCmd === 'play' || trimmedCmd === 'play pong') {
			addLine('output', 'Starting Pong game...');
			setTimeout(() => {
				isPlayingPong = true;
			}, 500);
			return;
		}

		if (trimmedCmd === 'play snake') {
			addLine('output', 'Starting Snake game...');
			setTimeout(() => {
				isPlayingSnake = true;
			}, 500);
			return;
		}

		if (trimmedCmd === 'play tetris') {
			addLine('output', 'Starting Tetris game...');
			setTimeout(() => {
				isPlayingTetris = true;
			}, 500);
			return;
		}

		// Check for order commands
		if (trimmedCmd.startsWith('order ')) {
			const service = trimmedCmd.slice(6).trim();
			if (orderCommands[service]) {
				orderCommands[service].forEach(line => addLine('output', line));
			} else {
				addLine('output', `Error: Unknown service "${service}". Try: order apparel, order shortener, order dev, order store`);
			}
			return;
		}

		// Check for info commands
		if (trimmedCmd.startsWith('info ')) {
			const service = trimmedCmd.slice(5).trim();
			if (infoCommands[service]) {
				infoCommands[service].forEach(line => addLine('output', line));
			} else {
				addLine('output', `Error: Unknown service "${service}". Try: info apparel, info shortener, info dev, info store`);
			}
			return;
		}

		// Check for built-in commands
		if (commands[trimmedCmd as keyof typeof commands]) {
			const cmd_obj = commands[trimmedCmd as keyof typeof commands];
			if (cmd_obj.output.length > 0) {
				cmd_obj.output.forEach(line => addLine('output', line));
			}
			return;
		}

		// Unknown command
		addLine('output', `Command not found: ${cmd}`);
		addLine('output', 'Type "help" for available commands');
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (isPlayingPong || isPlayingSnake || isPlayingTetris) return; // Ignore terminal input while playing

		if (e.key === 'Enter') {
			e.preventDefault();
			processCommand(currentInput);
			clearIdleTimeout();
			resetIdleTimeout();
		}
	}

	function clearIdleTimeout() {
		if (idleTimeout) clearTimeout(idleTimeout);
		if (autoTypeTimeout) clearTimeout(autoTypeTimeout);
	}

	function resetIdleTimeout() {
		clearIdleTimeout();
		idleTimeout = setTimeout(() => {
			if (terminalLines.length === 0 && !isAutoTyping && !isPlayingPong && !isPlayingSnake && !isPlayingTetris) {
				autoTypeIntroduction();
			}
		}, 3000);
	}

	function autoTypeIntroduction() {
		let delay = 0;
		autoIntroduction.forEach((line, idx) => {
			setTimeout(() => {
				addLine('system', '', true);
				typeText(line, () => {
					if (idx === autoIntroduction.length - 1) {
						resetIdleTimeout();
					}
				});
			}, delay);
			delay += line.length * 30 + 500;
		});
	}

	function clearTerminal() {
		terminalLines = [];
		currentInput = '';
		clearIdleTimeout();
		resetIdleTimeout();
	}

	function copyToClipboard() {
		const text = terminalLines.map(line => line.content).join('\n');
		navigator.clipboard.writeText(text);
		alert('Terminal output copied to clipboard!');
	}

	onMount(() => {
		// Animate terminal entrance
		gsap.from(terminalRef, {
			scrollTrigger: {
				trigger: terminalRef,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 1
			},
			opacity: 0,
			y: 50,
			scale: 0.95,
			ease: 'power3.out'
		});

		// Don't auto-focus on mount to prevent page jump
		// inputRef?.focus();

		// Start idle timeout
		resetIdleTimeout();

		return () => {
			clearIdleTimeout();
		};
	});
</script>

<section id="terminal" class="bg-black py-24 relative overflow-hidden">
<!-- Background gradient and particles -->
		<div class="absolute inset-0 bg-gradient-to-b from-black/95 via-black/30 to-black/95 z-0">
			<ParticleBackground />
		</div>

	<div class="container relative z-10">
		<!-- Section Header -->
		<div class="text-center mb-12 space-y-4">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-200/10 border border-yellow-200/30 text-yellow-200 text-sm font-bold uppercase tracking-widest">
				<Terminal size={16} />
				<span>Developer Experience</span>
			</div>
			<h2 class="text-4xl md:text-5xl font-black text-white font-['Playfair_Display']">
				Penak Terminal
			</h2>
			<p class="text-white/60 text-lg max-w-2xl mx-auto">
				Jelajahi ekosistem kami melalui command-line interface. Ketik perintah atau biarkan terminal berbicara sendiri.
			</p>
		</div>

		<!-- Floating Terminal -->
		<div
			bind:this={terminalRef}
			class="relative mx-auto max-w-3xl"
		>
			<!-- Terminal glow effect -->
			<div class="absolute -inset-1 bg-gradient-to-r from-yellow-200/20 to-yellow-500/20 rounded-2xl blur-2xl opacity-50"></div>

			<!-- Terminal window -->
			<div class="relative bg-[#0a0a0a] border border-yellow-200/30 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
				<!-- Window Header -->
				<div class="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-yellow-200/10">
					<div class="flex gap-2">
						<div class="w-3 h-3 rounded-full bg-red-500/50"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
						<div class="w-3 h-3 rounded-full bg-green-500/50"></div>
					</div>
					<div class="text-xs font-mono text-white/40 flex items-center gap-2">
						<Terminal size={12} />
						bash — 80x24
					</div>
					<div class="flex gap-3">
						<button
							on:click={copyToClipboard}
							class="text-white/40 hover:text-yellow-200 transition-colors"
							title="Copy output"
						>
							<Copy size={14} />
						</button>
						<button
							on:click={clearTerminal}
							class="text-white/40 hover:text-yellow-200 transition-colors"
							title="Reset terminal"
						>
							<RotateCcw size={14} />
						</button>
					</div>
				</div>

				<!-- Terminal Body -->
				<div
					bind:this={outputRef}
					class="flex-1 p-6 font-mono text-sm overflow-y-auto scrollbar-hide"
				>
					{#if isPlayingPong}
						<PongGame on:exit={() => isPlayingPong = false} />
					{:else if isPlayingSnake}
						<SnakeGame on:exit={() => isPlayingSnake = false} />
					{:else if isPlayingTetris}
						<TetrisGame on:exit={() => isPlayingTetris = false} />
					{:else}
						<div class="space-y-2">
							{#each terminalLines as line}
								<div class="flex gap-2 {line.type === 'input' ? 'text-yellow-200' : line.type === 'system' ? 'text-white/40' : 'text-white/80'}">
									<span class="whitespace-pre-wrap">{line.content}</span>
									{#if line.isTyping}
										<span class="w-2 h-4 bg-yellow-200 animate-pulse"></span>
									{/if}
								</div>
							{/each}

							{#if !isAutoTyping}
								<div class="flex gap-2 text-yellow-200">
									<span>$</span>
<input
											bind:this={inputRef}
											bind:value={currentInput}
											on:keydown={handleKeyDown}
											class="flex-1 bg-transparent border-none outline-none p-0 text-yellow-200"
										/>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Terminal Footer -->
				<div class="px-4 py-2 bg-white/5 border-t border-yellow-200/10 flex justify-between items-center">
					<div class="text-[10px] font-mono text-white/20">
						Connected to penak-v1.0.0-stable
					</div>
					<div class="text-[10px] font-mono text-white/20">
						UTF-8
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	input {
		caret-shape: block;
	}
</style>
