import cookie from "cookie";
import {host, isDev} from "$lib/res";

export async function post({headers}) {
    let tk;
    if(headers){
        const cks = cookie.parse(headers.cookie || '');
        tk = cks['session_id'];
    }
    if (tk) fetch(host + '/ot').catch(e => {
        console.error(e)
    })
    const hds = {
        'Set-Cookie': cookie.serialize('session_id', '', {
            httpOnly: true,
            secure:!isDev,
            domain:isDev?"local.io":"err.name",
            sameSite:"lax",
            maxAge: -1,
            path: '/'
        })
    }
    return {
        status: 200,
        headers: hds,
        body: {
            message: 'Success',
        }
    }
}