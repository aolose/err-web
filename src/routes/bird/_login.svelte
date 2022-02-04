<script context="module">
    import SparkMD5 from 'spark-md5';
</script>
<script>
    import {jump} from '$lib/transition'
    import LD from '$lib/loading.svelte'
    import {fade} from 'svelte/transition'
    import {isLogin, msg, token} from "$lib/store";
    import Tm from "$lib/typeMsg.svelte";
    import {onDestroy} from "svelte";
    import {enc} from "$lib/utils";
    import {host, query} from "$lib/res";

    let k
    let wt = 0
    let w = 0
    const t = setInterval(() => {
        if (wt > 0) {
            wt = wt - 1
        }
    }, 1e3)
    onDestroy(() => clearInterval(t))

    async function login() {
        if (dis || wt) return;
        w = 1
        if (!k) {
            try {
                k = await ((await fetch(host + '/k')).text())
            } catch (e) {
                msg.set(e.message)
            }
        }
        const t = await query('login', enc(usr, SparkMD5.hash(SparkMD5.hash(pwd + "err#*&@#1") + k)))
        const error = t && t.error;
        if (!error) {
            w = 0
            isLogin.set(1)
            token.set(t);
        } else {
            if (/^w:/.test(error)) {
                wt = +error.substr(2)
                msg.set("please try later")
            } else if (error === 'forbidden ip') {
                wt = -1
            } else {
                setTimeout(() => w = 0, 1e3)
                return msg.set(error)
            }
        }
        setTimeout(() => w = 0, 1e3)
    }

    let st = ""
    let dis;
    let ke = 1, bk = 0, br
    let ft
    let mf
    let ftt = ''
    let usr = ""
    let pwd = ""
    let iu, ip
    $:dis = usr.length < 2 || pwd.length < 4 || pwd.length > 30 || usr.length > 20
    $:st = wt === -1 ? 'Your are blocked\n' +
        'Please try again later' : `Please wait ${wt}s`

    function nx(e) {
        if (e.code === 'Enter') {
            if (this === iu) {
                ip.focus()
            } else {
                if (!dis) {
                    login()
                }
            }
        }
    }

    function go() {
        ke = Math.random()
        const {offsetLeft: lf, offsetWidth: w0, offsetParent: {offsetWidth: w1}} = br;
        mf = 120 * lf / 220
        const lft = +getComputedStyle(br).left.replace('px', '');
        const step = 20;
        if (!bk) {
            ft = lft - step
            if (lf <= w0) bk = 1
        } else {
            ft = lft + step
            if (lf + w0 > w1) bk = 0
        }
        ftt = `transform:translate3d(${mf}px,0,0)`
    }

</script>
<div class="bg" transition:fade>
    <div class="cc">
        <div class="bx">
            <LD act={w}/>
            <div class="msg" style={ftt}>
                <Tm defaultText="Have a nice day !"/>
            </div>
            <div class="br" style={`left:${ft}px`} class:bk={bk} bind:this={br}>
                {#if $msg}
                    <div class="v"></div>
                {/if}
                {#key ke}<i in:jump={{y:-18,duration:150}}></i>{/key}
            </div>
            {#if wt}
                <p transition:fade
                   class="ti">{st}</p>
            {:else }
                <div class="l">
                    <div class="r" class:a={usr}>
                        <input
                                on:input={go}
                                bind:value={usr}
                                bind:this={iu}
                                on:keydown={nx}
                                type="text"/>
                        <label>Username</label>
                    </div>
                    <div class="r" class:a={pwd}>
                        <input bind:value={pwd}
                               bind:this={ip}
                               on:keydown={nx}
                               type="password" autocomplete="new-password" on:input={go}/>
                        <label>Password</label>
                    </div>
                    <button class:dis={dis} on:click={login}>Login</button>
                </div>
            {/if}
            <a href="/">{'<  '}Home</a>
        </div>
    </div>
</div>
<style lang="scss">
  .l {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: inherit;
  }

  .ti {
    top: 50%;
    left: 0;
    right: 0;
    transform: translate3d(0, -50%, 0);
    position: absolute;
    color: #5d6879;
    white-space: pre-wrap;
    font-size: 16px;
    text-align: center;
  }

  .v {
    position: absolute;
    opacity: .8;
    transform: rotate(-50deg);
    background: white;
    height: 1px;
    width: 13px;
    border-radius: 3px;
    bottom: 102px;
    left: 50px;
  }

  .msg {
    transition: .3s ease-in-out;
    color: white;
    width: 200px;
    transform: translate3d(50px, 0, 0);
    text-align: center;
    bottom: 328px;
    position: absolute;
    font-size: 20px;
  }

  .br {
    transform: translate3d(-50%, 0, 0);
    left: 50%;
    top: -75px;

    &.bk {
      transform: translate3d(-50%, 0, 0) rotateY(180deg);

      .v {
        left: 10px;
        transform: rotate(50deg)
      }
    }

    width: 80px;
    height: 80px;
    position: absolute;
    transition: .1s ease-in-out;
  }

  .dis {
    opacity: .5;
    pointer-events: none;
  }

  .bg {
    width: 100%;
    height: 100%;
    background: #121622 url("../../lib/img/bg.jpg") bottom center;
    background-size: cover;
  }

  label {
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
    min-height: 210px;
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
    transform: translate3d(0, 0, 0);
    position: absolute;
    left: 0;
    bottom: 0;
    background: url("../../lib/img/fav.png") center no-repeat;
    background-size: 100% auto;
    width: inherit;
    height: inherit;
  }
</style>
