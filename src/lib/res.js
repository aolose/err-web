import {apis} from "$lib/apis";
import {logout, tok} from './utils'
import {browser} from "$app/env";

export const host = import.meta.env.VITE_API_CLI;

export const resFlag = {
    useCache: 0
}

async function getRes(ctx={}, name) {
    const {url: u, params, data, fetch} = ctx;
    const info = {url: u, params};
    const cfg = apis[name];
    if (!cfg) return {
        status: 404
    };
    const {
        fail,
        path,
        before,
        storage: sto = 0,
        after,
        cacheTime,
        done,
        method = 'GET'
    } = cfg;
    const p = typeof path === 'function' ? path(data, info) : path;
    let url = `${host}/${p}`;
    let err;
    const cf = {
        credentials: "include",
        method
    }

    let s = null;
    let d = data
    if (before) {
        const a = before(d, info, a => s = a)
        if (a !== undefined) d = a;
    }
    if (s) return s;
    if (d) {
        Object.keys(d).forEach(a => {
            if (d[a] === undefined || d[a] === 0 || d[a] === "" || d[a] === null) {
                delete d[a]
            }
        })
        if (/post|put|patch/i.test(method)) {
            if (typeof d === "string") cf.body = d;
            else cf.body = JSON.stringify(d);
        } else {
            const u = [];
            Object.keys(d).forEach(k => {
                const v = d[k];
                if (v !== undefined)
                    u.push(`${k}=${encodeURI(v)}`)
            })
            url += '?' + u.join('&')
        }
    }
    let cache;
    let cacheKey;
    let store;
    if (browser) {
        store = [localStorage, sessionStorage][sto]
    }
    if (cacheTime) {
        let str = p
        if (d) {
            str = str + JSON.stringify(d);
        }
        let n = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            n += str.charCodeAt(i) * (i + 1);
        }
        cacheKey = n.toString(36);
        if (resFlag.useCache) {
            let ca;
            try {
                ca = JSON.parse(store[cacheKey]);
                if (!ca.t || (Date.now() < ca.t)) {
                    cache = ca.d;
                } else {
                    delete store[cacheKey]
                }
            } catch (e) {
            }
        }
        if (cache) {
            if (done) {
                done(cache, data)
            }
            return {
                status: 200,
                props: {d: cache}
            };
        }
    }
    let re
    await new Promise((resolve) => {
        const t = tok.get()
        if (t) {
            (cf.headers = (cf.headers || {})).token = t
        }
        fetch(url, cf).then(r => {
            re = r
            resolve()
        }).catch(e => {
            err = e
            resolve()
        })
    })
    const o = {
        status: re && re.status,
    }
    if (re) {
        let r = ''
        try {
            r = await re.text()
        } catch (e) {
        }
        try {
            r = JSON.parse(r)
        } catch (e) {
        }
        if (after) {
            const a = after(r, o, info)
            if (a !== undefined) r = a;
        }
        if (o.status === 200) {
            if (done) {
                done(r, data)
            }
            o.props = {
                d: r
            }
            if (cacheTime && browser) {
                const c = {
                    d: r
                }
                if (cacheTime) c.t = Date.now() + cacheTime * 1e3
                store[cacheKey] = JSON.stringify(c)
            }
            return o
        } else {
            err = new Error(r)
        }
    }
    if (re && re.status === 403) {
        if (name !== 'login') {
            await logout()
            err = null
        }
    } else {
        o.status = 408
    }
    if (err) {
        if (fail) fail(err)
        console.trace(err)
    }
    o.error = err && err.message || new Error(`Could not load ${url}`)
    return o
}


export const query = async (name, data) => {
    const ctx = {fetch, data}
    const res = await getRes(ctx, name);
    if (res.status === 200) {
        return res.props.d
    }
    return res
}

export function res(name) {
    /**
     * @type  {import('@sveltejs/kit').Load}
     */
    return async function load(ctx) {
        return await getRes.call(this, ctx, name)
    }
}
