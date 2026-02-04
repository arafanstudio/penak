<script lang="ts">
	import { Instagram, MessageCircle, Music, Send } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';

	gsap.registerPlugin(ScrollTrigger);

	let footerRef: HTMLElement;
	let socialLinks: HTMLElement[] = [];

	onMount(() => {
		// Animate footer content on scroll
		gsap.from(footerRef?.querySelector('.brand-column'), {
			scrollTrigger: {
				trigger: footerRef,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 0.5,
				markers: false
			},
			opacity: 0,
			x: -40,
			duration: 0.8,
			ease: 'power3.out'
		});

		// Animate link columns
		gsap.from(footerRef?.querySelectorAll('.link-column'), {
			scrollTrigger: {
				trigger: footerRef,
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
	});
</script>

<footer id="tentang" class="bg-black text-white overflow-hidden border-t border-white/5" bind:this={footerRef}>
	<div class="container py-20 md:py-32">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
			<!-- Brand Column -->
			<div class="brand-column lg:col-span-5 space-y-8">
				<a href="/" class="text-2xl font-bold tracking-tight text-white font-['Playfair_Display']">
					penak<span class="text-yellow-200">.</span>online
				</a>
				<p class="text-white/60 text-lg leading-relaxed max-w-md">
					Satu ekosistem untuk segala kebutuhan digitalmu. Kami hadir untuk memberikan kenyamanan dan efisiensi dalam setiap langkah bisnis Anda.
				</p>
				<div class="flex gap-4">
					{#each [
						{ icon: Instagram, label: 'Instagram' },
						{ icon: Music, label: 'TikTok' },
						{ icon: MessageCircle, label: 'WhatsApp' }
					] as social}
					<button 
						class="w-12 h-12 flex items-center justify-center bg-white/5 text-white/90 hover:bg-[#F3E5AB] hover:text-black rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-3"
						aria-label={social.label}
					>
						<svelte:component this={social.icon} size={20} />
					</button>
					{/each}
				</div>
			</div>

			<!-- Links Columns -->
			<div class="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
				<div class="link-column space-y-6">
					<h4 class="text-sm font-bold uppercase tracking-[0.2em] text-yellow-200/80">Layanan</h4>
					<ul class="space-y-4">
						{#each ['Apparel', 'Shortener', 'Dev', 'Store'] as item}
						<li>
							<button class="text-white/60 hover:text-yellow-200 transition-colors cursor-pointer bg-none border-none p-0 text-left text-sm font-medium">
								{item}
							</button>
						</li>
						{/each}
					</ul>
				</div>

				<div class="link-column space-y-6">
					<h4 class="text-sm font-bold uppercase tracking-[0.2em] text-yellow-200/80">Bantuan</h4>
					<ul class="space-y-4">
						{#each ['Cek Pesanan', 'Kontak', 'Kebijakan', 'Syarat'] as item}
							<li>
								<button class="text-white/60 hover:text-yellow-200 transition-colors cursor-pointer bg-none border-none p-0 text-left text-sm font-medium">
									{item}
								</button>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Newsletter -->
				<div class="link-column hidden md:block space-y-6">
					<h4 class="text-sm font-bold uppercase tracking-[0.2em] text-yellow-200/80">Update</h4>
					<p class="text-sm text-white/60">Dapatkan info terbaru dari kami.</p>
					<div class="relative">
						<Input 
							type="email" 
							placeholder="Email Anda" 
							class="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl py-6 px-4 text-sm focus:outline-none focus:border-yellow-200/50 transition-colors"
						/>
						<button class="absolute right-2 top-2 p-2 bg-yellow-200 text-black rounded-lg hover:bg-[#F3E5AB] transition-colors">
							<Send size={18} />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
			<div class="flex flex-wrap justify-center gap-6 text-sm text-white/40">
				<p>© 2026 penak.online. Semua hak dilindungi.</p>
				<button class="hover:text-white transition-colors cursor-pointer bg-none border-none p-0">Privacy Policy</button>
				<button class="hover:text-white transition-colors cursor-pointer bg-none border-none p-0">Terms of Service</button>
			</div>
			<p class="text-sm font-medium text-white/50 italic">Dibuat dengan rasa nyaman ✨</p>
		</div>
	</div>
</footer>
