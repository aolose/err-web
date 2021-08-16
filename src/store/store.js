import {writable} from 'svelte/store'
import {browser} from '$app/env'

export const createStore = (key, value) => {
    let d
    try {
        d = JSON.parse(browser && localStorage.getItem(key));
    } catch (e) {
        d = {}
    }
    d[key] = value;
    const store = writable(d, () => {
        return store.subscribe(v => {
            browser && localStorage.setItem(key, JSON.stringify(v))
        })
    })
    return store
}
