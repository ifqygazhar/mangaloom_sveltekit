import { derived } from 'svelte/store';
import { sourceStore } from '$lib/stores/sourceStore';
import { SourceType } from '$lib/config/sourceType';

import { API_KEY, URI } from '$env/static/private';

let baseUrlCache: string | null = null;
export const apiKey = API_KEY;

export async function getBaseUrl(): Promise<string> {
	if (baseUrlCache) {
		return baseUrlCache;
	}

	try {
		const response = await fetch(URI);
		if (!response.ok) {
			throw new Error(`Failed to load config: ${response.status}`);
		}

		const configData = await response.text();
		const lines = configData.split('\n');

		for (const line of lines) {
			if (line.startsWith('newmain=')) {
				baseUrlCache = line.substring('newmain='.length).trim();
				console.log('Base URL fetched:', baseUrlCache);
				return baseUrlCache;
			}
		}

		throw new Error('Base URL not found in config');
	} catch (e) {
		console.error('Error fetching base URL:', e);
		return '';
	}
}

export class Endpoint {
	private sourceType: SourceType;

	constructor({ sourceType }: { sourceType: SourceType }) {
		this.sourceType = sourceType;
	}

	private get _prefix(): string {
		switch (this.sourceType) {
			case SourceType.V1:
				return '';
			case SourceType.V2:
				return '/kiryuu';
			case SourceType.V3:
				return '/komiku';
			case SourceType.V4:
				return '/komiklu';
			case SourceType.V5:
				return '/comicsans';
			default:
				return '';
		}
	}

	get popularComic(): string {
		return `${this._prefix}/popular`;
	}
	get recommendedComic(): string {
		return `${this._prefix}/recommended`;
	}
	get genreComic(): string {
		return `${this._prefix}/genre`;
	}

	newComic(page: number): string {
		return `${this._prefix}/newest?page=${page}`;
	}
	allComic(page: number): string {
		return `${this._prefix}/comics/${page}`;
	}
	detailComic(href: string): string {
		return `${this._prefix}/detail${href}`;
	}
	comicByGenre(genre: string, page: number): string {
		return `${this._prefix}/comic/${genre}/${page}`;
	}
	searchComic(query: string): string {
		return `${this._prefix}/search?keyword=${query}`;
	}
	filterComic(page: number, genre: string, status: string, type: string, order: string): string {
		return `${this._prefix}/filters?page=${page}&genre=${genre}&status=${status}&type=${type}&order=${order}`;
	}
	readComic(href: string): string {
		return `${this._prefix}/read${href}`;
	}
}

export const endpoint = derived(
	sourceStore,
	($sourceType) => new Endpoint({ sourceType: $sourceType })
);
