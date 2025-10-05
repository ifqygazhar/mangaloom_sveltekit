<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import History from '@lucide/svelte/icons/history';
	import Search from '@lucide/svelte/icons/search';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { SourceType } from '$lib/config/sourceType';
	import { page } from '$app/state';
	import { goto, invalidate } from '$app/navigation';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { resolve } from '$app/paths';

	let searchQuery = $state('');

	let { isOpen = false } = $props<{
		isOpen?: boolean;
	}>();

	let selected = $derived($sourceStore);

	let isDetail = $derived(
		page.url.pathname.startsWith('/detail/') || page.url.pathname.startsWith('/read/')
	);

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		const searchUrl = `/search?query=${encodeURIComponent(searchQuery)}&source=${selected}`;
		goto(searchUrl);
	}

	function onSourceChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newSource = target.value as SourceType;

		sourceStore.set(newSource);

		if (newSource === SourceType.V2) {
			sourceStore.set(SourceType.V3);
			return;
		}

		const newUrl = new URL(page.url);
		newUrl.searchParams.set('source', newSource);

		invalidate('app:source').then(() => {
			goto(newUrl.toString(), {
				keepFocus: true,
				noScroll: true,
				invalidateAll: true
			});
		});
	}

	const sourceOptions = [
		{ value: SourceType.V1, label: 'General (v1)', disabled: false },
		{ value: SourceType.V2, label: 'Maintenance (v2)', disabled: true },
		{ value: SourceType.V3, label: 'Stabil (v3)', disabled: false },
		{ value: SourceType.V4, label: 'Dark (v4)', disabled: false },
		{ value: SourceType.V5, label: 'Manhwa (v5)', disabled: false }
	];

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('click_outside'));
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class="flex items-center gap-3">
	<div class="relative w-full max-w-xs flex-1 sm:max-w-md lg:w-80 lg:flex-none">
		<form onsubmit={handleSearch} role="search" class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search class="h-5 w-5 text-gray-400" />
			</div>
			<input
				bind:value={searchQuery}
				type="search"
				name="query"
				class="w-full rounded-full bg-[#1E1E1E] py-2 pr-12 pl-10 text-white placeholder-gray-500 transition-all focus:ring-2 focus:ring-primary focus:outline-none"
				placeholder="Cari komik..."
				aria-label="Cari Komik"
			/>
		</form>
	</div>

	<div class="flex items-center">
		<button
			type="button"
			onclick={() => (isOpen = !isOpen)}
			aria-label="Buka menu"
			aria-expanded={isOpen}
			class="relative z-20 p-2 lg:hidden"
		>
			{#if isOpen}
				<X class="h-6 w-6 text-white" />
			{:else}
				<Menu class="h-6 w-6 text-white" />
			{/if}
		</button>

		<div
			use:clickOutside
			class="
        {isOpen ? 'flex' : 'hidden'}
        absolute
        top-16 right-4
        z-10 w-56
        flex-col gap-2
        rounded-lg bg-[#2a2a2a] p-4 shadow-lg lg:relative lg:top-auto lg:right-auto lg:flex
        lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:bg-transparent lg:p-0 lg:shadow-none
      "
		>
			<a
				href={resolve('/bookmark')}
				aria-label="Bookmark"
				title="Bookmark"
				class="group flex w-full cursor-pointer items-center gap-3 rounded p-2 hover:bg-primary lg:inline-flex lg:w-auto lg:p-2"
			>
				<Bookmark class="h-5 w-5 text-white group-hover:text-black" />
				<span class="text-white lg:hidden">Bookmark</span>
			</a>

			<a
				href={resolve('/history')}
				aria-label="History"
				title="History"
				class="group flex w-full cursor-pointer items-center gap-3 rounded p-2 hover:bg-primary lg:inline-flex lg:w-auto lg:p-2"
			>
				<History class="h-5 w-5 text-white group-hover:text-black" />
				<span class="text-white lg:hidden">History</span>
			</a>

			{#if !isDetail}
				<select
					id="source-select"
					value={selected}
					onchange={onSourceChange}
					class="w-full rounded-md border border-gray-600 bg-third px-2 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none lg:w-auto lg:py-1"
					aria-label="Pilih sumber"
				>
					{#each sourceOptions as opt (opt.value)}
						<option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
					{/each}
				</select>
			{:else}
				<select
					id="source-select"
					value={selected}
					class="w-full cursor-not-allowed rounded-md border border-gray-600 bg-third px-2 py-2 text-sm text-grey lg:w-auto lg:py-1"
					aria-label="Sumber (read-only)"
					disabled
				>
					{#each sourceOptions as opt (opt.value)}
						<option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
					{/each}
				</select>
			{/if}

			<button
				type="button"
				aria-label="Download"
				title="Download"
				class="group flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-primary bg-transparent p-2 transition-colors hover:bg-primary focus:ring-2 focus:outline-none"
			>
				<Smartphone
					class="h-[1.25rem] w-[1.25rem] text-white transition-colors group-hover:text-black"
				/>
				<span class="font-medium text-white transition-colors group-hover:text-black">Download</span
				>
			</button>
		</div>
	</div>
</div>
