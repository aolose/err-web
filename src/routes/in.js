import cookie from "cookie";
import {host} from '$lib/res'

export async function post({body}) {
    const res = await  fetch(host + '/auth', {
        credentials:"include",
        method: 'POST',
        body: body
    })
    const tk = await res.text()
    if(!res.ok){
        return {
            status: 403,
            body: {
                message: 'auth fail',
            }
        }
    }
    const headers = {
        'Set-Cookie': cookie.serialize('session_id', tk, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            path: '/'
        })

    }
    return {
        status: 200,
        headers,
        body:tk
    }
}