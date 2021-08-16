import {apis} from "$lib/apis";
export const host = "http://localhost:8880"
const cacheStore = {};
export const query = async (name, d) => {
    const {
        done,
        fail,
        method = 0,
        before,
        after,
        storage: sto = 0,
        cacheTime,
        url = name,
    } = apis[name];

    const path = typeof url === 'function' ? url(name, d) : name
    let cache;
    let cacheKey;
    const store = [localStorage, sessionStorage][sto];
    const {token}=localStorage;
    if (cacheTime) {
        let str = name
        if (d) {
            str = str + JSON.stringify(d);
        }
        let n = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            n += str.charCodeAt(0) * (i + 1);
        }
        cacheKey = n.toString(36);
        let ca;
        try {
            ca = JSON.parse(store[cacheKey]);
            if (!ca.t || (Date.now() > ca.t)) {
                cache = ca.d;
            } else {
                delete cacheStore[cacheKey]
            }
        } catch (e) {
        }
    }
    if (cache && done) {
        done(cache);
        return cache;
    }
    const cfg = {
        method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'][method],
        headers: {
            'Authorization': 'Basic ' + token,
            'Content-Type': 'application/json',
        },
    }
    if (d) cfg.body = JSON.stringify(d);
        fetch(host + '/' + path, cfg)
        .then(r => r.json())
        .then(d => {
            if (after) {
                const a = after(d)
                if (a !== undefined) d = a;
            }
            if (done) {
                if (cacheTime) {
                    const c = {
                        d: d
                    }
                    if (cacheTime) c.t = Date.now() + cacheTime * 1e3
                    store[cacheKey] = JSON.stringify(c)
                }
                return d
            }
        })
        .catch(e => {
            if (fail) fail(e);
            return e
        })
}

export const posts = () => {
}