export const apis = {
    post: {
        path: ({params: {slug}}) => `post/${slug}`,
        cacheTime: 360
    },
    posts: {
        after: (r, o, {params: {page}}) => {
            if (page > r.total) {
                o.status = 302;
                o.redirect = `/posts/${r.total}`;
                return {}
            }
        },
        cacheTime: 60,
        path: ({params: {page = 0}}) => `posts/${page}`,
        before() {
            return {
                count: 3
            }
        }
    },
}