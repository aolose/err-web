import {tags} from "$lib/store";

export const apis = {
    delRes: {
        path: 'res',
        method: 'DELETE',
        before(_, id) {
            return {id: id.join()}
        }
    },
    rnRes:{
        method:'PATCH',
        path: ({id,name})=> `res/${id}/${name}`,
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
    content: {
        path: ({params: {id, ver}}) => `his/${id}/${ver}`,
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