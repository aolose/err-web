<script>
    import Pag from './pageNav.svelte'
    import Ld from './loading.svelte'
    import {query} from "$lib/res";
    import {timeFmt} from "$lib/./utils";

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

    $:total = res.total
    $:ls = res.ls || []
    go(1)
</script>

<div class="lis">
    {#await res}
        <Ld/>
    {/await}
    <div class="sc">
        <input
                placeholder="search..."
                bind:value={sc}/>
        <button class="i-sc" on:click={search}>search</button>
    </div>
    <div class="ps">
        <div>
            {#each ls as p }
                <div class:act={act===p.id} on:click={()=>{
                    act=p.id
                    onSelect&&onSelect(p)
                }} class="cd">
                    <h3>{p.title}</h3>
                    <p>{p.content.substr(0, 64)}</p>
                    <p class="tm">{timeFmt(p.updated)}</p>
                    <span class={['_0','_1','_2'][p.status]}>{['Dra', 'Pub', 'Cha'][p.status]}</span>
                </div>
            {/each}
        </div>
    </div>
    <Pag cur={page} url={go} total={total} length="3"/>
</div>
<style lang="scss">
  .tm{
    font-size: 10px;
    position: absolute;
    right: 5px;
    bottom: 3px;
  }
  p{
    color: #999;
  }
  .cd {
    height: 70px;
    padding: 5px 5px 14px;
    margin: 5px 3px;
    cursor: pointer;
    background: #fff;
    border-radius: 3px;
   &.act{
     border: #1c93ff solid 1px;
   }
    h3 {
      font-size: 14px;
    }

    span {
      opacity: .8;
      position: absolute;
      right: 5px;
      top: 5px;
      color: #fff;
      border-radius: 3px;
      padding: 0 3px;
      font-size: 10px;
    }

    ._0 {
      background: #3cbbff;
    }

    ._1 {
      background: #3f9d47;
    }

    ._2 {
      background: #ff8a3c;
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