<script context="module">
    import {res} from "$lib/res";
    export const load = res('tags');
</script>
<script>
    export let d = []
</script>
<div>
    {#each d as tag}
        <span>{tag.name}</span>
    {/each}
</div>