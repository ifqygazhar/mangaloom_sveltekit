<script lang="ts">
	import BookmarkPlus from '@lucide/svelte/icons/bookmark-plus';
	import BookmarkMinus from '@lucide/svelte/icons/bookmark-minus';
	let { onBookmark, isBookmarked } = $props<{
		onBookmark?: () => void;
		isBookmarked?: boolean;
	}>();
</script>

<button
	onclick={onBookmark}
	class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:w-[30.5rem]"
>
	{#if isBookmarked}
		<BookmarkMinus class="h-5 w-5" />
	{:else}
		<BookmarkPlus class="h-5 w-5" />
	{/if}
	<span>{isBookmarked ? 'Unbookmark' : 'Bookmark'}</span>
</button>
