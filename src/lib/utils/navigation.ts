import { writable, type Readable } from 'svelte/store';
import { onMount } from 'svelte';
import { afterNavigate } from '$app/navigation';
import type { Component } from 'svelte';

import Home from '@lucide/svelte/icons/home';
import Clock from '@lucide/svelte/icons/clock';
import List from '@lucide/svelte/icons/list';
import Tags from '@lucide/svelte/icons/tags';

export type NavLink = {
	href: string;
	label: string;
	id: number;
	icon?: Component;
};

export const links: NavLink[] = [
	{ href: '/', label: 'Beranda', id: 1, icon: Home },
	{ href: '/terbaru', label: 'Terbaru', id: 2, icon: Clock },
	{ href: '/daftar-komik', label: 'Daftar Komik', id: 3, icon: List },
	{ href: '/genres', label: 'Genre', id: 4, icon: Tags }
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
