<script lang="ts">
    import { onMount } from 'svelte';

    interface Section {
        number: string;
        id: string;
        label: string;
    }

    const sections: Section[] = [
        { number: '01', id: 'hero', label: 'Hero' },
        { number: '02', id: 'layanan', label: 'Services' },
        { number: '03', id: 'terminal', label: 'Terminal' },
        { number: '04', id: 'cara-kerja', label: 'Process' },
        { number: '05', id: 'tentang', label: 'Footer' }
    ];

    let activeIndex = 0;
    let progressPercentage = 0;

    function scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateProgress() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Find which section is currently most visible
        let currentIndex = 0;
        let maxVisibility = 0;

        for (let i = 0; i < sections.length; i++) {
            const element = document.getElementById(sections[i].id);
            if (element) {
                const elementTop = element.offsetTop;
                const elementHeight = element.offsetHeight;
                const elementBottom = elementTop + elementHeight;
                
                // Calculate how much of this section is visible
                const visibleTop = Math.max(scrollPosition, elementTop);
                const visibleBottom = Math.min(scrollPosition + windowHeight, elementBottom);
                const visibility = Math.max(0, visibleBottom - visibleTop);
                
                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    currentIndex = i;
                }
            }
        }
        
        activeIndex = currentIndex;

        // Calculate progress percentage within the current section
        const activeElement = document.getElementById(sections[activeIndex].id);
        if (activeElement) {
            const elementTop = activeElement.offsetTop;
            const elementHeight = activeElement.offsetHeight;
            
            // Progress within the current section (0 to 1)
            let sectionProgress = (scrollPosition - elementTop) / (elementHeight - (activeIndex === sections.length - 1 ? windowHeight : 0));
            sectionProgress = Math.max(0, Math.min(1, sectionProgress));
            
            // If it's the last section, we want it to reach 100% at the bottom
            if (activeIndex === sections.length - 1) {
                const maxScroll = documentHeight - windowHeight;
                if (scrollPosition >= maxScroll - 10) {
                    sectionProgress = 1;
                }
            }

            progressPercentage = sectionProgress * 100;
        }
    }

    onMount(() => {
        // Initial update
        setTimeout(() => {
            updateProgress();
        }, 100);
        
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    });
</script>

<!-- Slider/Pagination (Right) - Fixed Position -->
<div 
    class="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col items-end gap-6 z-30 pointer-events-none"
>
    <div class="flex flex-col items-end gap-4 pointer-events-auto">
        {#each sections as section, index}
            <div class="flex flex-col items-end gap-4">
                <!-- Section Indicator -->
                <button
                    on:click={() => scrollToSection(section.id)}
                    class="text-white/40 hover:text-white text-xs font-bold transition-all duration-300 cursor-pointer bg-none border-none p-0 hover:scale-110 transform {activeIndex === index ? 'text-white scale-110' : ''}"
                    title="Go to {section.label}"
                >
                    {section.number}
                </button>
                
                <!-- Vertical Progress Line - positioned under indicator -->
                {#if activeIndex === index}
                    <div 
                        class="w-px bg-white/20 relative transition-all duration-500 ease-out"
                        style="height: 80px;"
                    >
                        <!-- White progress indicator inside the line -->
                        <div 
                            class="absolute top-0 left-0 w-full bg-white transition-all duration-150 ease-out"
                            style="height: {progressPercentage}%;"
                        ></div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    :global(body) {
        background-color: black;
    }
</style>
