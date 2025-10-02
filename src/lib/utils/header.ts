import { API_KEY } from '$env/static/private';

export const header = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'X-API-KEY': API_KEY
};
