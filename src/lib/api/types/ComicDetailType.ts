import { parseChapterItemFromJson, type ChapterItemType } from './ChapterItemType';
import { parseGenreItemFromJson, type GenreItemType } from './GenreItemType';

export type ComicDetailType = {
	title: string;
	altTitle: string;
	thumbnail: string;
	description: string;
	status: string;
	author: string;
	type: string;
	released: string;
	updatedOn: string;
	rating: string;
	genre: GenreItemType[];
	chapter: ChapterItemType[];
};

export function parseComicDetailFromJson(json: any): ComicDetailType {
	let genres: GenreItemType[] = [];
	if (Array.isArray(json.genre) && json.genre.length > 0) {
		genres = json.genre.map((item: GenreItemType) => {
			return parseGenreItemFromJson(item);
		});
	}

	let chapters: ChapterItemType[] = [];
	if (Array.isArray(json.chapter)) {
		const rawChapters = json.chapter.map((item: ChapterItemType) => {
			return parseChapterItemFromJson(item);
		});

		const uniqueChaptersMap = new Map<string, ChapterItemType>();
		for (const chapter of rawChapters) {
			if (!uniqueChaptersMap.has(chapter.href)) {
				uniqueChaptersMap.set(chapter.href, chapter);
			}
		}
		chapters = Array.from(uniqueChaptersMap.values());
	}
	return {
		title: json.title || '',
		altTitle: json.altTitle || '',
		thumbnail: json.thumbnail || '',
		description: json.description || '',
		status: json.status || '',
		author: json.author || '',
		type: json.type || '',
		released: json.released || '',
		updatedOn: json.updatedOn || '',
		rating: json.rating || '',
		genre: genres,
		chapter: chapters
	};
}
