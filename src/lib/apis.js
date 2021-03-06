import {bannerMod, isLogin, mgList, qa, qaList, qState, resList, tags, token} from "$lib/store";
import {get} from "svelte/store";
import {enc} from "./utils";
import {tip} from "$lib/popMsg.svelte";

export const apis = {
    logs: {
        path: ([a]) => `log/${a}`,
        skipCache(d) {
            return !d || !d.ls || !d.ls.length
        },
        before() {
            return {c: 10}
        },
        cacheTime: 2
    },
    cmLs: {
        path: ([a, b]) => `c/${a}/${b}`,
        cacheTime: 3
    },
    delCm: {
        path: id => `c/${id}`,
        method: 'DELETE',
    },
    cmDel: {
        path: 'c',
        method: 'DELETE',
        before(id) {
            return {id: id.filter(a => a).join()}
        },
        done(a, id) {
            if (id) id = [].concat(id).map(v => +v)
            mgList.update(m => m.filter(({i}) => id.indexOf(i) === -1))
        }
    },
    reply: {
        path: 'c/r',
        method: 'POST',
    },
    replyDel: {
        path: ([to, id]) => `c/r/${to}/${id}`,
        method: 'DELETE',
        before: () => 0
    },

    cm: {
        path: 'c',
        method: 'POST',
        before(c) {
            return c
        }
    },
    pwd: {
        path: 'sys/acc',
        method: 'POST',
        before(c) {
            return enc(...c)
        },
        done() {
            tip('update success!')
        },
        fail(e) {
            tip(e);
        }
    },
    login: {
        path: 'auth',
        method: 'POST',
        before(c) {
            return c
        }
    },
    auth: {
        method: 'POST',
        path: 'auth',
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
        before(id) {
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
        before: () => 0
    },
    lsRes: {
        path: ([a]) => `res/${a}`,
        before([_, s]) {
            const o = {k: s, c: 15}
            if (get(bannerMod)) o.img = 1
            return o
        },
        cacheTime: 3
    },
    lsMg: {
        path: ([a]) => `c/${a}`,
        cacheTime: 10,
        before([_, s]) {
            const o = {}
            if (s) {
                const {id, text} = s;
                if (id) o.art_id = id;
                if (text) o.content = text;
            }
            return o
        }
    },
    lsBk: {
        path: () => `ft`,
        after(a, {status} = {}) {
            if (status === 200) {
                a.forEach(o => o.st = ('0000' + (+o.st).toString(2))
                    .substr(-4)
                    .split('')
                    .map(a => !!+a)
                    .reverse())
            }
            return {ls: a}
        },
        cacheTime: 3
    },
    addBk: {
        path: () => `ft`,
        method: 'POST',
        before(c = {}) {
            return {
                ...c,
                at: !!c.at,
                st: c.st.map((a, i) => a ? +a << i : 0)
                    .reduce((a, b) => a | b)
            }
        },
    },
    ediBk: {
        path: () => `ft`,
        method: 'PATCH',
        before(c = {}) {
            return {
                ...c,
                at: !!c.at,
                st: c.st.map((a, i) => a ? +a << i : 0)
                    .reduce((a, b) => a | b)
            }
        },
    },
    delBk: {
        path: a => `ft/${a}`,
        method: 'DELETE',
        before: () => 0
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
        before([_, s]) {
            return {k: s, count: 8}
        },
        path: ([a]) => `edit/${a}`,
        cacheTime: 3
    },
    post: {
        path: (_, {params: {slug}}) => `post/${slug}`,
        cacheTime: 3600 * 24
    },
    savePost: {
        path: 'edit',
        method: 'PUT',
        before: a => {
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
        before: () => 0
    },
    pubPost: {
        path: 'edit',
        method: 'POST',
    },
    unPub: {
        path: id => `edit/${id}`,
        method: 'PATCH',
        before: () => 0
    },
    tags: {
        path: 'tag/all',
        cacheTime: 60,
    },
    tagPosts: {
        path: (_, {params: {page, name} = {}}) => {
            if (!page) page = 1;
            return `tag/${name}/${page}`
        },
        after: (r, o, {params: {page, name}}) => {
            if (page === 0) {
                o.status = 302;
                o.redirect = `/tag/${name}/1`;
                return {
                    params: {page, name}
                }
            }
            if (page > r.total) {
                o.status = 302;
                o.redirect = `/tag/${name}/${r.total}`;
                return {
                    params: {page, name}
                }
            }
            if (r && typeof r !== "string") r.params = {page, name}
            else {
                return {
                    params: {page, name}
                }
            }
        },
        before() {
            return {
                count: 8
            }
        }
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
        cacheTime: 60 * 10,
        path: (_, {params: {page} = {}}) => {
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
