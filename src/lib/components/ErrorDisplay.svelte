<script lang="ts">
	import { resolve } from '$app/paths';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileSearch from '@lucide/svelte/icons/file-search'; // 1. Impor ikon baru untuk 404

	let {
		message = 'Terjadi kesalahan yang tidak diketahui.',
		is404 = false // 3. Tambahkan prop boolean 'is404'
	} = $props<{
		message: string;
		is404?: boolean; // Jadikan opsional
	}>();
</script>

<div
	class="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-4 text-center"
	role="alert"
>
	{#if is404}
		<FileSearch class="h-16 w-16 text-primary" />
		<h1 class="text-2xl font-bold text-white">404 - Halaman Tidak Ditemukan</h1>
	{:else}
		<AlertTriangle class="h-16 w-16 text-red-500" />
		<h1 class="text-2xl font-bold text-white">Oops! Terjadi Kesalahan</h1>
	{/if}

	<p class="max-w-md text-gray-400">{message}</p>

	{#if is404}
		<a
			href={resolve('/')}
			class="mt-4 cursor-pointer rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-transform hover:scale-105"
		>
			Kembali ke Beranda
		</a>
	{:else}
		<button
			onclick={() => window.location.reload()}
			class="mt-4 cursor-pointer rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-transform hover:scale-105"
		>
			Coba Lagi
		</button>
	{/if}
</div>
