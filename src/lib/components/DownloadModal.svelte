<script lang="ts">
	import { fade } from 'svelte/transition';
	import Download from '@lucide/svelte/icons/download';
	import Store from '@lucide/svelte/icons/store';
	import X from '@lucide/svelte/icons/x';

	// Props dengan $bindable untuk two-way binding di Svelte 5
	let { isOpen = $bindable(false) } = $props<{
		isOpen: boolean;
	}>();

	const apkUrl =
		'https://github.com/Mangaloom/mangaloom_public/releases/download/v2.3.0/mangaloom-v2.3.0-universal.apk';
	const playStoreComingSoon = false; // Set false jika sudah tersedia
	const playStoreUrl = 'https://play.google.com/store/apps/details?id=id.mangaloom.app&hl=id';

	// Function untuk menutup modal
	function closeModal() {
		isOpen = false;
	}

	// Handle keyboard events dengan $effect
	$effect(() => {
		if (isOpen) {
			const handleKeydown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					closeModal();
				}
			};

			document.addEventListener('keydown', handleKeydown);

			return () => {
				document.removeEventListener('keydown', handleKeydown);
			};
		}
	});

	// Handle backdrop click
	function handleBackdropClick() {
		closeModal();
	}

	// Prevent click propagation pada modal content
	function handleContentClick(e: MouseEvent) {
		e.stopPropagation();
	}
</script>

{#if isOpen}
	<div
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-labelledby="modal-title"
		transition:fade={{ duration: 150 }}
		onclick={handleBackdropClick}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
	>
		<div
			onclick={handleContentClick}
			class="relative flex w-full max-w-sm flex-col gap-4 rounded-xl bg-[#2a2a2a] p-6 shadow-2xl"
		>
			<!-- Header -->
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<h2 id="modal-title" class="text-xl font-bold text-white">Download Aplikasi</h2>
					<p class="mt-1 text-sm text-gray-400">Pilih metode unduhan yang Anda inginkan.</p>
				</div>
				<button
					onclick={closeModal}
					type="button"
					aria-label="Tutup modal"
					class="flex-shrink-0 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Download Options -->
			<div class="mt-2 flex flex-col gap-3">
				<!-- Direct Download Button -->
				<a
					href={apkUrl}
					download
					class="group flex w-full items-center justify-center gap-3 rounded-lg bg-primary p-3 text-black transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#2a2a2a] focus:outline-none"
				>
					<Download class="h-5 w-5" />
					<span class="font-semibold">Direct Download (APK)</span>
				</a>

				<!-- Play Store Button -->
				{#if playStoreComingSoon}
					<div
						class="relative flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg bg-white/5 p-3 text-gray-400"
					>
						<Store class="h-5 w-5 opacity-50" />
						<div class="flex flex-col items-center">
							<span class="font-semibold opacity-50">via Google Play</span>
							<span class="text-xs text-gray-500">Coming Soon</span>
						</div>
					</div>
				{:else}
					<a
						href={playStoreUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex w-full items-center justify-center gap-3 rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#2a2a2a] focus:outline-none"
					>
						<Store class="h-5 w-5" />
						<span class="font-semibold">via Google Play</span>
					</a>
				{/if}
			</div>
		</div>
	</div>
{/if}
