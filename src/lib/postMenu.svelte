<script>
    import Msg from "./msg.svelte"
    import Opt from "./opt.svelte"
    import File from "./file.svelte"
    import Del from "./del.svelte"
    import Cmt from "./cmt.svelte"
    import Und from "./und.svelte"
</script>
<div class="mu">
    <i class="a">
        <Cmt/>
    </i>
    <i class="e">
        <Opt/>
    </i>
    <i class="b">
        <Und/>
    </i>
    <i class="c">
        <Del/>
    </i>
    <i class="d">
        <File/>
    </i>
    <i class="f">
        <Msg/>
    </i>
</div>
<style lang="scss">
  .mu {
    position: absolute;
    right: 0;
    top: 60px;
    width: 60px;

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
      box-shadow: inset rgba(0,0,0,.0) 0 0 0;
      &:hover{
        opacity: 1;
         border-color: currentColor;
        box-shadow: inset rgba(99,99,99,.5)  0 10px 20px;
      }
      :global svg{
        color: inherit;
        max-width: 50%;
        max-height: 50%;
        :global *{
          color: inherit;
        }
      }
    }
    .a{color: #09ffd0
    }
    .b{color: #87a4ff
    }
    .c{color: #fd16a8
    }
    .d{color: #d4d261
    }
    .e{color: #ff760e
    }
    .f{color: #0ea701
    }
  }
</style>