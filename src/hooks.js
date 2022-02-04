import cookie from 'cookie';
import {browser} from "$app/env";
import {get} from "svelte/store";
import {token} from "$lib/store.js";


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}) {
    return await resolve(event, {
        ssr: true
    });
}

/** @type {import('@sveltejs/kit').ExternalFetch} */
export async function externalFetch({url, headers, rawBody, method}) {
    const tk = get(token);
    if (!headers.has('cookie') && tk) {
        headers.set('cookie', 'session_id=' + tk)
    }
    return await fetch(new Request(
        browser ? url :
            url.replace(
                import.meta.env.VITE_API_CLI,
                import.meta.env.VITE_API_SRV
            ), {
            body: rawBody,
            headers, method,
            mode: "cors",
        }
    ))
}


/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({request: {headers}}) {
    const cks = cookie.parse(headers.get("cookie") || '')
    const t = cks['session_id']
    token.set(t);
    return {tk: t}
}

