<script context="module">
    import {res} from "$lib/res";
    export const load = res('tags');
</script>
<script>
    import {cacheSrvData} from "$lib/res";

    export let d = []
    export let s;
    $:{
        cacheSrvData(s,d)
    }
</script>
<div>
    {#each d as tag}
        <span>{tag.name}</span>
    {/each}
</div>