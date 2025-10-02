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
		const query = url.searchParams.get('query') || '';
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;

		const endpointInstance = new Endpoint({ sourceType: source });
		const baseUrl = URI;

		const response = await fetch(`${baseUrl}${endpointInstance.searchComic(query)}`, {
			headers: header
		});

		if (!response.ok) {
			return json({ comics: [], hasMore: false }, { status: response.status });
		}

		const comics = await safeJsonParse<ComicItemType>(response);

		return json({ comics });
	} catch (e) {
		console.error('Error fetching search API:', e);
		return json({ comics: [], error: 'Gagal memuat data.' }, { status: 500 });
	}
};
