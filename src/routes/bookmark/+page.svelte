<script lang="ts">
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import { onMount } from 'svelte';
	import { deleteBookmark, getAllBookmarks, type BookmarkedKomik } from '$lib/db/database';
	import type { SourceType } from '$lib/config/sourceType';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	let bookmarks = $state<BookmarkedKomik[]>([]);
	let searchQuery = $state('');

	const filteredBookmarks = $derived(
		bookmarks.filter((bm) => bm.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	onMount(async () => {
		const allBookmarks = await getAllBookmarks();
		bookmarks = allBookmarks.sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime());
	});

	async function handleDeleteBookmark(
		event: CustomEvent<{ href: string; sourceType: SourceType }>
	) {
		const { href, sourceType } = event.detail;
		try {
			await deleteBookmark(href, sourceType);
			bookmarks = bookmarks.filter((bm) => !(bm.href === href && bm.sourceType === sourceType));
		} catch (error) {
			console.error('Gagal menghapus bookmark:', error);
		}
	}
</script>

{#if bookmarks.length > 0}
	<div class="flex flex-col md:h-[calc(100vh-10rem)]">
		<div class="w-full p-4">
			<input
				bind:value={searchQuery}
				type="text"
				placeholder="Cari bookmark komik..."
				class="w-full rounded-md border-2 border-transparent bg-secondary p-2.5 text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
			/>
		</div>

		{#if filteredBookmarks.length > 0}
			<GeneralVerticalComic
				items={filteredBookmarks}
				title="Bookmark Kamu 🔖"
				shortdesc="Komik yang sudah kamu simpan"
				isBookmark={true}
				on:delete={handleDeleteBookmark}
			/>
		{:else}
			<div class="flex flex-grow flex-col items-center justify-center text-center">
				<p class="text-lg font-semibold text-white">Tidak Ditemukan</p>
				<p class="text-neutral-400">Tidak ada bookmark yang cocok dengan '{searchQuery}'.</p>
			</div>
		{/if}
	</div>
{:else}
	<ErrorDisplay isBookmark={true} />
{/if}
