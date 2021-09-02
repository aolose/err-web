<script context="module">/**
 * @type {import('@sveltejs/kit').Load}
 */
import {isLogin} from "$lib/store";
export async function load({session}) {
        if (!session.token) {
            isLogin.set(0)
        }else {
            isLogin.set(1)
        }
        return {
            status: 200
        }
    }
</script>
<script>
    import DB from './_base.svelte'
    import Lg from './_login.svelte'
</script>
{#if $isLogin}
    <DB>
        <slot/>
    </DB>
{:else }
    <Lg/>
{/if}