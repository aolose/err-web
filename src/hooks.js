import  cookie from 'cookie';
/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({headers}) {
    const cks = cookie.parse(headers.cookie||'')

    return {
          token:cks['session_id']
    }
}

/** @type {import('@sveltejs/kit').ServerFetch} */
export async function serverFetch(request) {
    request = new Request(
        request.url,
        request
    );
    return fetch(request);
}