import { URI } from '$env/static/private';

import { parseComicReadFromJson, type ComicReadType } from '$lib/api/types/ComicReadType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';

import { error as svelteKitError } from '@sveltejs/kit';

type LoadOutput = {
	error: string | undefined;
	comicRead: ComicReadType | undefined;
};

export async function load({ fetch, url, params }): Promise<LoadOutput> {
	const href = `/${params.href}`;
	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;
		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;

		const response = await fetch(`${baseUrl}${endpointInstance.readComic(href)}`, {
			headers: header
		});
		console.log('fetch url :', response.url);
		if (!response.ok) {
			throw svelteKitError(response.status, 'Gagal mengambil detail komik');
		}

		const json = await response.json();
		// console.log('response json :', json);

		const comicRead = parseComicReadFromJson(json.data);
		// console.log('Parsed comicRead:', JSON.stringify(comicRead, null, 2));

		return {
			error: undefined,
			comicRead: comicRead
		};
	} catch (e) {
		console.error('Error in +page.server.load:', e);
		return {
			error: 'Gagal memuat data chapter dari server. Silakan coba lagi nanti.',
			comicRead: undefined
		};
	}
}
