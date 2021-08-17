<script>
    export let total
    export let cur
    export let url
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
<nav>
    {#if isF}
        <span class="nv" class:act={first} on:click={()=>url(1)}>1</span>
    {:else}
        <a class="nv" class:act={first} href={`${url}/1`}>1</a>
    {/if}
    {#if f}<span>{f}</span>{/if}
    {#each pg as p}
        {#if isF}
            <span class:act={cur===p} on:click={()=>url(p)}>{p}</span>
        {:else}
            <a class:act={cur===p} href={`${url}/${p}`}>{p}</a>
        {/if}
    {/each}
    {#if n}<span>{n}</span>{/if}
    {#if total > 2}
        {#if isF}
            <span class="nv" class:act={last} on:click={()=>url(total)}>{total}</span>
        {:else }
            <a class="nv" class:act={last} href={`${url}/${total}`}>{total}</a>
        {/if}
    {/if}
</nav>
<style lang="scss">
  nav {
    display: flex;

    * {
      margin: 0 3px;
      display: flex;
      width: 16px;
      height: 16px;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
    }
  }

  .act {
    color: red;
  }
</style>