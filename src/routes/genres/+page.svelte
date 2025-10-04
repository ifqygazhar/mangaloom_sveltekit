<script lang="ts">
	import { resolve } from '$app/paths';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	import { getGenreEmoji } from '$lib/utils/getEmojiGenre';
	import type { PageData } from './$types';

	export let data: PageData;

	$: genres = data.genres;
</script>

{#if data.error}
	<ErrorDisplay message={data.error} />
{:else}
	<div class="mb-2 flex w-screen flex-col">
		<h2
			class="pt-4 pl-4 text-[1.2rem] font-bold text-white sm:text-[1.3rem] lg:text-2xl md:text-2xl"
		>
			Genre 🎭
		</h2>
		<h3 class="md:text-1xl lg:text-1xl mb-4 pl-4 text-[0.85rem] text-gray-400 sm:text-[0.85rem]">
			Cari genre komik kesukaan mu
		</h3>

		<!-- Grid: vertikal ke bawah, responsive -->
		<div class="px-4 pb-6">
			<div
				class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 xl:grid-cols-6"
			>
				{#each genres as item (item.href)}
					{@const cleanHref = item.href.slice(1, -1)}
					<a
						href={resolve('/genre/[href]', { href: cleanHref })}
						class="relative flex min-h-[100px] flex-col items-center justify-center rounded-lg bg-slate-800 p-4 text-center transition-transform duration-300 hover:scale-105 hover:bg-slate-700"
					>
						<span class="text-3xl lg:text-4xl">{getGenreEmoji(item.title)}</span>
						<span class="mt-2 text-sm font-bold text-white md:text-base">{item.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}
