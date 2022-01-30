import cookie from 'cookie';
import {browser} from "$app/env";


export async function handle({ event, resolve }) {
    return await resolve(event, {
        ssr: true
    });
}

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
export async function getSession({request:{headers}}) {
    const cks = cookie.parse(headers.cookie || '')
    const tk = cks['session_id']
    return {
        token: tk
    }
}

