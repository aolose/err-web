<script context="module">
    import {res} from "$lib/res";
    import Nav from "$lib/pag.svelte"
    import Item from "$lib/pItem.svelte"

    export const load = res('posts');
</script>
<script>
    import {cacheSrvData} from "$lib/res";
    import Ctx from "$lib/ctx.svelte";

    export let d = {}
    export let s;
    $:{
        cacheSrvData(s, d)
    }
    $:cur = d.cur
    $:total = d.total
    let ls=[]
    $:ls = d.ls || []
</script>
<svelte:head>
    <title>Err - Posts</title>
</svelte:head>
<div class="o">
    <Ctx>
        <div class="t">
            <div class="i"></div>
            <div class="c">
                {#each ls as p,i (p.updated)}
                    <Item p={p} n={i}/>
                {/each}
            </div>
        </div>
    </Ctx>
    <div class="n">
        <Nav total={total} cur={cur} url="/posts"/>
    </div>
</div>

<style lang="scss">
  $w: 15px;
  .t {
    padding: 5px;
  }

  .o {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
 .n{
   height: 80px;
 }
  .i {
    position: absolute;
    top:  var(--itp);
    min-height: 70vh;
    bottom: 80px;
    width: var(--iw);
    left: var(--poL);
    color: transparentize(#fff, .8);
    background: linear-gradient(180deg, currentColor $w, transparent $w);
    background-size: 100% 1.6*$w;
  }

  .c {
    margin-left: var(--poL2);
  }
</style>