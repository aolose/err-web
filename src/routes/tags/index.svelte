<script context="module">
    import {res} from "$lib/res";
    export const load = res('tags');
</script>
<script>
    import Ctx from "$lib/ctx.svelte";
    export let d = []
</script>
<svelte:head>
    <title>Err - tags</title>
</svelte:head>
<div>
  <Ctx>
      {#each d as tag}
          <span>{tag.name}</span>
      {/each}
  </Ctx>
</div>