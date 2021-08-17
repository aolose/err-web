<script context="module">
    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({session}) {
        if (!session.token) {
            return {
                status: 302,
                redirect: '/login'
            }
        }
        return {
            status: 200
        }
    }
</script>
<script>
    import {session} from '$app/stores'

    async function logout() {
        const res = await fetch('/logout', {
            method: 'POST',
        })
        if (res.ok) {
            $session.token = '';
        }
    }
</script>
<div class="adm">
    <div class="btn">
        <button on:click={logout}>logout</button>
    </div>
    <div class="ctx">
        <slot>

        </slot>
    </div>
</div>
<style lang="scss">
  .adm {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #eee;
  }

  .ctx {
    display: flex;
    flex: 1;
    overflow: auto;
  }
</style>