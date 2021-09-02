<script>
    import Pag from './pag.svelte'
    import Ld from './loading.svelte'
    import {query} from "$lib/res";
   import Hd from './listHead.svelte'
    import {timeFmt} from "$lib/utils";

    import {artList, post} from "$lib/store";
    import {slide} from '$lib/transition'
    let res = {}
    let sc
    let sc1
    let posts = []
    let page = 1

    function add() {
        const o = {
            id: 0,
            title: "A new article",
            desc: "",
            content: "Write something",
            ver: -1
        }
        post.set(o);
        artList.set([o, ...$artList])
    }

    async function search() {
        res = await query('edit', 1, sc)
        sc1 = sc
    }

    async function go(x) {
        page = x
        res = await query('edit', x, sc1)
    }

    $:{
        if(res&&res.ls)artList.set(res.ls || [])
    }
    $: hi = $artList.find(a => a && !a.id)
    $:total = res.total
    go(1)
</script>

<div class="lis">
    <Hd
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
            {#each $artList as p }
                <div
                        transition:slide|local
                        class:act={$post.id===p.id}
                        on:click={()=>{
                            if($post.id===p.id)post.set({})
                            else post.set({...p})
                        }} class="cd">
                    <h3>{p.title}</h3>
                    <p>{(p.content||"").substr(0, 64)}</p>
                    <p class="tm t1">{timeFmt(p.saved)}</p>
                    <p class="tm">{timeFmt(p.updated)}</p>
                    <div class="stu">
                        {#if !p.id}
                            <span title="temporary" class="_2">T</span>
                            {:else }
                            {#if p.ver === -1 || p.saved > p.updated}
                                <span title="draft" class="_0">D</span>
                            {/if}
                            {#if p.ver > 0}
                                <span title="published" class="_1">P</span>
                            {/if}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <Pag cur={page} url={go} total={total} length="3"/>
</div>
<style lang="scss">

  .tm {
    font-size: 10px;
    position: absolute;
    left: 2px;
    bottom: 2px;
    color: #4f6a9f;
  }

  .t1 {
    left: auto;
    right: 4px;
    bottom: 2px;
    color: #6d5d40;
  }

  p {
    padding-left: 5px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cd {
    border: 1px solid #153049;
    height: 90px;
    padding: 5px 5px 14px;
    margin: 5px 3px;
    cursor: pointer;
    border-radius: 3px;

    &:hover {
      background: #1e2740
    }

    &.act {
      border-color: #22528c;
      background: #0e1832;

      h3 {
        color: #26cdfc;
      }

      p:not(.tm) {
        color: #a3780c;
      }
    }

    h3 {
      padding-left: 5px;
      white-space: nowrap;
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: normal;
      color: #2290b0;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .stu {
      position: absolute;
      display: flex;
      right: 5px;
      top: 5px;
    }

    span {
      margin-left: 2px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      font-size: 10px;
    }

    ._0 {
      background: #77432e;
    }

    ._1 {
      background: #1e4994;
    }
    ._2 {
      background: #d03f86;
    }
  }

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