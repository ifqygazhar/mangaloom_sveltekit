import { writable } from 'svelte/store';
import { SourceType } from '$lib/config/sourceType';

export const sourceStore = writable<SourceType>(SourceType.V5);
