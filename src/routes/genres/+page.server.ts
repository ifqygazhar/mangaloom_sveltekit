import { URI } from '$env/static/private';
import type { GenreItemType } from '$lib/api/types/GenreItemType';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse';

export async function load({ fetch, url }) {
	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;
		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;

		const genresFetch = await fetch(`${baseUrl}${endpointInstance.genreComic}`, {
			headers: header
		});
		// console.log('genresFetch object:', genresFetch);
		const komik = await safeJsonParse<GenreItemType>(genresFetch);
		// console.log('genres:', komik);
		return {
			genres: komik,
			source: source
		};
	} catch (e) {
		console.error('Error loading genres:', e);
		return {
			error: 'Gagal memuat data genres dari server. Silakan coba lagi nanti.',
			genres: [],
			source: SourceType.V3
		};
	}
}
