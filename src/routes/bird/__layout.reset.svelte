<script context="module">/**
 * @type {import('@sveltejs/kit').Load}
 */
import {res} from "$lib/res";

export const load = res('auth')
</script>
<script>
    import DB from './_base.svelte'
    import Lg from './_login.svelte'
    import Pop from '$lib/popMsg.svelte'
    import {resFlag} from "$lib/res";
    import {isLogin} from "$lib/store";

    resFlag.useCache = true
</script>
<svelte:head>
    <title>Err - Admin</title>
</svelte:head>
<h1 style="color:#fff">{$isLogin}</h1>

{#if $isLogin}
    <DB>
        <slot/>
    </DB>
{:else }
    <Lg type={1}/>
{/if}
<Pop/>
<style lang="scss">
  @import "../../lib/base";
</style>