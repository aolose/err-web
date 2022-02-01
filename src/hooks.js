import cookie from 'cookie';
import {browser} from "$app/env";
import {tok} from "$lib/store.js";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    return await resolve(event, {
        ssr: true
    });
}

/** @type {import('@sveltejs/kit').ExternalFetch} */
export async function externalFetch({url,headers,rawBody,method}) {
    return await fetch(new Request(
        browser ? url :
            url.replace(
                import.meta.env.VITE_API_CLI,
                import.meta.env.VITE_API_SRV
            ), {
            body:rawBody,
            headers,method,
            mode:"cors",
        }
    ))
}


/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession( {request:{headers}}) {
    const cks = cookie.parse(headers.get("cookie") || '')
    const tk = cks['session_id']
    tok.set(tk);
}

