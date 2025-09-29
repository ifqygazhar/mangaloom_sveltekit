export type ComicItemType = {
	title: string;
	href: string;
	thumbnail: string;
	type: string | '';
	chapter: string | '';
	rating: string | '';
	genre?: string | '';
	year?: string | '';
	isBookmark?: boolean | false;
};

export function parseComicItemFromJson(json: any): ComicItemType {
	return {
		title: json.title || '',
		href: json.href || '',
		thumbnail: json.thumbnail || '',
		type: json.type || '',
		chapter: json.chapter || '',
		rating: json.rating || '',
		genre: json.genre || '',
		year: json.year || '',
		isBookmark: json.isBookmark || false
	};
}
