<script context="module">
    import {host, query} from "$lib/api";
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ page:{params}, fetch}) {
        const { slug } = params;
        const url = `${host}/post/${slug}`;
        const res = await fetch(url);
        if (res.ok) {
            return {
                props: {
                    post: await res.json()
                }
            };
        }
        return {
            status: res.status,
            error: new Error(`Could not load ${url}`)
        };
    }
</script>
<script>
    export let post;
</script>
<h1>{post.title}</h1>
<h2>{post.author.name}</h2>
<p>{post.content}</p>