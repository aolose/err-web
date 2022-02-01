<script>
    import {fade} from "svelte/transition";
    import UpDownScroll from "$lib/UpDownScroll.svelte";
    let a = 0
</script>
<UpDownScroll bind:down={a}/>
<div class="ph" class:s={a} transition:fade>
    <div class="cc">
        <h1>
            <slot></slot>
        </h1>
    </div>
</div>

<style lang="scss">
  @import "./break";

  .cc {
    height: 120px;
    width: 90%;
    margin: 0 auto;
    transition: .3s ease-in-out;
    position: relative;

    h1 {
      transition: .3s ease-in-out;
      margin: 0;
      font-size: 34px;
      position: absolute;
      transform: translate3d(20px, 60px, 0);
      color: #000;
      font-weight: 200;
      text-transform: uppercase;

      &:first-letter {
        color: #5f86bb;
      }
    }
  }

  .ph {
    position: relative;

    &.s {
      @include s() {
        .cc {
          height: 40px;

          h1 {
            transform: translate3d(20px, 30px, 0);
            font-size: 20px;
            opacity: 0;
          }
        }
      }
    }
  }
</style>
