<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({session}) {
        if (session.token) {
            return {
                status: 301,
                redirect: '/admin'
            }
        }
        return {
            status:200
        }
    }
</script>
<script>
    import {session} from '$app/stores';
    async  function login(){
        const res =(await fetch('/login', {
            method: 'POST'
        }))

        const json = await res.json();
        $session.token = json;
    }
    let usr
    let pwd
</script>
<h1>Login</h1>
<p>{$session.token}</p>
<input bind:value={usr} type="text"/>
<input bind:value={pwd} type="password"/>
<button on:click={login}>Login
</button>