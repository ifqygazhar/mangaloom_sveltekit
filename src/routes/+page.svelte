<script lang="ts">
	import { resolve } from '$app/paths';

	import Ads from '$lib/components/Ads.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import GeneralHorizontalComic from '$lib/components/GeneralHorizontalComic.svelte';
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import Phone from '@lucide/svelte/icons/phone';
	import Coffee from '@lucide/svelte/icons/coffee';
	import Heart from '@lucide/svelte/icons/heart';
	import Book from '@lucide/svelte/icons/book';
	import shuffle from '$lib/utils/shuffleitem';
	import type { PageData } from './$types';

	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { layoutMetadata } from '$lib/utils/metatagHelper';
	import Seo from '$lib/components/Seo.svelte';

	export let data: PageData;

	$: recommended = data.recommended;
	$: popular = data.popular;
	$: newest = data.newest;
	$: action = data.action;
	$: comedy = data.comedy;
	$: echi = data.echi;
</script>

<Seo metatag={layoutMetadata()} />

{#if data.error}
	<ErrorDisplay message={data.error} />
{:else}
	{#snippet phoneIcon()}
		<Phone
			class="h-4 w-4 text-black group-hover:text-primary-foreground lg:h-5 md:h-5 md:text-white group-hover:md:text-black"
		/>
	{/snippet}

	{#snippet coffeIcon()}
		<Coffee
			class="h-4 w-4 text-black group-hover:text-primary-foreground lg:h-5 md:h-5 md:text-white group-hover:md:text-black"
		/>
	{/snippet}

	{#snippet hearthIcon()}
		<Heart
			class="h-4 w-4 text-black group-hover:text-primary-foreground lg:h-5 md:h-5 md:text-white group-hover:md:text-black"
		/>
	{/snippet}

	<Banner items={recommended} />

	<GeneralHorizontalComic
		items={shuffle(recommended)}
		title="Rekomendasi Bulan Ini 🌟"
		shortdesc="Sebuah mahakarya yang direkomendasikan untuk Anda"
	/>

	<Ads
		icon={phoneIcon}
		title="Ingin membuat website atau aplikasi serupa ?"
		btnText="Hubungi"
		url="https://ifqy.dev"
	/>

	<GeneralHorizontalComic
		items={shuffle(popular)}
		isPopuler={true}
		title="Komik Populer 🚀"
		shortdesc="Deretan komik populer pilihan pembaca"
	/>

	<Ads
		icon={coffeIcon}
		title="Donasi sangat membantu agar web/app tetap hidup"
		btnText="Donate"
		url="https://saweria.co/ifqygazhar"
	/>

	<GeneralHorizontalComic
		items={shuffle(action)}
		title="Komik Aksi Untuk Kamu 🔫"
		shortdesc="Komik dengan genre aksi terbaik"
	/>

	<GeneralVerticalComic
		items={newest.slice(3, newest.length)}
		title="Episode Baru 🎬"
		shortdesc="Coba cek siapa tau ada komik yang kamu ikutin"
		isPopuler={false}
	/>

	<div class="w-full p-4">
		<a
			data-sveltekit-preload-data="tap"
			href={resolve('/terbaru')}
			class="group flex w-full cursor-pointer flex-row items-center justify-center gap-2 border-2 border-primary bg-primary p-2 md:bg-transparent md:hover:bg-primary"
			aria-label="Komik Terbaru"
		>
			<Book class="h-5 w-5 text-black md:text-white md:group-hover:text-black" />
			<h3 class="text-black md:text-white md:group-hover:text-black">Lihat Komik Terbaru</h3>
		</a>
	</div>

	<GeneralHorizontalComic
		items={shuffle(comedy)}
		title="Komedi Acumalaka 😂"
		shortdesc="Komik dengan genre komedi terbaik"
	/>
	<Ads
		icon={hearthIcon}
		title="Follow instagram kita"
		btnText="Follow"
		url="https://www.instagram.com/mangaloom.app"
	/>

	<GeneralHorizontalComic
		items={shuffle(echi)}
		title="Echhiiii!! 👀"
		shortdesc="Komik yang bikin kamu panas dingin le"
	/>

	<div class="w-full p-4">
		<a
			data-sveltekit-preload-data="tap"
			href={resolve('/all')}
			class="group flex w-full cursor-pointer flex-row items-center justify-center gap-2 border-2 border-primary bg-primary p-2 md:bg-transparent md:hover:bg-primary"
			aria-label="Lihat Semua Komik"
		>
			<Book class="h-5 w-5 text-black md:text-white md:group-hover:text-black" />
			<h3 class="text-black md:text-white md:group-hover:text-black">Lihat Semua Komik</h3>
		</a>
	</div>
{/if}
