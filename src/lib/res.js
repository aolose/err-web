import {browser} from "$app/env";
import {apis} from "$lib/apis";

export const host = "http://localhost:8880"
export const res = (name) => {
    const cfg = apis[name] || {};
    const getRes = async (ctx) => {
        const {page, fetch, session, context} = ctx;
        const {
            path,
            before,
            storage: sto = 0,
            after,
            cacheTime,
            data,
            method = 'GET'
        } = typeof cfg === 'function' ? cfg(page, session, context) : cfg;
        const p = typeof path === 'function' ? path(page, session, context) : path;
        let d = typeof data === 'function' ? data(page, session, context) : data;
        let url = `${host}/${p}`;
        let err;
        const cf = {
            method
        }
        if (before) {
            const a = before(d)
            if (a !== undefined) d = a;
        }
        if (d) {
            if (/post|put|patch|delete/i.test(method)) cf.body = JSON.stringify(d);
            else {
                url += '?' + Object.keys(d).map(k => `${k}=${encodeURI(JSON.stringify(d[k]))}`).join('&')
            }
        }
        let cache;
        let cacheKey;
        let store;
        if (browser && cacheTime) {
            store = [localStorage, sessionStorage][sto];
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
                return {
                    status: 200,
                    props: {d: cache}
                };
            }
        }
        const re = await fetch(url, cf).catch(e => {
            err = e
        });
        const o = {
            status: re.status,
        }
        if (re.ok) {
            let r = await re.json()
            if (after) {
                const a = after(r,o,page)
                if (a !== undefined) r = a;
            }
            if (cacheTime && browser) {
                const c = {
                    d: r
                }
                if (cacheTime) c.t = Date.now() + cacheTime * 1e3
                store[cacheKey] = JSON.stringify(c)
            }
            o.props = {d: r}
        } else {
            o.error = err && err.message || new Error(`Could not load ${url}`)
        }
        return o
    }

    /**
     * @type  {import('@sveltejs/kit').Load}
     */
    return async function load(ctx) {
        return await getRes(ctx)
    }
}