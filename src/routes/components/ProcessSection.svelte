<script lang="ts">
	import { Search, CreditCard, CheckCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';

	gsap.registerPlugin(ScrollTrigger);

	interface Step {
		number: string;
		title: string;
		description: string;
		icon: any;
	}

	const steps: Step[] = [
		{
			number: '01',
			title: 'Pilih Layanan',
			description: 'Tentukan apa yang kamu butuhkan dari ekosistem Penak. Dari pre-order hingga shortener link.',
			icon: Search
		},
		{
			number: '02',
			title: 'Input & Bayar',
			description: 'Isi data yang diperlukan dan bayar secara instan via QRIS. Proses cepat, aman, dan otomatis.',
			icon: CreditCard
		},
		{
			number: '03',
			title: 'Pantau & Terima',
			description: 'Cek progres pesananmu secara real-time hingga selesai. Notifikasi otomatis di setiap tahap.',
			icon: CheckCircle
		}
	];

	let sectionRef: HTMLElement;
	let stepCards: HTMLElement[] = [];
	let ctaSection: HTMLElement;

	onMount(() => {
		// Animate section header
		const headerElements = sectionRef?.querySelector('.process-header');
		if (headerElements) {
			gsap.from(Array.from(headerElements.children), {
				scrollTrigger: {
					trigger: sectionRef,
					start: 'top 80%',
					end: 'top 20%',
					scrub: 0.5,
					markers: false
				},
				opacity: 0,
				x: -30,
				stagger: 0.1,
				duration: 0.8,
				ease: 'power3.out'
			});
		}

		// Animate step cards with stagger
		if (stepCards.length > 0) {
			gsap.from(stepCards.filter(Boolean), {
				scrollTrigger: {
					trigger: sectionRef,
					start: 'top 70%',
					end: 'top 10%',
					scrub: 0.5,
					markers: false
				},
				opacity: 0,
				y: 50,
				rotationX: 90,
				stagger: 0.15,
				duration: 0.8,
				ease: 'power3.out'
			});
		}

		// Animate CTA section
		if (ctaSection) {
			gsap.from(ctaSection, {
				scrollTrigger: {
					trigger: ctaSection,
					start: 'top 80%',
					end: 'top 20%',
					scrub: 0.5,
					markers: false
				},
				opacity: 0,
				y: 40,
				duration: 0.8,
				ease: 'power3.out'
			});
		}
	});
</script>

<section id="cara-kerja" class="bg-black py-24" bind:this={sectionRef}>
	<div class="container">
		<!-- Section Header -->
		<div class="process-header flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-24">
			<div class="max-w-2xl space-y-4">
				<div class="text-yellow-200/80 text-sm font-bold tracking-[0.2em] uppercase">Cara Kerja</div>
				<h3 class="text-3xl md:text-5xl font-extrabold text-white leading-tight font-['Playfair_Display']">
					Semudah itu, <br class="hidden md:block" /> Se-penak itu.
				</h3>
			</div>
			<p class="text-lg text-white/60 max-w-md lg:pb-2">
				Tiga langkah sederhana untuk mendapatkan layanan yang Anda butuhkan tanpa ribet.
			</p>
		</div>

		<!-- Steps Grid / Mobile Carousel -->
		<div class="mobile-carousel-container -mx-5 px-5 lg:mx-0 lg:px-0">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 relative 
				flex overflow-x-auto lg:grid snap-x snap-mandatory scroll-smooth pb-8 lg:pb-0">
				<!-- Connection Line (Desktop) -->
				<div class="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-white/10 -z-10"></div>

				{#each steps as step, index}
					<div 
						class="relative group min-w-[85%] lg:min-w-0 snap-center"
						bind:this={stepCards[index]}
					>
						<Card class="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-12 transition-all duration-500 hover:bg-white/10 hover:border-yellow-200/20 hover:shadow-2xl hover:shadow-yellow-200/5 overflow-hidden backdrop-blur-sm h-full">
							<!-- Step Number Background -->
							<span class="absolute -top-4 -right-4 text-8xl font-black text-white/5 group-hover:text-yellow-200/5 transition-colors pointer-events-none">
								{step.number}
							</span>
							
							<!-- Step Number Badge -->
							<div class="absolute top-8 right-10 w-12 h-12 rounded-full bg-yellow-200/10 flex items-center justify-center group-hover:bg-yellow-200/20 transition-colors">
								<span class="text-xl font-bold text-yellow-200">
									{step.number}
								</span>
							</div>

							<!-- Icon -->
							<div class="mb-10 inline-flex p-5 bg-white/5 text-yellow-200 rounded-2xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/10">
								<svelte:component this={step.icon} size={32} />
							</div>

							<!-- Content -->
							<div class="space-y-4 relative z-10">
								<h4 class="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors">
									{step.title}
								</h4>
								<p class="text-white/60 leading-relaxed group-hover:text-white/90 transition-colors">
									{step.description}
								</p>
							</div>
						</Card>
						
						<!-- Arrow (Desktop only now, mobile uses carousel) -->
						<!-- We hide the vertical arrow on mobile as it's now a horizontal carousel -->
					</div>
				{/each}
			</div>
		</div>

		<!-- CTA Bottom -->
		<div class="mt-20 md:mt-32 p-8 md:p-20 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-8 overflow-hidden relative shadow-2xl backdrop-blur-md" bind:this={ctaSection}>
			<div class="absolute top-0 left-0 w-full h-full grid-pattern opacity-5"></div>
			<div class="absolute -top-24 -left-24 w-64 h-64 bg-yellow-200/10 rounded-full blur-[100px]"></div>
			<div class="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]"></div>
			
			<div class="relative z-10 space-y-8">
				<h4 class="text-3xl md:text-5xl font-bold text-white tracking-tight font-['Playfair_Display']">Siap untuk memulai pengalaman baru?</h4>
				<p class="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
					Bergabunglah dengan ribuan pengguna lainnya yang telah merasakan kemudahan layanan kami.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
					<Button variant="default" size="lg" class="w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-xl bg-yellow-200 text-black hover:bg-[#F3E5AB] shadow-xl shadow-yellow-200/20 transition-all duration-300">
						Daftar Sekarang
					</Button>
					
					<Button 
						variant="outline" 
						size="lg" 
						class="w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-xl border-2 border-white/20 bg-transparent hover:bg-white/10 text-white transition-all duration-300"
					>
						Hubungi Kami
					</Button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@media (max-width: 1023px) {
		.mobile-carousel-container {
			overflow: hidden;
		}
		.flex {
			display: flex;
			gap: 1rem;
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
		.snap-center {
			scroll-snap-align: center;
			scroll-snap-stop: always;
		}
	}
</style>
