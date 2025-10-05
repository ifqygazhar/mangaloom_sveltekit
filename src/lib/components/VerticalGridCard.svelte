<script lang="ts">
	import type { ComicItemType } from '$lib/api/types/ComicItemType';
	import { getFlagSrc } from '$lib/utils/flaghelper';
	import Eye from '@lucide/svelte/icons/eye';
	import Star from '@lucide/svelte/icons/star';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import LazyImage from './LazyImage.svelte';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { SourceType } from '$lib/config/sourceType';
	import { createEventDispatcher } from 'svelte';
	import { resolve } from '$app/paths';

	let {
		item,
		index = 0,
		isPopuler = false,
		isBookmark = false
	} = $props<{
		item: ComicItemType;
		index?: number;
		isPopuler?: boolean;
		isBookmark?: boolean;
	}>();

	const currentSource = $derived($sourceStore);
	const cleanHref = isBookmark ? item.href : item.href.slice(1, -1);

	const detailUrl = $derived(
		`${resolve('/detail/[href]', { href: cleanHref })}?source=${currentSource}`
	);

	const dispatch = createEventDispatcher();

	function handleDelete(e: MouseEvent) {
		console.log('href bookmark:', item.href);
		e.preventDefault();
		e.stopPropagation();
		if (confirm('Hapus bookmark ini?')) {
			dispatch('delete', { href: item.href, sourceType: item.sourceType });
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

<div class="group relative block">
	<a href={detailUrl} class="block">
		<div class="relative overflow-hidden bg-gray-900">
			<!-- Gambar dengan aspect ratio konsisten -->
			<div class="aspect-[3/4] w-full overflow-hidden bg-gray-800">
				<LazyImage
					src={item.thumbnail}
					alt={item.title}
					containerClass="aspect-[3/4] w-full overflow-hidden"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			<!-- Badge populer (kiri atas) -->
			{#if isPopuler}
				<div
					class="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-sm border-2 border-black bg-primary text-xs text-black md:h-7 md:w-7"
					title="Populer"
				>
					<span class="font-bold">{index + 1}</span>
				</div>
			{/if}

			<!-- Flag kanan atas -->
			{#if getFlagSrc(item.type)}
				<div
					class="bg-transparant absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center overflow-hidden shadow md:h-8 md:w-8"
					title={item.type ?? 'Unknown'}
				>
					<img
						src={getFlagSrc(item.type)}
						alt={item.type ?? 'Unknown'}
						class="h-full w-full object-contain"
					/>
				</div>
			{/if}

			<!-- Overlay untuk bookmark dengan trash button -->
			{#if isBookmark}
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
					<button
						onclick={handleDelete}
						class="absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 md:h-9 md:w-9"
						title="Hapus bookmark"
						type="button"
					>
						<Trash2 class="h-4 w-4 md:h-5 md:w-5" />
					</button>
				</div>
			{/if}
		</div>

		<!-- Info bawah -->
		<div class="mt-2 text-white">
			<h4 class="line-clamp-2 text-sm font-semibold group-hover:text-primary">{item.title}</h4>
			<div class="mt-1 flex items-center justify-between text-xs text-gray-400">
				<span>{item.chapter}</span>
				<div class="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5">
					{#if currentSource === SourceType.V3}
						<Eye class="h-3 w-3 text-yellow-400" />
					{:else}
						<Star class="h-3 w-3 text-yellow-400" fill="currentColor" />
					{/if}
					<span>{item.rating}</span>
				</div>
			</div>

			<!-- Source Type Badge untuk bookmark -->
			{#if isBookmark}
				<div class="mt-1.5 flex items-center gap-1">
					<span
						class="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400"
					>
						Source: {getSourceLabel(item.sourceType)}
					</span>
				</div>
			{/if}
		</div>
	</a>
</div>
