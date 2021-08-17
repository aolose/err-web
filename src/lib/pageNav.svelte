<script>
    export let total
    export let cur
    export let url
    $:first = cur === 0
    $:last = cur === total - 1
    let pg = []
    $:{
        if (3 < total) {
            if (cur < total - 1 && cur) pg = [cur]
            for (let i = 1; i < 6 && pg.length < 5; i++) {
                const pr = cur - i;
                const nx = cur + i;
                if (pr > 0) pg = [pr, ...pg]
                if (nx < total - 1) pg = [...pg, nx]
            }
        }
    }
    $:f = pg[0] > 1 ? '...' : ''
    $:n = pg[pg.length - 1] < total - 2 ? '...' : ''
</script>
<nav>
    <a class="nv" class:act={first} href={`${url}/0`}>1</a>
    {#if f}<span>{f}</span>{/if}
    {#each pg as p}<a class:act={cur===p} href={`${url}/${p}`}>{p + 1}</a>{/each}
    {#if n}<span>{n}</span>{/if}
    {#if total > 1}<a class="nv" class:act={last} href={`${url}/${total-1}`}>{total}</a>{/if}
</nav>
<style lang="scss">
  .act {
    color: red;
  }
</style>