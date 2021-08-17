<script context="module">
    import {res} from "$lib/res";
    import Nav from "$lib/pageNav.svelte"
    export const load = res('posts');
</script>
<script>
    export let d = {}
    $:cur = d.cur
    $:total = d.total
    $:ls = d.ls || []
</script>

<div>
    {#each ls as p}
        <div>
            <a href={`/post/${p.slug}`}><h3>{p.title}</h3></a>
            <p>{p.content}</p>
        </div>
    {/each}
</div>
<Nav total={total} cur={cur} url="/posts"/>