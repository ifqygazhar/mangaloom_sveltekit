<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	let {
		src,
		alt,
		class: imgClass = '',
		containerClass = ''
	} = $props<{
		src: string;
		alt: string;
		class?: string;
		containerClass?: string;
	}>();

	let loaded = $derived(false);
</script>

<div class="{containerClass} relative">
	{#if !loaded}
		<Skeleton class="absolute inset-0 h-full w-full {containerClass}" />
	{/if}

	<img
		{src}
		{alt}
		class="{imgClass} transition-opacity duration-300 {loaded ? 'opacity-100' : 'opacity-0'}"
		onload={() => (loaded = true)}
		onerror={() => (loaded = true)}
	/>
</div>
