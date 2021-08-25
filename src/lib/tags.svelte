<script>
    import {createEventDispatcher, tick} from "svelte";

    export let ts = []
    let ipt
    let cp
    let v = ''
    let x
    let y
    let w
    let tags = {}
    const dispatch = createEventDispatcher();

    function pos() {
        if (!ipt) return
        setTimeout(() => {
            x = ipt.offsetLeft
            y = ipt.offsetTop
        }, 30)
    }

    function change() {
        dispatch('change', {tags: [...ts]})
    }

    $:{
        pos()
    }

    async function kd(en) {
        let {value, selectionEnd: e, selectionStart: s} = this;
        const {code} = en;
        const lf = value.length - e;
        if (code === 'Backspace') {
            if (!value) {
                ts.pop()
                ts = [...ts]
            }
        }
        value = value.toLowerCase()
        if ((!cp && /^(Space|Tab)$/gi.test(code)) || /^(Enter)$/gi.test(code)) {
            en.preventDefault()
            value = value.substr(0, s) + ' ' + value.substr(e)
            e++
        }
        if (/ /.test(value)) {
            const c = value.split(' ').filter(a => a)
            const f = c.shift()
            if (f) {
                if (ts.indexOf(f) === -1) {
                    ts = ts.concat(f)
                    change();
                }
                v = c[0] || '';
                e = v.length - lf
                if (e < 0) e = 0
                await tick();
                this.setSelectionRange(e, e)
            }
        }
        pos();
    }
</script>
<div class="tgs" on:click|stopPropagation={e=>{
    if(/tgs/.test(e.target.className))ipt.focus()
}}>
    {#each ts as t,i}
        <div class="t">
            <label>{t}</label>
            <i on:click={ async ()=>{
                ts.splice(i,1)
                ts=[...ts]
                await tick()
                pos()
            }}>x</i>
        </div>
    {/each}
    <span
            bind:offsetWidth={w}
            class="s" style={`left:${x}px;top:${y}px`}><span>{v}</span>{v}</span>
    <input bind:value={v} type="text"
           style={`width:${w}px`}
           on:compositionstart={()=>cp=1}
           on:compositionupdate={()=>cp=1}
           on:compositionend={()=>cp=0}
           on:keydown|stopPropagation={kd}
           bind:this={ipt}
    />
    <div class="sl"></div>
</div>
<style lang="scss">
  .tgs {
    width: 100%;
    min-height: 40px;
    display: flex;
    flex-wrap: wrap;
    padding: 3px;

    .t {
      border-radius: 4px;
      overflow: hidden;
      background: #1d314a;
      display: flex;
      height: 20px;
      margin: 2px;
      color: #8db2e9;

      &:hover {
        background: #00a1ff;
        color: #000;
      }
    }

    .s {
      position: absolute;
      min-width: 40px;
      color: #4b5e75;

      span {
        color: transparent;
        font: inherit;
        line-height: inherit;
      }
    }

    input {
      top: 0;
      left: 0;
    }

    .s, input {
      display: flex;
      align-items: center;
      font-family: inherit;
      font-size: 13px;
      font-weight: inherit;
      transform: none;
      height: 22px;
      line-height: 23px;
      padding: 2px 5px;
    }


    i {
      cursor: pointer;
      color: inherit;
      border-left: 1px solid #0e1832;
      width: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: normal;

      &:hover {
        background: #3c77c6;
      }
    }

    label {
      color: inherit;
      padding: 0 5px;
    }
  }
</style>