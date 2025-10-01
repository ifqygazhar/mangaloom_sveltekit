<script lang="ts">
	import type { ComicItemType } from '$lib/api/types/ComicItemType';
	import { getFlagSrc } from '$lib/utils/flaghelper';
	import { Star, Eye } from '@lucide/svelte';
	import LazyImage from './LazyImage.svelte';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { get } from 'svelte/store';
	import { SourceType } from '$lib/config/sourceType';
	import { onDestroy } from 'svelte';

	let {
		item,
		index = 0,
		isPopuler = false
	} = $props<{
		item: ComicItemType;
		index?: number;
		isPopuler?: boolean;
	}>();

	let currentSource = $state(get(sourceStore));
	const unsub = sourceStore.subscribe((v) => (currentSource = v));
	onDestroy(() => unsub());
</script>

<a href={item.href} class="group block">
	<div class="relative overflow-hidden rounded-md bg-gray-900">
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
				class="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white shadow md:h-7 md:w-7"
				title={item.type ?? 'Unknown'}
			>
				<img
					src={getFlagSrc(item.type)}
					alt={item.type ?? 'Unknown'}
					class="h-full w-full object-contain"
				/>
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
	</div>
</a>
