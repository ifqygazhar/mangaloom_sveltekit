<script lang="ts">
	import { onMount } from 'svelte';
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let items = data.newKomik;
	let source = data.source;
	let hasMore = data.hasMore;
	let loading = false;
	let page = 1; // Halaman saat ini (halaman 1 sudah dimuat)

	let sentinel: HTMLDivElement;

	async function loadMoreItems() {
		if (loading || !hasMore) return;

		loading = true;
		page++;

		try {
			const res = await fetch(`/api/newcomic?page=${page}&source=${source}`);
			const newData = await res.json();

			if (res.ok && newData.comics.length > 0) {
				items = [...items, ...newData.comics];
				hasMore = newData.hasMore;
			} else {
				hasMore = false;
			}
		} catch (e) {
			console.error('Gagal memuat komik selanjutnya:', e);
			hasMore = false;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMoreItems();
				}
			},
			{
				rootMargin: '200px'
			}
		);

		if (sentinel) {
			observer.observe(sentinel);
		}

		return () => {
			if (sentinel) {
				observer.unobserve(sentinel);
			}
		};
	});
</script>

<GeneralVerticalComic
	title="Semua Komik 📖"
	shortdesc="Jelajahi koleksi lengkap komik kami"
	{items}
/>

{#if hasMore}
	<div bind:this={sentinel} class="flex h-[3.1rem] w-full items-center justify-center">
		{#if loading}
			<p class="text-white">Memuat lebih banyak...</p>
		{/if}
	</div>
{/if}
