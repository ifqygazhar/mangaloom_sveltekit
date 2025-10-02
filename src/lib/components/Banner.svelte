<script lang="ts">
	import type { ComicItemType } from '$lib/api/types/ComicItemType';
	import { Carousel, CarouselContent, CarouselItem } from '$lib/components/ui/carousel';
	import LazyImage from '$lib/components/LazyImage.svelte';
	import Book from '@lucide/svelte/icons/book';
	import Eye from '@lucide/svelte/icons/eye';
	import Star from '@lucide/svelte/icons/star';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { SourceType } from '$lib/config/sourceType';
	import Autoplay from 'embla-carousel-autoplay';
	import shuffle from '$lib/utils/shuffleitem';
	import type { CarouselAPI } from './ui/carousel/context';

	let { items = [], count = 4 } = $props<{
		items?: ComicItemType[];
		count?: number;
	}>();

	let api = $state<CarouselAPI>();
	let current = $state<number>(0);

	const plugins = [
		Autoplay({
			delay: 4000,
			stopOnInteraction: true
		})
	];

	const slides: ComicItemType[] = $derived(items.length ? shuffle(items).slice(0, count) : []);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap();
			api.on('select', () => {
				current = api!.selectedScrollSnap();
			});
		}
	});
</script>

<div class="relative h-[11rem] w-full overflow-hidden md:h-[20rem]">
	{#if slides[current]}
		{#key current}
			<div class="absolute inset-0 z-0 transition-opacity duration-500">
				<LazyImage
					src={slides[current].thumbnail}
					alt={slides[current].title}
					containerClass="h-full w-full"
					class="h-full w-full object-cover"
				/>
			</div>
		{/key}
	{/if}
	<div class="absolute inset-0 z-10 bg-black/30 backdrop-blur-md"></div>

	<Carousel
		setApi={(emblaApi) => (api = emblaApi)}
		{plugins}
		opts={{
			align: 'center',
			loop: true,
			duration: 30
		}}
		class="relative z-20 h-full w-full"
	>
		<CarouselContent class="h-full">
			{#each slides as item (item.href)}
				<CarouselItem class="h-full w-full">
					<div class="flex h-full items-center justify-between gap-4 p-4 text-white">
						<div class="flex flex-col gap-2">
							<h1 class="line-clamp-2 text-[1rem] font-bold md:text-[2rem]">
								{item.title}
							</h1>
							<div class="flex flex-row gap-2">
								<div
									class="flex items-center justify-center gap-2 rounded-md border-2 border-white p-1 px-2 align-middle"
								>
									{#if $sourceStore === SourceType.V3}
										<Eye class="h-4 w-4 text-yellow-400" />
									{:else}
										<Star class="h-4 w-4 text-yellow-400" fill="currentColor" />
									{/if}
									<span class="text-[0.8rem] md:text-[1rem]">{item.rating}</span>
								</div>
								<div
									class="flex items-center justify-center gap-2 rounded-md border-2 border-white p-1 px-2 align-middle"
								>
									<Book class="h-4 w-4 text-yellow-400" />
									<span class="text-[0.8rem] md:text-[1rem]">{item.chapter}</span>
								</div>
							</div>
							<a
								data-sveltekit-preload-data="tap"
								href={item.href}
								class="group mt-2 flex w-fit cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-primary p-2 px-4 transition-colors duration-200 hover:bg-primary/80"
								aria-label="Baca"
							>
								<Book class="h-5 w-5 text-primary-foreground" />
								<h3 class="font-semibold text-primary-foreground">Baca sekarang</h3>
							</a>
						</div>

						<LazyImage
							src={item.thumbnail}
							alt={item.title}
							containerClass="h-[9rem] w-[6rem] flex-shrink-0 md:h-[18rem] md:w-[12rem]"
							class="h-full w-full border-2 border-gray-400 object-cover"
						/>
					</div>
				</CarouselItem>
			{/each}
		</CarouselContent>
	</Carousel>
</div>

<div class="mt-4 flex justify-center gap-2">
	{#each slides as item, i (item.href)}
		<button
			onclick={() => api?.scrollTo(i)}
			class="h-2 w-2 cursor-pointer rounded-full transition-all duration-300"
			class:bg-primary={current === i}
			class:bg-muted={current !== i}
			class:w-4={current === i}
			aria-label="Pindah ke slide {i + 1}"
		></button>
	{/each}
</div>
