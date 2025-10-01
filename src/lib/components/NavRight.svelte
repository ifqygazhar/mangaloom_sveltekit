<script lang="ts">
	import { onDestroy } from 'svelte';
	import Fa from 'svelte-fa';
	import { faBookmark, faHistory, faSearch, faMobile } from '@fortawesome/free-solid-svg-icons';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { SourceType } from '$lib/config/sourceType';
	// 1. Impor ikon Menu dan X dari lucide-svelte
	import { Menu, X } from '@lucide/svelte';

	let { isOpen = false, selected = SourceType.V3 } = $props<{
		isOpen?: boolean;
		selected?: SourceType;
	}>();

	const unsubscribe = sourceStore.subscribe((v) => (selected = v));
	onDestroy(() => unsubscribe());

	function onSourceChange() {
		sourceStore.set(selected);
	}

	const sourceOptions = [
		{ value: SourceType.V1, label: 'General (v1)' },
		{ value: SourceType.V2, label: 'General (v2)' },
		{ value: SourceType.V3, label: 'Stabil (v3)' },
		{ value: SourceType.V4, label: 'Dark (v4)' },
		{ value: SourceType.V5, label: 'Manhwa (v5)' }
	];

	// Aksi untuk mendeteksi klik di luar elemen
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
	<form
		action="/cari"
		method="get"
		role="search"
		class="relative w-full max-w-xs flex-1 sm:max-w-md lg:w-80 lg:flex-none"
	>
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<Fa icon={faSearch} class="text-gray-400" style="width:1.25rem;height:1.25rem;" />
		</div>
		<input
			name="q"
			type="search"
			class="w-full rounded-full bg-[#1E1E1E] py-2 pr-12 pl-10 text-white placeholder-gray-500 transition-all focus:ring-2 focus:ring-primary focus:outline-none"
			placeholder="Cari komik..."
			aria-label="Cari Komik"
		/>
	</form>

	<div class="flex items-center">
		<button
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
			<button
				aria-label="Bookmark"
				title="Bookmark"
				class="group flex w-full cursor-pointer items-center gap-3 rounded p-2 hover:bg-primary lg:inline-flex lg:w-auto lg:p-2"
			>
				<Fa
					icon={faBookmark}
					class="text-white group-hover:text-black"
					style="width:1.25rem;height:1.25rem;"
				/>
				<span class="text-white lg:hidden">Bookmark</span>
			</button>

			<button
				aria-label="History"
				title="History"
				class="group flex w-full cursor-pointer items-center gap-3 rounded p-2 hover:bg-primary lg:inline-flex lg:w-auto lg:p-2"
			>
				<Fa
					icon={faHistory}
					class="text-white group-hover:text-black"
					style="width:1.25rem;height:1.25rem;"
				/>
				<span class="text-white lg:hidden">History</span>
			</button>

			<select
				id="source-select"
				bind:value={selected}
				onchange={onSourceChange}
				class="w-full rounded-md border border-gray-600 bg-[#1E1E1E] px-2 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none lg:w-auto lg:py-1"
				aria-label="Pilih sumber"
			>
				{#each sourceOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>

			<button
				aria-label="Download"
				title="Download"
				class="group flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-primary bg-transparent p-2 transition-colors hover:bg-primary focus:ring-2 focus:outline-none"
			>
				<Fa
					icon={faMobile}
					class="h-[1.25rem] w-[1.25rem] text-white transition-colors group-hover:text-black"
				/>
				<span class="font-medium text-white transition-colors group-hover:text-black">Download</span
				>
			</button>
		</div>
	</div>
</div>
