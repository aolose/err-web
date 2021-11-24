<script>
    import {tick} from "svelte";

    let ipt = [], vv = []

    export let v = 0
    export let change

    function next(a, s = 1) {
        const p = ipt[ipt.indexOf(a) + s]
        if (p) {
            const a = s < 0 ? 9999 : 0;
            p.setSelectionRange(a, a)
            p.focus()
        }
    }

    function ch(mi, ma) {
        return async function () {
            const tg = this;
            const {selectionStart, selectionEnd, value} = tg
            let x = value
            if (value !== "") {
                x = +x
                if (x < mi) x = mi
                else if (x > ma) x = ma
            }
            vv[ipt.indexOf(tg)] = x
            const [m, d, y, h, mm, s] = vv;
            const nd = new Date(+y, m - 1, +d, +h, +mm, +s)
            const t = nd.getTime()
            if (+(y + m + d + h + mm + s) && t > 0) {
                change && change(Math.ceil(t / 1e3))
            } else {
                change && change(0)
            }
            await tick()
            tg.setSelectionRange(selectionStart, selectionEnd)
        }
    }

    function kd(l = 2) {
        return function (en) {
            const tg = this;
            const {code, key} = en;
            if (key.length === 1 && !/[0-9]/.test(key)) {
                return en.preventDefault()
            }
            if (/^(Enter)$/gi.test(code)) {
                return next(tg)
            }

            tg.onkeyup = async () => {
                tg.onkeyup = null;
                let {selectionStart, selectionEnd, value} = tg
                value = value.substr(0, l)
                vv[ipt.indexOf(tg)] = value
                await tick()
                if (selectionStart === 0) next(tg, -1)
                if ((selectionEnd === l && value.length === l) ||
                    (/ArrowRight/i.test(code) && selectionEnd === value.length)) {
                    next(tg)
                }
                tg.setSelectionRange(selectionStart, selectionEnd)
            }
        }
    }

    $:{
        if (v) {
            const da = new Date(v * 1e3);
            vv = [da.getMonth() + 1, da.getDate(), da.getFullYear(),
                da.getHours(), da.getMinutes(), da.getSeconds()]
        }
    }

    const cfg = [
        [0, 1, 12, '/'],
        [1, 1, 31, '/'],
        [2, 1970, 2099, '', 4],
        [3, 0, 23, ':'],
        [4, 0, 59, ':'],
        [5, 0, 59],
    ]

</script>
<div class="da">
    {#each cfg as [n, mi, ma, s, l],i (i)}
        <input class:a={!l} class:b={l} bind:value={vv[n]} placeholder={['MM','dd','yyyy','hh','mm','ss'][n]}
               bind:this={ipt[n]}
               on:blur={ch(mi,ma)} on:keydown={kd(l||2)}/>
        {#if s}
            {s}
        {:else }
            <span></span>
        {/if}
    {/each}
</div>

<style lang="scss">
  @import "./font/ibm.css";

  .da {
    font-size: 10px;
    display: flex;
    align-items: center;

    span {
      display: block;
      padding: 0 3px;
    }
  }

  .a {
    width: 28px;
  }

  .b {
    width: 56px;
  }

  input {
    text-align: center;
    font-size: 14px;
    font-family: ibm, sans-serif;

    &::placeholder {
      font-size: 10px;
      color: #1c93ff;
    }

    margin: 0 4px;
    color: #8ca4d7;
    line-height: 1.5;
    border: 1px solid #1d314a;
    border-radius: 6px;
    background: rgba(36, 46, 65, 0.4);
    padding: 5px 5px;
    resize: none;
    display: block;
  }

</style>