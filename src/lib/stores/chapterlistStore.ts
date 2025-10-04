import type { ChapterItemType } from '$lib/api/types/ChapterItemType';
import { writable } from 'svelte/store';

// Store ini akan menyimpan href dari komik detail dan daftar chapternya
type ChapterCache = {
	detailHref: string;
	chapters: ChapterItemType[];
};

// Inisialisasi store dengan nilai null
export const chapterListStore = writable<ChapterCache | null>(null);
