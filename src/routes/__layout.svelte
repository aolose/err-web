<script>
    import Nav from '$lib/nav.svelte'
    import {bg} from "$lib/store";

    import {onDestroy} from "svelte";
    import {host} from "$lib/res";
    let b=''
    onDestroy(bg.subscribe(g=>{
        b=g?`background-image:url(${host}/r/${g})`:''
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
  :global{
    * {
      color: #666;
    }
  }
  .nv{
    right: 0;
    left: 0;
    top: 0;
    z-index: 5;
    position: absolute;
  }
  .b {
    transition: .3s ease-in-out;
    height: 100%;
    background: url("../lib/bd/1.jpg") center no-repeat;
    background-size: cover;
  }

  .bg {
    padding: 1px;
    height: 100%;
    background: transparentize(#10121c, .1);
    backdrop-filter: blur(2px);
  }

</style>