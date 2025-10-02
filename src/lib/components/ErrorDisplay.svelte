<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	let { message = 'Terjadi kesalahan yang tidak diketahui.' } = $props<{
		message: string;
	}>();
</script>

<div
	class="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-4 text-center"
	role="alert"
>
	<AlertTriangle class="h-16 w-16 text-red-500" />
	<h1 class="text-2xl font-bold text-white">Oops! Terjadi Kesalahan</h1>
	<p class="max-w-md text-gray-400">{message}</p>
	<button
		onclick={() => window.location.reload()}
		class="mt-4 cursor-pointer rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-transform hover:scale-105"
	>
		Coba Lagi
	</button>
</div>
