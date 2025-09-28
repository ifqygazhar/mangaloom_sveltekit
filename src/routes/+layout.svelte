<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { baseurlStore } from '$lib/stores/baseurlStore';
	import { onMount } from 'svelte';
	import NavLeft from '$lib/components/NavLeft.svelte';
	import NavRight from '$lib/components/NavRight.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children, data } = $props();
	const year: number = new Date().getFullYear();

	onMount(() => {
		if (data.baseUrl) {
			baseurlStore.set(data.baseUrl);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="sticky top-0 z-50 flex w-full items-center justify-between bg-secondary px-4 py-2">
	<NavLeft />
	<NavRight />
</header>

<main class="flex h-screen flex-col overflow-auto bg-black">
	{@render children?.()}
</main>
<BottomNav />
<footer class="mt-auto bg-secondary pt-2 pb-22 text-center text-white lg:p-4">
	<p class="mb-1">
		Dibuat dengan
		<span role="img" aria-label="orange heart" class="mx-1 text-orange-400">🧡</span>
		oleh Team Mangaloom
	</p>
	<p class="mb-1">&copy; {year} Mangaloom</p>
</footer>
