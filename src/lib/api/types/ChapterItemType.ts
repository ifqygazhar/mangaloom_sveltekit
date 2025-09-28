export type ChapterItemType = {
	title: string;
	href: string;
	date: string;
	isHasBeenRead: boolean | false;
	downloadUrl: string | '';
};

export function parseChapterItemFromJson(json: any): ChapterItemType {
	return {
		title: json.title || '',
		href: json.href || '',
		date: json.date || '',
		isHasBeenRead: json.isHasBeenRead || false,
		downloadUrl: json.downloadUrl || ''
	};
}
