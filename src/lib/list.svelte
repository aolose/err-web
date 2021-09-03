<script>
    import Pag from './pag.svelte'
    import Ld from './loading.svelte'
    import {query} from "$lib/res";
    import Hd from './listHead.svelte'

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

    function add() {
        const o = {...baseItem}
        curStore.set({...o});
        listStore.set([o, ...$listStore])
    }

    async function search() {
        res = await query(api, 1, sc)||[]
        sc1 = sc
    }

    async function go(x) {
        page = x
        res = await query(api, x, sc1)
    }

    $:{
        if (res && res.ls) listStore.set(res.ls || [])
    }
    let hi;
    $:hi = ($listStore||[]).find(a => a && !a.id)
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
    {#await res}
        <Ld/>
    {/await}

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