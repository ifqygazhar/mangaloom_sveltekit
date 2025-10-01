<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { baseurlStore } from '$lib/stores/baseurlStore';
	import NavLeft from '$lib/components/NavLeft.svelte';
	import NavRight from '$lib/components/NavRight.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children, data } = $props();
	const year: number = new Date().getFullYear();

	let isDesktop = $state(false);

	onMount(async () => {
		// Logika untuk baseurlStore dengan caching
		const storageKey = 'baseUrl';
		const cachedBaseUrl = localStorage.getItem(storageKey);

		if (cachedBaseUrl) {
			// Jika ada di cache, langsung gunakan
			baseurlStore.set(cachedBaseUrl);
		} else {
			// Jika tidak ada, fetch dari API endpoint yang aman
			const response = await fetch('/api/base-url');
			if (response.ok) {
				const data = await response.json();
				const freshBaseUrl = data.baseUrl;
				if (freshBaseUrl) {
					baseurlStore.set(freshBaseUrl);
					localStorage.setItem(storageKey, freshBaseUrl);
				}
			}
		}

		// Logika untuk screen size (tetap sama)
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
		const scriptId = 'cid0020000420231913318';
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

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Primary SEO -->
	<title>Mangaloom — Baca Komik Manga, Manhwa & Manhua Gratis</title>
	<meta
		name="description"
		content="Mangaloom — baca komik manga, manhwa, dan manhua secara gratis. Temukan ratusan judul terbaru dan klasik, update harian, dan antarmuka yang ringan untuk pengalaman membaca terbaik."
	/>
	<meta
		name="keywords"
		content="Mangaloom, baca komik, manga, manhwa, manhua, komik gratis, baca manga online"
	/>
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Mangaloom — Baca Komik Manga, Manhwa & Manhua Gratis" />
	<meta
		property="og:description"
		content="Baca komik manga, manhwa, dan manhua secara gratis di Mangaloom. Koleksi lengkap, update cepat, dan pengalaman membaca yang nyaman."
	/>
	<meta property="og:image" content="og-image.png" />
	<meta property="og:url" content="" />
	<meta property="og:site_name" content="Mangaloom" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Mangaloom — Baca Komik Manga, Manhwa & Manhua Gratis" />
	<meta
		name="twitter:description"
		content="Baca komik manga, manhwa, dan manhua secara gratis di Mangaloom. Koleksi lengkap dan update harian."
	/>
	<meta name="twitter:image" content="{data.baseUrl ?? ''}/og-image.png" />

	<!-- Canonical (gunakan baseUrl yang disediakan oleh data) -->
	<!-- {#if data?.baseUrl}
		<link rel="canonical" href={data.baseUrl} />
	{/if} -->
</svelte:head>

<header class="sticky top-0 z-50 flex w-full items-center justify-between bg-secondary px-4 py-2">
	<NavLeft />
	<NavRight />
</header>

<main class="">
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
