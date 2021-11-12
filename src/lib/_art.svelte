<script>
    import List from '$lib/list.svelte'
    import PItem from '$lib/pCard.svelte'
    import Md from '$lib/md.svelte'
    import Pub from '$lib/pubWin.svelte'
    import Res from '$lib/resWin.svelte'
    import Edit from '$lib/edit.svelte'
    import {onDestroy} from 'svelte';
    import BW from './blWin.svelte'
    import Mg from './mgWin.svelte'
    import Sys from './sysWin.svelte'
    import Msg from '$lib/typeMsg.svelte'

    import {fade} from 'svelte/transition';
    import {artList, post, view, winAct, pubUrl} from '$lib/store';
    import {query} from '$lib/res';
    import {errorCatch} from '$lib/utils';

    let res
    let ipt
    let t
    let pid = $post.id
    let bf
    let cls = ''
    let content = "", title = ""
    $:content = ($post.content) || ""
    $:title = ($post.title) || ""


    function getKey(p) {
        if (!p.hasOwnProperty('id')) return null
        return (p.title + JSON.stringify(p.content || ""))
    }

    function syncList(p, old) {
        const i = $artList.findIndex(({id}) => id === old)
        if (i !== -1) {
            const ls = [...$artList]
            ls[i] = p;
            artList.set(ls)
        }
    }

    let pu = -1
    onDestroy(pubUrl.subscribe(p => {
        clearTimeout(pu)
        if (p) {
            pu = setTimeout(() => {
                pubUrl.set('')
            }, 8e3)
        }
    }))
    onDestroy(post.subscribe(p => {
        syncList(p, p.id)
        clearTimeout(t)
        if (v === null) return
        if (pid === p.id) {
            t = setTimeout(async function () {
                const a = $post
                const v = getKey(a)
                if (v === bf) return
                const r = await query('savePost', a)
                if (r && r.error) {
                    errorCatch(r.error)
                } else {
                    const [id, da] = (r || "").split('\u0001')
                    const old = a.id
                    const n = {
                        ...a,
                        id: +id,
                        saved: +da
                    }
                    bf=v
                    post.set(n);
                    syncList(n, old)
                }
            })
        } else {
            pid = p.id || 0
            bf = getKey(p)
        }
    }))
    onDestroy(() => {
        post.set({})
        artList.set([])
        winAct.set(0)
    })
    onDestroy(view.subscribe(a => {
        cls = 'v' + a
    }))
</script>
<div class={'tip'+($pubUrl?' act':'')} on:click={()=>setTimeout(()=>pubUrl.set(""),300)}>
    Publish success! <a target='_blank' href={'/post/'+$pubUrl}>VIEW</a>
</div>
<div class={'ctx '+cls}>
    <nav>
        <List
                onAdd={()=>{view.set(1)}}
                icon={1}
                api={'edit'}
                cpm={PItem}
                listStore={artList}
                curStore={post}
                baseItem={ {
            id: 0,
            title: 'A new article',
            desc: "",
            content: 'Write something',
        }}
        />
    </nav>
    <div class={'ma'}>
        <div class='write'>
            <Edit
                    store={post}
                    saved={$post.saved}
                    show={Object.keys($post).length}
                    bind:ipt={ipt}
            />
            <div class='prev'>
                {#key !Object.keys($post).length}
                    <div transition:fade>
                        <h1>{title}</h1>
                        <Md value={content}/>
                    </div>
                {/key}
            </div>
        </div>
    </div>
    <div class='msg'>
        <Msg defaultText='version 0.0.1'/>
    </div>
</div>
<Pub/>
<Res ipt={ipt}/>
<BW/>
<Mg/>
<Sys/>
<style lang='scss'>
  @import './break';

  .tip {
    pointer-events: none;
    position: fixed;
    height: 30px;
    width: 200px;
    top: 0;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: .3s ease-in-out;
    transform: translate3d(-50%, -100%, 0);
    color: #fff;
    z-index: 10;
    background: transparentize(#0eb200, .4);
    backdrop-filter: blur(3px);
    box-shadow: transparentize(#0ea701, .8) 0 2px 20px -4px;

    &.act {
      pointer-events: all;
      transform: translate3d(-50%, 100%, 0);
    }

    a {
      padding: 0 5px;
      color: yellow;
      text-decoration: underline;
    }
  }

  nav {
    width: 250px;
    display: block;
    height: 100%;
    background: #121622;
    padding: 0 11px 5px 6px;
    @include s() {
      padding-right: 40px;
      width: 100%;
    }
  }

  .write {
    padding: 10px;
    flex: 1;
    display: flex;
  }

  .prev {
    border-radius: 10px;
    flex: 1;
    max-width: 600px;
    margin-left: 30px;
    margin-right: 50px;
    overflow: hidden;
    @include s() {
      margin-right: 40px;
    }

    h1 {
      margin-bottom: 20px;
    }

    & > div {
      overflow: auto;
      word-break: break-all;
      position: absolute;
      left: 0;
      right: 0;
      top: 5px;
      bottom: 5px;
      padding: 0 20px;
    }


    :global {
      p {
        line-height: 24px;
      }
    }
  }


  .ma {
    padding: 10px 0 40px 10px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    @include s() {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: -100%;
      transform: translate3d(50%, 0, 0);
    }
  }

  .msg {
    position: absolute;
    right: 30px;
    bottom: 15px;
    max-width: 70%;
    color: #00a1ff;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ctx {
    transition: .3s ease-in-out;
    display: flex;
    flex: 1;
    overflow: visible;
  }

  @include s() {
    .v0 {
      transform: translate3d(0, 0, 0);
    }
    .v1 {
      transform: translate3d(-100%, 0, 0);
    }
    .v2 {
      transform: translate3d(-200%, 0, 0);
    }
  }

</style>
