<script>
    import {view, winAct} from "$lib/store";

    export let onAct
    export let onClose
    export let act
    let show = false
    $:{
        show = $winAct === act
        if (show) {
            onAct && onAct()
        }
    }
</script>
<div class="s-win" class:sh={show}>
    <div class="h">
        <div class="clo" on:click={()=>{
            winAct.set(0)
        onClose&&onClose()
        }}>
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
  @import "./break";

  .h {
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    position: absolute;
    @include s() {
      left: -10px;
    }
  }

  .au {
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
    left: 50px;
    top: 0;
  }

  .s-win {
    padding: 50px 20px 20px;
    backdrop-filter: blur(50px);
    background: transparentize(#121622, .1);
    transition: .6s ease-in-out transform,
    .2s .5s ease-in-out opacity,
    .3s .5s ease-in-out background-color;
    position: absolute;
    right: 60px;
    left: calc(50% + 116px);
    top: 20px;
    bottom: 40px;
    overflow: hidden;
    transform: translate3d(100%, 0, 0);
    @include s() {
      right: 40px;
      left: 10px;
      top: 10px;
      bottom: 0;
      padding: 0;
    }

    &.sh {
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

      @include w() {
        left: auto;
        width: 600px;
        box-shadow: rgba(0,0,0,.1) -6px 0 10px -5px;
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
