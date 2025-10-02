import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse.js';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const genre = url.searchParams.get('genre') || 'action';
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;

		const endpointInstance = new Endpoint({ sourceType: source });
		const baseUrl = URI;

		const response = await fetch(`${baseUrl}${endpointInstance.comicByGenre(genre, page)}`, {
			headers: header
		});

		if (!response.ok) {
			return json({ comics: [], hasMore: false }, { status: response.status });
		}

		const comics = await safeJsonParse<ComicItemType>(response);
		const hasMore = comics.length > 0;

		return json({ comics, hasMore });
	} catch (e) {
		console.error('Error fetching comics API:', e);
		return json({ comics: [], hasMore: false, error: 'Gagal memuat data.' }, { status: 500 });
	}
};
