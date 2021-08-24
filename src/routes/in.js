import cookie from "cookie";
export async function post({body}) {
    const cookieId = 'aaaa'
    const headers = {
        'Set-Cookie': cookie.serialize('session_id', cookieId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            path: '/'
        })

    }
    return {
        status:200,
        headers,
        body:{
            message:'Success',
            token:'cccccc'
        }
    }
}