<script context="module">
    import {res} from "$lib/res";
    import Nav from "$lib/pag.svelte"
    import Item from "$lib/pItem.svelte"
    export const load = res('posts');
</script>
<script>
    import Ctx from "$lib/ctx.svelte";
    import {browser} from "$app/env";
    import {tick} from "svelte";

    let sc
    async function scTop(){
        await tick()
        if (sc) {
            document.scrollingElement.scrollTop=0
            window.scrollTo(0,0)
            sc.scrollTop=0
        }
    }
    export let d = {}
    $:{
        if (browser) {
            window.name = 'err'
        }
    }
    $:cur = d.cur
    $:total = d.total
    let ls = []
    $:ls = d.ls || []
</script>
<svelte:window  on:sveltekit:navigation-end={scTop}/>
<svelte:head>
    <title>Err - Posts</title>
</svelte:head>
<div class="o" bind:this={sc}>
    <Ctx>
        <div class="t">
            <div class="li"></div>
            <div class="c">
                {#each ls as p,i (p.updated)}
                    <Item p={p} n={i}/>
                {/each}
            </div>
        </div>
    </Ctx>
    <div class="n">
        <Nav total={total} cur={cur} url="/posts" length="2"/>
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

  .n {
    height: 80px;
  }

  .li {
    position: absolute;
    top: var(--itp);
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