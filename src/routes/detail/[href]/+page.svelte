<script lang="ts">
	import Star from '@lucide/svelte/icons/star';
	import Eye from '@lucide/svelte/icons/eye';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { onMount } from 'svelte';
	import { SourceType } from '$lib/config/sourceType';
	import Book from '@lucide/svelte/icons/book';
	import { resolve } from '$app/paths';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import BtnBookmark from '$lib/components/BtnBookmark.svelte';
	import {
		addOrUpdateBookmark,
		deleteBookmark,
		getBookmark,
		getHistoryForKomik,
		type BookmarkedKomik
	} from '$lib/db/database';

	let { data } = $props();
	const { comicDetail } = $derived(data);

	let isBookmarked = $state(false);
	let readChapters = $state(new Set<string>());
	let searchQuery = $state('');
	const chapters = $derived(comicDetail?.chapter ?? []);
	const filteredChapters = $derived(
		chapters.filter((chapter) => chapter.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const firstChapter = $derived(comicDetail?.chapter[comicDetail.chapter.length - 1]);
	const lastChapter = $derived(comicDetail?.chapter[0]);

	const cleanFirstChapterHref = $derived(firstChapter?.href.slice(1, -1) ?? '');
	const cleanLastChapterHref = $derived(lastChapter?.href.slice(1, -1) ?? '');

	const title = $derived(comicDetail?.title ?? 'Judul Komik');
	const description = $derived(comicDetail?.description ?? 'Tidak ada deskripsi.');
	const author = $derived(comicDetail?.author ?? '-');
	const status = $derived(comicDetail?.status ?? '-');
	const type = $derived(comicDetail?.type ?? '-');
	const released = $derived(comicDetail?.released ?? '-');
	const rating = $derived(comicDetail?.rating ?? '0');
	const genre = $derived(comicDetail?.genre ?? []);
	const thumbnail = $derived(comicDetail?.thumbnail ?? '');
	const altTitle = $derived(comicDetail?.altTitle ?? '');
	const detailHref: string = data.detailHref;
	let normalizedDetailHref = detailHref;

	if (normalizedDetailHref.endsWith('/')) {
		normalizedDetailHref = normalizedDetailHref.slice(0, -1);
	}
	if (!normalizedDetailHref.startsWith('/')) {
		normalizedDetailHref = `/${normalizedDetailHref}`;
	}

	const currentSource = $derived($sourceStore);
	const hasGenre = $derived(genre.length > 0);

	onMount(async () => {
		if (detailHref === '') {
			return;
		}
		const existingBookmark = await getBookmark(detailHref, currentSource);
		isBookmarked = !!existingBookmark;
		const historyRecords = await getHistoryForKomik(normalizedDetailHref, currentSource);
		readChapters = new Set(historyRecords.map((record) => record.href));
	});

	async function handleBookmark() {
		if (!comicDetail) return;

		const bookmarkData: BookmarkedKomik = {
			title: comicDetail.title,
			href: detailHref,
			thumbnail: comicDetail.thumbnail,
			type: comicDetail.type,
			chapter: lastChapter?.title ?? 'N/A',
			rating: comicDetail.rating,
			genre: comicDetail.genre.map((g) => g.title).join(', ') || 'Unknown',
			year: comicDetail.released,
			sourceType: currentSource,
			bookmarkedAt: new Date()
		};

		if (isBookmarked) {
			await deleteBookmark(bookmarkData.href, bookmarkData.sourceType);
		} else {
			await addOrUpdateBookmark(bookmarkData);
		}

		isBookmarked = !isBookmarked;
	}
</script>

{#if data.error}
	<ErrorDisplay message={data.error} />
{:else}
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
					<BtnBookmark {isBookmarked} onBookmark={handleBookmark} />
					<div class="flex flex-col justify-start gap-2 md:flex-row">
						<a
							href={`/read/${cleanFirstChapterHref}?detailHref=${detailHref}&source=${currentSource}`}
							class="group hover:aria-2 flex items-center justify-center gap-2 rounded-md bg-primary p-2 hover:border-2 hover:border-primary hover:bg-transparent md:w-[15rem]"
						>
							<Book class="h-5 w-5 text-black group-hover:text-white" />
							<span class="text-black group-hover:text-white">Chapter Pertama</span>
						</a>
						<a
							href={`/read/${cleanLastChapterHref}?detailHref=${detailHref}&source=${currentSource}`}
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
				{#if hasGenre}
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
						{#each genre as item (item.href)}
							{@const cleanHref = item.href.slice(1, -1)}
							<a
								href={resolve('/genre/[href]', { href: cleanHref })}
								class="hover:aria-2 cursor-pointer rounded-md bg-third p-3 font-bold text-neutral-300 hover:bg-primary hover:text-black"
								>{item.title}</a
							>
						{/each}
					</div>
				{:else}
					<div class="flex items-center justify-center py-4">
						<p class="text-neutral-400 italic">Genre tidak tersedia</p>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-col gap-2 rounded-md bg-secondary p-2">
			<h3 class="text-[1.3rem] font-bold text-white">Chapter</h3>

			<input
				type="text"
				placeholder="Cari chapter..."
				bind:value={searchQuery}
				class="w-full rounded-md border-2 border-transparent bg-third p-2 text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
			/>

			<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
				{#each filteredChapters as item (item.href)}
					{@const cleanHref = item.href.slice(1, -1)}
					{@const isRead = readChapters.has(item.href.slice(1, -1))}

					<a
						href={`/read/${cleanHref}?detailHref=${detailHref}&source=${currentSource}`}
						class="hover:aria-2 flex cursor-pointer items-center gap-2 rounded-md border-2 bg-third p-2 hover:border-2 hover:border-primary"
						class:border-green-500={isRead}
						class:border-transparent={!isRead}
					>
						<Book class="h-5 w-5 text-neutral-300" />
						<div class="flex flex-col justify-start">
							<span class="text-neutral-300" class:!text-green-500={isRead}>
								{item.title}
							</span>
							<span class="text-neutral-300">{item.date}</span>
						</div>
					</a>
				{:else}
					<div class="col-span-full flex h-24 items-center justify-center">
						<p class="italic text-neutral-400">Chapter tidak ditemukan.</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
