<script lang="ts" module>
	import { cn } from "$lib/utils.js";

	export const cardClasses = "rounded-xl border bg-card text-card-foreground shadow";
	export const cardHeaderClasses = "flex flex-col space-y-1.5 p-6";
	export const cardTitleClasses = "font-semibold leading-none tracking-tight";
	export const cardDescriptionClasses = "text-sm text-muted-foreground";
	export const cardContentClasses = "p-6 pt-0";
	export const cardFooterClasses = "flex items-center p-6 pt-0";
</script>

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {}

	let { class: className, children, ...rest }: Props = $props();
</script>

<div class={cn(cardClasses, className)} {...rest}>
	{@render children?.()}
</div>
