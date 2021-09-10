<script>
    import {fade} from "svelte/transition";
</script>
<div class="ctx" transition:fade>
    <slot>
    </slot>
</div>
<style lang="scss">
  @import "./break";
  .ctx {
    margin:  0 auto;
    padding: 80px  10px 0;
    max-width: 800px;
    width: 90%;
    @include s(){
      padding: 80px  0 0;
    }
  }
</style>