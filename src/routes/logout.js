import cookie from "cookie";
import {host} from "$lib/res";

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
            maxAge: -1,
            sameSite: 'lax',
            path: '/',
            domain:"err.name"
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