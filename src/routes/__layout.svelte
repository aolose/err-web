<script>
    import Nav from '$lib/nav.svelte'
    import {bg} from "$lib/store";

    import {onDestroy} from "svelte";
    import {host, resFlag} from "$lib/res";

    let b = ''
    onDestroy(bg.subscribe(g => {
        b = g ? `background-image:url(${host}/r/${g})` : ''
    }))
</script>
<svelte:window on:sveltekit:navigation-start={function (){
    resFlag.useCache=true
}}/>
<div class="b" style={b}>
    <slot></slot>
</div>
<style lang="scss">
  @import "../lib/base";
  @import "../lib/break";
  .b{
    width: 50%;
    height: 100%;
    position: relative;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      border: 1px solid red;
    }
  }
</style>