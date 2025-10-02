import { API_KEY, URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';

export async function load({ fetch, url }) {
	console.log(`Source: ${url.searchParams.get('source')}`);

	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;
		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;
		const header = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': API_KEY
		};
		const recommendedPromise = fetch(`${baseUrl}${endpointInstance.recommendedComic}`, {
			headers: header
		});
		const popularPromise = fetch(`${baseUrl}${endpointInstance.popularComic}`, {
			headers: header
		});
		const newestPromise = fetch(`${baseUrl}${endpointInstance.newComic(1)}`, {
			headers: header
		});
		const actionPromise = fetch(`${baseUrl}${endpointInstance.comicByGenre('action', 1)}`, {
			headers: header
		});
		const comedyPromise = fetch(`${baseUrl}${endpointInstance.comicByGenre('comedy', 1)}`, {
			headers: header
		});
		const echiPromise = fetch(`${baseUrl}${endpointInstance.comicByGenre('ecchi', 1)}`, {
			headers: header
		});

		const [recommended, popular, newest, action, comedy, echi] = await Promise.all([
			recommendedPromise,
			popularPromise,
			newestPromise,
			actionPromise,
			comedyPromise,
			echiPromise
		]);
		const safeJsonParse = async (response: Response): Promise<ComicItemType[]> => {
			if (!response.ok) {
				return [];
			}
			const api = await response.json();

			return Array.isArray(api.data) ? api.data : [];
		};

		const recommendedRes = await safeJsonParse(recommended);
		const popularRes = await safeJsonParse(popular);
		const newestRes = await safeJsonParse(newest);
		const actionRes = await safeJsonParse(action);
		const comedyRes = await safeJsonParse(comedy);
		const echiRes = await safeJsonParse(echi);

		return {
			recommended: recommendedRes,
			popular: popularRes,
			newest: newestRes,
			action: actionRes,
			comedy: comedyRes,
			echi: echiRes
		};
	} catch (error) {
		console.error('Error in +page.server.load:', error);
		return {
			error: 'Gagal mengambil data dari server. Silakan coba lagi nanti.',
			recommended: [],
			popular: [],
			newest: [],
			action: [],
			comedy: [],
			echi: []
		};
	}
}
