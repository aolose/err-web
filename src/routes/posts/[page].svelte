<script context="module">
    import {res} from "$lib/res";
    import Nav from "$lib/pag.svelte"

    export const load = res('posts');
</script>
<script>
    import {cacheSrvData} from "$lib/res";

    export let d = {}
    export let s;
    $:{
        cacheSrvData(s, d)
    }
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