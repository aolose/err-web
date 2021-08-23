<script>
    import Msg from "./msg.svelte"
    import Opt from "./opt.svelte"
    import File from "./file.svelte"
    import Del from "./del.svelte"
    import Cmt from "./cmt.svelte"
    import Und from "./und.svelte"
    import {post, list} from "./store";
    import Btn from "./btn.svelte"
    import {query} from "./res";
    import {errorCatch} from "$lib/utils";

    function upu() {
        if ($post.id)
            return query('setVer', {
                id: $post.id,
                ver: -1
            }).then(a => {
                if (a) {
                    if (a.error) {
                        errorCatch(a.error)
                    }
                }
                post.set({
                    ...$post,
                    ver: -1
                })
            })
    }

    function del() {
        if ($post.id)
            return query('delPost', $post.id).then(a => {
                if (a) {
                    if (a.error) {
                        errorCatch(a.error)
                    } else {
                        const ls = [...$list]
                        const idx = ls.findIndex(c => c.id === +a)
                        if (idx !== -1) {
                            ls.splice(idx, 1)
                        }
                        list.set(ls)
                        if ($post.id === +a) {
                            post.set({})
                        }
                    }
                }
            })
        post.set({})
    }

    function pub() {
        return query('pubPost', $post).then((a) => {
            if (a) {
                if (a.error) {
                    errorCatch(a.error)
                } else {
                    const [i, s, v, u] = a.split("\u0001")
                    post.set({
                        ...$post,
                        slug: s,
                        id: +i,
                        ver: +v,
                        updated: +u,
                    })
                }
            }
        });
    }

</script>
<div class="mu">
    {#if $post.ver}
        <Btn cls="e">
            <Opt/>
        </Btn>
        <Btn cls="a" fn={pub}>
            <Cmt/>
        </Btn>
        {#if $post.ver > 0}
            <Btn cls="b" fn={upu}>
                <Und/>
            </Btn>
        {/if}
        <Btn cls="c" fn={del}>
            <Del/>
        </Btn>
    {/if}
    <Btn cls="d">
        <File/>
    </Btn>
    <Btn cls="f">
        <Msg/>
    </Btn>
</div>
<style lang="scss">
  .mu {
    position: absolute;
    right: 0;
    top: 60px;
    width: 60px;

    :global {
      .a {
        color: #09ffd0
      }

      .b {
        color: #87a4ff
      }

      .c {
        color: #fd16a8
      }

      .d {
        color: #d4d261
      }

      .e {
        color: #ff760e
      }

      .f {
        color: #0ea701
      }

      i {
        width: 40px;
        height: 40px;
        margin: 10px auto;
        display: flex;
        align-items: center;
        border-radius: 50%;
        justify-content: center;
        cursor: pointer;
        border: 1px solid transparent;
        opacity: .6;
        transition: .2s ease-in-out;
        box-shadow: inset rgba(0, 0, 0, .0) 0 0 0;

        &:hover {
          opacity: 1;
          border-color: currentColor;
          box-shadow: inset rgba(99, 99, 99, .5) 0 10px 20px;
        }
      }

      svg {
        color: inherit;
        max-width: 50%;
        max-height: 50%;

        :global * {
          color: inherit;
        }
      }
    }
  }
</style>