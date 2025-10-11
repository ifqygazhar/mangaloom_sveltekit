<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import ImageOff from '@lucide/svelte/icons/image-off';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	interface LazyImageProps {
		src: string;
		alt: string;
		class?: string;
		containerClass?: string;
		width?: number;
		height?: number;
		quality?: number;
		format?: 'webp' | 'jpeg' | 'png' | 'avif';
		useSharp?: boolean;
		loading?: 'lazy' | 'eager';
	}

	let {
		src,
		alt,
		class: imgClass = '',
		containerClass = '',
		width = 0,
		height = 0,
		quality = 80,
		format = 'webp',
		useSharp = true,
		loading = 'lazy'
	}: LazyImageProps = $props();

	let status = $state<'loading' | 'loaded' | 'error'>('loading');

	const optimizedSrc = $derived(() => {
		if (!useSharp) return src;

		const isExternalUrl = src.startsWith('http://') || src.startsWith('https://');
		if (!isExternalUrl) return src;

		const params = new SvelteURLSearchParams();
		params.set('url', src);
		if (width > 0) params.set('w', width.toString());
		if (height > 0) params.set('h', height.toString());
		params.set('q', quality.toString());
		params.set('f', format);

		return `/api/image?${params.toString()}`;
	});
</script>

<div class="{containerClass} relative grid place-items-center bg-secondary/30">
	{#if status === 'loading'}
		<Skeleton class="absolute inset-0 h-full w-full" />
	{/if}

	{#if status === 'error'}
		<div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
			<ImageOff class="h-8 w-8 text-red-400" />
			<span class="mt-1 text-xs">Gambar gagal dimuat</span>
		</div>
	{/if}

	<img
		src={optimizedSrc()}
		{alt}
		{loading}
		class="{imgClass} transition-opacity duration-300 {status === 'loaded'
			? 'opacity-100'
			: 'opacity-0'}"
		onload={() => (status = 'loaded')}
		onerror={() => (status = 'error')}
	/>
</div>
