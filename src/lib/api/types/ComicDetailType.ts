import { type ChapterItemType } from './ChapterItemType';
import { type GenreItemType } from './GenreItemType';

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
	const genres = Array.isArray(json.genre) ? json.genre : [];
	const chapters = Array.isArray(json.chapter) ? json.chapter : [];
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
