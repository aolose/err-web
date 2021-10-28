<script>
    import SWin from './slideWin.svelte'
    import Pag from './pag.svelte'
    import Sc from './sc.svelte'
    import {query} from "./res";
    import Item from "./mgItem.svelte";
    import {bkList, post} from "./store";
    import Switch from "./switch.svelte";

    let sc = ''
    let ld = 0
    let cur = 1
    let total = 0
    let sc1 = ''
    let selected = {}
    let on = 0

    function loadList(res) {
        if (res) {
            bkList.set(res.ls || [])
            cur = res.cur || 1
            total = res.total
        }
    }

    async function  search() {
        loadList(await query('lsBk', 1, sc))
        sc1 = sc
    }

    async function go(x) {
        ld = 0
        cur = x
        loadList(await query('lsBk', x, sc1))
    }
</script>

<SWin act={5} onAct={()=>go(1)}>
    <div slot="btn" class="btn">
        <div class="sc">
            <Sc bind:value={sc} search={search}/>
            {#if ('id' in $post)}
                <Switch bind:on name="Current"/>
            {/if}
        </div>
    </div>
    <div class="ls">
        {#each $bkList as b}
            <Item d={b} act={selected[b.id]}/>
        {/each}
    </div>
    <Pag cur={cur} total={total}/>
</SWin>
<style lang="scss">
  .btn{
    display: flex;
    justify-content: flex-end;
  }
  .sc {
    max-width: 300px;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .ls {
    flex: 1;
    overflow: auto;
  }
</style>
