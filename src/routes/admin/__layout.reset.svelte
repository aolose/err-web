<script context="module">/**
 * @type {import('@sveltejs/kit').Load}
 */
import {isLogin} from "$lib/store";
export async function load({session}) {
    console.log('session',session)
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
    <Lg type={1}/>
{/if}