<script lang="ts">
	import { onMount } from 'svelte';
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import type { PageData, PageProps } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page as pageStore } from '$app/state';
	import LoadingDot from '$lib/components/LoadingDot.svelte';
	import { v1Genre, v1Order, v1Status, v1Type } from '$lib/utils/v1filter';
	import { v3genre, v3Order, v3status, v3Type } from '$lib/utils/v3filter';
	import { v2v4v5Genre, v2v4v5Order, v2v4v5Status, v2v4v5Type } from '$lib/utils/v2v4v5filter';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	type PaginationProps = {
		form: PageProps;
		data: PageData;
	};
	let { form, data }: PaginationProps = $props();

	// State for infinite scrolling
	let items = $state(data.allkomik);
	let currentSource = $state(data.source);
	let hasMore = $state(data.hasMore);
	let loading = $state(false);
	let currentPage = $state(1);
	let sentinel = $state<HTMLDivElement | undefined>();
	let formElement = $state<HTMLFormElement | undefined>();

	// --- State for Filters ---
	type FilterOption = { label: string; value: string };

	// Reactive variables to hold the current options for the UI
	let genreOptions = $state<FilterOption[]>([]);
	let statusOptions = $state<FilterOption[]>([]);
	let typeOptions = $state<FilterOption[]>([]);
	let orderOptions = $state<FilterOption[]>([]);

	// Reactive variables bound to the select elements
	let selectedGenre = $state(data.genre || '');
	let selectedStatus = $state(data.status || '');
	let selectedType = $state(data.type || '');
	let selectedOrder = $state(data.order || '');

	/**
	 * Normalizes filter data from either an array of strings or a Record into a
	 * consistent array of {label, value} objects for the UI.
	 */
	function normalizeOptions(
		data: string[] | Record<string, string>,
		convertToLower = false
	): FilterOption[] {
		if (Array.isArray(data)) {
			return data.map((item) => ({
				label: item,
				value: convertToLower ? item.toLowerCase() : item
			}));
		}
		// FIXED: Untuk Record, key adalah label (ditampilkan), value adalah value (dikirim ke server)
		return Object.entries(data).map(([label, value]) => ({ label, value }));
	}

	// Update filter options when source changes
	$effect(() => {
		switch (data.source) {
			case 'v1':
				genreOptions = normalizeOptions(v1Genre);
				statusOptions = normalizeOptions(v1Status, true);
				typeOptions = normalizeOptions(v1Type);
				orderOptions = normalizeOptions(v1Order);
				break;
			case 'v3':
				genreOptions = normalizeOptions(v3genre);
				statusOptions = normalizeOptions(v3status);
				typeOptions = normalizeOptions(v3Type);
				orderOptions = normalizeOptions(v3Order);
				break;
			default: // Handles v2, v4, v5
				genreOptions = normalizeOptions(v2v4v5Genre);
				statusOptions = normalizeOptions(v2v4v5Status);
				typeOptions = normalizeOptions(v2v4v5Type);
				orderOptions = normalizeOptions(v2v4v5Order);
				break;
		}
	});

	// FIXED: Separate effect untuk sync data dari server (dengan untrack untuk avoid loop)
	$effect(() => {
		const newSource = data.source;

		// Cek apakah source-nya berubah
		if (newSource !== currentSource) {
			// Jika source BERUBAH, paksa reset semua filter
			selectedGenre = '';
			selectedStatus = '';
			selectedType = '';
			selectedOrder = '';
		} else {
			// Jika source SAMA, sinkronkan filter dari server
			selectedGenre = data.genre || '';
			selectedStatus = data.status || '';
			selectedType = data.type || '';
			selectedOrder = data.order || '';
		}

		// Selalu update data list, state 'hasMore', dan reset halaman
		items = data.allkomik;
		hasMore = data.hasMore;
		currentPage = 1;

		// Terakhir, update currentSource untuk pengecekan berikutnya
		currentSource = newSource;
	});

	function applyFilters() {
		const params = new SvelteURLSearchParams(pageStore.url.search);

		// FIXED: Set params hanya jika ada value, hapus jika kosong
		if (selectedGenre) {
			params.set('genre', selectedGenre);
		} else {
			params.delete('genre');
		}

		if (selectedStatus) {
			params.set('status', selectedStatus);
		} else {
			params.delete('status');
		}

		if (selectedType) {
			params.set('type', selectedType);
		} else {
			params.delete('type');
		}

		if (selectedOrder) {
			params.set('order', selectedOrder);
		} else {
			params.delete('order');
		}

		params.set('page', '1');

		goto(`?${params.toString()}`, {
			invalidateAll: true,
			noScroll: true
		});
	}

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { comics, hasMore: newHasMore } = result.data as {
					comics: typeof items;
					hasMore: boolean;
				};
				if (comics.length > 0) {
					items = [...items, ...comics];
				}
				hasMore = newHasMore;
				currentPage++;
			}
			loading = false;
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

