<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import ImageOff from '@lucide/svelte/icons/image-off';

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

	// 2. Ubah state menjadi lebih deskriptif
	let status = $state<'loading' | 'loaded' | 'error'>('loading');
</script>

<div class="{containerClass} relative grid place-items-center bg-secondary/30">
	{#if status === 'loading'}
		<Skeleton class="absolute inset-0 h-full w-full" />
	{/if}

	{#if status === 'error'}
		<div class="flex flex-col items-center justify-center align-middle text-muted-foreground">
			<ImageOff class="h-8 w-8 text-red-400" />
			<span class="mt-1 text-xs">Gambar gagal dimuat</span>
		</div>
	{/if}

	<img
		{src}
		{alt}
		class="{imgClass} transition-opacity duration-300 {status === 'loaded'
			? 'opacity-100'
			: 'opacity-0'}"
		onload={() => (status = 'loaded')}
		onerror={() => (status = 'error')}
	/>
</div>
