<script>
    import {qa} from "$lib/store";
    import {timeFmt} from "$lib/utils";
    import {slide} from '$lib/transition'
    export let data = {}
    let before=""
    let dr =false
    let hd = data.q||''
    let params=[]
    $:{
        dr = JSON.stringify(data)!==before

        if(data.saved){
            before=JSON.stringify(data)
        };

        (data.q||'').replace(/%[dws]/g,function (a,b,c){
            debugger
        });
    }

</script>

<div
        transition:slide|local
        class:act={$qa.id===data.id}
        on:click={()=>{
                            if($qa.id===data.id)qa.set({})
                            else qa.set({...data})
                        }} class="cd">
    <h3>{data.q}</h3>
    <p class="tm t1">{timeFmt(data.saved)}</p>
    <div class="stu">
        {#if !data.id}
            <span title="temporary" class="_0">T</span>
        {/if}
        {#if dr}
            <span title="unsaved" class="_3">U</span>
            {:else }
            <span title="saved" class="_4">S</span>
        {/if}
        {#if data.active}
            <span title="active" class="_1">A</span>
        {:else }
            <span title="disable" class="_2">D</span>
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
    min-height: 90px;
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
      background: #6f3fd0;
    }
    ._1 {
      background: #3fd083;
    }
    ._2 {
      background: #6b6b64;
    }
    ._3 {
      background: #3f98d0;
    }
    ._4 {
      background: #d05a3f;
    }
  }

</style>