<script lang="ts">
	import type { ChapterItemType } from '$lib/api/types/ChapterItemType';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let {
		chapters = [],
		currentHref,
		detailHref
	} = $props<{
		chapters: ChapterItemType[];
		currentHref: string;
		detailHref: string;
	}>();

	// State untuk mengontrol visibilitas dropdown
	let isOpen = $state(false);

	// Cari judul chapter yang sedang aktif untuk ditampilkan di tombol
	const currentChapterTitle = $derived(
		chapters.find((ch) => ch.href === currentHref)?.title ?? 'Pilih Chapter'
	);

	function closeDropdown() {
		isOpen = false;
	}
</script>

<div class="relative w-full">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-secondary p-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
	>
		<span class="truncate">{currentChapterTitle}</span>
		<ChevronDown class="h-5 w-5 flex-shrink-0 transition-transform {isOpen ? 'rotate-180' : ''}" />
	</button>

	{#if isOpen}
		<div
			class="absolute bottom-full z-20 mb-2 max-h-72 w-full cursor-pointer overflow-y-auto rounded-md border border-white/10 bg-secondary p-1 shadow-lg"
		>
			<ul class="flex flex-col gap-1">
				{#each chapters as chapter (chapter.href)}
					{@const cleanHref = chapter.href.slice(0, -1)}
					<li>
						<a
							href={`/read${cleanHref}?detailHref=${detailHref}`}
							onclick={closeDropdown}
							class="block w-full truncate rounded p-2 text-left text-sm text-white transition-colors"
							class:bg-primary={chapter.href === currentHref}
							class:hover:bg-primary={chapter.href !== currentHref}
							class:hover:text-black={chapter.href !== currentHref}
							aria-current={chapter.href === currentHref ? 'page' : undefined}
						>
							{chapter.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
