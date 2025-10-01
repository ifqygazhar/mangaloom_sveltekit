<script lang="ts">
	import type { ComicItemType } from '$lib/api/types/ComicItemType';
	import { getFlagSrc } from '$lib/utils/flaghelper';
	import {
		Carousel,
		CarouselContent,
		CarouselItem,
		CarouselNext,
		CarouselPrevious
	} from '$lib/components/ui/carousel';
	import Eye from '@lucide/svelte/icons/eye';
	import Star from '@lucide/svelte/icons/star';
	import LazyImage from '$lib/components/LazyImage.svelte';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { get } from 'svelte/store';
	import { SourceType } from '$lib/config/sourceType';
	import { onDestroy } from 'svelte';
	let { items = [], isPopuler = false } = $props<{
		items?: ComicItemType[];
		isPopuler?: boolean;
	}>();

	let currentSource = $state(get(sourceStore));
	const unsub = sourceStore.subscribe((v) => (currentSource = v));
	onDestroy(() => unsub());
</script>

<div class="relative">
	<Carousel
		opts={{
			align: 'start',
			loop: false
		}}
		class="w-full"
	>
		<CarouselContent class="-ml-2 md:-ml-4">
			{#each items as item, i (item.href)}
				<CarouselItem class="basis-1/2 sm:basis-1/3 lg:basis-1/5 md:basis-1/4 xl:basis-1/6">
					<div class="px-4">
						<a href={item.href} class="group">
							<div class="relative aspect-[3/4] overflow-hidden">
								<LazyImage
									src={item.thumbnail}
									alt={item.title}
									containerClass="h-full w-full"
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<!-- Popular badge (left) — hanya muncul jika isPopuler true -->
								{#if isPopuler}
									<div
										class="absolute top-2 left-2 flex h-[1.5rem] w-[1.5rem] items-center justify-center border-2 border-black bg-primary lg:h-[2rem] lg:w-[2rem] md:h-[2rem] md:w-[2rem]"
									>
										<h4 class="text-black">{i + 1}</h4>
									</div>
								{/if}

								<!-- Flag kanan atas berdasarkan item.type -->
								{#if getFlagSrc(item.type)}
									<div
										class="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white shadow md:h-8 md:w-8"
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

							<div class="mt-2 text-white">
								<h4 class="line-clamp-2 font-semibold group-hover:text-primary">
									{item.title}
								</h4>
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
					</div>
				</CarouselItem>
			{/each}
		</CarouselContent>

		<CarouselPrevious class="ml-12 hidden cursor-pointer sm:flex" />
		<CarouselNext class="mr-12 hidden cursor-pointer sm:flex" />
	</Carousel>

	<div
		class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent"
	></div>
</div>
