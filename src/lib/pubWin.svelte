<script>
    import SWin from './slideWin.svelte'
    import Ck from './checkbox.svelte'
    import Tags from './tags.svelte'
    import {query} from "$lib/res";
    import {post, tags} from "$lib/store";
    import {errorCatch} from "$lib/utils";

    let d = 0

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
                        slug: s,
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
        <label>Slug</label>
        <input type="text" placeholder="Slug"/>
        <span>xxx</span>
    </div>
    <div class="r">
        <label>Description</label>
        <textarea></textarea>
    </div>
    <div class="r">
        <label>Tags</label>
        <div class="tgs">
            <Tags/>
        </div>
    </div>
    <div class="r">
        <label>Banner</label>
        <div class="bn">

        </div>
    </div>
    <div class="r">
        <label>
            <Ck>Protect</Ck>
        </label>
        <input type="text"/>
    </div>
    <div class="r">
        <label>
            <Ck>Allow Comment</Ck>
        </label>
    </div>

</SWin>
<style lang="scss">
  @keyframes a {
    0%, 50%, 100% {
      opacity: 1;
    }
    25%, 75% {
      opacity: .3;
    }
  }

  .ld {
    animation: a 1s infinite linear;
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
    padding-top: 50%;
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