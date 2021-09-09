<script>
    import SWin from './slideWin.svelte'
    import Ck from './checkbox.svelte'
    import Tags from './tags.svelte'
    import {host, query} from "$lib/res";
    import {bannerMod, post, tags, winAct} from "$lib/store";
    import {errorCatch, getArtDesc} from "$lib/utils";
    import {onDestroy} from "svelte";
    import {fade} from 'svelte/transition'

    let d = 0
    let bs = ''
    onDestroy(post.subscribe(o => {
        if (!Object.keys(o).length) {
            if ($winAct === 1) {
                winAct.set(0)
            }
        } else {
            bs = o.banner ? `background-image:url(${host}/r/${o.banner}.png)` : ''
        }
    }))


    function selRes() {
        bannerMod.set(1);
        winAct.set(2)
    }

    function pub() {
        d = 1
        return query('pubPost', $post).then((a) => {
            setTimeout(() => d = 0, 1e3)
            if (a) {
                if (a.error) {
                    errorCatch(a.error)
                } else {
                    const [i, s, v, u, nt, ot] = a.split("\u0001")
                    tags.add(nt).del(ot)
                    post.set({
                        ...$post,
                        pwd: $post.pwd,
                        slug: s,
                        slug2: s,
                        id: +i,
                        ver: +v,
                        updated: +u,
                    })
                }
            }
        }).catch(e => {
            d = 0
            errorCatch(e)
        });
    }

</script>

<SWin act={1}>
    <div slot="btn" class="btn" class:ld={d} on:click={pub}>
        Publish
    </div>
    <div class="r">
        <label for="b">Slug</label>
        <input id="b" type="text"
               bind:value={$post.slug2}
               placeholder={$post.slug||'slug'}/>
    </div>
    <div class="r">
        <label for="a">Description</label>
        <textarea id="a"
                  bind:value={$post.desc}
                  placeholder={getArtDesc($post)}></textarea>
    </div>
    <div class="r">
        <label for="d">Tags</label>
        <div class="tgs" id="d">
            <Tags curStore={post} tagsStore={tags}/>
        </div>
    </div>
    <div class="r">
        <label>Banner</label>
        <div class="bn" on:click={selRes}>
            {#if bs}
                <div
                        transition:fade
                        class="bg" style={bs}></div>
                <div
                        transition:fade
                        class="rm" on:click|stopPropagation={()=>{
                    $post.banner=''
                }}></div>
            {/if}
        </div>
    </div>
    <div class="r">
        <label for="e">
            Password
        </label>
        <input type="text" id="e" bind:value={$post.pwd}/>
    </div>
    <div class="r">
        <label for="f" id="f">
            <Ck bind:act={$post.cm}>Allow Comment</Ck>
        </label>
    </div>

</SWin>
<style lang="scss">
  .ld {
    animation: ss 1s infinite linear;
  }

  label {
    left: 0;
    top: 22px;
    color: #52749b;
    position: absolute;
    width: 180px;
    padding-right: 20px;
    display: flex;
    align-items: center;

    &:hover {
      color: #4aa9ff;
    }
  }

  .r {
    min-height: 40px;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    width: 80%;
    padding: 10px 10px 10px 100px;
    margin: 10px auto;

    span {
      color: #ae893f;
      position: absolute;
      bottom: -10px;
      left: 110px;
    }
  }

  input, textarea, .bn, .tgs {
    width: 0;
    flex: 1;
    color: #8ca4d7;
    line-height: 1.5;
    border: 1px solid #1d314a;
    border-radius: 6px;
    background: rgba(36, 46, 65, 0.4);
    padding: 9px 10px;
    resize: none;
    display: block;
    min-height: 40px;

    &:focus {
      border-color: #1c93ff;
    }
  }

  textarea {
    height: 100px;
  }

  .bn {
    cursor: pointer;
    padding-top: 50%;
    overflow: hidden;

    &:hover {
      .rm {
        opacity: 1;
      }
      .bg{
        opacity: .5;
      }
    }

    &:before {
      content: '';
      display: block;
      opacity: .3;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("./img/add.svg") no-repeat center;
      background-size: 50px;
    }

    div {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }

    .rm {
      width: 30px;
      height: 30px;
      bottom: auto;
      border-radius: 4px;
      right: 0;
      left: auto;
      opacity: .2;
      cursor: pointer;
      transition: .3s ease-in-out;
      background:  url("./img/can.svg") no-repeat center;
      background-size: 20px;
    }
  }

  .bg {
    transition: .3s ease-in-out;
    background: no-repeat center;
    background-size: cover;
  }

  .tgs {
    height: auto;
    padding: 0;
  }

  .btn {
    &:hover {
      opacity: 1;
    }

    opacity: .6;
    cursor: pointer;
    border-radius: 3px;
    border: 1.5px solid currentColor;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    color: #3cadff;
    transition: .2s ease-in-out;
  }
</style>