import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse.js';

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
