<script>
    export let total
    export let cur
    export let url
    export let tm
    export let length = 5
    $:first = cur === 1
    $:last = cur === total
    let pg = []
    $: isF = typeof url === 'function'

    $:{
        pg = [];
        if (2 < total) {
            if (cur < total && cur > 1) pg = [cur]
            for (let i = 1; i <= length && pg.length < length; i++) {
                const pr = cur - i;
                const nx = cur + i;
                if (pr > 1) pg = [pr, ...pg]
                if (nx < total) pg = [...pg, nx]
            }
        }
    }
    $:f = pg[0] > 2 ? '...' : ''
    $:n = pg[pg.length - 1] < total - 1 ? '...' : ''
</script>
<nav class:lt={tm}>
    {#if isF}
        <span class="nv" class:act={first} on:click={()=>url(1)}>1</span>
    {:else}
        <a class="nv" class:act={first} href={`${url}/1`}>1</a>
    {/if}
    {#if f}<span>{f}</span>{/if}
    {#each pg as p}
        {#if isF}
            <span class="nv" class:act={cur===p} on:click={()=>url(p)}>{p}</span>
        {:else}
            <a class="nv" class:act={cur===p} href={`${url}/${p}`}>{p}</a>
        {/if}
    {/each}
    {#if n}<span>{n}</span>{/if}
    {#if total > 1}
        {#if isF}
            <span class="nv" class:act={last} on:click={()=>url(total)}>{total}</span>
        {:else }
            <a class="nv" class:act={last} href={`${url}/${total}`}>{total}</a>
        {/if}
    {/if}
</nav>
<style lang="scss">
  nav {
    height: 50px;
    align-items: center;
    justify-content: center;
    display: flex;

    * {
      color: #1c93ff;
    }

    .act {
      background: #1d314a;
    }

    .nv {
      font-size: 10px;
      cursor: pointer;
      border: 1px solid #1c93ff;
      border-radius: 50%;
      height: 24px;
      width: 24px;
      display: flex;
      margin: 0 5px;
      justify-content: center;
      align-items: center;

      &:hover {
        background: #1c93ff;
        color: #fff;
      }
    }
  }

  .lt {
    * {
      color: #1c334a;
    }

    .nv {
      color: #000;
      background: none;
      padding: 5px 8px;
      height: 24px;
      width: auto;
      border-radius: 2px;
      border: 1px solid currentColor;
    }

    .act,.nv:hover {
      color: #fff;
      border-color: #000;
      background: #000;
    }
  }
</style>