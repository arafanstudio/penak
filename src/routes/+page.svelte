<script lang="ts">
		import HeroSection from './components/HeroSection.svelte';
		import ServiceGrid from './components/ServiceGrid.svelte';
		
		export let data;
		$: ({ services } = data);
	import ProcessSection from './components/ProcessSection.svelte';
	import InteractiveSection from './components/InteractiveSection.svelte';
	import FooterSection from './components/FooterSection.svelte';
	import PaginationSidebar from './components/PaginationSidebar.svelte';
</script>

<PaginationSidebar />
<HeroSection />
<ServiceGrid {services} />
	<InteractiveSection />
	<ProcessSection />
<FooterSection />
