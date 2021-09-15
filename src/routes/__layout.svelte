<script>
    import Nav from '$lib/nav.svelte'
    import {bg} from "$lib/store";

    import {onDestroy} from "svelte";
    import {host} from "$lib/res";

    let b = ''
    onDestroy(bg.subscribe(g => {
        b = g ? `background-image:url(${host}/r/${g})` : ''
    }))
</script>
<div class="b" style={b}>
    <div class="nv ">
        <Nav/>
    </div>
    <div class="bg">
        <slot>
        </slot>
    </div>
</div>
<style lang="scss">
  @import "../lib/base.css";
  @import "../lib/break";
  :global {
    :root {
      --iw: 2px;
      --it: -160px;
      --skA: -15deg;
      --skB: 15deg;
      --poW: 15px;
      --poL: 108px;
      --poL2: 150px;
      --td: column;
      --tw: 80px;
      --pl: -10px;
      --itp: 10px;
      --mr: 30px;
      --ex: 80%;
      --artP:40px;
      --artC:20px 20px 60px;
      --fs:28px;
      @include s() {
        --fs:20px;
        --artC:0 0 50px;
        --artP:20px;
        --ex: 99%;
        --mr: 10px;
        --skA: 0deg;
        --skB: 0deg;
        --iw: 1px;
        --poL: 0;
        --poL2: 20px;
        --it: -5px;
        --itp: -20px;
        --td: row;
        --tw: auto;
        --pl: 0;
      }
    }

    * {
      color: #666;
    }

    *::-webkit-scrollbar {
      width: 8px;
      height: 8px
    }

    *::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, .05)
    }

    *::-webkit-scrollbar-thumb {
      background-color: #2f4569
    }
  }

  .nv {
    right: 0;
    left: 0;
    top: 0;
    z-index: 5;
    position: absolute;
  }

  .b {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: .3s ease-in-out;
    background: url("../lib/bd/1.jpg") center no-repeat;
    background-size: cover;
  }

  .bg {
    position: absolute;
    left: 0;
    right: 0;
    top: -1px;
    bottom: -1px;
    padding: 1px;
    background: transparentize(#10121c, .1);
    backdrop-filter: blur(2px);
  }

</style>