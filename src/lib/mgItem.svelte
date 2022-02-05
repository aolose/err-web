<script>
    import {timeFmt} from "$lib/utils";
    import {tip} from "$lib/popMsg.svelte";
    import {slide} from "svelte/transition";
    import {query} from "$lib/res.js";

    export let d = {}
    export let click
    export let act
    let mr = 0
    let showRp = 0
    let rl = 0
    const {
        x: {s: slug, t: title, d: date} = {},
        i,
        a,
        n,
        f,
        c,
        l,
        s,
        t,
    } = d;
    let r = []
    let tm
    $:{
        r = d.r || []
        rl = r.length
    }
    let mg

    function del(e) {
        e.stopPropagation()
        tip('Block the IP?', () => {

        }, 1)
    }

    function block() {

    }

    function msg(a) {
        clearTimeout(tm)
        mg = a
        tm = setTimeout(() => {
            mg = ''
        }, 2e3)
    }

    function delRp(k) {
        tip('Delete the reply?', () => {
            query('replyDel', [i, k]).then(() => {
                d = {...d, r: r.filter(a => a.i !== k)}
            }).catch(e => {
                debugger
            })
        }, 1)
    }

    function reply() {
        if (!v) return
        const now = Math.floor(Date.now() / 1e3)
        const itm = {
            t: i,
            c: v
        }
        query('reply', itm).then(a => {
            itm.z=now
            v = ''
            itm.i = a
            d = {...d, r: [itm].concat(r)}
            msg('success')
        }).catch(e => {
            msg('fail!')
        })
    }

    let v = ''
    const sty = `color:#${[
        '21ff00', '00ffea', 'b783ff', 'ff49f6', 'ffdb49', 'ff8332'
    ][(n + a).split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 6]}`
    const e = {"i": 1, "a": 8, "n": "唐纳德·肉丝", "d": 1, "r": 0, "c": "sadasdas", "l": "", "s": 1, "t": 0, "o": 0}
</script>
<div class="cm" class:act={act}
     on:click={click?()=>click(i):null} transition:slide|local>
    <div class="m">
        <i class="rp" on:click|stopPropagation={()=>{
            showRp=1-showRp
        }}>
            {#if rl}
                <span>{rl}</span>
            {/if}
        </i>
        <i class="o" on:click={e=>{
            e.stopPropagation()
            mr=1-mr
        }}>
            ...
        </i>
        <div class="l">
            <span style={sty}>{n}</span> -
            <a target="__blank" href={`/post/${slug}`}>{title}</a>
            <span class="t">{timeFmt(t)}</span>
        </div>
        <div class="r">
            <p>{c}</p>
        </div>
    </div>
    {#if showRp}
        <div class="rs" class:sr={showRp} transition:slide on:click|stopPropagation>
            <div class="rx">
                <div class="mg" class:sh={mg}>
                    {mg}
                </div>
                <textarea bind:value={v} placeholder="say some thing ..."></textarea>
                <div class="bn" class:dis={!v} on:click={reply}>reply</div>
            </div>
            {#each r as {i, t, z, c}(i)}
                <div class="rr" transition:slide>
                    <div class="ro" on:click|stopPropagation={()=>delRp(i)}>
                        x
                    </div>
                    <span>{timeFmt(z)}</span>
                    <p>{c}</p>
                </div>
            {/each}
        </div>
    {/if}
    <div class="ee" class:mr>
        <div class="e">
            <span>IP: {f}</span>
            <div class="op">
                <i class="del" on:click={del}></i>
            </div>
        </div>
    </div>
</div>
<style lang="scss">


  .cm {
    cursor: pointer;
    border: 1px solid #10273f;
    margin: 10px 0 20px;
  }

  .act {
    background: #171f33;
    border-color: #163b78;
  }

  .l {
    background: transparentize(#000, .9);
    padding: 10px;
    display: flex;
    align-items: center;

    span {
      margin-right: 5px;
    }

    a {
      margin-left: 5px;
      color: #00a1ff;
      text-decoration: underline;
    }

    .t {
      font-size: 12px;
      margin-right: 64px;
      flex: 1;
      color: #638294;
      text-align: right;
    }
  }

  .r {
    flex: 1;

    p {
      padding: 10px;
      color: #bebebe;
      white-space: normal;
      word-break: break-all;
    }
  }

  i {
    display: block;
  }

  .o {
    position: absolute;
    top: 1px;
    right: 1px;
    padding: 3px 8px;
    z-index: 5;

    &:hover {
      color: orange;
      background: transparentize(#000, .3);
    }
  }

  .rp {
    opacity: .5;
    background: url("./img/reply.svg") center no-repeat;
    background-size: 50% auto;
    position: absolute;
    top: 1px;
    right: 40px;
    width: 30px;
    height: 30px;
    z-index: 5;

    span {
      position: absolute;
      top: 3px;
      right: -2px;
      color: #fff;
      background: #000;
      font-size: 10px;
      font-style: normal;
      text-align: center;
    }

    &:hover {
      opacity: 1;
    }
  }

  .rs {

  }

  .ro {
    position: absolute;
    color: #738eb0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    width: 18px;
    height: 18px;
    border: inherit;
    cursor: pointer;
    border-radius: 3px;

    &:hover {
      background: #1cb6ee;
      color: #fff;
    }
  }

  .rr {
    span {
      display: block;
      font-size: 12px;
      color: #6b665f;
    }

    p {
      color: #a8b0b6;
    }

    position: relative;
    border: 1px solid #2e3356;
    width: 96%;
    padding: 10px;
    border-radius: 4px;
    margin: 10px auto;

    &:nth-child(2n+1) {
      background: rgba(26, 40, 59, 0.5);
    }
  }

  .rx {
    position: relative;
    overflow: hidden;
  }

  .mg {
    z-index: 4;
    backdrop-filter: blur(10px);
    background: rgba(14, 167, 1, 0.47);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 50%;
    transition: .3s ease-in-out;
    opacity: .8;
    max-width: 200px;
    white-space: break-spaces;
    word-break: break-all;
    padding: 10px 20px;
    color: #fff;
    border-radius: 6px;
    transform: translate3d(-50%, -100%, 0);

    &.sh {
      transform: translate3d(-50%, 0, 0);
    }
  }

  textarea {
    border-radius: 4px;
    max-height: 180px;
    width: 96%;
    resize: none;
    display: block;
    margin: 10px auto;
    color: white;
    padding: 4px 10px;
    background: #1e2d3b;
  }

  .bn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    height: 24px;
    width: 60px;
    border-radius: 4px;
    margin: 0 1% 3px auto;
    background: #355685;
    opacity: .8;

    &:hover {
      opacity: 1;
    }

    &.dis {
      opacity: .5;
    }
  }

  .e {
    align-items: center;
    border-top: 1px solid #10273f;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    flex-wrap: wrap;
    background: transparentize(#fff, .99);

    span {
      color: #87a7bd;
    }
  }

  .op {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    i {
      width: 20px;
      height: 20px;
      background: center no-repeat;
      background-size: 100%;
      opacity: .5;
      cursor: pointer;
      transition: .2s ease-in-out;

      &:hover {
        opacity: 1;
      }
    }

    .del {
      background-image: url("./img/dis.svg");
    }
  }

  .ee {
    transition: .3s ease-in-out;
    height: 0;
    overflow: hidden;
  }

  .mr {
    height: 40px;
  }

</style>
