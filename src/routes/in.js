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
            body: tk||'auth fail'
        }
    }

    const headers = {
        'Set-Cookie': cookie.serialize('session_id', tk, {
            httpOnly: true,
            secure:true,
            sameSite:"lax",
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            domain:"err.name"
        })

    }
    return {
        status: 200,
        headers,
        body:tk
    }
}