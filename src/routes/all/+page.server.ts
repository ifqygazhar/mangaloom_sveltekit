import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse.js';
import { json, type Actions } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;
		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;

		const allkomikFetch = await fetch(`${baseUrl}${endpointInstance.allComic(1)}`, {
			headers: header
		});
		const komik = await safeJsonParse<ComicItemType>(allkomikFetch);

		return {
			allkomik: komik,
			source: source,
			hasMore: komik.length > 0
		};
	} catch (e) {
		console.error('Error loading all komik:', e);
		return {
			error: 'Gagal memuat data komik dari server. Silakan coba lagi nanti.',
			allkomik: [],
			source: SourceType.V3,
			hasMore: false
		};
	}
}

export const actions: Actions = {
	loadMore: async ({ request }) => {
		const formData = await request.formData();
		const page = Number(formData.get('page'));
		const source = formData.get('source') as SourceType;

		try {
			const endpointInstance = new Endpoint({ sourceType: source });
			const baseUrl = URI;

			const response = await fetch(`${baseUrl}${endpointInstance.newComic(page)}`, {
				headers: header // <-- API Key Rahasia digunakan di sini, di server
			});

			if (!response.ok) {
				return json({ comics: [], hasMore: false });
			}

			const comics = await safeJsonParse<ComicItemType>(response);
			const hasMore = comics.length > 0;

			// Kembalikan hanya data yang baru
			return { comics, hasMore };
		} catch (e) {
			console.error('Error fetching more comics:', e);
			return { comics: [], hasMore: false };
		}
	}
};
