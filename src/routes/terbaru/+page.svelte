<script lang="ts">
	import { onMount } from 'svelte';
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import type { PageData, PageProps } from './$types';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import LoadingDot from '$lib/components/LoadingDot.svelte';

	type PaginationProps = {
		form: PageProps;
		data: PageData;
	};
	let { form, data }: PaginationProps = $props();

	let items = $state(data.newKomik);
	let source = $state(data.source);
	let hasMore = $state(data.hasMore);
	let loading = $state(false);
	let page = $state(1);

	let sentinel = $state<HTMLDivElement | undefined>();
	let formElement = $state<HTMLFormElement | undefined>();

	$effect(() => {
		if (data.source !== source) {
			items = data.newKomik;
			source = data.source;
			hasMore = data.hasMore;
			page = 1;
		}
	});

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				const { comics, hasMore: newHasMore } = result.data;
				if (comics.length > 0) {
					items = [...items, ...comics];
				}
				hasMore = newHasMore;
				page++;
			}
			loading = false;
			await update();
		};
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && hasMore) {
					formElement?.requestSubmit();
				}
			},
			{
				rootMargin: '0px'
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
	title="Semua Komik 🤩"
	shortdesc="Jelajahi koleksi lengkap komik kami"
	{items}
/>

{#if hasMore}
	<div bind:this={sentinel} class="">
		<form
			bind:this={formElement}
			method="POST"
			action="?/loadMore"
			use:enhance={handleSubmit}
			class="hidden"
		>
			<input type="hidden" name="page" value={page + 1} />
			<input type="hidden" name="source" value={source} />
		</form>

		{#if loading}
			<LoadingDot />
		{/if}
	</div>
{/if}
