<script>
    import {oldQa, qa, initEdit} from "$lib/store";
    import {timeFmt} from "$lib/utils";
    import {slide} from '$lib/transition'
    import {tick} from "svelte";
    export let data = {}
</script>

<div
        transition:slide|local
        class:act={$qa.id===data.id}
        on:click={async ()=>{
                            const v={}
                            let o=v
                            if($qa.id!==data.id)o={...data}
                            qa.set(o)
                            if($qa.saved)oldQa.set({...$oldQa,[$qa.id]:{...o}})
                            await tick()
                            initEdit.set(+(v!==o))
                        }} class="cd">
    <h3>{data.q}</h3>
    <p class="tm t1">{timeFmt(data.saved)}</p>
    <div class="stu">
        {#if !data.id}
            <span title="temporary" class="_0">T</span>
        {/if}
        {#if $qa.saved}
            <span title="saved" class="_4">S</span>
            {:else }
            <span title="unsaved" class="_3">U</span>
        {/if}
    </div>
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
    min-height: 60px;
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
      margin-top: 15px;
      white-space: pre-wrap;
      padding-left: 5px;
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
      background: #494f67;
    }
    ._3 {
      background: #cb9647;
    }
    ._4 {
      background: #3f88d0;
    }
  }

</style>