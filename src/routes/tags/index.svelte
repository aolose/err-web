<script context="module">
    import {res} from "$lib/res";

    export const load = res('tags');
</script>
<script>
    import Ctx from "$lib/ctx.svelte";
    import ITag from "$lib/icontag.svelte"

    export let d = []
</script>
<svelte:head>
    <title>Err - tags</title>
</svelte:head>
<Ctx>
    <h1>
        <ITag/>
        Tags
    </h1>
    <div class="ls">
        {#each d as tag}
            <a href={`/tag/${tag.name}/1`}>{tag.name}</a>
        {/each}
    </div>
</Ctx>
<style lang="scss">
  h1 {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 50px;
    color: #94abc2;
    display: flex;
    align-items: center;
  }

  a {
    font-size: 14px;
    background: #1c334a;
    margin: 8px 5px;
    border-radius: 5px;
    padding: 5px 10px;
    color: #fff;

    &:hover {
      background: #49a9e8;
      color: #000;
    }
  }
  .ls{
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
  }
</style>