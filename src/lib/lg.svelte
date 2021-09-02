<script>
    export let type=0
</script>
<div class="lg" class:t1={type===1} class:t2={type===2}>
    <i/>
</div>

<style lang="scss">
  .lg{
    top: 10px;
    left: 10px;
    position: absolute;
    i{
      width: 46px;
      height: 46px;
      background-image: url("./img/fav.png");
    }
  }
  .t1{
    i{
      background-image: url("./icon/4.png");
    }
  }
</style>