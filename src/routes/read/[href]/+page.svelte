<script lang="ts">
	import { onMount } from 'svelte';
	// Hapus impor ikon yang sudah dipindah ke ReaderControls
	import Shrink from '@lucide/svelte/icons/shrink';
	import {
		Carousel,
		CarouselContent,
		CarouselItem,
		CarouselNext,
		CarouselPrevious
	} from '$lib/components/ui/carousel';
	import LazyImage from '$lib/components/LazyImage.svelte';
	import ReaderControls from '$lib/components/ReaderControl.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { sourceStore } from '$lib/stores/sourceStore.js';
	import { addOrUpdateHistory, type ChapterHistory } from '$lib/db/database';
	import { layoutMetadata } from '$lib/utils/metatagHelper.js';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
	const { comicRead, chapterList, detailHref, currentChapterHref } = $derived(data);
	let currentSource = $derived($sourceStore);

	let mode = $state<'scroll' | 'swipe'>('scroll');
	let isFullscreen = $state(false);
	let fullscreenContainer = $state<HTMLDivElement>();

	const comicPages = $derived(comicRead?.panel ?? ['']);
	const title = $derived(comicRead?.title ?? 'Judul Komik');
	const prev = $derived(
		`${comicRead?.prev.slice(1, -1) !== '' ? `${comicRead?.prev.slice(1, -1) ?? '#'}?detailHref=${detailHref}&source=${currentSource}` : '#'}`
	);
	const next = $derived(
		`${comicRead?.next.slice(1, -1) !== '' ? `${comicRead?.next.slice(1, -1) ?? '#'}?detailHref=${detailHref}&source=${currentSource}` : '#'}`
	);

	function switchToSwipeMode() {
		mode = 'swipe';

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

	function titleToSlug(title: string): string {
		if (!title) return '';
		return (
			title
				.toLowerCase()
				// Ganti spasi dengan tanda hubung
				.replace(/\s+/g, '-')
				// Hapus semua karakter yang BUKAN huruf, angka, tanda hubung, atau titik
				.replace(/[^\w.-]+/g, '')
		);
	}
	$effect(() => {
		// Pastikan semua data yang dibutuhkan sudah ada
		if (!comicRead || !detailHref || !chapterList || chapterList.length === 0) {
			return;
		}

		// Cari data chapter lengkap dari chapterList untuk mendapatkan 'date'
		const fullChapterData = chapterList.find((ch) => ch.href === titleToSlug(comicRead.title));

		// Buat objek riwayat yang akan disimpan
		const historyData: ChapterHistory = {
			title: comicRead.title,
			href: titleToSlug(comicRead.title),
			date: fullChapterData?.date ?? '',
			isHasBeenRead: true,
			downloadUrl: '',
			komikHref: detailHref,
			sourceType: currentSource,
			readAt: new Date()
		};

		// Panggil fungsi untuk menyimpan ke IndexedDB
		addOrUpdateHistory(historyData)
			.then(() => {
				console.log(`Riwayat untuk chapter "${historyData.title}" disimpan/diperbarui.`);
			})
			.catch((err) => {
				console.error('Gagal menyimpan riwayat chapter:', err);
			});
	});

	onMount(() => {
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});
</script>

{#if data.comicRead && !data.error}
	<Seo metatag={layoutMetadata(`${title} — Mangaloom`, `Nikmatin chapter ${title} - Mangaloom`)} />
{/if}

{#if data.error}
	<ErrorDisplay message={data.error} />
{:else}
	<div bind:this={fullscreenContainer} class="relative flex h-full w-full flex-col bg-gray-900">
		{#if !isFullscreen}
			<ReaderControls
				{title}
				{prev}
				{next}
				onSwitchToSwipe={switchToSwipeMode}
				onToggleFullscreen={toggleFullscreen}
				chapterList={chapterList ?? []}
				{currentChapterHref}
				{detailHref}
			/>
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

					{#if !isFullscreen && comicPages.length > 0}
						<ReaderControls
							{title}
							{prev}
							{next}
							onSwitchToSwipe={switchToSwipeMode}
							onToggleFullscreen={toggleFullscreen}
							chapterList={chapterList ?? []}
							{currentChapterHref}
							{detailHref}
						/>
					{/if}
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
{/if}
