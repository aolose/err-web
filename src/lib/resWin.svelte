<script>
    import SWin from './slideWin.svelte'
    import Pag from './pag.svelte'
    import Sc from './sc.svelte'
    import P from './process.svelte'
    import Item from './resItem.svelte'
    import {upload} from './utils'
    import {onDestroy, tick} from "svelte";
    import {slide} from './transition'
    import {bannerMod, extraHis, post, resList, tok, upLoadSeq, winAct} from "$lib/store";
    import {query} from "$lib/res";
    import {session} from "$app/stores";

    export let ipt
    let delLd = 0
    let acts = []
    let sc = ''
    let sc1 = ''
    let cur = 1;
    let total = 0;
    let showTsk = 0
    let qs = []
    let hasP = 0

    const bakPub = () => {
        bannerMod.set(0)
        winAct.set(1)
    }

    function add(a) {
        if ($bannerMod) {
            bannerMod.set(0)
            if ($post) $post.banner = a.id
            bakPub()
            return
        }
        const v = acts.slice()
        const x = v.findIndex(v => v.id === a.id)
        if (x !== -1) {
            v.splice(x, 1)
        } else {
            v.push(a)
        }
        acts = v
    }


    onDestroy(post.subscribe(p => {
        hasP = Object.keys(p).length > 1
    }))
    onDestroy(upLoadSeq.subscribe(u => {
        qs = Object.keys(u)
        if (!qs.length) setTimeout(() => {
            showTsk = 0
        }, 400)
    }))

    async function search() {
        loadList(await query('lsRes', 1, sc))
        sc1 = sc
    }

    async function go(x) {
        delLd = 0
        cur = x
        loadList(await query('lsRes', x, sc1))
    }

    function loadList(res) {
        if (res) {
            resList.set(res.ls || [])
            cur = res.cur || 1
            total = res.total
        }
    }

    async function del() {
        delLd = 1
        await query('delRes', acts.map(a => a.id))
        await tick()
        if ($resList.length) await go(cur)
        acts = []
        delLd = 0
    }

    async function ins() {
        if (ipt) {
            let {value, selectionEnd: e, selectionStart: s} = ipt;
            const ls = acts.map(({id, name, ext, size}) => {
                return `!(${id})\n[t:${ext}|n:${name}|s:${size}]`
            })
            let is = "";
            ls.forEach(v => extraHis.update(() => {
                is = is + v + '\n\n';
                const lt = e + is.length + 1;
                const d = value.substr(0, s) + '\n' + is + value.substr(e);
                return [d, lt, lt]
            }));

            const a = ls.join('\n\n')
            const d = value.substr(0, s) + '\n' + a + value.substr(e)
            const l = a.length + 1
            e += l
            post.set({...$post, content: d})
            await tick()
            ipt.setSelectionRange(e, e)
            acts = []
        }
    }

    let c = 0
    let d = 0
    $:{
        d = Object.keys($upLoadSeq).length
        c = acts.length
    }

</script>
<SWin act={2} onAct={()=>go(1)} onClose={bakPub}>
    <div class="bn" slot="btn">
        <div class="i up">
            <input type="file"
                   accept={bannerMod?"image/*": "*/*"}
                   on:change={function (){
                upload.call(this,$tok||$session.token)
                showTsk=1
            }} multiple/>
        </div>
        {#if hasP && c}
            <div
                    on:click={ins}
                    transition:slide|local={{horizon:1}}
                    class="i ins"><span>{c}</span></div>
        {/if}
        {#if c}
            <div class="i del"
                 transition:slide|local={{horizon:1}}
                 class:ld={delLd}
                 on:click={del}
            ><span>{c}</span></div>
            <div
                    transition:slide|local={{horizon:1}}
                    class="i can" on:click={()=>{
            acts=[]
        }}></div>
        {/if}
        <div class="sc">
            <Sc bind:value={sc} search={search}/>
        </div>
        {#if d}
            <div
                    transition:slide|local={{horizon:1}}
                    class="i tsk" on:click={()=>showTsk=1-showTsk}>
                <span>{d}</span>
            </div>
        {/if}
    </div>
    <div class="re">
        <div class="fl">
            <div class="ls">
                <div class="po">
                    {#each $resList as r (r.id)}
                        <Item
                                idx={acts.indexOf(r)+1}
                                click={()=>add(r)}
                                tp={r.type}
                                ext={r.ext}
                                url={r.url}
                                nm={r.name}
                                sz={r.size}
                                act={acts.indexOf(r)!==-1}
                                id={r.id}/>
                    {/each}
                </div>
            </div>
            <Pag url={go} cur={cur} total={total}/>
        </div>
        <div class:act={showTsk} class="tk">
            {#each qs as q}
                <P id={q}/>
            {/each}
        </div>
    </div>
</SWin>
<style lang="scss">
  .tk {
    transition: .3s ease-in-out;
    transform: translate3d(100%, 0, 0);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 200px;
    background: rgba(16, 19, 29, .82);
    padding: 20px 10px;
    backdrop-filter: blur(5px);

    &.act {
      transform: translate3d(0, 0, 0);
    }
  }


  .re {
    height: 100%;
    margin: 0 10px 0 20px;
    overflow: hidden;

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
    overflow-x: hidden;
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

    span {
      pointer-events: none;
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 10px;
      color: #a6a093
    }

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