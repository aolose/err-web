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
    color: #355375;
    &:hover{
          color: #1c93ff;
    }
  }
  .a {
    cursor: pointer;
    border-radius: 3px;
    height: 18px;
    width: 18px;
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