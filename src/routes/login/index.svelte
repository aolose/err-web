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
            status: 200
        }
    }
</script>
<script>
    import {session} from '$app/stores';

    async function login() {
        const res = (await fetch('/in', {
            method: 'POST'
        }))
        const json = await res.json();
        $session.token = json;
    }

    let usr = ""
    let pwd = ""
    let pw
</script>
<div class="bg">
    <div class="cc">
        <div class="bx">
            <i></i>
            <div class="r" class:a={usr}>
                <input bind:value={usr} type="text"/>
                <label>Username</label>
            </div>
            <div class="r" class:a={pwd}>
                <input bind:value={pwd} bind:this={pw} type="password" autocomplete="new-password"/>
                <label>Password</label>
            </div>
            <button on:click={login}>Login
            </button>
        </div>
    </div>
</div>
<style lang="scss">
  .bg {
    width: 100%;
    height: 100%;
    background: #121622 url("$lib/img/bg.jpg") bottom center;
    background-size: cover;
  }

  .cc {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    background: transparentize(#1b233b, 0.2);
  }

  .bx {
    padding: 20px 0;
    width: 300px;
    border-radius: 10px;
    background: #121622;
    box-shadow: rgba(0, 0, 0, .3) 0 20px 40px -10px;
  }

  .r {
    width: 80%;
    margin: 20px auto 30px;

    input {
      padding: 0 5px;
      background: none;
      height: 30px;
      width: 100%;
      border: 0;
      color: #bad5ff;
      border-bottom: 1px solid #1d314a;
      transition: ease-in-out .3s;

      &:focus {
        border-color: #1c93ff;
      }
    }
  }

  label {
    transition: .3s ease-in-out;
    position: absolute;
    left: 10px;
    top: 0;
    color: #51a9ff;
  }

  input:focus + label, .a label {
    left: 3px;
    top: -20px;
    font-size: 11px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 0;
    cursor: pointer;
    transition: .3s ease-in-out;
    border: 1px solid currentColor;
    color: #4a91c3;
    width: 80%;
    height: 30px;
    border-radius: 3px;
    &:hover{
      color: #000;
      background: #00bbff;
    }
  }

  i {
    transform: translate3d(-50%, 0, 0);
    border-radius: 50%;
    left: 50%;
    top: -75px;
    pointer-events: none;
    background: url("$lib/img/fav.png") center no-repeat;
    background-size: 100% auto;
    width: 80px;
    height: 80px;
    position: absolute;
  }
</style>