{#if data.error}
	<ErrorDisplay message={data.error} />
{:else}
	<div class="grid grid-cols-1 gap-4 rounded-lg bg-transparent p-4 sm:grid-cols-2 md:grid-cols-4">
		<div class="relative w-full">
			<select
				bind:value={selectedGenre}
				onchange={applyFilters}
				class="w-full cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-white transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none"
			>
				<option class="bg-neutral-800 text-white" value="">All Genres</option>
				{#each genreOptions as option (option.value)}
					<option class="bg-neutral-800 text-white" value={option.value}>{option.label}</option>
				{/each}
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
				<ChevronDown class="h-5 w-5 text-gray-400" />
			</div>
		</div>

		<div class="relative w-full">
			<select
				bind:value={selectedStatus}
				onchange={applyFilters}
				class="w-full cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-white transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none"
			>
				<option class="bg-neutral-800 text-white" value="">All Status</option>
				{#each statusOptions as option (option.value)}
					<option class="bg-neutral-800 text-white" value={option.value}>{option.label}</option>
				{/each}
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
				<ChevronDown class="h-5 w-5 text-gray-400" />
			</div>
		</div>

		<div class="relative w-full">
			<select
				bind:value={selectedType}
				onchange={applyFilters}
				class="w-full cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-white transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none"
			>
				<option class="bg-neutral-800 text-white" value="">All Types</option>
				{#each typeOptions as option (option.value)}
					<option class="bg-neutral-800 text-white" value={option.value}>{option.label}</option>
				{/each}
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
				<ChevronDown class="h-5 w-5 text-gray-400" />
			</div>
		</div>

		{#if orderOptions.length > 0}
			<div class="relative w-full">
				<select
					bind:value={selectedOrder}
					onchange={applyFilters}
					class="w-full cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-white transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none"
				>
					<option class="bg-neutral-800 text-white" value="">Sort by</option>
					{#each orderOptions as option (option.value)}
						<option class="bg-neutral-800 text-white" value={option.value}>{option.label}</option>
					{/each}
				</select>
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
					<ChevronDown class="h-5 w-5 text-gray-400" />
				</div>
			</div>
		{/if}
	</div>

	<!-- Comic List -->
	<GeneralVerticalComic
		title="Daftar Komik 📜"
		shortdesc="Jelajahi koleksi lengkap komik kami"
		{items}
	/>

	<!-- Infinite Scroll Trigger -->
	{#if hasMore}
		<div bind:this={sentinel} class="py-8">
			<form
				bind:this={formElement}
				method="POST"
				action="?/loadMore"
				use:enhance={handleSubmit}
				class="hidden"
			>
				<input type="hidden" name="page" value={currentPage + 1} />
				<input type="hidden" name="source" value={currentSource} />
				<input type="hidden" name="genre" value={selectedGenre} />
				<input type="hidden" name="status" value={selectedStatus} />
				<input type="hidden" name="type" value={selectedType} />
				<input type="hidden" name="order" value={selectedOrder} />
			</form>

			{#if loading}
				<LoadingDot />
			{:else}
				<div class="flex justify-center">
					<div class="text-base-content/50 text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto h-8 w-8 animate-bounce"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
						<p class="mt-2 text-sm">Scroll untuk memuat lebih banyak</p>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/if}
