import {bannerMod, isLogin, qa, qaList, qState, resList, tags} from "$lib/store";
import {get} from "svelte/store";
import {tick} from "svelte";
import {enc} from "./utils";
import {tip} from "$lib/popMsg.svelte";

const ok = c => c && c.status === 200
export const apis = {
    cm:{
        path: 'c',
        method: 'POST',
        before(a,b,c){
            return c
        }
    },
    pwd: {
        path: 'sys/acc',
        method: 'POST',
        before(a, b, c) {
            return enc(...c)
        },
        done() {
            tip('update success!')
        },
        fail(e) {
            tip(e);
        }
    },
    qs: {
        path: a => `qa/${a}`,
        before(_, s) {
            return {q: s, c: 15}
        },
        after(a, b, d) {
            if (ok(b)) {
                a.ls = a.ls.map(c => {
                    const {id, q, a, p, saved} = c;
                    const params = {}
                    const ps = p.split(',')
                    for (let i = 0, l = ps.length / 3; i < l; i++) {
                        const n = i * 3;
                        params[ps[n]] = [ps[n + 1], p[n + 2]]
                    }
                    return {id, q, a, saved, params}
                })
            }
        },
        cacheTime: 3
    },
    delQ: {
        path: (id) => `qa/${id}`,
        method: 'DELETE',
    },
    tesQ: {
        cacheTime: 1e5,
        path: 'qa/test',
        method: 'POST',
        before(_, b, {params, a, q}) {
            qState.set({pending: 1, e: "", q: "", a: ""})
            const p = Object.keys(params).map(k => [k, ...[params[k]]])
                .reduce((a, b) => a.concat(b), [])
                .join()
            return {
                q, a, p
            }
        },
        fail(e) {
            qState.set({pending: 0, e: e, q: "".q, a: ""})
        },
        done(a) {
            qState.set({pending: 0, e: "", q: a.q || "", a: a.a || ""})
        }
    },
    svQ: {
        path: 'qa',
        method: 'POST',
        before(_, b, {params, a, q, id}) {
            qState.set({pending: 1, e: "", q: "", a: ""})
            const p = Object.keys(params).map(k => [k, ...[params[k]]])
                .reduce((a, b) => a.concat(b), [])
                .join()
            return {
                q, a, p, id
            }
        },
        async after(a, b, c) {
            if (ok(b)) {
                const ls = get(qaList)
                let q = get(qa)
                let _q = ls.find(e => e.id === c.id)
                const isCu = q && q.id === c.id
                if (_q) {
                    q = _q
                }
                if (q) {
                    q.saved = a.saved
                    q.id = a.id
                    q.q = c.q
                    q.a = c.a
                    q.params = c.params
                    if (isCu) {
                        qa.set({...q})
                        await tick()
                    }
                    if (_q) {
                        qaList.set(ls.slice())
                    }
                }
                qState.set({pending: 0, e: "", q: a.q || "", a: a.a || ""})
            } else {
                qState.set({pending: 0, e: a, q: "".q, a: ""})
            }
        }
    },
    auth: {
        method: 'POST',
        path: 'auth',
        before(_, s, a, st) {
            if (s.token) {
                return s.token
            } else st({
                status: 200
            })
        },
        after(r, o) {
            if (o.status === 200) {
                isLogin.set(1)
            } else {
                isLogin.set(0)
            }
            o.status = 200;
        }
    },
    delRes: {
        path: 'res',
        method: 'DELETE',
        before(a, b, id) {
            return {id: id.filter(a => a).join()}
        },
        done(a, id) {
            resList.update(a => {
                const l = [];
                a.forEach(v => {
                    if (id.indexOf(v.id) === -1)
                        l.push(v)
                })
                return l
            })
        }
    },
    rnRes: {
        method: 'PATCH',
        path: ({id, name}) => `res/${id}/${name}`,
    },
    lsRes: {
        path: a => `res/${a}`,
        before(_, s) {
            const o = {k: s, c: 15}
            if (get(bannerMod)) o.img = 1
            return o
        },
        cacheTime: 3
    },
    lsBk: {
        path: a => `bk/${a}`,
        before(_, s) {
            return {ip: s, tp: [0, 1][get(isLogin)], c: 15}
        },
        cacheTime: 3
    },
    loadTags: {
        path: 'tag/ls',
        cacheTime: 2e3,
        done(a) {
            if (Array.isArray(a)) {
                a.sort((a, b) => a > b ? 1 : -1)
                tags.set(a)
            }
        }
    },
    edit: {
        before(_, s) {
            return {k: s, count: 8}
        },
        path: (a) => `edit/${a}`,
        cacheTime: 3
    },
    post: {
        path: ({params: {slug}}) => `post/${slug}`,
        cacheTime: 3600 * 24
    },
    savePost: {
        path: 'edit',
        method: 'PUT',
        data: a => {
            return {
                id: a.id,
                title: a.title,
                content: a.content,
            }
        },
    },
    delPost: {
        path: (id) => `edit/${id}`,
        method: 'DELETE',
    },
    pubPost: {
        path: 'edit',
        method: 'POST',
        data: a => a,
    },
    unPub: {
        path: id => `edit/${id}`,
        method: 'PATCH',
    },
    tags: {
        path: 'tag/all',
        cacheTime: 60,
    },
    posts: {
        after: (r, o, {params: {page}}) => {
            if (page === 0) {
                o.status = 302;
                o.redirect = `/posts/1`;
                return {}
            }
            if (page > r.total) {
                o.status = 302;
                o.redirect = `/posts/${r.total}`;
                return {}
            }
        },
        cacheTime: 60,
        path: ({params: {page} = {}}) => {
            if (!page) page = 1;
            return `posts/${page}`
        },
        before() {
            return {
                count: 8
            }
        }
    },
}