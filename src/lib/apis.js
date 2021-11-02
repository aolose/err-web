import {bannerMod, isLogin, qa, qaList, qState, resList, tags} from "$lib/store";
import {get} from "svelte/store";
import {enc} from "./utils";
import {tip} from "$lib/popMsg.svelte";

export const apis = {
    cmLs: {
        path: ([a, b]) => `c/${a}/${b}`,
        cacheTime: 3
    },
    cm: {
        path: 'c',
        method: 'POST',
        before(a, b, c) {
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
    login: {
        path: 'auth',
        method: 'POST',
        before(a, b, c) {
            return c
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
    lsMg: {
        path: a => `c/${a}`,
        cacheTime: 10,
        before(_, s) {
            const o = {}
            if (s) {
                const {id, text} = s;
                if (id) o.art_id =id;
                if (text) o.content = text;
            }
            return o
        }
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
    tagPosts: {
        path: ({params: {page, name} = {}}) => {
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
            if (r) r.params = {page, name}
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
