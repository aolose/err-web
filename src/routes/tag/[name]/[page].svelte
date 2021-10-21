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
<Posts d={d} name="tag">
    <h1>
        <ITag/>{params.name}</h1>
</Posts>
<style lang="scss">
  h1 {
    display: flex;
    align-items: center;
    font-weight: 100;
    font-size: 23px;
    margin-top: -20px;
    margin-bottom: 60px;
    color: #5a647c;
  }
</style>

