<script>
    import {fade} from "svelte/transition";
    export let act
    export let cls
</script>
{#if act}
    <div transition:fade  class={cls}>
        <slot/>
    </div>
{/if}