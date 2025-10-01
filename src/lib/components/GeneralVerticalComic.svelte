<script lang="ts">
	import type { ComicItemType } from '$lib/api/types/ComicItemType';
	import VerticalGridCard from '$lib/components/VerticalGridCard.svelte';

	let {
		items = [],
		title = 'n/a',
		shortdesc = 'n/a',
		isPopuler = false
	} = $props<{
		items: ComicItemType[];
		title: string;
		shortdesc: string;
		isPopuler?: boolean;
	}>();
</script>

<div class="mb-2 flex w-screen flex-col">
	<h2 class="pt-4 pl-4 text-[1.2rem] font-bold text-white sm:text-[1.3rem] md:text-2xl lg:text-2xl">
		{title}
	</h2>
	<h3 class="md:text-1xl lg:text-1xl mb-4 pl-4 text-[0.85rem] text-gray-400 sm:text-[0.85rem]">
		{shortdesc}
	</h3>

	<!-- Grid: vertikal ke bawah, responsive -->
	<div class="px-4 pb-6">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{#each items as item, i (item.href)}
				<VerticalGridCard {item} index={i} {isPopuler} />
			{/each}
		</div>
	</div>
</div>
