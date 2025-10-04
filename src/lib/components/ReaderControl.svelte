<script lang="ts">
	import GalleryHorizontal from '@lucide/svelte/icons/gallery-horizontal';
	import GalleryThumbnails from '@lucide/svelte/icons/gallery-thumbnails';
	import Expand from '@lucide/svelte/icons/expand';
	import ArrowBigLeft from '@lucide/svelte/icons/arrow-big-left';
	import ArrowBigRight from '@lucide/svelte/icons/arrow-big-right';

	let { title, prev, next, onSwitchToSwipe, onToggleFullscreen } = $props<{
		title: string;
		prev: string;
		next: string;
		onSwitchToSwipe: () => void;
		onToggleFullscreen: () => void;
	}>();
</script>

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
				onclick={onSwitchToSwipe}
				class="group flex cursor-pointer items-center gap-2 rounded-md bg-secondary p-2 hover:bg-primary"
			>
				<GalleryThumbnails class="h-4 w-4 text-white group-hover:text-black" />
				<span class="text-sm font-bold text-white group-hover:text-black">Mode Swipe</span>
			</button>
		</div>
		<button
			onclick={onToggleFullscreen}
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
