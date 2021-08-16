import cookie from "cookie";
export async function post({body}) {
    const headers = {
        'Set-Cookie': cookie.serialize('session_id', '', {
            httpOnly: true,
            maxAge: -1,
            sameSite: 'lax',
            path: '/'
        })

    }
    return {
        status:200,
        headers,
        body:{
            message:'Success',
        }
    }
}