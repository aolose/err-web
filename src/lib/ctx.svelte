<script>
    import {fade} from "svelte/transition";
</script>
<div class="ctx" transition:fade>
    <slot>
    </slot>
</div>
<style lang="scss">
  .ctx {
    margin:  0 auto;
    padding: 80px  10px;
    max-width: 800px;
    width: 90%;
    min-height: 100%;
  }
</style>