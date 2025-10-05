import type { PageServerLoad, Actions } from './$types';
import { URI } from '$env/static/private';
import type { ComicItemType } from '$lib/api/types/ComicItemType';
import { SourceType } from '$lib/config/sourceType';
import { Endpoint } from '$lib/utils/endpoint';
import { header } from '$lib/utils/header';
import { safeJsonParse } from '$lib/utils/safeJsonParse';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('query') || '';
	const source = (url.searchParams.get('source') as SourceType) || SourceType.V5;

	if (!query) {
		return { comics: [], query: '' };
	}

	try {
		const endpointInstance = new Endpoint({ sourceType: source });
		const baseUrl = URI;

		const response = await fetch(`${baseUrl}${endpointInstance.searchComic(query)}`, {
			headers: header
		});

		if (!response.ok) {
			return { comics: [], query };
		}

		const comics = await safeJsonParse<ComicItemType>(response);
		return { comics, query };
	} catch (e) {
		console.error('Error fetching search:', e);
		return { comics: [], query };
	}
};

export const actions = {
	search: async ({ request }) => {
		const formData = await request.formData();
		const query = formData.get('query')?.toString() || '';
		const source = (formData.get('source')?.toString() as SourceType) || SourceType.V5;

		if (!query.trim()) {
			return fail(400, {
				comics: [],
				query,
				error: 'Query pencarian tidak boleh kosong'
			});
		}

		try {
			const endpointInstance = new Endpoint({ sourceType: source });
			const baseUrl = URI;

			const response = await fetch(`${baseUrl}${endpointInstance.searchComic(query)}`, {
				headers: header
			});

			if (!response.ok) {
				return fail(response.status, {
					comics: [],
					query,
					error: 'Gagal mengambil data dari server'
				});
			}

			const comics = await safeJsonParse<ComicItemType>(response);

			return {
				success: true,
				comics,
				query
			};
		} catch (e) {
			console.error('Error fetching search:', e);
			return fail(500, {
				comics: [],
				query,
				error: 'Terjadi kesalahan server'
			});
		}
	}
} satisfies Actions;
