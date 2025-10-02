<script lang="ts">
	import { navigating } from '$app/stores';

	let navigatingValue = $derived(navigating);
</script>

{#if $navigatingValue}
	<div class="animate-progress fixed top-0 left-0 z-50 h-1 bg-primary"></div>
{/if}

<style>
	@keyframes progress {
		0% {
			width: 0%;
		}
		100% {
			width: 100%;
		}
	}
	.animate-progress {
		animation: progress 2s linear infinite;
	}
</style>
