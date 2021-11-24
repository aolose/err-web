<script>
    import Pag from './pag.svelte'
    import Ld from './loading.svelte'
    import {query} from "$lib/res";
    import Hd from './listHead.svelte'
    import {initEdit} from "$lib/store";
    import {tick} from "svelte";

    export let listStore
    export let curStore
    export let onAdd
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
        listStore.set([o, ...$listStore])
        curStore.set({...o});
        if(onAdd)onAdd()
        await tick()
        initEdit.set(1)
    }

    async function search() {
        ld = 1
        res = await query(api, 1, sc) || []
        sc1 = sc
        ld = 0
    }

    async function go(x) {
        ld = 1
        page = x
        res = await query(api, x, sc1)
        ld = 0
        await tick()
        sct.scrollTop=0
    }

    $:{
        if (res && res.ls) listStore.set(res.ls || [])
    }
    let hi;
    $:total = res.total
    let mix
    $:{
        mix = $listStore || []
        hi = ($listStore || []).find(a => a && !a.id)
        // if(Object.keys($curStore).length){
        //     const m = ($listStore || []).find(a => a.id === $curStore.id)
        //     if (!m) mix = [$curStore].concat($listStore)
        // }
        mix=mix.filter(a=>a&&'id' in a)
    }
    go(1)
    let sct;
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
        <div bind:this={sct}>
            {#each mix as p (p.id)}
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