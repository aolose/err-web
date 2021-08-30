<script>
    import {resList, upLoadInfo, upLoadSeq} from "$lib/store";
    import {onDestroy} from "svelte";
    import {fileType} from "$lib/utils";

    export let id = ""
    let inf = {}
    let p = 0
    let tp = '', nm = '', url = ''
    onDestroy(upLoadSeq.subscribe(u => {
        const v = u[id]
        if (v) {
            inf = $upLoadInfo[id] || {}
            p = Math.floor(v.reduce((a, b) => a + b, 0) * 100 / v.length)
            tp = inf.type
            nm = inf.name || ''
            url = inf.url
            if (p === 100) {
                resList.add({
                    ...inf,
                    id: id,
                })
                setTimeout(()=>{
                    upLoadSeq.update(a => {
                        delete a[id]
                        return {...a}
                    })
                },1e3)
            }
        }
    }))
</script>
<div class="t">
    <span class="f">{p}%</span>
    {#if url}
        <div class="b" style={`background-image:url(${inf.url})`}></div>
    {:else }
        <div class="b">
            <span class="c">{fileType(tp)}</span>
        </div>
    {/if}
    <div class="e">
        <span class="d" title={nm}>{nm}</span>
    </div>
    <div class="p">
        <div class="v">
            <div style={`width:${p}%`}></div>
        </div>
    </div>
</div>
<style lang="scss">
  .f {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #4d707e;
    font-size: 10px;
  }

  .p {
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: 0;
    height: 15px;
    display: flex;
  }

  .v {
    display: flex;
    align-items: center;
    flex: 1;

    div {
      transition: .1s linear;
      height: 2px;
      border-radius: 3px;
      background: linear-gradient(90deg, #155d86, #00a3ff);
    }
  }

  .c {
    color: #cb7547;
    font-weight: 600;
    text-transform: uppercase;
  }

  .b {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    background: #13152f;
    margin-right: 5px;
    margin-left: 3px;
    background-size: contain;
    border-radius: 3px;
  }

  .e {
    margin-left: 5px;
    height: 26px;
    overflow: hidden;
    flex: 1;
    align-items: flex-end;
    display: flex;
  }

  .d {
    color: #6fa8ce;
    font-size: 12px;
    display: block;
    width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .t {
    padding: 2px 4px 10px;
    align-items: center;
    display: flex;
    height: 60px;
    border-radius: 4px;
    margin: 10px 0;
    background: #242848;
  }
</style>