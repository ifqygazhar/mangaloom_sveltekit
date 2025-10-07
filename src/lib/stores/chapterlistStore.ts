import { writable } from 'svelte/store';
import type { ComicDetailType } from '$lib/api/types/ComicDetailType';
import type { SourceType } from '$lib/config/sourceType';

type ChapterCacheKey = `${string}|${SourceType}`;

type ChapterCache = {
	[key: ChapterCacheKey]: ComicDetailType['chapter'];
};

function createChapterStore() {
	const { subscribe, set, update } = writable<ChapterCache>({});

	const createKey = (detailHref: string, sourceType: SourceType): ChapterCacheKey => {
		return `${detailHref}|${sourceType}`;
	};

	return {
		subscribe,

		setChapters: (
			detailHref: string,
			sourceType: SourceType,
			chapters: ComicDetailType['chapter']
		) => {
			const key = createKey(detailHref, sourceType);
			update((cache) => ({ ...cache, [key]: chapters }));
			console.log(`✅ Chapters cached for ${detailHref} (${sourceType})`);
		},

		getChapters: (
			detailHref: string,
			sourceType: SourceType
		): ComicDetailType['chapter'] | undefined => {
			const key = createKey(detailHref, sourceType);
			let chapters: ComicDetailType['chapter'] | undefined;
			subscribe((cache) => {
				chapters = cache[key];
			})();

			return chapters;
		},

		// Hapus cache untuk detailHref dan sourceType tertentu
		remove: (detailHref: string, sourceType: SourceType) => {
			const key = createKey(detailHref, sourceType);
			update((cache) => {
				const newCache = { ...cache };
				delete newCache[key];
				return newCache;
			});
		},

		// Hapus semua cache
		clear: () => {
			set({});
		},

		// Debug: lihat semua keys di cache
		getAllKeys: (): string[] => {
			let keys: string[] = [];
			subscribe((cache) => {
				keys = Object.keys(cache);
			})();
			return keys;
		}
	};
}

export const chapterStore = createChapterStore();
