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
	genres = json.genre.map((item: GenreItemType) => {
		console.log('Parsing genre item:', item);
		return parseGenreItemFromJson(item);
	});

	let chapters: ChapterItemType[] = [];
	chapters = json.chapter.map((item: ChapterItemType) => {
		console.log('Parsing chapter item:', item);
		return parseChapterItemFromJson(item);
	});
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
