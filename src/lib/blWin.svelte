<script>
    import SWin from './slideWin.svelte'
    import LD from '$lib/loading.svelte'
    import Pag from './pag.svelte'
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
        sct.scrollTop=0;
    }

    async function ch() {
        await tick();
        go(1)
    }

    async function search() {
        ld = 1
        loadList(await query(api, 1, sc))
        sc1 = sc
    }

    async function go(x) {
        ld = 1
        cur = x
        loadList(await query(api, x, sc1))
    }
</script>

<SWin act={3} onAct={()=>go(1)}>
    <div slot="btn">
        <div class="sc">
            <div class="ct">
                <Tabs change={ch} item={['logs', 'black list' ]} bind:cur={tab}/>
            </div>
            <Sc bind:value={sc} search={search}/>
        </div>
    </div>
    <div class="ls" bind:this={sct}>
        {#each $bkList as b (b.k)}
            <Item d={b} act={selected[b.k]} click={i=>{
                selected[i]=!selected[i]
            }}/>
        {/each}
    </div>
    <Pag cur={cur} total={total} url={go}/>
    <LD act={ld}/>
</SWin>
<style lang="scss">
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

  .ls {
    flex: 1;
    overflow: auto;
    padding: 20px 30px;
  }

</style>