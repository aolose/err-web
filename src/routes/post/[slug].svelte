<script context="module">
    import {res} from "$lib/res";
    export const load = res('post')
</script>
<script>
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'viewerjs';
    import Ctx from "$lib/ctx.svelte";
    import CmList from "$lib/cmList.svelte"
    import Tag from "$lib/tag.svelte";
    import Md from "$lib/md.svelte"
    import DC from "$lib/derection.svelte"
    import {onDestroy} from "svelte";
    import {bg} from "$lib/store";
    import {goBack, resUrl, timeFmt} from "$lib/utils";
    import PF from '$lib/pf.svelte'

    Viewer.setDefaults({
        button: true,
        navbar: false,
        title: false,
        toolbar: false,
        keyboard: false,
        minWidth: 400,
        loop: false,
        minHeight: 200,
        minZoomRatio: 0.1,
    })
    export let d;
    let ga;
    $:{
        if (d.banner) {
            bg.set(d.banner)
        }
        if (ga) {
            setTimeout(() => {
                new Viewer(ga);
            }, 100)
        }
    }
    onDestroy(() => {
        bg.set('')
    })
</script>
<svelte:head>
    <title>{d.title}</title>
    <meta property="description" content={d.desc}/>
    <meta property="og:type" content="article"/>
    <meta property="og:title" content={d.title}/>
    <meta property="og:description" content={d.desc}/>
    <meta property="og:url" content={d.slug}/>
    <meta property="article:published_time" content={timeFmt(d.created)}/>
    <meta property="article:tag" content={d.tags}/>
    <meta property="og:image" content={resUrl(d.banner,'.png')}/>
    <meta property="og:image:width" content="600"/>
    <meta property="og:image:height" content="400"/>
</svelte:head>
{#if d && d.updated}
    <div class="co">
        <Ctx>
            <div class={'bk'} on:click={()=>goBack()}>{'< '}back</div>
            <div class="art">
                <div class="h">
                    <DC color="currentColor">
                        <h1>{d.title}</h1>
                    </DC>
                    <p>{d.desc}</p>
                    <span>{timeFmt(d.created)}</span>
                </div>
                <div class='ct' bind:this={ga}>
                    {#if d.banner}
                        <img src={resUrl(d.banner)}/>
                    {/if}
                    <Md value={d.pubCont}/>
                </div>
                <PF/>
                <div class="tg">
                    {#if d.tags}
                        <label>#</label>
                        <Tag t={d.tags}/>
                    {/if}
                </div>
                <CmList id={d.aid} act="1"/>
            </div>
        </Ctx>
    </div>
{/if}
<style lang="scss">
  .tg {
    display: flex;
    flex-wrap: wrap;
  }

  .art {
    border-radius: 4px;
    overflow: hidden;
    background: white;
    padding: var(--artP);
  }

  .ct {
    & > img {
      margin: 0 auto 30px;
      display: block;
    }

    :global {
      a {
        color: #1c93ff;
      }

      .md {
        color: #333;
        font-size: 14px;
        line-height: 2;
        text-align: justify;
        margin: 10px 0 20px;
        pre, code {
          border-radius: 3px;
          word-break: break-word;
          background: transparentize(rgb(37, 40, 55), .95);
          color: #1a2638;
        }

        pre {
          code {
            background: none;
          }
        }

        & > p {
          margin-bottom: 10px;
          &:first-child:first-letter {
            font-size: 30px;
          }
          &:first-letter {
            padding-left: 29px;
          }
        }
      }
    }
  }

  .co {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    padding: var(--artC);
    overflow: auto;
  }

  .h {
    color: #3c444f;
    display: flex;
    padding-top: 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 30px auto 80px;
    text-align: center;
    max-width: 90%;
    p {
      color: #19283d;
      margin: 10px 0;
      font-size: 14px;
    }

    span {
      font-size: 12px;
      color: #9a9aa1;
    }
  }

  h1 {
    max-width: 70%;
    color: inherit;
    margin: 14px 0 20px;
    font-weight: 100;
    text-align: center;
    font-size: var(--fs);
  }

  .bk {
    font-size: 14px;
    opacity: .8;
    cursor: pointer;
    left: 20px;
    color: #a1b0c2;
    top: 50px;
    position: absolute;

    &:hover {
      opacity: 1;
    }
  }
</style>
