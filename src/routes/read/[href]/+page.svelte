<script lang="ts">
	import { onMount } from 'svelte';
	import GalleryHorizontal from '@lucide/svelte/icons/gallery-horizontal';
	import GalleryThumbnails from '@lucide/svelte/icons/gallery-thumbnails';
	import Expand from '@lucide/svelte/icons/expand';
	import ArrowBigLeft from '@lucide/svelte/icons/arrow-big-left';
	import ArrowBigRight from '@lucide/svelte/icons/arrow-big-right';
	import Shrink from '@lucide/svelte/icons/shrink';

	import {
		Carousel,
		CarouselContent,
		CarouselItem,
		CarouselNext,
		CarouselPrevious
	} from '$lib/components/ui/carousel';
	import LazyImage from '$lib/components/LazyImage.svelte';

	let { data } = $props();
	const { comicRead } = $derived(data);

	let mode = $state<'scroll' | 'swipe'>('scroll');
	let isFullscreen = $state(false);
	let fullscreenContainer: HTMLDivElement;

	const comicPages = $derived(comicRead?.panel ?? ['']);
	const title = $derived(comicRead?.title ?? 'Judul Komik');
	const prev = $derived(comicRead?.prev.slice(1, -1) ?? '#');
	const next = $derived(comicRead?.next.slice(1, -1) ?? '#');

	function switchToSwipeMode() {
		mode = 'swipe';
		// Request fullscreen after state has updated
		setTimeout(() => fullscreenContainer?.requestFullscreen(), 0);
	}

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			fullscreenContainer?.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	}

	function handleFullscreenChange() {
		isFullscreen = document.fullscreenElement !== null;
		if (!isFullscreen && mode === 'swipe') {
			mode = 'scroll';
		}
	}

	onMount(() => {
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});
</script>

<div bind:this={fullscreenContainer} class="relative flex h-full w-full flex-col bg-gray-900">
	{#if !isFullscreen}
		<div class="flex flex-col items-center gap-2 p-4">
			<p class="max-w-4xl text-center text-white md:text-[1.2rem]">
				Nikmati pengalaman membaca komik <b>{title}</b>
				secara gratis dengan kualitas gambar terbaik. Baca manga, manhwa, dan manhu dalam bahasa Indonesia
				hanya di Mangaloom.
			</p>
			<h2 class="max-w-4xl text-center font-bold text-white md:text-[1.5rem]">{title}</h2>
			<div class="flex flex-col gap-2">
				<div class="flex gap-2">
					<button class="group flex cursor-pointer items-center gap-2 rounded-md bg-primary p-2">
						<GalleryHorizontal class="h-4 w-4 text-black" />
						<span class="text-sm font-bold text-black">Mode Scroll</span>
					</button>
					<button
						onclick={switchToSwipeMode}
						class="group flex cursor-pointer items-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
					>
						<GalleryThumbnails class="h-4 w-4 text-white group-hover:text-black" />
						<span class="text-sm font-bold text-white group-hover:text-black">Mode Swipe</span>
					</button>
				</div>
				<button
					onclick={toggleFullscreen}
					class="group flex cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
				>
					<Expand class="h-4 w-4 text-white group-hover:text-black" />
					<span class="text-sm font-bold text-white group-hover:text-black">Fullscreen</span>
				</button>
				<div class="flex w-full gap-2">
					{#if prev !== ''}
						<a
							data-sveltekit-preload-data="tap"
							href={`/read/${prev}`}
							class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
						>
							<ArrowBigLeft class="h-4 w-4 text-white group-hover:text-black" />
							<span class="text-sm font-bold text-white group-hover:text-black">Prev</span>
						</a>
					{:else}
						<div
							class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-secondary p-2"
						>
							<span class="text-sm font-bold text-white">Chapter Pertama</span>
						</div>
					{/if}
					{#if next !== ''}
						<a
							data-sveltekit-preload-data="tap"
							href={`/read/${next}`}
							class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
						>
							<ArrowBigRight class="h-4 w-4 text-white group-hover:text-black" />
							<span class="text-sm font-bold text-white group-hover:text-black">next</span>
						</a>
					{:else}
						<div
							class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-secondary p-2"
						>
							<span class="text-sm font-bold text-white">Chapter Terakhir</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<div class="flex-grow overflow-y-auto" class:bg-black={isFullscreen}>
		{#if mode === 'scroll'}
			<div class="flex w-full flex-col items-center">
				{#each comicPages as item (item)}
					<div
						class="flex w-full flex-col items-center justify-center"
						class:lg:mx-auto={!isFullscreen}
						class:lg:max-w-4xl={!isFullscreen}
					>
						<LazyImage
							src={item}
							alt={`${title} - ${item}`}
							class={`w-full max-w-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
						/>
					</div>
				{/each}
			</div>
		{:else if mode === 'swipe'}
			<Carousel class="flex h-full w-full items-center">
				<CarouselContent>
					{#each comicPages as page, i (page)}
						<CarouselItem class="flex items-center justify-center">
							<img src={page} alt="Comic Page {i + 1}" class="h-screen object-contain" />
						</CarouselItem>
					{/each}
				</CarouselContent>
				<CarouselPrevious
					class="absolute left-2 h-10 w-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
				/>
				<CarouselNext
					class="absolute right-2 h-10 w-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
				/>
			</Carousel>
		{/if}
	</div>

	{#if isFullscreen}
		<button
			onclick={toggleFullscreen}
			class="fixed right-5 bottom-5 z-50 cursor-pointer rounded-full bg-primary p-2 text-white backdrop-blur-sm transition-colors hover:bg-white"
			aria-label="Exit fullscreen"
		>
			<Shrink class="h-6 w-6 text-black" />
		</button>
	{/if}
</div>
