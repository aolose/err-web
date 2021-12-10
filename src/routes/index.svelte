<script context="module">
    export const prerender = true;
</script>
<script>
    import Bird from "$lib/brid.svelte"
    import {onDestroy, onMount} from "svelte";
    import {mk, msg} from "$lib/store";
    import {slide} from "$lib/transition";
    import {goto} from "$app/navigation";
    import Ctx from '$lib/whi/ctx.svelte'
    let c = 0;
    let h = 0;
    let sm = 0
    const m = [
        'welcome to my blog !'
    ]
    let t, t0, a
    onMount(() => {
        a = setTimeout(() => h = 1, 300)
        t = setInterval(function () {
            const v = (c++) % m.length
            const t = $mk[v];
            msg.set(m[v] + (t ? ' x' + t : ''))
            $mk[v] = (t || 1) + 1
        }, 1e3 * 5)
    })
    onDestroy(() => {
        $mk[0] = ($mk[0] || 1) + 1
        clearInterval(t)
        clearTimeout(t0)
        clearTimeout(a)
    })
</script>
<svelte:head>
    <title>Err</title>
</svelte:head>
<Ctx/>
<div class="b">
    <div class="bb">
        {#if h}
            <Bird/>
        {/if}
    </div>
     <div class="mu">
         <a href="/posts/1" transition:slide|local={{horizon:1}}>Articles -></a>
     </div>
</div>
<style lang="scss">
  @import "../lib/break";

  .mu{
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 30px;
  }
  a {
    text-align: left;
    display: block;
    font-size: 18px;
    font-family: 'Architects Daughter', -apple-system,
    BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti,
    Microsoft Yahei, Tahoma, Simsun, sans-serif;;
    position: relative;
    opacity: .8;
    white-space: nowrap;
    overflow: hidden;
    color: #fff;
    transition: .3s ease-in-out;
    &:hover {
      opacity: 1;
      color: #ffffff;
    }
  }

  .b {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .bb {
    transform: translateY(-100%);
    width: 50%;
    max-width: 80px;
  }
</style>