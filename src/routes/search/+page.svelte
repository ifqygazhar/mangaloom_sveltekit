<script lang="ts">
	import type { PageData } from './$types';
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Seo from '$lib/components/Seo.svelte';
	import { layoutMetadata } from '$lib/utils/metatagHelper';

	let { data } = $props<{ data: PageData }>();
</script>

<Seo
	metatag={layoutMetadata(
		`Search: ${data.query} - Mangaloom`,
		`Hasil pencarian untuk "${data.query}" di Mangaloom. Temukan berbagai komik menarik sesuai dengan kata kunci pencarian Anda.`
	)}
/>

{#if data.comics.length == 0}
	<div
		class="flex h-[calc(100vh-10rem)] flex-col items-center justify-center space-y-4 px-4 text-center"
	>
		<div class="text-slate-500">
			<Search class="h-16 w-16 text-primary" />
		</div>

		<h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Komik Tidak Ditemukan</h2>

		<p class="max-w-md text-slate-400">
			Maaf, kami tidak dapat menemukan hasil untuk pencarian
			<span class="font-semibold text-primary">"{data.query}"</span>.
		</p>

		<div class="pt-6 text-left">
			<p class="mb-2 text-center text-sm font-medium text-slate-300">Beberapa saran:</p>
			<ul class="list-inside list-disc space-y-1 text-sm text-slate-400">
				<li>Pastikan semua kata dieja dengan benar.</li>
				<li>Coba gunakan kata kunci yang berbeda atau lebih umum.</li>
				<li>Coba cari dengan judul alternatif jika ada.</li>
			</ul>
		</div>
	</div>
{:else if data.comics.length > 0}
	<div class="lg:h-[calc(100vh-10rem)]">
		<GeneralVerticalComic
			title={`🔍︎ Hasil Pencarian: ${data.query}`}
			shortdesc="Semoga ketemu ya"
			items={data.comics}
		/>
	</div>
{/if}
