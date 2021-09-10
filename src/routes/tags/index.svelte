<script context="module">
    import {res} from "$lib/res";
    export const load = res('tags');
</script>
<script>
    import {cacheSrvData} from "$lib/res";
    import Ctx from "$lib/ctx.svelte";
    export let d = []
    export let s;
    $:{
        cacheSrvData(s,d)
    }
</script>
<div>
  <Ctx>
      {#each d as tag}
          <span>{tag.name}</span>
      {/each}
  </Ctx>
</div>