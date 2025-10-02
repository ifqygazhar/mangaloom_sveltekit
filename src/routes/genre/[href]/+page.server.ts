import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse.js';

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
