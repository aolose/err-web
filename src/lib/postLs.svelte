<script>
    import Pag from './pageNav.svelte'
    import Ld from './loading.svelte'
    import {query} from "$lib/res";
    import {timeFmt} from "$lib/utils";
    import Lg from "$lib/./lg.svelte";
    import {list} from "$lib/store";

    export let onSelect
    export let act = -1;
    let res = {}
    let sc
    let sc1
    let posts = []
    let page = 1

    async function search() {
        res = await query('edits', 1, sc)
        sc1 = sc
    }

    async function go(x) {
        page = x
        res = await query('edits', x, sc1)
    }

    $:{
        list.set(res.ls || [])
    }
    $:total = res.total
    go(1)
</script>

<div class="lis">
    <Lg/>
    {#await res}
        <Ld/>
    {/await}
    <div class="sc">
        <input
                placeholder="search..."
                bind:value={sc}/>
        <button class="i-sc" on:click={search}></button>
    </div>
    <div class="ps">
        <div>
            {#each $list as p }
                <div class:act={act===p.id} on:click={()=>{
                    act=p.id
                    onSelect&&onSelect(p)
                }} class="cd">
                    <h3>{p.title}</h3>
                    <p>{p.content.substr(0, 64)}</p>
                    <p class="tm">{timeFmt(p.updated)}</p>
                    <div class="stu">
                        {#if p.publish}<span title="published" class="_1">P</span>{/if}
                        {#if p.draft}<span title="draft" class="_0">D</span>{/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <Pag cur={page} url={go} total={total} length="3"/>
</div>
<style lang="scss">
  .sc {
    align-items: center;
    display: flex;
    height: 30px;
    margin: 20px 0 20px 60px;
    input{
      padding:  0 10px;
      height: 30px;
      width: 0;
      flex: 1;
      border-radius: 200px;
      background: #1c334a;
    }
  }
  .i-sc{
    margin-left: 5px;
    width: 24px;
    height: 24px;
    border-radius: 20px;
    background: #1c93ff url("$lib/img/search.svg") no-repeat center;
    background-size: 50%;
  }
  .tm {
    font-size: 10px;
    position: absolute;
    right: 5px;
    bottom: 3px;
    color: #606d99;
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
      h3{
        color: #26cdfc;
      }
      p:not(.tm){
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