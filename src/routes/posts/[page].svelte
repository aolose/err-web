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
    $:ls = d.ls || []
</script>
<div class="o">
    <Ctx>
        <div class="t">
            <div class="i"></div>
            <div class="c">
                {#each ls as p,i}
                    <Item p={p} n={i}/>
                {/each}
            </div>
        </div>
    </Ctx>
    <Nav total={total} cur={cur} url="/posts"/>
</div>

<style lang="scss">
  $w: 15px;
  $lf: 100px;
  .t {
    padding: 5px;
    display: flex;
    height: 100%;
  }

  .o {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .i {
    position: absolute;
    top: 10px;
    bottom: 10px;
    width: 2px;
    left: $lf;
    color: transparentize(#fff, .8);
    background: linear-gradient(180deg, currentColor $w, transparent $w);
    background-size: 100% 1.6*$w;
  }

  .c {
    margin-left: 50px + $lf;
    flex: 1;
  }
</style>