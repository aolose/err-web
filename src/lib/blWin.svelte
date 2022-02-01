<script>
    import SWin from './slideWin.svelte'
    import LD from './loading.svelte'
    import Pag from './pag.svelte'
    import Firewall from './firewallItem.svelte'
    import Sc from './sc.svelte'
    import {query} from "./res";
    import Item from "./ipItem.svelte";
    import {bkList} from "./store";
    import Tabs from './tabs.svelte'
    import {tick} from "svelte";

    let tab = 0
    let sc = ''
    let ld = 0
    let cur = 1
    let total = 0
    let sc1 = ''
    let selected = {}
    let sct
    let api;
    $:{
        api = ['logs', 'lsBk'][tab]
    }

    async function loadList(res) {
        if (res) {
            bkList.set(res.ls || [])
            cur = res.cur || 1
            total = res.total
        }
        ld = 0
        await tick();
        if (sct) sct.scrollTop = 0;
    }

    async function ch() {
        bkList.set([])
        await tick();
        go(1)
    }

    async function search() {
        ld = 1
        loadList(await query(api, [1, sc]))
        sc1 = sc
    }

    async function go(x) {
        act=0
        ld = 1
        cur = x
        loadList(await query(api, [x, sc1]))
    }

    let act=0;
</script>

<SWin act={3} onAct={()=>go(1)}>
    <div slot="btn">
        <div class="sc">
            <div class="ct">
                <Tabs change={ch} item={['logs', 'firewall' ]} bind:cur={tab}/>
            </div>
            <Sc bind:value={sc} search={search}/>
        </div>
    </div>
    {#if tab}
        <div class="fi" class:act>
            <Firewall mod={1} change={()=>{
                go()
            }}/>
            <div class="dp" on:click={()=>act=1-act}></div>
        </div>
    {/if}
    <div class="ls" bind:this={sct}>
        {#each $bkList as b ,i(`${b.k}-${b.id}-${i}`)}
            {#if tab}
                <Firewall d={{...b}}
                          raw={JSON.stringify(b)}
                          change={d=>{
                    if(d)Object.assign(b,d)
                      go()
            }}/>
            {:else }
                <Item d={b} act={selected[b.k]} click={i=>{
                selected[i]=!selected[i]
            }}/>
            {/if}
        {/each}

    </div>
    {#if !tab}
        <Pag cur={cur} total={total} url={go}/>
    {/if}
    <LD act={ld}/>
</SWin>
<style lang="scss">
  .fi {
    position: absolute;
    top: 0;
    z-index: 100;
    background: transparentize(#121622,.3);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: flex-end;
    max-height: 30px;
    transition: .3s ease-in-out;
    padding: 0 30px 30px;
    overflow: hidden;
    &.act{
      max-height: 600px;
      .dp{
        transform: translateX(-50%) rotate(180deg);
      }
    }
  }
  .dp{
    &:hover{
      opacity: 1;
    }
    cursor: pointer;
    opacity: .5;
    transition: .3s ease-in-out;
    bottom: 5px;
    left: 50%;
    border-radius: 5px;
    transform: translateX(-50%);
    position: absolute;
    height: 20px;
    width: 60%;
    background:  center no-repeat url("../lib/img/down.svg");
    background-size:  auto 40%;
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }

  .ct {
    margin-right: 20px;
    width: 180px;
  }

  .sc {
    width: 100%;
    display: flex;
    align-items: center;
  }
 .fi+.ls{
   margin-top: 20px;
 }
  .ls {
    flex: 1;
    overflow: auto;
    padding: 20px 30px;
  }
</style>
