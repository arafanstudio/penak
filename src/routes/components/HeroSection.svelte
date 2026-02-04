<script lang="ts">
    import { Instagram, Twitter } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import Button from '$lib/components/ui/button.svelte';

    let heroContainer: HTMLElement;
    let textContent: HTMLElement;
    let sidebarLeft: HTMLElement;



    onMount(() => {
        const tl = gsap.timeline();

        // Initial state
        gsap.set([textContent.children, sidebarLeft], { opacity: 0 });

        tl.to(textContent.children, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            startAt: { y: 30 }
        })
        .to([sidebarLeft], {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, "-=0.5");
    });
</script>

<section 
    id="hero"
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-black" 
    bind:this={heroContainer}
>
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
        <img 
            src="/images/hero-bg.jpg" 
            alt="Mountain Landscape" 
            class="w-full h-full object-cover opacity-80"
        />
        <!-- Vignette/Gradient Overlay - Top to Bottom -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/95"></div>
        
        <!-- Additional bottom vignette for smoother transition -->
        <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
    </div>
    
    <!-- Social Sidebar (Left) -->
    <div 
        class="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-8 z-20"
        bind:this={sidebarLeft}
    >
        <span class="text-white/60 text-xs font-bold uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
            Follow us
        </span>
        <div class="flex flex-col gap-4">
            <a href="javascript:void(0)" class="text-white/60 hover:text-white transition-colors">
                <Instagram size={20} />
            </a>
            <a href="javascript:void(0)" class="text-white/60 hover:text-white transition-colors">
                <Twitter size={20} />
            </a>
        </div>
    </div>



    <div class="container relative z-10 text-center">
        <div class="max-w-5xl mx-auto space-y-8" bind:this={textContent}>
            <!-- Sub-headline -->
            <div class="flex items-center justify-center gap-4">
                <div class="w-12 h-px bg-yellow-200/50"></div>
                <span class="text-yellow-200 text-xs md:text-sm font-bold tracking-[0.4em] uppercase">
                    Solusi Digital Terpadu di Penak Online
                </span>
            </div>
            
            <!-- Headline -->
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] font-['Playfair_Display']">
                Saatnya Kelola Bisnis Digital Lebih Penak
            </h1>
            
            <!-- CTA Button -->
            <div class="pt-6">
                <Button 
                    variant="default" 
                    class="bg-[#F3E5AB] hover:bg-[#EEDC9A] text-black font-bold px-10 py-7 text-lg rounded-sm transition-all duration-300 shadow-2xl"
                >
                    Pelajari Lebih Lanjut
                </Button>
            </div>
        </div>
    </div>
</section>

<style>
    :global(body) {
        background-color: black;
    }
</style>
