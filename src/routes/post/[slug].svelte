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
    let sly = ''
    $:{
        if (d.banner) {
            sly = `background-image:url(${resUrl(d.banner)})`
        }
        if (ga) {
            setTimeout(() => {
                new Viewer(ga);
            }, 100)
        }
    }
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
    <div class={'bk'} on:click={()=>goBack()}>X</div>
    <div class="co" style={sly}>
        <div class="bg"></div>
        <Ctx>
            <div class="v">
                <div class="h">
                    <h1>{d.title}</h1>
                    <p>{d.desc}</p>
                    <span>{timeFmt(d.created)}</span>
                </div>
                <div class="art">
                    <div class='ct' bind:this={ga}>
                        <Md value={d.pubCont}/>
                    </div>
                    <div class="ss"></div>
                    <PF/>
                    <div class="tg">
                        {#if d.tags}
                            <label>#</label>
                            <Tag t={d.tags}/>
                        {/if}
                    </div>
                    <CmList id={d.aid} act="1"/>
                </div>
            </div>
        </Ctx>
    </div>
{/if}
<style lang="scss">
  @import "../../lib/break";

  @keyframes bg {
    0% {
      background-position: 0 100%;
    }
    100% {
      background-position: 100% 0;
    }
  }

  .tg {
    display: flex;
    flex-wrap: wrap;
  }

  .ss {
    flex: 1;
  }

  .art {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    border-radius: 4px;
    overflow: hidden;
    background: white;
    padding: var(--artP);
    box-shadow: rgba(0, 0, 0, .2) 0 10px 30px -10px;
    @include s() {
      margin: 0;
    }
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
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    padding: var(--artC);
    overflow: auto;
    background: url("../../lib/bd/1.jpg") center no-repeat;
    background-size: cover;
    animation: bg 120s linear infinite alternate-reverse;
  }

  .h {
    padding: 30px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 30px auto 0;
    text-align: center;

    * {
      text-shadow: rgba(0, 0, 0, 0.15) 1px 1px 1px;
    }

    p {
      color: #eee;
      margin: 10px 0;
      font-size: 14px;
    }

    span {
      width: 100%;
      display: block;
      text-align: right;
      font-size: 12px;
      color: #eee;
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    background: #dee4e5;
    z-index: 10;
    font-size: 14px;
    opacity: .8;
    cursor: pointer;
    color: #000;
    top: 0;
    right: 0;
    position: absolute;

    &:hover {
      opacity: 1;
    }
  }

  .bg {
    position: fixed;
    height: 100%;
    z-index: 0;
    left: 0;
    right: 0;
    top: 40px;
    background: linear-gradient(
                    transparentize(#0c274f, .5),
                    transparentize(#000, .8)
    );
  }

  .v {
    max-width: 100%;
    width: 800px;
    margin: 20px auto 10px;
  }
</style>
