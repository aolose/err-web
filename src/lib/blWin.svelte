<script>
    import SWin from './slideWin.svelte'
    import Pag from './pag.svelte'
    import Sc from './sc.svelte'
    import {query} from "./res";
    import Item from "./ipItem.svelte";
    import {bkList} from "./store";

    let sc=0
    let ld = 0
    let cur = 1
    let total = 0
    let sc1 = ''
    let selected={}
    function loadList(res) {
        if (res) {
            bkList.set(res.ls || [])
            cur = res.cur || 1
            total = res.total
        }
    }

    async function search() {
        loadList(await query('lsBk', 1, sc))
        sc1 = sc
    }

    async function go(x) {
        ld = 0
        cur = x
        loadList(await query('lsBk', x, sc1))
    }
</script>

<SWin act={3} onAct={()=>go(1)}>
    <div slot="btn">
        <div class="sc">
            <Sc bind:value={sc} search={search}/>
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

</style>