import { writable, type Readable } from 'svelte/store';
import { onMount } from 'svelte';
import { afterNavigate } from '$app/navigation';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHome, faClock, faList, faTags } from '@fortawesome/free-solid-svg-icons';

export type NavLink = {
	href: string;
	label: string;
	id: number;
	icon?: IconDefinition;
};

export const links: NavLink[] = [
	{ href: '/', label: 'Beranda', id: 1, icon: faHome },
	{ href: '/terbaru', label: 'Terbaru', id: 2, icon: faClock },
	{ href: '/daftar-komik', label: 'Daftar Komik', id: 3, icon: faList },
	{ href: '/genre', label: 'Genre', id: 4, icon: faTags }
];

export function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(href + '/');
}

export function useCurrentPath(): Readable<string> {
	const currentPath = writable('');

	onMount(() => {
		currentPath.set(globalThis.location?.pathname ?? '');
	});

	afterNavigate(() => {
		currentPath.set(globalThis.location?.pathname ?? '');
	});

	return {
		subscribe: currentPath.subscribe
	};
}
