<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { Terminal, Copy, RotateCcw } from 'lucide-svelte';

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
				'  clear           - Clear terminal',
				'  about           - About Penak Online'
			],
			description: 'Show available commands'
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
			if (terminalLines.length === 0 && !isAutoTyping) {
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
	<!-- Background gradient -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/95 via-black/30 to-black/95 z-0 pointer-events-none"></div>

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
			<div class="relative bg-black border-2 border-yellow-200/40 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-200/20">
				<!-- Terminal header -->
				<div class="bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-b border-yellow-200/30 px-6 py-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-3 h-3 rounded-full bg-red-500"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div class="w-3 h-3 rounded-full bg-green-500"></div>
						<span class="ml-4 text-yellow-200 text-sm font-mono">penak@terminal:~$</span>
					</div>
					<div class="flex items-center gap-2">
						<button
							on:click={copyToClipboard}
							class="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-200 hover:text-yellow-100"
							title="Copy output"
						>
							<Copy size={18} />
						</button>
						<button
							on:click={clearTerminal}
							class="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-200 hover:text-yellow-100"
							title="Clear terminal"
						>
							<RotateCcw size={18} />
						</button>
					</div>
				</div>

				<!-- Terminal output -->
				<div
					bind:this={outputRef}
					class="bg-black p-6 font-mono text-sm text-yellow-200 h-96 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-yellow-200/30 scrollbar-track-black"
				>
					{#each terminalLines as line, idx (idx)}
						<div class="whitespace-pre-wrap break-words">
							{#if line.type === 'input'}
								<span class="text-yellow-300 font-bold">{line.content}</span>
							{:else if line.type === 'output'}
								<span class="text-white/80">{line.content}</span>
							{:else}
								<span class="text-yellow-200">{line.content}</span>
								{#if line.isTyping}
									<span class="animate-pulse">▌</span>
								{/if}
							{/if}
						</div>
					{/each}
				</div>

				<!-- Terminal input -->
				<div class="bg-black border-t border-yellow-200/30 px-6 py-4 flex items-center gap-2">
					<span class="text-yellow-200 font-mono font-bold">$</span>
					<input
						bind:this={inputRef}
						bind:value={currentInput}
						on:keydown={handleKeyDown}
						type="text"
						placeholder="Type a command..."
						class="flex-1 bg-transparent text-yellow-200 font-mono outline-none placeholder-yellow-600/50 caret-yellow-200"
						autocomplete="off"
					/>
				</div>
			</div>

			<!-- Hint text -->
			<div class="mt-6 text-center text-white/40 text-sm font-mono">
				💡 Tip: Try typing <span class="text-yellow-200">help</span>, <span class="text-yellow-200">ls</span>, or <span class="text-yellow-200">order apparel</span>
			</div>
		</div>
	</div>
</section>

<style>
	::-webkit-scrollbar {
		width: 8px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: rgba(250, 204, 21, 0.3);
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: rgba(250, 204, 21, 0.5);
	}

	@keyframes blink {
		0%, 49% {
			opacity: 1;
		}
		50%, 100% {
			opacity: 0;
		}
	}

	.animate-pulse {
		animation: blink 1s infinite;
	}
</style>
