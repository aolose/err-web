<script>

    import {initEdit, post} from "$lib/store";
    import {timeFmt} from "$lib/utils";
    import {slide} from '$lib/transition'
    import {tick} from "svelte";

    export let data = {}
</script>

<div
        transition:slide|local
        class:act={$post.id===data.id}
        on:click={async ()=>{
               const v={}
                            let o=v
                            if($post.id!==data.id)o={...data}
                            post.set(o)
                              await tick()
                              initEdit.set(+(v!==o))
                        }} class="cd">
    <h3>{data.title}</h3>
    <p>{(data.content || "").substr(0, 64)}</p>
    <p class="tm t1">{timeFmt(data.saved)}</p>
    <p class="tm">{timeFmt(data.updated)}</p>
    <div class="stu">
        {#if !data.id}
            <span title="temporary" class="_2">T</span>
        {:else }
            {#if data.ver === -1 || data.saved > data.updated}
                <span title="draft" class="_0">D</span>
            {/if}
            {#if data.ver > 0}
                <span title="published" class="_1">P</span>
            {/if}
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

</style>