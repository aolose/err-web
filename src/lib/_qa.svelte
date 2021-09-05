<script>
    import List from './list.svelte'
    import Qa from './qCard.svelte'
    import Ld from './loading.svelte'
    import {fade} from "svelte/transition";
    import {slide} from './transition'
    import {initEdit, qaList} from "./store";
    import {qa} from "./store";
    import Edit from './edit.svelte'
    import {query} from "$lib/res";

    $:{
        const newPa = {}
        const q = $qa

        function syncParam(p) {
            const k = p.replace(/[{}]/g, '')
            newPa[k] = params[k] || [3, 9]
        }

        const {params = {}, a = "", q: b = ""} = q;
        (a.match(/\{\w+\}/g)||[]).forEach(syncParam);
        (b.match(/\{\w+\}/g)||[]).forEach(syncParam);
        Object.values(newPa).forEach(o => {
            o[0] = +((o[0] + '').replace(/[^0-9]/g, ''));
            o[1] = +((o[1] + '').replace(/[^0-9]/g, ''));
        })
        q.params = newPa;
        qa.set({...q})
    }

    function sav() {
         query('addQ',$qa)
    }

    function del() {
        query('delQ',$qa.id)
    }

    function tesQ(){
        query('tesQ',$qa.id)
    }



</script>
<div class="qa" transition:fade>
    <nav>
        <List
                icon={1}
                api={'qa'}
                cpm={Qa}
                listStore={qaList}
                curStore={qa}
                baseItem={{
                    id:0,
                    params:{},
                    q:"write your question",
                    a:"write your code / answer"
                }}
        />
    </nav>
    <div class="ma">

        <Edit
                type={1}
                saved={$qa.saved}
                show={'id' in $qa}
                bind:title={$qa.q}
                bind:content={$qa.a}
        >
            <div class="r" slot="title">
                <h3 transition:fade>Question:</h3>
                <div class="tl">
                    <i transition:slide|local={{horizon:1}} class="del"></i>
                    <i transition:slide|local={{horizon:1}} class="rec"></i>
                    <i transition:slide|local={{horizon:1}} class="sav"></i>
                    <i transition:slide|local={{horizon:1}} class="act"></i>
                    <i transition:slide|local={{horizon:1}} class="dis"></i>
                </div>
            </div>
            <div class="r" slot="content">
                <h3 transition:fade>Answer:</h3>
            </div>
        </Edit>
        <div class="pms">
            <div class="pre">
                <label>Preview</label>
                <div >
                    <Ld/>
                </div>
            </div>
          <div class="pl">
              {#each Object.keys($qa.params).map(k=>[k,$qa.params[k]]) as [k,p]}
                  <div class="pm" transition:slide|local>
                      <label>{k}</label>
                      <div class="l">
                          <span>Min</span>
                          <span>Max</span>
                      </div>
                      <div class="s">
                          <input type="text" bind:value={p[0]}>
                          <input type="text" bind:value={p[1]}/>
                      </div>
                  </div>
              {/each}
          </div>
        </div>
    </div>
</div>
<style lang="scss">
  .pre{
    width: 240px;
    margin: 0 10px;
    min-height: 100px;
    label{
      display: flex;
      align-items: center;
      height: 20px;
      padding-left: 5px;
      color: #866529;
      font-size: 14px;
    }

  }
  .tl {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  i {
    opacity: .7;
    cursor: pointer;
    height: 24px;
    width: 24px;
    margin-left: 20px;
    background-size: 80%;

    &:hover {
      opacity: 1;
    }
  }


  .del {
    background-image: url("./img/del.svg");
  }

  .dis {
    background-image: url("./img/dis.svg");
  }

  .act {
    background-image: url("./img/act.svg");
  }

  .rec {
    background-image: url("./img/rec.svg");
  }

  .sav {
    background-image: url("./img/sav.svg");
    background-size: 100% auto;
  }

  h3 {
    font-size: 20px;
    font-weight: 200;
    color: #233e5d;
    line-height: 1;
    font-style: italic;
  }

  .r {
    height: 60px;
    display: flex;
    align-items: center;
  }

  .qa {
    position: absolute;
    left: 0;
    right: 60px;
    top: 0;
    bottom: 0;
    display: flex;
  }

  .ma {
    padding: 10px 0 40px 10px;
    flex: 1;
    height: 100%;
    display: flex;
  }

  nav {
    width: 250px;
    display: block;
    height: 100%;
    background: #121622;
    padding: 0 11px 5px 6px;
  }

  .pms {
    margin: 20px;
    white-space: pre-wrap;
  }

  .pm {
    label {
      position: absolute;
      font-weight: 200;
      color: #2e3b46;
      left: 0;
      top: 4px;
      font-style: italic;
      bottom: -3px;
      font-size: 24px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    padding-left: 50px;
    height: 60px;
    width: 240px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 10px;

    div {
      display: flex;
      justify-content: space-between;
      margin: 0 10px;

      * {
        text-align: center;
        padding: 0;
        margin: 0;
        flex: 1;
        width: 0;
      }
    }

    .l {
      margin-bottom: 3px;

      span {
        color: #0ea701;
        font-size: 10px;

        & + span {
          color: #a16306;
        }
      }
    }

    .s {
      input {
        padding: 0 10px;
        border-radius: 4px;
        margin: 0 3px;
        background: #1b233b;
        font-size: 16px;
      }

      height: 30px;
    }
  }
</style>
