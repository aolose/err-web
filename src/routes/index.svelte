<script>
    import Bird from "$lib/brid.svelte"
    import {onDestroy, onMount} from "svelte";
    import {mk, msg} from "$lib/store";
    import {slide} from "$lib/transition";
    import {goto} from "$app/navigation";


    let c = 0;
    let h = 1;
    let sm = 0
    const m = [
        'welcome to my blog !',
        'Navigation is in the upper right corner.',
        'What are you waiting for?',
        'There is nothing here.',
        'Well... I made an entrance for you.',
        'emm . . .             ',
        ' Still here ?',
        'You are so boring !',
        'OK, let me take you to the other page.'
    ]
    let t, t0
    onMount(() => {
        t = setInterval(function () {
            const v = (c++) % m.length
            const t = $mk[v];
            msg.set(m[v] + (t ? ' x' + t : ''))
            $mk[v] = (t || 1) + 1
            if (c === 5) {
                t0 = setTimeout(() => {
                    sm = 1
                }, 1500)
            }
            if (c === m.length) {
                t0 = setTimeout(() => {
                    h = 0;
                    goto('/posts/1', {replaceState: false})
                }, 4e3)
            }
        }, 1e3 * 5)
    })
    onDestroy(() => {
        $mk[0] = ($mk[0] || 1) + 1
        clearInterval(t)
        clearTimeout(t0)
    })
</script>
<svelte:head>
    <title>Err</title>
</svelte:head>
<div class="b">
    <div class="bb">
        {#if h}
            <Bird/>
        {/if}
        {#if sm}
            <a href="/posts/1" transition:slide={{horizon:1}}>Let's Go!</a>
        {/if}
    </div>
</div>
<style lang="scss">
  a {
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    width: 120px;
    opacity: .5;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    top: 300%;
    position: absolute;
    padding: 6px 0;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 50px;
    font-weight: 100;
    font-size: 16px;
    transition: .3s ease-in-out;

    &:hover {
      opacity: 1;
      background: #fff;
      color: #000;
    }
  }

  .b {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bb {
    transform: translateY(-100%);
    width: 50%;
    max-width: 80px;
  }
</style>