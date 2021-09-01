import {isLogin, resList, tags} from "$lib/store";

export const apis = {
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
                isLogin.set(true)
            } else {
                isLogin.set(false)
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
            return {k: s, c: 15}
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
        cacheTime: 30
    },
    savePost: {
        path: 'edit',
        method: 'PUT',
        data: a => a,
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
    setVer: {
        path: ({id, ver}) => `edit/${id}/${ver}`,
        method: 'PATCH',
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