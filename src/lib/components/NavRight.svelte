<script lang="ts">
	import { onDestroy } from 'svelte';
	import Fa from 'svelte-fa';
	import { faBookmark, faHistory, faSearch, faMobile } from '@fortawesome/free-solid-svg-icons';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { SourceType } from '$lib/config/sourceType';

	let selected: SourceType = SourceType.V3;
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
</script>

<div class="flex items-center gap-3">
	<!-- Search: fleksibel, tumbuh untuk mengambil ruang yang tersedia di header -->
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

	<!-- aksi kanan: bookmark/history hanya di desktop (lg), download tersedia di semua layar -->
	<div class="flex items-center gap-2">
		<!-- bookmark & history hanya tampil di desktop -->
		<button
			aria-label="Bookmark"
			title="Bookmark"
			class="group hidden cursor-pointer rounded p-2 hover:bg-primary lg:inline-flex"
		>
			<Fa
				icon={faBookmark}
				class="text-white group-hover:text-black"
				style="width:1.25rem;height:1.25rem;"
			/>
		</button>

		<button
			aria-label="History"
			title="History"
			class="group hidden cursor-pointer rounded p-2 hover:bg-primary lg:inline-flex"
		>
			<Fa
				icon={faHistory}
				class="text-white group-hover:text-black"
				style="width:1.25rem;height:1.25rem;"
			/>
		</button>

		<label for="source-select" class="sr-only">Pilih sumber</label>
		<select
			id="source-select"
			bind:value={selected}
			on:change={onSourceChange}
			class="rounded-md border border-gray-600 bg-[#1E1E1E] px-2 py-1 text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none"
			aria-label="Pilih sumber"
		>
			{#each sourceOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>

		<!-- Download: tampil di semua device. teks muncul mulai sm/md -->
		<button
			aria-label="Download"
			title="Download"
			class="group flex cursor-pointer items-center gap-2 rounded-md border-2 border-primary bg-transparent p-2 transition-colors hover:bg-primary focus:ring-2 focus:outline-none"
		>
			<Fa
				icon={faMobile}
				class="text-white transition-colors group-hover:text-black"
				style="width:1.25rem;height:1.25rem;"
			/>
			<span class="hidden font-medium text-white transition-colors group-hover:text-black sm:inline"
				>Download</span
			>
		</button>
	</div>
</div>
