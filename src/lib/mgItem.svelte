<script>
    import {timeFmt} from "$lib/utils";
    import {tip} from "$lib/popMsg.svelte";
    import {slide} from "svelte/transition";

    export let d = {}
    export let click
    export let act
    let mr = 0
    const {
        x: {s: slug, t: title, d: date} = {},
        i,
        a,
        n,
        f,
        r,
        c,
        l,
        s,
        t,
    } = d;

    function del(e) {
        e.stopPropagation()
        tip('Block the IP?', () => {

        }, 1)
    }

    function block() {

    }

    const sty = `color:#${[
        '21ff00', '00ffea', 'b783ff', 'ff49f6', 'ffdb49', 'ff8332'
    ][(n + a).split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 6]}`


    const e = {"i": 1, "a": 8, "n": "唐纳德·肉丝", "d": 1, "r": 0, "c": "sadasdas", "l": "", "s": 1, "t": 0, "o": 0}
</script>
<div class="cm" class:act={act} on:click={click?()=>click(i):null} transition:slide|local>
    <div class="m">
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
  .act{
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
      margin-right: 30px;
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
      &:hover{
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
