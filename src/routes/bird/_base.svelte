<script>
    import Msg from '$lib/typeMsg.svelte'
    import Mu from '$lib/sidebar.svelte'
</script>
<div class="adm">
    <div class="ctx">
        <slot/>
        <div class="msg">
            <Msg defaultText="version 0.0.1"/>
        </div>
    </div>
    <Mu/>
</div>
<style lang="scss">
  :global{
    .adm{
      *{
        color: #aaa;
      }
      *::-webkit-scrollbar {
        width: 8px;
        height: 8px
      }

      *::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, .05)
      }

      *::-webkit-scrollbar-thumb {
        background-color: #075291
      }
     p{
       font-size: 13px;
     }
    }
  }
  .adm {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #121622;
  }

  .msg {
    position: absolute;
    right: 30px;
    bottom: 15px;
    max-width: 70%;
    color: #00a1ff;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ctx {
    display: flex;
    flex: 1;
    overflow: auto;
  }
</style>