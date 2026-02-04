<script lang="ts">
	import { Shirt, Link2, Code2, ShoppingBag, ArrowRight, Zap, Globe, ShieldCheck } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Badge from '$lib/components/ui/badge.svelte';
	import Card from '$lib/components/ui/card.svelte';

	gsap.registerPlugin(ScrollTrigger);

	interface Service {
		id: string;
		title: string;
		description: string;
		icon: any;
		category: 'bisnis' | 'tools' | 'dev';
		badge?: {
			text: string;
			variant: 'default' | 'secondary' | 'destructive' | 'outline';
		};
	}

	const services: Service[] = [
		{
			id: 'apparel',
			title: 'Penak Apparel',
			description: 'Kelola sistem Pre-Order untuk merchandise dengan mudah. Terima pesanan, kelola stok, dan kirim produk tanpa ribet.',
			icon: Shirt,
			category: 'bisnis',
			badge: {
				text: 'Populer',
				variant: 'default'
			}
		},
		{
			id: 'shortener',
			title: 'Penak Shortener',
			description: 'Perpendek link panjang menjadi URL yang ringkas dan mudah dibagikan. Pantau analytics dan klik secara real-time.',
			icon: Link2,
			category: 'tools'
		},
		{
			id: 'dev',
			title: 'Penak Dev',
			description: 'Layanan custom web development untuk kebutuhan spesifik bisnis Anda. Dari landing page hingga aplikasi kompleks.',
			icon: Code2,
			category: 'dev'
		},
		{
			id: 'store',
			title: 'Penak Store',
			description: 'Katalog produk eksklusif dengan sistem Pre-Order terintegrasi. Jual produk limited edition dengan sistem yang handal.',
			icon: ShoppingBag,
			category: 'bisnis',
			badge: {
				text: 'Segera Hadir',
				variant: 'secondary'
			}
		}
	];

	let sectionRef: HTMLElement;
	let serviceCards: HTMLElement[] = [];
	let activeCategory: 'semua' | 'bisnis' | 'tools' | 'dev' = 'semua';

	$: filteredServices = activeCategory === 'semua' 
		? services 
		: services.filter(s => s.category === activeCategory);

	onMount(() => {
		// Animate section header
		const headerElements = sectionRef?.querySelectorAll('.section-header > *');
		gsap.from(headerElements, {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 0.5,
				markers: false
			},
			opacity: 0,
			y: 30,
			stagger: 0.1,
			duration: 0.8,
			ease: 'power3.out'
		});

		// Initial animation for cards
		animateCards();
	});

	function animateCards() {
		setTimeout(() => {
			gsap.from(serviceCards.filter(Boolean), {
				opacity: 0,
				y: 30,
				scale: 0.95,
				stagger: 0.1,
				duration: 0.5,
				ease: 'power2.out',
				overwrite: 'auto'
			});
		}, 50);
	}

	function setCategory(cat: typeof activeCategory) {
		activeCategory = cat;
		animateCards();
	}
</script>

<section id="layanan" class="bg-black py-24 relative overflow-hidden" bind:this={sectionRef}>
	<!-- Gradient Overlay to match Hero -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/95 via-black/30 to-black/95 z-0 pointer-events-none"></div>
	
	<div class="container relative z-10">
		<!-- Section Header -->
		<div class="section-header max-w-3xl mx-auto text-center mb-12 md:mb-16 space-y-4">
			<div class="text-yellow-200/80 text-sm font-bold tracking-[0.2em] uppercase">Ekosistem Kami</div>
			<h3 class="text-3xl md:text-5xl font-extrabold text-white leading-tight font-['Playfair_Display']">
				Pilih layanan yang <br class="hidden md:block" /> kamu butuhkan
			</h3>
			<p class="text-lg text-white/60 leading-relaxed">
				Satu platform untuk semua kebutuhan digital Anda. Kami menyediakan solusi yang terintegrasi untuk membantu bisnis Anda tumbuh lebih cepat.
			</p>
		</div>

		<!-- Interactive Filter Tabs -->
		<div class="flex flex-wrap justify-center gap-2 mb-12">
			{#each ['semua', 'bisnis', 'tools', 'dev'] as cat}
				<button 
					class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 
					{activeCategory === cat 
						? 'bg-[#F3E5AB] border-[#F3E5AB] text-black shadow-lg shadow-yellow-200/20 scale-105' 
						: 'bg-white/5 border-transparent text-white/60 hover:border-yellow-200/30 hover:text-yellow-200'}"
					onclick={() => setCategory(cat as any)}
				>
					{cat.charAt(0).toUpperCase() + cat.slice(1)}
				</button>
			{/each}
		</div>

		<!-- Service Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
			{#each filteredServices as service, index (service.id)}
				<div bind:this={serviceCards[index]}>
					<Card class="group h-full flex flex-col p-8 md:p-10 rounded-[2rem] border border-white/10 hover:border-yellow-200/20 hover:shadow-2xl hover:shadow-yellow-200/5 transition-all duration-500 bg-white/5 backdrop-blur-sm">
						<!-- Badge & Icon -->
						<div class="flex items-start justify-between mb-8">
							<div class="inline-flex p-4 bg-yellow-200/10 text-yellow-200 rounded-2xl group-hover:bg-[#F3E5AB] group-hover:text-black group-hover:rotate-6 transition-all duration-500">
								<svelte:component this={service.icon} size={28} />
							</div>
							{#if service.badge}
								<Badge variant={service.badge.variant} class="font-bold bg-yellow-200/20 text-yellow-200 border-none">
									{service.badge.text}
								</Badge>
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-grow space-y-4">
							<h4 class="text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
								{service.title}
							</h4>
							<p class="text-white/60 text-sm leading-relaxed">
								{service.description}
							</p>
						</div>

						<!-- Features List -->
						<div class="mt-6 space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-white/40">
								<Zap size={14} class="text-yellow-500" />
								<span>Proses Instan</span>
							</div>
							<div class="flex items-center gap-2 text-xs font-medium text-white/40">
								<ShieldCheck size={14} class="text-green-500" />
								<span>Aman & Terpercaya</span>
							</div>
						</div>

						<!-- Link -->
						<div class="mt-8 pt-6 border-t border-white/10">
							<a href={`#${service.id}`} class="inline-flex items-center text-sm font-bold text-white hover:text-[#F3E5AB] transition-colors group/link">
								Buka Layanan
								<ArrowRight size={18} class="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
							</a>
						</div>
					</Card>
				</div>
			{/each}
		</div>
	</div>
</section>
