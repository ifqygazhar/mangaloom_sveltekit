<script lang="ts">
	import History from '@lucide/svelte/icons/history';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { onMount } from 'svelte';
	import { deleteHistory, getAllHistory, type ChapterHistory } from '$lib/db/database';

	import { SourceType } from '$lib/config/sourceType';
	import { timeAgo } from '$lib/utils/timehelper';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { layoutMetadata } from '$lib/utils/metatagHelper';
	import Seo from '$lib/components/Seo.svelte';

	let historyItems = $state<ChapterHistory[]>([]);
	let searchQuery = $state('');

	const filteredHistory = $derived(
		historyItems.filter((item) =>
			(item.title.toLowerCase() + item.komikHref.toLowerCase()).includes(searchQuery.toLowerCase())
		)
	);

	onMount(async () => {
		historyItems = await getAllHistory();
	});

	async function handleDelete(item: ChapterHistory) {
		if (confirm(`Hapus riwayat "${item.title}"?`)) {
			await deleteHistory(item.href, item.sourceType);

			historyItems = historyItems.filter((h) => h.href !== item.href);
		}
	}

	// Helper untuk mendapatkan label source type
	function getSourceLabel(sourceType: string | undefined): string {
		if (!sourceType) return 'N/A';
		switch (sourceType) {
			case SourceType.V3:
				return 'V3';
			case SourceType.V2:
				return 'V2';
			case SourceType.V1:
				return 'V1';
			case SourceType.V4:
				return 'V4';
			case SourceType.V5:
				return 'V5';
			default:
				return sourceType.toUpperCase();
		}
	}
</script>

<Seo
	metatag={layoutMetadata(
		'History komik kamu - Mangaloom',
		'History riwayat komik kamu - Mangaloom'
	)}
/>

{#if historyItems.length > 0}
	<div class="flex w-full flex-col gap-4 p-4">
		<h1 class="flex items-center gap-2 text-2xl font-bold text-white">
			<History class="h-7 w-7" />
			Riwayat Baca
		</h1>

		<input
			bind:value={searchQuery}
			type="text"
			placeholder="Cari berdasarkan judul chapter atau komik..."
			class="w-full rounded-md border-2 border-transparent bg-secondary p-2.5 text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
		/>

		<div class="flex w-full flex-col gap-3">
			{#each filteredHistory as item ([item.href, item.sourceType])}
				{@const cleanKomikHref = item.komikHref.replace(/^\/|\/$/g, '')}
				{@const readUrl = `/read/${item.href}?detailHref=${cleanKomikHref}&source=${item.sourceType}`}

				<div class="flex items-center gap-3 rounded-md bg-secondary p-3 shadow-md">
					<div class="flex-grow">
						<a href={readUrl} class="group">
							<h2 class="font-semibold text-white group-hover:text-primary">{item.title}</h2>
							<p class="text-sm text-neutral-400">
								Komik: <span class="italic">{item.komikHref.replace(/-/g, ' ')}</span>
							</p>
							<div class="mt-1 flex items-center gap-2 text-xs text-neutral-500">
								<span>{timeAgo(item.readAt)}</span>
								<span
									class="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 font-medium text-blue-400"
								>
									{getSourceLabel(item.sourceType)}
								</span>
							</div>
						</a>
					</div>

					<button
						onclick={() => handleDelete(item)}
						class="flex-shrink-0 cursor-pointer rounded-full p-2 text-neutral-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
						title="Hapus riwayat"
					>
						<Trash2 class="h-5 w-5" />
					</button>
				</div>
			{:else}
				<div class="flex flex-grow flex-col items-center justify-center text-center">
					<p class="text-lg font-semibold text-white">Tidak Ditemukan</p>
					<p class="text-neutral-400">
						Tidak ada riwayat yang cocok dengan '<span class="italic">{searchQuery}</span>'.
					</p>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<ErrorDisplay isHistory={true} />
{/if}
