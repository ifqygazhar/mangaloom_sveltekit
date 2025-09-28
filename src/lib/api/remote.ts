import { get } from 'svelte/store';
import { baseurlStore } from '$lib/stores/baseurlStore';
import { parseComicItemFromJson, type ComicItemType } from './types/ComicItemType';
import { parseGenreItemFromJson, type GenreItemType } from './types/GenreItemType';
import { parseComicDetailFromJson, type ComicDetailType } from './types/ComicDetailType';
import { parseComicReadFromJson, type ComicReadType } from './types/ComicReadType';
import { apiKey, endpoint } from '$lib/utils/endpoint';

async function fetcher(path: string) {
	const baseUrl = get(baseurlStore);
	if (!baseUrl) {
		throw new Error('Base URL has not been set.');
	}
	const fullUrl = `${baseUrl}${path}`;

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'X-API-KEY': apiKey
	};

	try {
		const response = await fetch(fullUrl, { headers });
		if (!response.ok) {
			throw new Error(`Request failed: ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		console.error('API fetch error:', error);
		throw error;
	}
}

export async function fetchPopular(): Promise<ComicItemType[]> {
	const path = get(endpoint).popularComic;
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchRecommended(): Promise<ComicItemType[]> {
	const path = get(endpoint).recommendedComic;
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchGenres(): Promise<GenreItemType[]> {
	const path = get(endpoint).genreComic;
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseGenreItemFromJson) : [];
}

export async function fetchNewComic(page: number): Promise<ComicItemType[]> {
	const path = get(endpoint).newComic(page);
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchAllComic(page: number): Promise<ComicItemType[]> {
	const path = get(endpoint).allComic(page);
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchComicByGenre(genre: string, page: number): Promise<ComicItemType[]> {
	const path = get(endpoint).comicByGenre(genre, page);
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchSearchComic(query: string): Promise<ComicItemType[]> {
	const path = get(endpoint).searchComic(query);
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchFilteredComic(
	page: number,
	genre: string,
	status: string,
	type: string,
	order: string
): Promise<ComicItemType[]> {
	const path = get(endpoint).filterComic(page, genre, status, type, order);
	const rawData = await fetcher(path);
	return Array.isArray(rawData) ? rawData.map(parseComicItemFromJson) : [];
}

export async function fetchDetailComic(href: string): Promise<ComicDetailType> {
	const path = get(endpoint).detailComic(href);
	const rawData = await fetcher(path);
	return parseComicDetailFromJson(rawData);
}

export async function fetchReadComic(href: string): Promise<ComicReadType> {
	const path = get(endpoint).readComic(href);
	const rawData = await fetcher(path);
	return parseComicReadFromJson(rawData);
}
