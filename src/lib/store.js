import {writable} from 'svelte/store';

export const list = writable([]);
export const msg = writable(new Date().toLocaleString());
export const post = writable({})
export const winAct = writable(0)