<script>
    import Sc from "$lib/sc.svelte";
    import Lg from "$lib/./lg.svelte";
    export let value
    export let search
    export let add
    export let hi
    export let icon
</script>

{#if icon}
<Lg type={icon}/>
    {/if}
<div class="sc" class:f={!icon}>
    <Sc bind:value={value} search={search}/>
    <button class="add" class:hi={hi} on:click={add}></button>
</div>
<style lang="scss">
  .sc {
    align-items: center;
    display: flex;
    height: 30px;
    margin: 20px 0 20px 60px;
    &.f{
      margin: 20px 10px;
    }
  }
  .add {
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

  .add {
    background-image: url("./img/add.svg");
    background-color: #337e1e;
  }

  .hi {
    pointer-events: none;
    opacity: .3;
  }

</style>