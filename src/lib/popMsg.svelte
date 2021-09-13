<script context="module">
    import {tips} from "$lib/store";

    export const tip = (m, ok, fail) =>
        tips.update(t => [...t, [m, ok, fail, 1]])
</script>
<script>
    import {fade} from "svelte/transition";
    import {onDestroy} from "svelte";

    let m = 0
    let ctx
    let ox, oy
    const mv = []

    function getPos(e) {
        const {clientX, clientY} = (e.touches || [e])[0];
        return [clientX, clientY]
    }

    function onEnd() {
        m = 0
        mv.length = 0
        ctx.onmousemove = ctx.ontouchmove = undefined
        ctx.onmouseup = ctx.ontouchend = ctx.ontouchcancel = ctx.onmouseleave = undefined
    }

    function onMv(e) {
        const [cx, cy] = getPos(e)
        let tx = cx - mv[0] + mv[2]
        let ty = cy - mv[1] + mv[3]
        if (tx >= ox) tx = ox;
        else if (tx <= -ox) tx = -ox;
        if (ty >= oy) ty = oy;
        else if (ty <= -oy) ty = -oy;
        this.style = `transform: matrix(1, 0, 0, 1, ${tx}, ${ty})`
    }

    function onSt(ev) {
        m = 1
        const {offsetWidth, offsetHeight} = ctx;
        const {offsetWidth: w, offsetHeight: cy} = this;
        [ox, oy] = [(offsetWidth - w) / 2 - 10, (offsetHeight - cy) / 2 - 10]
        const style = getComputedStyle(this);
        let [, e = 0, f = 0] = (style.transform.match(/matrix\(.*?, *([\-0-9.]+), *([\-0-9.]+)\)/) || []).map(a => +a)
        mv.push(...getPos(ev), e, f, offsetWidth - w - 10, offsetHeight - cy - 10)
        ctx.onmousemove = ctx.ontouchmove = onMv.bind(this)
        ctx.onmouseup = ctx.ontouchend = ctx.ontouchcancel = ctx.onmouseleave = onEnd
    }

    function onFn(v, i) {
        const fn = v[i]
        if (typeof fn === 'function') fn()
        v[3] = 0
        tips.update(t => t.filter(a => a[3]))
    }

    onDestroy(tips.subscribe(a => console.log(a)))
    onDestroy(() => tips.set([]))
</script>
{#if $tips.length }
    <div class="ms" bind:this={ctx} transition:fade class:m={m}>
        {#each $tips as v}
            {#if v[3]}
                <div class="tip" transition:fade
                     on:touchstart={onSt}
                     on:mousedown={onSt}>
                    <p>{v[0]}</p>
                    <div class="bn">
                        <div class="_0"
                             on:touchstart|stopPropagation
                             on:mousedown|stopPropagation
                             on:click={()=>onFn(v,1)}>OK
                        </div>
                        {#if v[2]}
                            <div class="_1"
                                 on:touchstart|stopPropagation
                                 on:mousedown|stopPropagation
                                 on:click={()=>onFn(v,2)}>Cancel
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}
<style lang="scss">
  .ms {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparentize(#000, .8);
    backdrop-filter: blur(2px);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
  }

  .m {
    cursor: move;
  }

  .tip {
    transform: translate3d(0, 0, 0);
    font-size: 14px;
    box-shadow: #000 0 5px 20px -10px;
    border-radius: 4px;
    user-select: none;
    padding: 15px 30px 50px;
    background: #061c2d;

    p {
      color: #4b7a98;
    }
  }

  .bn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 7px;
    left: 0;
    right: 0;
    height: 30px;

    div {
      background: #0b141a;
      cursor: pointer;
      color: #3b5975;
      border-radius: 2px;
      font-size: 12px;
      border: 1px solid currentColor;
      padding: 3px 20px;
      margin: 0 5px;

      &:hover {
        color: #000;
        background: #5084b9;
      }
    }

    ._1 {
      background: none;
    }
  }
</style>