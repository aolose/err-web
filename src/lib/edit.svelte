<script>
    import Bg from "$lib/empty.svelte";
    import {slide} from '$lib/transition'
    import {timeFmt} from "$lib/utils";

    export let title
    export let type = 0
    export let content
    export let show
    export let ipt
    export let saved
    $:update = saved ? `update at ${timeFmt(saved)}` : ""


</script>
<div class="edit">
    {#if show}
        <slot name="title"/>
        {#if type === 0}
            <input
                    transition:slide={{horizon:1}}
                    bind:value={title}/>
        {/if}
        {#if type === 1}
            <textarea class="h"
                      transition:slide={{horizon:1}}
                    bind:value={title}></textarea>
        {/if}
        <slot name="content"/>
        <textarea
                transition:slide={{horizon:1}}
                bind:value={content} bind:this={ipt}></textarea>
    {:else }
        <Bg type={type}/>
    {/if}
    <div class="sv">{update}</div>
</div>

<style lang="scss">
  .edit {
    max-width: 600px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;

    textarea {
      flex: 1;
      overflow: auto;
    }
    input {
      height: 40px;
      margin-bottom: 10px;
    }
    input, textarea {
      color: #8db2e9;
      line-height: 1.5;
      border: 1px solid #1d314a;
      border-radius: 6px;
      background: rgba(36, 46, 65, .4);
      padding: 10px;
      resize: none;
      display: block;
    }
    .h{
      flex: 0.5;
      margin-bottom: 20px;
    }
  }

</style>