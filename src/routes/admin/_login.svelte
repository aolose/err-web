<script context="module">
    import {res} from '$lib/res'
    /**
 * @type {import('@sveltejs/kit').Load}
 */

export const load =res('auth')
</script>
<script>
    import {session} from '$app/stores';
    import {cacheSrvData} from "$lib/res";
    import {browser} from "$app/env";
    import {isLogin} from "$lib/store";
    import {popMsg} from "$lib/utils";
    export let d;
    export let s;
    $:{
        cacheSrvData(s,d)
        if(browser){
            localStorage.tk=d||''
        }
    }
    let w=0
    async function login() {
        if (dis) return;
        w=1
        const res = (await fetch('/in', {
            credentials:"include",
            method: 'POST',
            body: '_' + btoa(btoa(usr) + '\u0001' + btoa(pwd))
        }))
        w=0
        if(res.ok){
            isLogin.set(true)
        }else {
            return popMsg("wrong account or password!")
        }
    }

    let usr = ""
    let pwd = ""
    let pw
    $:dis = usr.length < 2 || pwd.length < 4 || pwd.length > 30 || usr.length > 20
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
            <button class:dis={dis} on:click={login}>Login
            </button>
            <a href="/">{'<  '}Home</a>
        </div>
    </div>
</div>
<style lang="scss">
  .dis{
    opacity: .5;
    pointer-events: none;
  }
  .bg {
    width: 100%;
    height: 100%;
    background: #121622 url("$lib/img/bg.jpg") bottom center;
    background-size: cover;
  }
  label{
    pointer-events: none;
  }
  a {
    position: absolute;
    bottom: -40px;
    color: #626f94;
    text-decoration: none;
    left: 15px;

    &:hover {
      color: #8db2e9;
    }
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

    &:hover {
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