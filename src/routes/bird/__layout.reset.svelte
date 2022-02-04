<script context="module">/**
 * @type {import('@sveltejs/kit').Load}
 */
import {res} from "$lib/res";

export const load = res('auth')
</script>
<script>
    import {session} from "$app/stores";

    export let d = {};
    import DB from './_base.svelte'
    import Lg from './_login.svelte'
    import Pop from '$lib/popMsg.svelte'
    import {resFlag} from "$lib/res";
    import {isLogin,token} from "$lib/store";
    resFlag.useCache = true
    session.subscribe(({tk}={})=>{
        token.set(tk)
    })
</script>
<svelte:head>
    <title>Err - Admin</title>
</svelte:head>
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
