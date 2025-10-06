import { URI } from '$env/static/private';

import { parseComicReadFromJson, type ComicReadType } from '$lib/api/types/ComicReadType.js';
import { parseComicDetailFromJson, type ComicDetailType } from '$lib/api/types/ComicDetailType.js';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';

import { error as svelteKitError } from '@sveltejs/kit';

type LoadOutput = {
	error: string | undefined;
	comicRead: ComicReadType | undefined;
	chapterList: ComicDetailType['chapter'] | undefined;
	detailHref: string;
	currentChapterHref: string;
};

function normalizePath(path: string | null): string {
	if (!path) return '';
	// Trim whitespace
	path = path.trim();
	// Pastikan dimulai dengan /
	return path.startsWith('/') ? path : `/${path}`;
}

export async function load({ fetch, url, params }): Promise<LoadOutput> {
	const currentChapterHref = `/${params.href}`;
	const detailHref = normalizePath(url.searchParams.get('detailHref'));

	if (!detailHref) {
		return {
			error:
				'Informasi komik tidak ditemukan. Pastikan Anda mengakses chapter dari halaman detail.',
			comicRead: undefined,
			chapterList: undefined,
			detailHref: '',
			currentChapterHref: ''
		};
	}

	try {
		const source = (url.searchParams.get('source') as SourceType) || SourceType.V5;
		const endpointInstance = new Endpoint({ sourceType: source });
		const baseUrl = URI;

		const readResponsePromise = fetch(
			`${baseUrl}${endpointInstance.readComic(currentChapterHref)}`,
			{
				headers: header
			}
		);

		const detailResponsePromise = fetch(`${baseUrl}${endpointInstance.detailComic(detailHref)}`, {
			headers: header
		});

		const [readResponse, detailResponse] = await Promise.all([
			readResponsePromise,
			detailResponsePromise
		]);

		console.log('detail uri fetch:', detailResponse.url);
		console.log('read uri fetch:', readResponse.url);

		if (!readResponse.ok) {
			throw svelteKitError(
				readResponse.status,
				`Gagal mengambil data chapter: ${currentChapterHref}`
			);
		}
		if (!detailResponse.ok) {
			throw svelteKitError(detailResponse.status, `Gagal mengambil detail komik: ${detailHref}`);
		}

		const readJson = await readResponse.json();
		const detailJson = await detailResponse.json();

		const comicRead = parseComicReadFromJson(readJson.data);
		const comicDetail = parseComicDetailFromJson(detailJson.data);

		return {
			error: undefined,
			comicRead: comicRead,
			chapterList: comicDetail.chapter,
			detailHref: detailHref,
			currentChapterHref: currentChapterHref
		};
	} catch (e) {
		console.error('Error in +page.server.load (read):', e);
		return {
			error: 'Gagal memuat data dari server. Silakan coba lagi nanti.',
			comicRead: undefined,
			chapterList: undefined,
			detailHref: detailHref,
			currentChapterHref: currentChapterHref
		};
	}
}
