<script lang="ts">
	import GeneralVerticalComic from '$lib/components/GeneralVerticalComic.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: allkomik = data.allkomik;
</script>

<GeneralVerticalComic
	title="Daftar Komik 📜"
	shortdesc="Jelajahi koleksi lengkap komik kami"
	items={allkomik}
/>
