<script>
   export let d
</script>
<div class="dgb">
    {JSON.stringify(d, null, '\t')}
</div>
<style lang="scss">
  .dgb {
    z-index: 999;
    width: 200px;
    pointer-events: none;
    position: fixed;
    top: 40px;
    right: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    white-space: pre-wrap;
    color: transparentize(white, .3);
    background: transparentize(#000, .4);
    opacity: .8;
  }
</style>