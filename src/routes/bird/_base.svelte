<script>
    import Mu from '$lib/sidebar.svelte'
    import {post, view, winAct} from "$lib/store";
    import {onDestroy} from "svelte";
    import {fade} from "svelte/transition";

    let sty = `transform:translate3d(0,0,0)`
    onDestroy(post.subscribe(a => {
        if (!Object.keys(a).length) {
            view.set(0)
        }
    }))
    onDestroy(view.subscribe(a => {
        sty = `transform:translate3d(${a * 119}%,0,0)`
        if ($winAct > 0) {
            winAct.set(0)
        }
    }))
    onDestroy(() => {
        view.set(0)
    })
</script>
<div class="adm">
    <slot/>
    <Mu/>
</div>
<div class="nv">
    {#if Object.keys($post).length}
        <div on:click={()=>view.set(0)} transition:fade></div>
        <div on:click={()=>view.set(1)} transition:fade></div>
        <div on:click={()=>view.set(2)} transition:fade></div>
        <i style={sty} transition:fade></i>
    {/if}
</div>
<style lang="scss">
  @import "../../lib/break";

  .nv {
    transition: .3s ease-in-out;
    position: absolute;
    pointer-events: none;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    height: 30px;
    display: flex;
    align-items: center;
    background: #121622;
    justify-content: center;
    padding: 0 10px 0 10px;
    @include s() {
      opacity: 1;
      pointer-events: all;
    }

    div, i {
      margin: 3%;
      height: 5px;
      width: 20%;
      border-radius: 5px;
      background: #2283f3;
      opacity: .1;
    }

    i {
      left: 12%;
      transition: .3s ease-in-out;
      position: absolute;
      opacity: 1;
    }
  }

  :global {
    .adm {
      * {
        color: #aaa;
      }

      *::-webkit-scrollbar-thumb {
        background-color: #075291
      }

      p {
        font-size: 13px;
      }
    }
  }

  .adm {
    transition: .3s ease-in-out;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #121622;
    @include s() {
      bottom: 30px;
    }
  }

</style>