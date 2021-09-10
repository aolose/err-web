<script>
    export let t=""
</script>

{#each t.split(' ') as g}
    <a href={`/tag/${g}`}>{g}</a>
{/each}
<style lang="scss">
    a{
      color: #798ea1;
      margin-left: 3px;
    }
</style>