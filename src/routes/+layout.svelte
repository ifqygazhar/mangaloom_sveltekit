<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import '@fontsource-variable/dm-sans';

	import NavLeft from '$lib/components/NavLeft.svelte';
	import NavRight from '$lib/components/NavRight.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LoadingBar from '$lib/components/LoadingBar.svelte';
	import { SourceType } from '$lib/config/sourceType';
	import { sourceStore } from '$lib/stores/sourceStore';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import { layoutMetadata } from '$lib/utils/metatagHelper';

	let { children } = $props();
	const year: number = new Date().getFullYear();

	let isDesktop = $state(false);

	onMount(() => {
		// Logika untuk screen size (tetap sama)
		const urlSource = page.url.searchParams.get('source') as SourceType;
		if (urlSource && Object.values(SourceType).includes(urlSource)) {
			sourceStore.set(urlSource);
		}
		const desktopBreakpoint = 1280;
		const checkScreenSize = () => {
			isDesktop = window.innerWidth >= desktopBreakpoint;
		};
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	});
	$effect(() => {
		const urlSource = page.url.searchParams.get('source') as SourceType;
		if (urlSource && Object.values(SourceType).includes(urlSource)) {
			const currentSource = $sourceStore;
			if (urlSource !== currentSource) {
				sourceStore.set(urlSource);
			}
		}

		const scriptId = 'cid0020000420380444667';
		const existingScript = document.getElementById(scriptId);

		if (isDesktop) {
			if (!existingScript) {
				const script = document.createElement('script');
				script.id = scriptId;
				script.src = '//st.chatango.com/js/gz/emb.js';
				script.style.width = '200px';
				script.style.height = '300px';
				script.async = true;
				script.setAttribute('data-cfasync', 'false');
				script.textContent = JSON.stringify({
					handle: 'mangaloom',
					arch: 'js',
					styles: {
						a: 'ffcc33',
						b: 100,
						c: '000000',
						d: '000000',
						k: 'ffcc33',
						l: 'ffcc33',
						m: 'ffcc33',
						p: '10',
						q: 'ffcc33',
						r: 100,
						pos: 'bl',
						cv: 1,
						cvbg: 'ffcc33',
						cvfg: '000000',
						cvw: 75,
						cvh: 30
					}
				});
				document.body.appendChild(script);
			}
		} else {
			if (existingScript) {
				document.body.removeChild(existingScript);
			}
		}
	});
</script>

<Seo metatag={layoutMetadata()} />

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="apple-mobile-web-app-title" content="Mangaloom" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />
</svelte:head>

<header class="sticky top-0 z-50 flex w-full items-center justify-between bg-secondary px-4 py-2">
	<NavLeft />
	<NavRight />
</header>

<main class="flex flex-1 flex-col items-center">
	<LoadingBar />
	{@render children?.()}
</main>
<BottomNav />

<footer class="relative bottom-0 mt-auto bg-secondary pt-2 pb-22 text-center text-white lg:p-4">
	<p class="mb-1">
		Dibuat dengan
		<span role="img" aria-label="orange heart" class="mx-1 text-orange-400">🧡</span>
		oleh Team Mangaloom
	</p>
	<div class="mt-2 text-sm text-gray-400">
		<a href="/dmca" class="transition hover:text-primary hover:underline">DMCA</a>
		<span class="mx-2">|</span>
		<a href="/privacy-policy" class="transition hover:text-primary hover:underline"
			>Privacy Policy</a
		>
	</div>
</footer>
