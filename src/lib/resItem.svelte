<script>
    import {host, query} from "$lib/res";
    import {col, fileSize} from "$lib/utils";
    import {scale} from 'svelte/transition';
    import {onDestroy} from "svelte";
    import {resList} from "$lib/store";

    let l = 0
    let top = 0
    let sd
    export let id
    export let url
    export let nm = ''
    export let tp = ''
    export let ext = ''
    export let sz = 0
    export let act
    export let idx
    export let click
    let t = -1;

    function ch() {
        const v = nm.replace(/^\s+|\s+$/, '')
        clearTimeout(t)
        t = setTimeout(() => {
            query('rnRes', {
                id, name: v
            })
        }, 2e3)
    }

    function pos() {
        setTimeout(function () {
            if (!sd) return
            const {offsetTop, offsetLeft} = sd;
            l = offsetLeft
            top = offsetTop
        }, 500)
    }

    onDestroy(resList.subscribe(pos))
    $:pos()
</script>
<svelte:window on:resize={pos}/>
<div class="f s" bind:this={sd}></div>
<div class="f re"
     style={`top:${top}px;left:${l}px`}
     transition:scale|local
     on:click={click} class:act={act}>
    {#if idx}
        <div class="n">{idx}</div>
    {/if}
    {#if /svg|image/.test(tp)}
        <div class="be" style={`background-image:url('${url||(host+`/r/${id}.webp`)}')`}></div>
    {:else }
        <div class="be" style={col(tp)}>{(ext).toUpperCase()}</div>
    {/if}
    <div class="z">{fileSize(sz)}</div>
    <input bind:value={nm} on:change={ch}/>
</div>
<style lang="scss">
  @import "./break";
  .re {
    position: absolute;
    transition: .3s ease-in-out left, .3s .3s ease-in-out top, .2s ease-in-out transform;
    cursor: pointer;
    opacity: .8;
    background: #2c3a56;
    border-radius: 4px;

    &:hover {
      opacity: 1;
      transform: translate3d(0, -2px, 0);
    }
  }
  .n{
    user-select: none;
    position: absolute;
    background: #162b52;
    width: 18px;
    text-align: center;
    font-size: 10px;
    color: yellow;
    height: 14px;
    left: 0;
    top: 0;
    z-index: 5;
    border-radius: 3px;
  }
  .f {
    width: 160px;
    height: 133px;
    display: inline-block;
    margin: 3px;
    border: 2px solid transparent;
    @include s(){
      width: 120px;
      margin:  0;
    }
  }

  .s {
    opacity: 0;
    pointer-events: none;
  }

  input {
    font-size: 12px;
    text-align: center;
    height: 30px;
    overflow: hidden;
    display: block;
    width: 100%;
    padding: 0 10px;
    text-overflow: ellipsis;
  }

  .z {
    user-select: none;
    opacity: .5;
    color: #ffffff;
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 10px;
    background: transparentize(#0e1832, .3);
    padding: 2px 3px;
    border-radius: 3px;
  }

  .be {
    user-select: none;
    border-radius: 4px;
    width: 100%;
    height: 100px;
    background: #0e1832 center no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 24px;
  }

  .act {
    border-color: #61beff;
    opacity: 1;
  }
</style>