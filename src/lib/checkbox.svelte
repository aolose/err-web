<script>
    export let act
</script>
<div class="c" on:click={()=>act=!act}>
    <div class="a" class:act >
        <div class="b"></div>
    </div>
    <slot/>
</div>
<style lang="scss">
  .c{
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #52749b;
    &:hover{
          color: #4aa9ff;
    }
  }
  .a {
    cursor: pointer;
    height: 14px;
    width: 14px;
    border: 2px solid currentColor;
    color: #6c92b0;
    transition: .2s ease-in-out;
    margin-right: 5px;

    &.act {
      color: #1c93ff;

      .b {
        background: currentColor;
      }
    }
  }

  .b {
    color: inherit;
    left: 2px;
    top: 2px;
    bottom: 2px;
    right: 2px;
    position: absolute;
  }

</style>