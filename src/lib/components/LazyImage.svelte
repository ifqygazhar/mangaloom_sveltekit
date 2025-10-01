<script lang="ts">
	let {
		src,
		alt,
		class: imgClass = '',
		containerClass = ''
	} = $props<{
		src: string;
		alt: string;
		class?: string;
		containerClass?: string;
	}>();

	let loaded = $derived(false);

	$effect(() => {
		loaded = false;
	});
</script>

<div class="{containerClass} relative bg-gray-800">
	{#if !loaded}
		<div class="absolute inset-0 overflow-hidden">
			<div
				class="shimmer-wave absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"
			></div>
		</div>
	{/if}

	<img
		{src}
		{alt}
		class="{imgClass} transition-opacity duration-300 {loaded ? 'opacity-100' : 'opacity-0'}"
		onload={() => {
			loaded = true;
		}}
		onerror={() => {
			loaded = true;
		}}
	/>
</div>

<style>
	.shimmer-wave {
		/* Menerapkan animasi 'shimmer' selama 2 detik, berjalan terus-menerus */
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		/* Animasi bergerak dari posisi awal (-100% dari lebar)
      ke posisi akhir (100% dari lebar), menciptakan efek gelombang
    */
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
