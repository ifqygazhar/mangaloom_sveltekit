export type ComicReadType = {
	title: string;
	prev: string;
	next: string;
	panel: string[] | [];
};

export function parseComicReadFromJson(json: any): ComicReadType {
	const panels = Array.isArray(json.panel) ? json.panel : [];
	return {
		title: json.title || '',
		prev: json.prev || '',
		next: json.next || '',
		panel: panels
	};
}
