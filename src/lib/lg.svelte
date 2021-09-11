<script>
    export let type
</script>
<a href="/" class="lg" class:t1={type===1} class:t2={type===2}>
    <i/>
</a>

<style lang="scss">
  .lg{
    top: 10px;
    left: 10px;
    position: absolute;
    i{
      width: 46px;
      height: 46px;
    }
  }
  .t1{
    i{
      background-image: url("./img/fav.png");
    }
  }
  .t2{
    i{
      background-image: url("./icon/4.png");
    }
  }
</style>