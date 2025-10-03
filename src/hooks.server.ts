import { INTERNAL_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api')) {
		const apiKey = event.request.headers.get('x-api-key');

		if (apiKey !== INTERNAL_API_KEY) {
			return json({ message: 'Akses tidak sah' }, { status: 401 });
		}
	}

	return await resolve(event);
};
