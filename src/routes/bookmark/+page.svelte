<script lang="ts">
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import { onMount } from 'svelte';
	// --- 1. Impor fungsi database dan tipe ---
	import { deleteBookmark, getAllBookmarks, type BookmarkedKomik } from '$lib/db/database';
	import type { SourceType } from '$lib/config/sourceType';

	// --- 2. Buat state untuk menampung data bookmark ---
	let bookmarks = $state<BookmarkedKomik[]>([]);

	// --- 3. Muat data saat komponen di-mount ---
	onMount(async () => {
		const allBookmarks = await getAllBookmarks();
		// Urutkan berdasarkan yang terbaru
		bookmarks = allBookmarks.sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime());
	});

	// --- 4. Buat fungsi untuk menangani penghapusan item ---
	async function handleDeleteBookmark(
		event: CustomEvent<{ href: string; sourceType: SourceType }>
	) {
		const { href, sourceType } = event.detail;
		try {
			await deleteBookmark(href, sourceType);
			// Hapus item dari state lokal agar UI terupdate secara reaktif
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
	<div class="flex h-64 items-center justify-center">
		<p class="text-gray-400">Kamu belum punya bookmark.</p>
	</div>
{/if}
