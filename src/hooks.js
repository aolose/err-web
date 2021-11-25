import cookie from 'cookie';
import {browser} from "$app/env";

export async function externalFetch(request) {
    const {url} = request;
    return await fetch(new Request(
        browser ? url :
            url.replace(
                import.meta.env.VITE_API_CLI,
                import.meta.env.VITE_API_SRV
            ), request
    ))
}


/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({headers}) {
    const cks = cookie.parse(headers.cookie || '')
    const tk = cks['session_id']
    return {
        token: tk
    }
}

