<script>
    export let search
   export let value
</script>
<input
        placeholder="search..."
        bind:value={value}/>
<button class="i-sc" on:click={search}></button>
<style lang="scss">
  input {
    padding: 0 10px;
    height: 30px;
    width: 0;
    flex: 1;
    border-radius: 200px;
    background: #1c334a;
  }
  .i-sc {
    margin-left: 5px;
    width: 24px;
    height: 24px;
    border-radius: 20px;
    background: #1c93ff url("./img/search.svg") no-repeat center;
    background-size: 50%;
    cursor: pointer;
    opacity: .8;

    &:hover {
      opacity: 1;
    }
  }
</style>