<script>
    import { getStores } from "$app/stores";
    const { session } = getStores();

    async function logout() {
         await new Promise(function (resolve){
             setTimeout(resolve,1e3)
         })
        $session.user = undefined;
    }
    async function login() {
         await new Promise(function (resolve){
             setTimeout(resolve,1e3)
         })
        $session.user = "tom";
    }
</script>
<h1>{$session.user}</h1>
{#if $session.user}
    <button on:click="{logout}">Logout</button>
    {:else}
    <button on:click="{login}">Login</button>
{/if}
<style>
    * {
        margin: 100px;
    }
</style>