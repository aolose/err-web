<script>
    import List from '$lib/list.svelte'
    import PItem from '$lib/pCard.svelte'
    import Md from '$lib/md.svelte'
    import Pub from '$lib/pubWin.svelte'
    import Res from '$lib/resWin.svelte'
    import Edit from '$lib/edit.svelte'
    import {onDestroy} from "svelte";
    import BW from './blWin.svelte'
    import Sys from './sysWin.svelte'
    import Qa from './qaWin.svelte'

    import {fade} from "svelte/transition";
    import {artList, post, winAct} from "$lib/store";
    import {query} from "$lib/res";
    import {errorCatch} from "$lib/utils";

    let res
    let ipt
    let t
    let pid = $post.id
    let bf
    let lock
    $:{
        if (!bf) {
            bf = ($post.title + JSON.stringify($post.content || "")).replace(/[ \n\t\r]/g, '')
        }
        if (!pid && $post.id !== undefined) {
            pid = $post.id
        }
    }
    let content = "", title = ""
    $:content = ($post.content) || ""
    $:title = ($post.title) || ""


    function syncList(p, old) {
        const i = $artList.findIndex(({id}) => id === old)
        if (i !== -1) {
            const ls = [...$artList]
            ls[i] = p;
            artList.set(ls)
        }
    }

    onDestroy(post.subscribe(p => {
        syncList(p, p.id)
        if (lock) return
        clearTimeout(t)
        if (pid === $post.id) {
            t = setTimeout(async function () {
                const a = $post
                const v = (a.title + JSON.stringify(a.content || "")).replace(/[ \n\t\r]/g, '');
                if (v !== bf) {
                    bf = v
                    lock = 1
                    const r = await query('savePost', {...a, tags: undefined})
                    if (r && r.error) {
                        errorCatch(r.error)
                    } else {
                        const [id, ver, da] = (r || "").split('\u0001')
                        const old = $post.id
                        post.set({
                            ...a,
                            ver: +ver,
                            id: +id,
                            saved: +da
                        });
                        syncList($post, old)
                    }
                    lock = 0
                }
            }, 2e3)
        } else {
            if (!pid) {
                const idx = $artList.findIndex(a => a && !a.id)
                if (idx !== -1) {
                    const ls = [...$artList];
                    if (!ls.find(a => a.id === $post.id)) {
                        ls[idx] = $post.id
                        artList.set(ls)
                    }
                }
            }
            pid = $post.id
        }
    }))
    onDestroy(() => {
        post.set({})
        artList.set([])
        winAct.set(0)
    })
</script>
<nav>
    <List
            icon={1}
            api={'edit'}
            cpm={PItem}
            listStore={artList}
            curStore={post}
            baseItem={ {
            id: 0,
            title: "A new article",
            desc: "",
            content: "Write something",
            ver: -1
        }}
    />
</nav>
<div class="ma">
    <div class="write">
        <Edit
                store={post}
                saved={$post.saved}
                show={$post.ver}
                bind:ipt={ipt}
        />
        <div class="prev">
            {#key !Object.keys($post).length}
                <div transition:fade>
                    <h1>{title}</h1>
                    <Md value={content}/>
                </div>
            {/key}
            <Pub/>
            <Res ipt={ipt}/>
            <BW/>
            <Qa/>
            <Sys/>
        </div>
    </div>
</div>
<style lang="scss">
  nav {
    width: 250px;
    display: block;
    height: 100%;
    background: #121622;
    padding: 0 11px 5px 6px;
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
  }

</style>