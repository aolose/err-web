<script context="module">
    import {res} from "$lib/res";
    export const load = res('posts');
</script>
<script>
    import Posts from "$lib/Posts.svelte"
    export let d = {}
</script>
<svelte:head>
    <title>Err - Posts</title>
</svelte:head>
<Posts d={d} name="posts"/>