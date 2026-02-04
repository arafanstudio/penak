<script lang="ts">
    import { Menu, X, User } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import Button from '$lib/components/ui/button.svelte';

    let isMenuOpen = $state(false);
    let isScrolled = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            const menuOverlay = document.querySelector('.mobile-menu-overlay');
            if (menuOverlay) {
                gsap.fromTo(menuOverlay, 
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
                gsap.fromTo(menuOverlay.querySelectorAll('a, button'),
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08 }
                );
            }
        } else {
            document.body.style.overflow = '';
            const menuOverlay = document.querySelector('.mobile-menu-overlay');
            if (menuOverlay) {
                gsap.to(menuOverlay, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' });
            }
        }
    }

    function closeMenu() {
        isMenuOpen = false;
        document.body.style.overflow = '';
    }

    onMount(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 20;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = '';
        };
    });

    const navLinks = [
        { name: 'Layanan', href: '#layanan' },
        { name: 'Cara Kerja', href: '#cara-kerja' },
        { name: 'Tentang', href: '#tentang' }
    ];
</script>

<header 
    class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out
    {isScrolled || isMenuOpen ? 'py-3' : 'py-6'}"
>
    <!-- Background & Border Layer -->
    <div 
        class="absolute inset-0 -z-10 transition-all duration-500 ease-in-out
        {isScrolled || isMenuOpen ? 'opacity-100' : 'opacity-0'}"
    >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-xl"></div>
        <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
    </div>

    <div class="container flex items-center justify-between relative z-10">
        <!-- Logo -->
        <a href="/" class="text-2xl font-black tracking-widest text-white z-[110] uppercase font-['Playfair_Display']">
            PENAK<span class="text-yellow-200">.</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-12">
            {#each navLinks as link}
                <a 
                    href={link.href} 
                    class="text-sm font-medium text-white/70 hover:text-yellow-200 transition-colors duration-200"
                >
                    {link.name}
                </a>
            {/each}
        </nav>

        <!-- Right Side -->
        <div class="flex items-center space-x-3 md:space-x-5 z-[110]">
            <a href="/account" class="hidden md:flex items-center gap-2 text-sm font-medium text-white/70 hover:text-yellow-200 transition-colors">
                <User size={18} />
                Account
            </a>
            
            <!-- Mobile Menu Toggle -->
            <button 
                class="md:hidden p-2.5 text-white hover:bg-white/10 rounded-xl transition-all"
                onclick={toggleMenu}
                aria-label="Toggle Menu"
            >
                {#if isMenuOpen}
                    <X size={24} />
                {:else}
                    <Menu size={24} />
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    {#if isMenuOpen}
        <div 
            class="mobile-menu-overlay md:hidden fixed inset-0 bg-black z-[100] flex flex-col pt-24 px-6"
        >
            <nav class="flex flex-col space-y-6">
                {#each navLinks as link}
                    <a 
                        href={link.href} 
                        class="text-2xl font-bold text-white hover:text-yellow-200 transition-colors border-b border-white/10 pb-4"
                        onclick={closeMenu}
                    >
                        {link.name}
                    </a>
                {/each}
                <div class="pt-6">
                    <Button class="w-full h-12 text-lg rounded-2xl shadow-lg bg-yellow-200 text-black hover:bg-[#F3E5AB]">
                        Account
                    </Button>
                </div>
            </nav>
            
            <div class="mt-auto pb-12 text-center">
                <p class="text-white/40 text-sm">© 2026 penak.online. Semua hak dilindungi.</p>
            </div>
        </div>
    {/if}
</header>
