<script>
    import Item from './pItem.svelte'
    import Ctx from "./ctx.svelte";
    import Canvas from './whi/ctx.svelte'
    import {tick} from "svelte";
    import Nav from "./pag.svelte"
    import {browser} from "$app/env";
    import Ph from './hd.svelte'
    import UpDownScroll from "$lib/UpDownScroll.svelte";

    let a = 0

    async function scTop() {
        await tick()
        if (sc) {
            document.scrollingElement.scrollTop = 0
            window.scrollTo(0, 0)
            sc.scrollTop = 0
        }
    }

    let sc, oh = 0, ih = 0
    export let name
    $:{
        if (browser) {
            window.name = 'err'
        }
    }
    export let d = {}
    $:cur = d.cur
    $:total = d.total
    let ls = []
    $:ls = d.ls || []
</script>
<UpDownScroll bind:down={a}/>
<svelte:window on:sveltekit:navigation-end={scTop}/>
<Canvas type={1}/>
<div class="o">
    <Ph bind:shrink={a}><slot></slot></Ph>
    <div class="t" bind:this={sc} class:v={a} bind:offsetHeight={oh}>
        <Ctx>
            <div class="c" bind:offsetHeight={ih}>
                {#each ls as p,i (p.updated)}
                    <Item p={p} n={i}/>
                {/each}
            </div>
        </Ctx>
    </div>
    <div class="n" class:v={ih>oh&&!a}>
        <div class="nn">
            <Nav total={total} cur={cur} url={'/'+name} length="2" tm="1"/>
        </div>
    </div>
</div>
<style lang="scss">
  @import "./break";

  $w: 15px;
  .nn {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .t {
    position: absolute;
    top: 40px;
    bottom: 10px;
    left: 0;
    right: 0;
    overflow: auto;
    padding: 80px 0 0;
    transition: .3s ease-in-out;
    transform: translate3d(0, 0, 0);
    clip-path: inset(80px 0 0 0);
  }


  .o {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .n {
    transition: .3s ease-in-out;
    height: 60px;
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translate3d(0, 0, 0);
    @include s() {
      height: 50px;
    }
  }

  .c {
    width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: baseline;
  }

  .v {
    @include s() {
      &.t {
        clip-path: inset(0px 0px 40px 0);
      }
      &.n {
        transform: translate3d(0, 50px, 0);
      }
    }
  }
</style>
