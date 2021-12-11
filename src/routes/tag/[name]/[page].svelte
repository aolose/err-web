<script context="module">
    import {res} from "$lib/res";

    export const load = res('tagPosts');
</script>
<script>
    import Posts from "$lib/Posts.svelte"
    import ITag from "$lib/icontag.svelte"

    export let d = {}
    const {params = {}} = d;
</script>
<svelte:head>
    <title>Err - tag/{params.name}</title>
</svelte:head>
<Posts d={d} name={'tag/'+params.name}>
        <a href="/tags">{params.name}</a>
</Posts>

