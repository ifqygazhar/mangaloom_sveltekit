<script lang="ts">
	import { resolve } from '$app/paths';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileSearch from '@lucide/svelte/icons/file-search';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import History from '@lucide/svelte/icons/history';

	let {
		message = 'Terjadi kesalahan yang tidak diketahui.',
		is404 = false,
		isBookmark = false,
		isHistory = false
	} = $props<{
		message?: string;
		is404?: boolean;
		isBookmark?: boolean;
		isHistory?: boolean;
	}>();

	const config = $derived(
		is404
			? {
					icon: FileSearch,
					iconColor: 'text-primary',
					title: '404 - Halaman Tidak Ditemukan',
					defaultMessage: 'Halaman yang Anda cari tidak ditemukan.',
					buttonText: 'Kembali ke Beranda',
					buttonAction: 'navigate' as const,
					navigateTo: '/'
				}
			: isBookmark
				? {
						icon: Bookmark,
						iconColor: 'text-yellow-500',
						title: 'Bookmark Kosong',
						defaultMessage:
							'Kamu belum menambahkan komik apapun ke bookmark. Mulai eksplorasi dan simpan komik favoritmu!',
						buttonText: 'Jelajahi Komik',
						buttonAction: 'navigate' as const,
						navigateTo: '/'
					}
				: isHistory
					? {
							icon: History,
							iconColor: 'text-blue-500',
							title: 'History Kosong',
							defaultMessage:
								'Belum ada riwayat bacaan. Mulai baca komik untuk melihat history-mu di sini!',
							buttonText: 'Mulai Membaca',
							buttonAction: 'navigate' as const,
							navigateTo: '/'
						}
					: {
							icon: AlertTriangle,
							iconColor: 'text-red-500',
							title: 'Oops! Terjadi Kesalahan',
							defaultMessage: 'Terjadi kesalahan yang tidak diketahui.',
							buttonText: 'Coba Lagi',
							buttonAction: 'reload' as const,
							navigateTo: null
						}
	);

	const IconComponent = $derived(config.icon);
	const displayMessage = $derived(message || config.defaultMessage);

	function handleAction() {
		if (config.buttonAction === 'reload') {
			window.location.reload();
		}
	}
</script>

<div
	class="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center"
	role="alert"
	aria-live="polite"
>
	<IconComponent class="h-16 w-16 {config.iconColor}" />

	<h1 class="text-2xl font-bold text-white md:text-3xl">
		{config.title}
	</h1>

	<p class="max-w-md text-base text-gray-400 md:text-lg">
		{displayMessage}
	</p>

	{#if config.buttonAction === 'navigate' && config.navigateTo}
		<a
			href={resolve(config.navigateTo)}
			class="mt-4 cursor-pointer rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
		>
			{config.buttonText}
		</a>
	{:else}
		<button
			onclick={handleAction}
			class="mt-4 cursor-pointer rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
		>
			{config.buttonText}
		</button>
	{/if}

	{#if isBookmark || isHistory}
		<div class="mt-6 flex flex-col gap-2 text-sm text-gray-500 md:flex-row md:gap-4">
			<a href={resolve('/terbaru')} class="transition-colors hover:text-primary hover:underline">
				Komik Terbaru
			</a>
			<span class="hidden md:inline">•</span>
			<a href={resolve('/all')} class="transition-colors hover:text-primary hover:underline">
				Semua Komik
			</a>
			<span class="hidden md:inline">•</span>
			<a href={resolve('/')} class="transition-colors hover:text-primary hover:underline">
				Beranda
			</a>
		</div>
	{/if}
</div>
