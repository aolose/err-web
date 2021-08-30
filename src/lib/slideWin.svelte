<script>
    import {winAct} from "$lib/store";
    export let onAct
    export let act
    export let title
    let show=false
    $:{
        show = $winAct === act
        if(show&&onAct){
            onAct()
        }
    }
</script>
<div class="s-win" class:sh={show}>
    <div class="h">
        <div class="clo" on:click={()=>winAct.set(0)}>
            <i class="a"></i>
            <i class="b"></i>
        </div>
        <span class="ti">
        <slot name="btn"/>
    </span>
    </div>
    <div class="au">
        <slot/>
    </div>
</div>
<style lang="scss">
  .h{
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    position: absolute;
  }
  .au{
    position: absolute;
    overflow: auto;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
  }
  .ti {
    position: absolute;
    right: 10px;
    top: 0;
  }

  .s-win {
    padding: 50px 20px 20px;
    background-color: #191e2f;
    opacity: .5;
    transition: .6s ease-in-out transform,
    .2s .5s ease-in-out opacity,
    .3s .5s ease-in-out background-color;
    position: absolute;
    right: 0;
    left: -10px;
    top: 0;
    bottom: 0;
    overflow: hidden;
    transform: translate3d(100%, 0, 0);

    &.sh {
      opacity: 1;
      background: #121622;

      i {
        width: 16px;
      }

      transform: translate3d(0, 0, 0);

      .a {
        transform: rotateZ(35deg);
      }

      .b {
        transform: rotateZ(-35deg);
      }
    }
  }

  .clo {
    height: 30px;
    width: 30px;
    position: absolute;
    left: 10px;
    top: 0;
    cursor: pointer;

    &:hover {
      i {
        width: 20px;
        color: #ff5a00;
      }

      .a {
        top: 14px;
        transform: rotateZ(45deg);
      }

      .b {
        bottom: 14px;
        transform: rotateZ(-45deg);
      }
    }

    i {
      transition: .2s ease-in-out;
      color: #1c93ff;
      background: currentColor;
      width: 0;
      border-radius: 3px;
      height: 1.5px;
      position: absolute;
      left: 7px;
      transform-origin: center;
    }

    .a {
      transform: rotateZ(-35deg);
      top: 10px;
    }

    .b {
      transform: rotateZ(35deg);
      bottom: 9px;
    }
  }
</style>