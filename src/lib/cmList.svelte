<script>
    import {browser} from "$app/env";
    import {randNm, rndAr} from "./utils";
    import {fade} from "svelte/transition";
    import Ld from './loading.svelte'
    import {query} from "./res";

    export let id = ''
    export let act = 0
    let ls = [], ed = 0,ld=0
    let sh = 0
    const avLs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    let nm = '', av = 0, cm = ''
    let dis = 0
    $:{
        dis = !nm.length || !cm.length
        if (browser) {
            localStorage.av = av = av || localStorage.av || (rndAr(avLs) + 1)
            nm = nm || localStorage.nm || randNm()
            av = av || +localStorage.av || 1
        }
    }

    async function cmt() {
       ld=1
        await query('cm',{
            d:id,
            n:nm,
            c:cm,
        })
        ld=0
    }

    function se() {
        ed = 1
    }

    function rn() {
        nm = randNm()
        av = localStorage.av = rndAr(avLs) + 1
    }
</script>
<div class:sh={act} class="cm">
    {#if sh}
        <div class="as" transition:fade>
            {#each avLs as a}
                <i class={'av a_'+a} class:act={a===av-1} on:click={()=>{
                av=a+1
                sh=0
            }}></i>
            {/each}
        </div>
    {/if}
    <div class="c">
        <div class="o">
            <i class={'a a_'+(av-1)} on:click={()=>sh=1}></i>
            {#if ed}
                <input bind:value={nm} placeholder="name"
                       on:blur={()=>ed=0}/>
            {:else }
                <span class="n">{nm}</span>
                <i class="r" on:click={rn}></i>
                <i class="e" on:click={se}></i>
            {/if}
            <div class="s"></div>
            <div class="bn"
                 class:dis={dis}
                 on:click={cmt}>Commit
            </div>
        </div>
        <div class="sd">
            <div class="v">{cm}</div>
            <textarea placeholder="write something~" bind:value={cm}></textarea>
        </div>
        <Ld tm={1} act={ld} text="committing"/>
    </div>
    <div class="ls">

    </div>
</div>
<style lang="scss">
  .as {
    padding: 7px;
    position: absolute;
    height: 100px;
    top: -110px;
    width: 247px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: rgba(0, 0, 0, .2) 0 3px 8px -3px;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;

    :global {
      .av {
        width: 40px;
        height: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: auto 80%;
        margin: 3px;
        border-radius: 6px;
        border: 1px solid transparent;

        &.act, &:hover {
          border-color: #c5c5c5;
          background-color: #eee;
        }
      }
    }
  }

  .s {
    flex: 1;
  }

  .bn {
    opacity: .7;
    cursor: pointer;
    border-radius: 2px;
    padding: 5px 10px;
    color: #fff;
    background: #1cbbff;
    transition: .1s ease-in-out;

    &:hover {
      opacity: 1
    }
  }

  .cm {
    :global {
      .a_0 {
        background-image: url("./icon/0.png");
      }

      .a_1 {
        background-image: url("./icon/1.png");
      }

      .a_2 {
        background-image: url("./icon/2.png");
      }

      .a_3 {
        background-image: url("./icon/3.png");
      }

      .a_4 {
        background-image: url("./icon/4.png");
      }

      .a_5 {
        background-image: url("./icon/5.png");
      }

      .a_6 {
        background-image: url("./icon/6.png");
      }

      .a_7 {
        background-image: url("./icon/7.png");
      }

      .a_8 {
        background-image: url("./icon/8.png");
      }

      .a_9 {
        background-image: url("./icon/9.png");
      }

      .a_a {
        background-image: url("./icon/a.png");
      }

      .a_b {
        background-image: url("./icon/b.png");
      }
    }
  }

  .c {
    border: 1px solid #eee;
    border-radius: 4px;
    background: transparentize(#eee, .6);
  }

  input, .n {
    display: flex;
    align-items: center;
    height: 30px;
    font-weight: 600;
    color: #f59528;
    min-width: 80px;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .n {
    margin-right: 10px;
    width: auto;
  }

  .r, .e {
    opacity: .5;
    height: 20px;
    width: 20px;
    cursor: pointer;
    background: url("./img/c.svg") center no-repeat;
    background-size: 60%;

    &:hover {
      opacity: 1;
    }
  }

  .e {
    background-image: url("./img/e.svg");
  }

  .o {
    border-radius: 2px;
    padding: 5px 10px;
    background: #fff;
    display: flex;
    align-items: center;
  }

  .a {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: url("./icon/0.png") center no-repeat;
    background-size: auto 80%;
  }

  .sd {

  }

  .v {
    opacity: 0;
    pointer-events: none;
    min-height: 60px;
    overflow: hidden;
    padding: 20px 10px;
    max-height: 150px;
  }

  .v, textarea {
    white-space: pre-wrap;
    line-height: 1.5;
    font-size: 14px;
  }

  textarea {
    width: 100%;
    resize: none;
    left: 0;
    padding: 0 10px;
    right: 0;
    top: 5px;
    bottom: 10px;
    position: absolute;
    height: auto;
  }

  .dis {
    pointer-events: none;
    background: #aaa;
  }
</style>