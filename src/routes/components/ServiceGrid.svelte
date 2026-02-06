<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { urlFor } from '$lib/sanity/client';

	gsap.registerPlugin(ScrollTrigger);

	interface Service {
		id: string;
		title: string;
		image: any;
	}

	export let services: Service[] = [];

	// Fallback jika data belum ada atau kosong
	const defaultServices: Service[] = [
		{
			id: 'apparel',
			title: 'Penak Apparel',
			image: '/images/services/apparel.svg'
		}
	];

	$: displayServices = services && services.length > 0 ? services : defaultServices;

	// Duplicate services for infinite scroll effect
	$: duplicatedServices = [...displayServices, ...displayServices, ...displayServices];

	let carouselContainer: HTMLElement;
	let isHovering = false;
	let isTouching = false;
	let autoScrollTween: gsap.core.Tween | null = null;
	let hoveredCardIndex: number | null = null;

	function startAutoScroll() {
		if (!carouselContainer) return;
		
		const totalWidth = carouselContainer.scrollWidth;
		const scrollDistance = totalWidth / 3;

		if (autoScrollTween) {
			autoScrollTween.kill();
		}

		autoScrollTween = gsap.to(carouselContainer, {
			scrollLeft: scrollDistance,
			duration: 60,
			ease: 'none',
			repeat: -1,
			onRepeat: () => {
				carouselContainer.scrollLeft = 0;
			}
		});
	}

	onMount(() => {
		if (!carouselContainer) return;

		// Tunggu sebentar agar DOM ter-render dengan data baru
		setTimeout(startAutoScroll, 100);

		carouselContainer.addEventListener('mouseenter', () => {
			isHovering = true;
			if (autoScrollTween) autoScrollTween.pause();
		});

		carouselContainer.addEventListener('mouseleave', () => {
			isHovering = false;
			hoveredCardIndex = null;
			if (autoScrollTween) autoScrollTween.resume();
		});

		carouselContainer.addEventListener('touchstart', () => {
			isTouching = true;
			if (autoScrollTween) autoScrollTween.pause();
		});

		carouselContainer.addEventListener('touchend', () => {
			isTouching = false;
			hoveredCardIndex = null;
			if (autoScrollTween) autoScrollTween.resume();
		});

		return () => {
			if (autoScrollTween) autoScrollTween.kill();
		};
	});

	// Re-start animation if services change
	$: if (services && carouselContainer) {
		setTimeout(startAutoScroll, 100);
	}

	function handleCardHover(event: MouseEvent, index: number) {
		if (isHovering) {
			hoveredCardIndex = index;
			const card = event.currentTarget as HTMLElement;
			gsap.to(card, {
				scale: 1.08,
				duration: 0.4,
				ease: 'power2.out',
				overwrite: 'auto'
			});
		}
	}

	function handleCardHoverOut(event: MouseEvent) {
		hoveredCardIndex = null;
		const card = event.currentTarget as HTMLElement;
		gsap.to(card, {
			scale: 1,
			duration: 0.4,
			ease: 'power2.out',
			overwrite: 'auto'
		});
	}

	function handleCardTouchStart(event: TouchEvent, index: number) {
		if (isTouching) {
			hoveredCardIndex = index;
			const card = event.currentTarget as HTMLElement;
			gsap.to(card, {
				scale: 1.08,
				duration: 0.4,
				ease: 'power2.out',
				overwrite: 'auto'
			});
		}
	}

	function handleCardTouchEnd(event: TouchEvent) {
		hoveredCardIndex = null;
		const card = event.currentTarget as HTMLElement;
		gsap.to(card, {
			scale: 1,
			duration: 0.4,
			ease: 'power2.out',
			overwrite: 'auto'
		});
	}

	function getImageUrl(image: any) {
		if (typeof image === 'string') return image;
		try {
			return urlFor(image).url();
		} catch (e) {
			return '/images/services/apparel.svg'; // fallback
		}
	}
</script>

<section id="layanan" class="bg-black py-24 relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-b from-black/95 via-black/30 to-black/95 z-0 pointer-events-none"></div>
	
	<div class="relative z-10">
		<div class="max-w-3xl mx-auto text-center mb-16 space-y-4 px-4">
			<div class="text-yellow-200/80 text-sm font-bold tracking-[0.2em] uppercase">Ekosistem Kami</div>
			<h3 class="text-3xl md:text-5xl font-extrabold text-white leading-tight font-['Playfair_Display']">
				Pilih layanan yang <br class="hidden md:block" /> kamu butuhkan
			</h3>
			<p class="text-lg text-white/60 leading-relaxed">
				Satu platform untuk semua kebutuhan digital Anda. Kami menyediakan solusi yang terintegrasi untuk membantu bisnis Anda tumbuh lebih cepat.
			</p>
		</div>

		<div class="carousel-outer-wrapper overflow-hidden">
			<div 
				bind:this={carouselContainer}
				class="carousel-inner flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
				style="scroll-behavior: auto; padding: 1rem 0;"
			>
				{#each duplicatedServices as service, index (index)}
					<div
						class="card-wrapper flex-shrink-0"
						on:mouseenter={(e) => handleCardHover(e, index)}
						on:mouseleave={handleCardHoverOut}
						on:touchstart={(e) => handleCardTouchStart(e, index)}
						on:touchend={handleCardTouchEnd}
						role="button"
						tabindex="0"
					>
						<div class="relative w-64 md:w-80 h-96 rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 group">
							<div class="absolute inset-0 flex items-center justify-center p-12 transition-transform duration-700 group-hover:scale-110">
									<img
										src={getImageUrl(service.image)}
										alt={service.title}
										class="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(254,240,138,0.3)]"
									/>
							</div>

							<div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

							<div class="absolute inset-0 flex items-end justify-center pb-8">
								<h4 class="text-2xl md:text-3xl font-bold text-white text-center px-4 drop-shadow-lg">
									{service.title}
								</h4>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/50 to-transparent z-20 pointer-events-none"></div>
			<div class="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/50 to-transparent z-20 pointer-events-none"></div>
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

	.carousel-outer-wrapper {
		position: relative;
		overflow: visible;
		padding: 1rem 0;
	}

	.carousel-inner {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	@media (min-width: 768px) {
		.carousel-inner {
			padding-left: 2rem;
			padding-right: 2rem;
		}
	}

	.card-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		will-change: transform;
	}

	.card-wrapper > div {
		will-change: transform;
		transform-origin: center;
	}
</style>
