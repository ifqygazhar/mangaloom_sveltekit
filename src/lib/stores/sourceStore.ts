import { writable } from 'svelte/store';
import { SourceType } from '$lib/config/sourceType';
import { chapterStore } from './chapterlistStore';

function createSourceStore() {
	const { subscribe, set } = writable<SourceType>(SourceType.V3);

	return {
		subscribe,
		set: (newSource: SourceType) => {
			chapterStore.clear();
			set(newSource);
		}
	};
}

export const sourceStore = createSourceStore();
