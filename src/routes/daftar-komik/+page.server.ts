import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse.js';
import { json, type Actions } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V5;
		const page = parseInt(url.searchParams.get('page') || '1', 10); // FIXED: Changed from 1 to 10
		const genre = url.searchParams.get('genre') || '';
		const status = url.searchParams.get('status') || '';
		const type = url.searchParams.get('type') || '';
		const order = url.searchParams.get('order') || '';

		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;

		const allkomikFetch = await fetch(
			`${baseUrl}${endpointInstance.filterComic(page, genre, status, type, order)}`,
			{
				headers: header
			}
		);
		// console.log('url fetch :', allkomikFetch.url);

		const komik = await safeJsonParse<ComicItemType>(allkomikFetch);

		return {
			allkomik: komik,
			genre: genre,
			status: status,
			type: type,
			order: order,
			source: source,
			hasMore: komik.length > 0
		};
	} catch (e) {
		console.error('Error loading all komik:', e);
		return {
			error: 'Gagal memuat data komik dari server. Silakan coba lagi nanti.',
			allkomik: [],
			genre: '',
			status: '',
			type: '',
			order: '',
			source: SourceType.V3,
			hasMore: false
		};
	}
}

export const actions: Actions = {
	loadMore: async ({ request }) => {
		const formData = await request.formData();
		const page = Number(formData.get('page'));
		const genre = formData.get('genre') as string;
		const status = formData.get('status') as string;
		const type = formData.get('type') as string;
		const order = formData.get('order') as string;
		const source = formData.get('source') as SourceType;

		try {
			const endpointInstance = new Endpoint({ sourceType: source });
			const baseUrl = URI;

			const response = await fetch(
				`${baseUrl}${endpointInstance.filterComic(page, genre, status, type, order)}`,
				{
					headers: header
				}
			);

			console.log('loadMore fetch URL:', response.url); // IMPROVED: Log the URL

			if (!response.ok) {
				return json({ comics: [], hasMore: false });
			}

			const comics = await safeJsonParse<ComicItemType>(response);
			const hasMore = comics.length > 0;

			return { comics, hasMore };
		} catch (e) {
			console.error('Error fetching more comics:', e);
			return { comics: [], hasMore: false };
		}
	}
};
