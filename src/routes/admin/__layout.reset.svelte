<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function  load({session}) {
        if (!session.token) {
            return {
                status: 302,
                redirect: '/login'
            }
        }
        return {
            status:200
        }
    }
</script>
<script>
    import {session} from '$app/stores'
    async function logout(){
        const res = await fetch('/logout',{
            method:'POST',
        })
        if(res.ok){
            $session.token='';
        }
    }
</script>
<button on:click={logout}>logout</button>
<slot>

</slot>