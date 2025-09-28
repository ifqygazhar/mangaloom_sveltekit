export type GenreItemType = {
	title: string;
	href: string;
};

export function parseGenreItemFromJson(json: any): GenreItemType {
	return {
		title: json.title || '',
		href: json.href || ''
	};
}
