<script>
    import Msg from "./msg.svelte"
    import Out from "./out.svelte"
    import SF from "./safe.svelte"
    import File from "./file.svelte"
    import Del from "./del.svelte"
    import Cmt from "./cmt.svelte"
    import Art from "./art.svelte"
    import Und from "./und.svelte"
    import {post, artList, winAct, isLogin} from "./store";
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
                        const ls = [...$artList]
                        const idx = ls.findIndex(c => c.id === +a)
                        if (idx !== -1) {
                            ls.splice(idx, 1)
                        }
                        artList.set(ls)
                        if ($post.id === +a) {
                            post.set({})
                        }
                    }
                }
            })
        const ls = [...$artList]
        if (ls.length && (!ls[0] || !ls[0].id)) ls.unshift()
        artList.set([])
        post.set({})
        if ($winAct === 1) winAct.set(0)
    }

    function pub() {
        winAct.set($winAct === 1 ? 0 : 1)
    }

</script>
<div class="mu">
    <Out/>
    {#if $isLogin === 1}
        {#if $post.ver}
            <!--        <Btn cls="e">-->
            <!--            <Opt/>-->
            <!--        </Btn>-->
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
        <Btn cls="d" fn={()=> winAct.set($winAct === 2 ? 0 : 2)}>
            <File/>
        </Btn>
        <Btn cls="g" fn={()=>isLogin.set(2)}>
            <SF/>
        </Btn>
    {/if}
    {#if $isLogin === 2}
        <Btn cls="j" fn={()=>isLogin.set(1)}>
            <Art/>
        </Btn>
    {/if}
    <Btn cls="f">
        <Msg/>
    </Btn>
</div>
<style lang="scss">
  .mu {
    position: absolute;
    right: 0;
    top: 0;
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

      .j {
        color: #d75bd4
      }

      .f {
        color: #cb9647
      }

      .g {
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