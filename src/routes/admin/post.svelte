<script>
    import List from '$lib/list.svelte'
    import Md from '$lib/md.svelte'
    import PostMu from '$lib/sidebar.svelte'
    import {list, post} from "$lib/store";
    import Ld from "$lib/loading.svelte";
    import Bg from "$lib/empty.svelte";
    import {onDestroy} from "svelte";
    import {query} from "$lib/res";
    import {errorCatch, timeFmt} from "$lib/utils";

    let res
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
    $:content = ($post.content) || ""
    $:title = ($post.title) || ""
    $:saved = $post.saved ? `Saved at ${timeFmt($post.saved)}` : ""

    function syncList(p, old) {
        const i = $list.findIndex(({id}) => id === old)
        if (i !== -1) {
            const ls = [...$list]
            ls[i] = p;
            list.set(ls)
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
                    const r = await query('savePost', a)
                    if (r && r.error) {
                        errorCatch(r.error)
                    } else {
                        const [id,ver, da] = (r || "").split('\u0001')
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
                const idx = $list.findIndex(a => !a.id)
                if (idx !== -1) {
                    const ls = [...$list];
                    ls[idx] = $post.id
                    list.set(ls)
                }
            }
            pid = $post.id
        }
    }))
</script>

<nav>
    <List onSelect={(d)=>{ post.set(d)}}/>
</nav>
<div class="ma">
    <div class="write">
        <div class="edit">
            {#if $post.ver}
                <input bind:value={$post.title}/>
                {#await res}
                    <Ld/>
                {/await}
                <textarea bind:value={$post.content}></textarea>
            {:else }
                <Bg/>
            {/if}
            <div class="sv">{saved}</div>
        </div>
        <div class="prev">
            <div>
                <h1>{title}</h1>
                <Md value={content}/>
            </div>
        </div>
    </div>
    <div class="res">

    </div>
</div>
<PostMu/>
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
    margin-right: 60px;
    overflow: hidden;

    & > div {
      overflow: auto;
      word-break: break-all;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 20px;
    }


    :global {
      p {
        line-height: 24px;
      }
    }
  }

  .edit {
    max-width: 600px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;

    textarea {
      flex: 1;
      overflow: auto;
    }

    input {
      height: 40px;
      margin-bottom: 10px;
    }

    input, textarea {
      color: #8db2e9;
      line-height: 1.5;
      border: 1px solid #1d314a;
      border-radius: 6px;
      background: rgba(36, 46, 65, .4);
      padding: 10px;
      resize: none;
      display: block;
    }
  }

  .ma {
    padding: 10px 0 40px 10px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sv {
    position: absolute;
    color: #334271;
    bottom: -30px;
    left: 12px;
  }
</style>