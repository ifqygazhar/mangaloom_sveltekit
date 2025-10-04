<script lang="ts">
	import GalleryHorizontal from '@lucide/svelte/icons/gallery-horizontal';
	import GalleryThumbnails from '@lucide/svelte/icons/gallery-thumbnails';
	import Expand from '@lucide/svelte/icons/expand';
	import ArrowBigLeft from '@lucide/svelte/icons/arrow-big-left';
	import ArrowBigRight from '@lucide/svelte/icons/arrow-big-right';
	import ChapterSelect from './ChapterSelect.svelte';
	import type { ChapterItemType } from '$lib/api/types/ChapterItemType';

	let {
		title,
		prev,
		next,
		onSwitchToSwipe,
		onToggleFullscreen,
		chapterList,
		currentChapterHref,
		detailHref
	} = $props<{
		title: string;
		prev: string;
		next: string;
		onSwitchToSwipe: () => void;
		onToggleFullscreen: () => void;
		chapterList: ChapterItemType[];
		currentChapterHref: string;
		detailHref: string;
	}>();
</script>

<div class="flex flex-col items-center gap-2 p-4">
	<p class="max-w-4xl text-center text-white md:text-[1.2rem]">
		Nikmati pengalaman membaca komik <b>{title}</b>
		secara gratis dengan kualitas gambar terbaik.
	</p>
	<h2 class="max-w-4xl text-center font-bold text-white md:text-[1.5rem]">{title}</h2>
	<div class="flex w-full max-w-md flex-col items-center gap-2">
		<div class="flex w-full gap-2">
			<button
				class="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary p-2"
			>
				<GalleryHorizontal class="h-4 w-4 text-black" />
				<span class="text-sm font-bold text-black">Mode Scroll</span>
			</button>
			<button
				onclick={onSwitchToSwipe}
				class="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
			>
				<GalleryThumbnails class="h-4 w-4 text-white group-hover:text-black" />
				<span class="text-sm font-bold text-white group-hover:text-black">Mode Swipe</span>
			</button>
		</div>
		<button
			onclick={onToggleFullscreen}
			class="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
		>
			<Expand class="h-4 w-4 text-white group-hover:text-black" />
			<span class="text-sm font-bold text-white group-hover:text-black">Fullscreen</span>
		</button>

		<ChapterSelect chapters={chapterList} currentHref={currentChapterHref} {detailHref} />

		<div class="flex w-full gap-2">
			<a
				href={prev}
				class:pointer-events-none={prev === '#'}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md p-2"
				class:bg-secondary={prev !== '#'}
				class:hover:bg-primary={prev !== '#'}
				class:bg-gray-600={prev === '#'}
				class:cursor-not-allowed={prev === '#'}
			>
				<ArrowBigLeft class="h-4 w-4 text-white group-hover:text-black" />
				<span class="text-sm font-bold text-white group-hover:text-black">Prev</span>
			</a>
			<a
				href={next}
				class:pointer-events-none={next === '#'}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md p-2"
				class:bg-secondary={next !== '#'}
				class:hover:bg-primary={next !== '#'}
				class:bg-gray-600={next === '#'}
				class:cursor-not-allowed={next === '#'}
			>
				<ArrowBigRight class="h-4 w-4 text-white group-hover:text-black" />
				<span class="text-sm font-bold text-white group-hover:text-black">Next</span>
			</a>
		</div>
	</div>
</div>
