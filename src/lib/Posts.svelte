<script>
    import Item from './pItem.svelte'
    import Ctx from "./ctx.svelte";
    import {tick} from "svelte";
    import Nav from "./pag.svelte"
    import {browser} from "$app/env";
   import Ph from './hd.svelte'
    async function scTop() {
        await tick()
        if (sc) {
            document.scrollingElement.scrollTop = 0
            window.scrollTo(0, 0)
            sc.scrollTop = 0
        }
    }

    let sc
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
<svelte:window on:sveltekit:navigation-end={scTop}/>
<div class="o" bind:this={sc}>
    <Ph><slot></slot></Ph>
    <div class="t">
        <Ctx>
            <div class="c">
                {#each ls as p,i (p.updated)}
                    <Item p={p} n={i}/>
                {/each}
            </div>
        </Ctx>
    </div>
    <div class="n">
       <div class="nn">
           <Nav total={total} cur={cur} url={'/'+name} length="2" tm="1"/>
       </div>
    </div>
</div>
<style lang="scss">
  $w: 15px;
  .nn{
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .t {
    flex: 1;
    overflow: auto;
    padding: 10px 0;
    margin-bottom: 60px;
  }


  .o {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }

  .n {
    height: 60px;
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
  }

  .c {
    width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: baseline;
  }
</style>