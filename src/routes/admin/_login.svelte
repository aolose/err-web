<script context="module">
    import {res} from '$lib/res'
    import {jump} from '$lib/transition'
    import LD from '$lib/loading.svelte'

    /**
     * @type {import('@sveltejs/kit').Load}
     */

    export const load = res('auth')
</script>
<script>
    import {isLogin, msg} from "$lib/store";
    import Tm from "$lib/typeMsg.svelte";

    let w = 0
    let key = ""
    let ans = ""
    let showQ = 0
    let question = 0

    function next() {
        if(question){
            msg.set("Please answer the question blow!")
            showQ=1
        }else login()
    }

    async function login() {
        if (dis) return;
        w = 1
        const res = (await fetch('/in', {
            credentials: "include",
            method: 'POST',
            body: '_' + btoa([usr, pwd, key, ans].map(a => btoa(a)).join("\u0001"))
        }))
        if (res.ok) {
            isLogin.set(1)
        } else {
            let t = res.text();
            try {
                t=JSON.parse(t)
            }catch (e){
                console.log(e)
            }
            debugger;
            msg.set("username or password is incorrect !")
        }
        setTimeout(() => w = 0, 1e3)
    }

    let dis;
    let ke = 1, bk = 0, br
    let ft
    let mf
    let ftt = ''
    let usr = ""
    let pwd = ""
    let iu, ip
    $:dis = usr.length < 2 || pwd.length < 4 || pwd.length > 30 || usr.length > 20

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
<div class="bg">
    <div class="cc">
        <div class="bx">
            <LD act={w}/>
            {#if showQ && question}
                <div class="qs">
                    <label>Q</label>
                    <p>{question}</p>
                    <div class="r" class:a={ans}>
                        <input bind:value={ans} type="text"/>
                    </div>
                    <button
                            class:dis={!ans}
                            on:click={next}>
                        {question ? 'Next' : 'Login'}
                    </button>
                </div>
            {/if}
            <div class="msg" style={ftt}>
                <Tm defaultText="Have a nice day !"/>
            </div>
            <div class="br" style={`left:${ft}px`} class:bk={bk} bind:this={br}>
                {#if $msg}
                    <div class="v"></div>
                {/if}
                {#key ke}<i in:jump={{y:-18,duration:150}}></i>{/key}
            </div>
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
            <button class:dis={dis} on:click={login}>{question ? 'Next' : 'Login'}</button>
            <a href="/">{'<  '}Home</a>
        </div>
    </div>
</div>
<style lang="scss">
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
    background: #121622 url("$lib/img/bg.jpg") bottom center;
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
    background: url("$lib/img/fav.png") center no-repeat;
    background-size: 100% auto;
    width: inherit;
    height: inherit;
  }
</style>