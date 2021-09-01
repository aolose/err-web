<script>
    import Msg from '$lib/sysmsg.svelte'
    import Mu from '$lib/sidebar.svelte'
</script>
<div class="adm">
    <div class="ctx">
        <slot/>
        <Msg/>
    </div>
    <Mu/>
</div>
<style lang="scss">
  .adm {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #121622;
  }

  .ctx {
    display: flex;
    flex: 1;
    overflow: auto;
  }
</style>