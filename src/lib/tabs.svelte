<script>
    export let item = []
    export let cur = 0
</script>
<div class="tbs">
    {#each item as t,i}
        <div class:act={cur===i} on:click={()=>cur=i}>
            {t}
        </div>
    {/each}
</div>
<style lang="scss">
  .tbs {
    display: flex;
    width: 100%;
    div{
      &:first-child{
         border-radius: 4px 0 0 4px;
      }
      &:last-child{
        border-radius: 0 4px 4px 0;
      }
      transition: .2s;
      min-width: 80px;
      color: #40739f;
      border: 1px solid currentColor;
      padding:  0 10px;
      cursor: pointer;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      &+div{
        border-left: 0;
      }
      &:hover:not(.act){
        background: transparentize(#68abda,.8);
      }
    }
    .act {
      background: #68abda;
      color: #1b233b;
      border-color: #68abda;
    }
  }
</style>