import { URI } from '$env/static/private';
import { parseComicDetailFromJson, type ComicDetailType } from '$lib/api/types/ComicDetailType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';

import { error as svelteKitError } from '@sveltejs/kit';

type LoadOutput = {
	error: string | undefined;
	comicDetail: ComicDetailType | undefined;
	detailHref: string;
};

export async function load({ fetch, url, params }): Promise<LoadOutput> {
	const href = `/${params.href}`;
	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V3;
		const endpointInstance = new Endpoint({ sourceType: source });

		const baseUrl = URI;

		const response = await fetch(`${baseUrl}${endpointInstance.detailComic(href)}`, {
			headers: header
		});
		console.log('fetch url :', response.url);
		if (!response.ok) {
			throw svelteKitError(response.status, 'Gagal mengambil detail komik');
		}

		const json = await response.json();
		// console.log('response json :', json);

		const comicDetail = parseComicDetailFromJson(json.data);
		// console.log('Parsed comicDetail:', JSON.stringify(comicDetail, null, 2));

		return {
			error: undefined,
			comicDetail: comicDetail,
			detailHref: href
		};
	} catch (e) {
		console.error('Error in +page.server.load:', e);
		return {
			error: 'Gagal memuat data komik detail dari server. Silakan coba lagi nanti.',
			comicDetail: undefined,
			detailHref: href
		};
	}
}
