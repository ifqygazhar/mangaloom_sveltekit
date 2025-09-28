import { getBaseUrl } from '$lib/utils/endpoint';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const baseUrl = await getBaseUrl();
	return {
		baseUrl
	};
};
