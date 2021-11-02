<script>
    import SWin from './slideWin.svelte'
    import Pag from './pag.svelte'
    import Sc from './sc.svelte'
    import {query} from "./res";
    import Item from "./mgItem.svelte";
    import {mgList, post} from "./store";
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
            mgList.set(res.ls || [])
            cur = res.cur || 1
            total = res.total
        }
    }

    async function search() {
        loadList(await query('lsMg', 1, {
            id: on ? $post.id : undefined,
            text: sc
        }))
        sc1 = sc
    }

    async function go(x) {
        ld = 0
        cur = x
        loadList(await query('lsMg', x, {
            id: on ? $post.id : undefined,
            text: sc1
        }))
    }

    async function ch() {
        loadList(await query('lsMg', 1, {
            id: on ? $post.id : undefined,
            text: sc
        }))
    }
</script>

<SWin act={5} onAct={()=>go(1)}>
    <div slot="btn" class="btn">
        <div class="sc">
            <Sc bind:value={sc} search={search}/>
            {#if ('id' in $post)}
                <Switch bind:on name="Current" change={ch}/>
            {/if}
        </div>
    </div>
    <div class="ls">
        {#each $mgList as b}
            <Item d={b} act={selected[b.id]}/>
        {/each}
    </div>
    <Pag cur={cur} total={total} url={go}/>
</SWin>
<style lang="scss">
  .btn {
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
    padding: 20px 30px;
  }
</style>
