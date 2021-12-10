<script>
    import {fade} from "svelte/transition";
</script>
<div class="ph" transition:fade>
    <div class="cc">
        <h1>
            <slot></slot>
        </h1>
    </div>
</div>

<style lang="scss">

  .cc {
    padding: 80px 10px 0;
    width: 90%;
    margin: 0 auto;

    h1 {
      margin: 0;
      font-size: 34px;
      position: relative;
      top: -20px;
      left: 10px;
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
    border-bottom: 1px solid #eee;
    box-shadow: rgba(0, 0, 0, .05) 0 10px 10px -5px;
  }
</style>