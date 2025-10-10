import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse.js';
import type { Actions } from '@sveltejs/kit';

export async function load({ fetch, url, params }) {
	try {
		const genre = params.href;
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;
		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;

		const genreKomikFetch = await fetch(`${baseUrl}${endpointInstance.comicByGenre(genre, 1)}`, {
			headers: header
		});
		const komik = await safeJsonParse<ComicItemType>(genreKomikFetch);

		return {
			genreKomik: komik,
			source: source,
			genre: genre,
			hasMore: komik.length > 0
		};
	} catch (e) {
		console.error('Error loading genre komik:', e);
		return {
			error: 'Gagal memuat data komik dari server. Silakan coba lagi nanti.',
			genreKomik: [],
			genre: '',
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
		const genre = formData.get('genre') as string;

		try {
			const endpointInstance = new Endpoint({ sourceType: source });
			const baseUrl = URI;

			const response = await fetch(`${baseUrl}${endpointInstance.comicByGenre(genre, page)}`, {
				headers: header
			});

			if (!response.ok) {
				return { comics: [], hasMore: false };
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
