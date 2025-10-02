export async function safeJsonParse<T>(response: Response): Promise<T[]> {
	if (!response || !response.ok) {
		// Non-ok responses -> no data
		return [];
	}

	try {
		const api = await response.json();

		// If response wrapper uses { data: [...] } use it, otherwise if response is array take it
		const payload = api && api.data !== undefined ? api.data : api;

		return Array.isArray(payload) ? (payload as T[]) : [];
	} catch (error) {
		// Log to server console to help debugging, return empty array to avoid throwing
		console.error('safeJsonParse error:', error);
		return [];
	}
}
