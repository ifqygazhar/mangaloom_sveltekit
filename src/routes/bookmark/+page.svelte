<script lang="ts">
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import { onMount } from 'svelte';
	import { deleteBookmark, getAllBookmarks, type BookmarkedKomik } from '$lib/db/database';
	import type { SourceType } from '$lib/config/sourceType';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	let bookmarks = $state<BookmarkedKomik[]>([]);

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
	<GeneralVerticalComic
		items={bookmarks}
		title="Bookmark Kamu 🔖"
		shortdesc="Komik yang sudah kamu simpan"
		isBookmark={true}
		on:delete={handleDeleteBookmark}
	/>
{:else}
	<ErrorDisplay isBookmark={true} />
{/if}
