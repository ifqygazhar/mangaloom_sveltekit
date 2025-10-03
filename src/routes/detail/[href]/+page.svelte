<script lang="ts">
	import Star from '@lucide/svelte/icons/star';
	import Eye from '@lucide/svelte/icons/eye';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { get } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import { SourceType } from '$lib/config/sourceType';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Book from '@lucide/svelte/icons/book';
	import type { GenreItemType } from '$lib/api/types/GenreItemType';
	import type { ChapterItemType } from '$lib/api/types/ChapterItemType.js';
	import { resolve } from '$app/paths';

	let { data } = $props();
	const { comicDetail } = data;

	const firstChapter: ChapterItemType = comicDetail.chapter[comicDetail.chapter.length - 1];
	const lastChapter: ChapterItemType = comicDetail.chapter[0];

	const cleanFirstChapterHref = firstChapter.href.slice(1, -1);
	const cleanLastChapterHref = lastChapter.href.slice(1, -1);

	const title: string = comicDetail.title;
	const description: string = comicDetail.description;
	const author: string = comicDetail.author;
	const status: string = comicDetail.status;
	const type: string = comicDetail.type;
	const released: string = comicDetail.released;
	const rating: string = comicDetail.rating;
	const genre: GenreItemType[] = comicDetail.genre;
	const thumbnail: string = comicDetail.thumbnail;
	const chapters: ChapterItemType[] = comicDetail.chapter;
	const altTitle: string = comicDetail.altTitle;

	let currentSource = $state(get(sourceStore));
	const unsub = sourceStore.subscribe((v) => (currentSource = v));
	onDestroy(() => unsub());
</script>

<div class="flex flex-col gap-2 p-4">
	<div
		class="relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-cover bg-center"
		style="background-image: url('{thumbnail}');"
	>
		<div class="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>

		<div class="relative z-10 flex w-full flex-row items-start gap-4 p-4 md:p-6">
			<div class="flex flex-1 flex-col gap-3">
				<h2 class="text-xl font-bold text-white md:text-2xl">{title}</h2>
				<p class="text-sm text-neutral-300">{altTitle}</p>
				<p class="text-xs text-neutral-300">{author} | {status} | {type} | {released}</p>

				<div class="flex flex-row items-center gap-2">
					<p class="font-bold text-white">Rating:</p>
					<div class="flex items-center gap-1">
						{#if currentSource === SourceType.V3}
							<Eye class="h-4 w-4 text-yellow-400" />
						{:else}
							<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
						{/if}
						<p class="font-bold text-white">{rating}</p>
					</div>
				</div>
				<button
					class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:w-[30.5rem]"
				>
					<Bookmark class="h-5 w-5" />
					<span>Bookmark</span>
				</button>
				<div class="flex flex-col justify-start gap-2 md:flex-row">
					<a
						href={resolve('/read/[href]', { href: cleanFirstChapterHref })}
						class="group hover:aria-2 flex items-center justify-center gap-2 rounded-md bg-primary p-2 hover:border-2 hover:border-primary hover:bg-transparent md:w-[15rem]"
					>
						<Book class="h-5 w-5 text-black group-hover:text-white" />
						<span class="text-black group-hover:text-white">Chapter Pertama</span>
					</a>
					<a
						href={resolve('/read/[href]', { href: cleanLastChapterHref })}
						class="group hover:aria-2 flex items-center justify-center gap-2 rounded-md bg-red-500 p-2 hover:border-2 hover:border-red-500 hover:bg-transparent md:w-[15rem]"
					>
						<Book class="h-5 w-5 text-black group-hover:text-white" />
						<span class=" text-black group-hover:text-white">Chapter Terakhir</span>
					</a>
				</div>
			</div>

			<img
				src={thumbnail}
				class="h-48 w-32 flex-shrink-0 rounded-md object-cover shadow-lg md:h-56 md:w-40"
				alt={title}
			/>
		</div>
	</div>
	<div class="flex flex-col gap-2 md:flex-row">
		<div class="flex w-full flex-col gap-1 rounded-md bg-secondary p-2">
			<h3 class="text-[1.3rem] font-bold text-white">Deskripsi</h3>
			<p class="text-justify text-neutral-300">
				{description}
			</p>
		</div>
		<div class="flex w-full flex-col gap-1 rounded-md bg-secondary p-2">
			<h3 class="text-[1.3rem] font-bold text-white">Genre</h3>
			<div class=" grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
				{#each genre as item (item.href)}
					{@const cleanHref = item.href.slice(1, -1)}
					<a
						href={resolve('/genre/[href]', { href: cleanHref })}
						class="hover:aria-2 cursor-pointer rounded-md bg-third p-3 font-bold text-neutral-300 hover:bg-primary hover:text-black"
						>{item.title}</a
					>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-2 rounded-md bg-secondary p-2">
		<h3 class="text-[1.3rem] font-bold text-white">Chapter</h3>
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
			{#each chapters as item (item.href)}
				{@const cleanHref = item.href.slice(1, -1)}
				<a
					href={resolve('/read/[href]', { href: cleanHref })}
					class="hover:aria-2 flex cursor-pointer items-center gap-2 rounded-md bg-third p-2 hover:border-2 hover:border-primary"
				>
					<Book class="h-5 w-5 text-neutral-300" />
					<div class="flex flex-col justify-start">
						<span class="text-neutral-300">{item.title}</span>
						<span class="h text-neutral-300">{item.date}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
