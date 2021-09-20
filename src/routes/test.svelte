<script>
    import Res from '../lib/resBox.svelte';
    let aa=[['baidu','a'],['sadas','v'],['sadas','c'],['sadsa',''],['asdd','']]
</script>
<div>
    {#each aa as [u,p]  }
        {#if p}
            <Res attr={p} src={u}/>
        {:else}
            {@html u}
        {/if}
    {/each}
</div>
<style>
    div{
        padding: 100px;
    }
</style>