import { getBaseUrl } from '$lib/utils/endpoint';
import { json } from '@sveltejs/kit';

export async function GET() {
	const baseUrl = await getBaseUrl();
	return json({ baseUrl });
}
