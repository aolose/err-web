<script>
    import SWin from './slideWin.svelte'
    import Pag from './pag.svelte'
    import Sc from './sc.svelte'
    import P from './process.svelte'
    import {upload} from './utils'
    import {onDestroy} from "svelte";
    import {upLoadSeq} from "$lib/store";
    let sc = ''
    let cur = 1;
    let total = 1;
    let showTsk = 1
    let qs=[]
    onDestroy(upLoadSeq.subscribe(u=>{
        qs=Object.keys(u)
    }))
    function search() {

    }
</script>
<SWin act={2}>
    <div class="bn" slot="btn">
        <div class="i ins"></div>
        <div class="i up">
            <input type="file" on:change={upload} multiple/>
        </div>
        <div class="i del"></div>
        <div class="i can"></div>
        <div class="sc">
            <Sc bind:value={sc} search={search}/>
        </div>
        <div class="i tsk" on:click={()=>showTsk=1-showTsk}></div>
    </div>
    <div class="re">
        <div class="fl">
            <div class="ls">
                <div class="po">
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                    <div class="f"></div>
                </div>
            </div>
            <Pag cur={cur} total={total}/>
        </div>
        <div class:act={showTsk} class="tk">
            {#each qs as q}
                    <P id={q}/>
            {/each}
        </div>
    </div>
</SWin>
<style lang="scss">
  .f {
    width: 140px;
    height: 100px;
    background: #2c3a56;
    display: inline-block;
    margin: 3px;
    border-radius: 5px;
  }
  .tk {
    transition: .3s ease-in-out;
    transform: translate3d(100%,0,0);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 200px;
    background: #121623;
    padding: 20px;
    &.act{
      transform: translate3d(0,0,0);
    }
  }


  .re {
    height: 100%;
    margin: 0 10px 0 20px;
   overflow:hidden;
    :global nav {
      left: 10px;
      bottom: 0;
      position: absolute;
      height: 30px;
    }
  }

  .fl {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ls {
    flex: 1;
  }

  .po {
    position: absolute;
    left: 0;
    right: 0;
    top: 10px;
    bottom: 40px;
    padding: 10px;
    overflow: auto;
  }

  .bn {
    display: flex;
  }

  .i {
    margin-right: 10px;
    height: 30px;
    width: 30px;
    background: center no-repeat;
    background-size: 60% auto;
    cursor: pointer;
    opacity: .7;

    &:hover {
      opacity: 1;
    }
  }

  .ins {
    background-image: url("./img/ins.svg");
  }

  .up {
    background-image: url("./img/up.svg");
  }

  .del {
    background-image: url("./img/del.svg");
  }

  .can {
    background-image: url("./img/can.svg");
  }

  .tsk {
    background-image: url("./img/task.svg");
    background-size: 75% auto;
    margin-right: -10px;
    opacity: .4;
  }

  .sc {
    align-items: center;
    display: flex;
    width: 180px;
  }


</style>