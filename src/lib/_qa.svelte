<script>
    import List from './list.svelte'
    import Qa from './qCard.svelte'
    import Ld from './loading.svelte'
    import {fade} from "svelte/transition";
    import {slide} from './transition'
    import { qaList, qState} from "./store";
    import {qa} from "./store";
    import Edit from './edit.svelte'
    import BW from './blWin.svelte'
    import {query} from "$lib/res";
    import {onDestroy} from "svelte";
     let last=""
    let curQ=-1
    $:{
        const newPa = {}
        const q = $qa

        function syncParam(p) {
            const k = p.replace(/[{}]/g, '')
            newPa[k] = params[k] || [3, 9]
        }

        const {params = {}, a = "", q: b = ""} = q;
        (a.match(/\{\w+\}/g) || []).forEach(syncParam);
        (b.match(/\{\w+\}/g) || []).forEach(syncParam);
        Object.values(newPa).forEach(o => {
            o[0] = +((o[0] + '').replace(/[^0-9]/g, ''));
            o[1] = +((o[1] + '').replace(/[^0-9]/g, ''));
        })
        q.params = newPa;
        qa.set({...q})
    }

    let ld=0
    async function del() {
        if(ld)return
        const {id} = $qa
        if(id){
            ld=1
            await query('delQ', id)
            setTimeout(()=>ld=0,1e3)
        }
        qa.set({})
        qaList.update(c=>{
            const idx = c.findIndex(a=>a.id===id)
            if(idx!==-1){
                c=c.splice(idx,1)
                return c.slice()
            }
        })
    }
    let tm=-1;
    function tesQ() {
        clearTimeout(tm)
        tm=setTimeout(function (){
            curQ= $qa.id
            query('tesQ', $qa)
        },1e3)
    }

    function svQ() {
       clearTimeout(tm)
        tm=setTimeout(function (){
            curQ= $qa.id
            query('svQ', $qa)
        },2e3)
    }
    function ku(){
        qa.update(a=>a)
    }
    onDestroy(qa.subscribe(async q => {
        const idx = $qaList.findIndex(a=>a.id===q.id)
        if(idx!==-1){
            $qaList[idx]={...q}
            qaList.set($qaList.slice())
        }
        const l =JSON.stringify(q)
        if (q.q&&q.a&&last!==l) {
            if(q.saved||!q.id){
                if(curQ===q.id)return;
                if (/{\w+}|[a-z]+\.|[()]/i.test(q.a)) {
                    tesQ()
                } else {
                    qState.set({q: q.q, e: "",a:q.a, pending: 0})
                }
            }else {
                last=l;
                svQ()
            }
        }
    }))
    onDestroy(()=>{
        qa.set({})
        qaList.set([])
        qState.init()
    })
</script>
<div class="qa" transition:fade>
    <nav>
        <List
                icon={1}
                api={'qs'}
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
                store={qa}
                type={1}
                saved={$qa.saved}
                show={'id' in $qa}
                title={'q'}
                content={'a'}
        >
            <div class="r" slot="title">
                <h3 transition:fade>Question:</h3>
                <div class="tl">
                    <i
                            class:ld={ld}
                            on:click={del}
                            transition:slide|local={{horizon:1}} class="del"></i>
                </div>
            </div>
            <div class="r" slot="content">
                <h3 transition:fade>Answer:</h3>
            </div>
        </Edit>
        <div class="ra">
            <div class="pms">
                {#if 'id' in $qa}
                    <div
                            transition:fade
                            class="pre">
                        <h3>Preview</h3>
                        <div class="pq">
                            {#if $qState.e}
                                <p class="er"><label>E</label> {$qState.e}</p>
                            {:else }
                                <p><label>Q</label> {$qState.q}</p>
                                <p class="as"><label>A</label> {$qState.a}</p>
                            {/if}
                            <Ld act={$qState.pending} text="question build"/>
                        </div>
                    </div>
                {/if}
                <div class="pl">
                    {#each Object.keys($qa.params).map(k => [k, $qa.params[k]]) as [k, p]}
                        <div class="pm" transition:slide|local>
                            <label>{k}</label>
                            <div class="l">
                                <span>Min</span>
                                <span>Max</span>
                            </div>
                            <div class="s">
                                <input type="text" bind:value={p[0]} on:keyup={ku}>
                                <input type="text" bind:value={p[1]} on:keyup={ku}/>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <BW/>
        </div>
    </div>
</div>
<style lang="scss">
  .ra{
    margin-top: 10px;
    margin-left: 20px;
    flex: 1;
  }
  .pq {
    padding: 0 20px;
    p{
      margin-top: 10px;
      display: flex;
      font-size: 16px;
      color: #ccb38d;
      white-space:pre-wrap;
      word-break: break-word;
    }
    .as{
      color: #0ea701;
    }
    .er{
      color: #53758d;
    }
  }

  .pre {
    width: 240px;
    margin: 0 10px;
    label {
      left: -20px;
      position: absolute;
      opacity: .5;
      top: -18px;
      color: inherit;
      margin-right: 6px;
      display: flex;
      align-items: center;
      height: 20px;
      font-size: 13px;
      font-weight: 200;
      &:after{
        content:':';
      }
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
    overflow: hidden;
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
    width: 240px;
    margin: 10px 20px;
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
