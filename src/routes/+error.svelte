<script lang="ts">
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { page } from '$app/state';
</script>

{#if page.status === 404}
	<ErrorDisplay message={`Terjadi kesalahan ${page.error?.message}`} is404={true} />
{:else}
	<ErrorDisplay message={`Terjadi kesalahan ${page.error?.message}`} is404={false} />
{/if}
