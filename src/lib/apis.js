export const apis = {
    edits: {
        before(_, s) {
            return {k: s, count: 8}
        },
        path: (a) => `edits/${a}`,
        cacheTime: 10
    },
    post: {
        path: ({params: {slug}}) => `post/${slug}`,
        cacheTime: 360
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