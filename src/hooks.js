import cookie from 'cookie';
import {browser} from "$app/env";

export async function externalFetch(request) {
    const headers = {}
    for (let pair of request.headers.entries()) {
        headers[pair[0]] = pair[1];
    }
    const {url} = request;
    return await fetch(
        browser ? url : url.replace(import.meta.env.VITE_API_CLI, import.meta.env.VITE_API_SRV),
        {
            ...request,
            headers,
        })
}


/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({headers}) {
    const cks = cookie.parse(headers.cookie || '')
    const tk = cks['session_id']
    return {
        token: tk
    }
}

