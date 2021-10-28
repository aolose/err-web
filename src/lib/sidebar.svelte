<script>
    import Msg from "./iconMsg.svelte"
    import Out from "./iconOut.svelte"
    import SF from "./iconSafe.svelte"
    import File from "./iconFile.svelte"
    import Sys from "./iconSys.svelte"
    import Blk from "./iconBlk.svelte"
    import Del from "./iconDel.svelte"
    import Cmt from "./iconCmt.svelte"
    import Und from "./iconUnd.svelte"
    import {post, isLogin, openWin, artList, winAct} from "./store";
    import Btn from "./btn.svelte"
    import {query} from "./res";
    import {errorCatch} from "$lib/utils";
    import {tip} from './popMsg.svelte'

    function upu() {
        tip('Unpublish the post?', () => {
            if ($post.id)
                return query('unPub', $post.id).then(a => {
                    if (a) {
                        if (a.error) {
                            errorCatch(a.error)
                        }
                    }
                    post.set({
                        ...$post,
                        updated: 0
                    })
                })
        }, 1)
    }

    function del() {
        tip('Confirm delete?', () => {
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
        }, 1)
    }

</script>
<div class="mu">
    <Out/>
    {#if $isLogin === 1}
        {#if Object.keys($post).length}
            <Btn cls="a" fn={openWin(1)}>
                <Cmt/>
            </Btn>
            {#if $post.updated}
                <Btn cls="b" fn={upu}>
                    <Und/>
                </Btn>
            {/if}
            <Btn cls="c" fn={del}>
                <Del/>
            </Btn>
        {/if}
        <Btn cls="d" fn={openWin(2)}>
            <File/>
        </Btn>
        <Btn cls="g" fn={openWin(3)}>
            <SF/>
        </Btn>
        <Btn cls="l" fn={openWin(4)}>
            <Sys/>
        </Btn>
        <Btn cls="f" fn={openWin(5)}>
            <Msg/>
        </Btn>
    {/if}
</div>
<style lang="scss">
  @import "./break";

  .mu {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: #121622;
    @include s() {
      width: 40px;
    }

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
        color: #76d75b
      }

      .f {
        color: #738ae5
      }

      .g {
        color: #0ea701
      }

      .h {
        color: #e7aa04;
      }

      .l {
        color: #e75b04;
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
        @include s() {
          width: 30px;
          height: 30px;
          margin:  3px auto;
          svg{
            width: 58%;
            height: 58%;
          }
        }

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
