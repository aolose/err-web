<script>
    import Pag from './pag.svelte'
    import Ld from './loading.svelte'
    import {query} from "$lib/res";
    import Hd from './listHead.svelte'
    import {initEdit} from "$lib/store";
    import {tick} from "svelte";

    export let listStore
    export let curStore
    export let cpm
    export let icon = 0
    export let api
    export let baseItem = {}
    let res = {}
    let sc
    let sc1
    let page = 1
    let ld = 0

    async function add() {
        const o = {...baseItem}
        curStore.set({...o});
        listStore.set([o, ...$listStore])
        await tick()
        initEdit.set(1)
    }

    async function search() {
        ld=1
        res = await query(api, 1, sc) || []
        sc1 = sc
        ld=0
    }

    async function go(x) {
        ld=1
        page = x
        res = await query(api, x, sc1)
        ld=0
    }

    $:{
        if (res && res.ls) listStore.set(res.ls || [])
    }
    let hi;
    $:hi = ($listStore || []).find(a => a && !a.id)
    $:total = res.total
    go(1)
</script>

<div class="lis">
    <Hd
            icon={icon}
            bind:value={sc}
            search={search}
            add={add}
            hi={hi}
    />
    <Ld act={ld}/>

    <div class="ps">
        <div>
            {#each $listStore as p }
                <svelte:component this={cpm} data={p}/>
            {/each}
        </div>
    </div>
    <Pag cur={page} url={go} total={total} length="3"/>
</div>
<style lang="scss">

  .lis {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ps {
    flex: 1;

    & > div {
      padding: 5px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
      overflow-x: hidden;
      position: absolute;
    }
  }
</style>