<script>
    import {host} from "./res";
    import {fade} from "svelte/transition";
    export let p = {}

    const {banner, slug, title, content, updated} = p
    const sty = `background-image:url(${host}/r/${banner}.png)`
    const tm = new Date(updated * 1e3)
    const y = tm.getFullYear()
    const m = tm.getMonth() + 1
    const d = tm.getDate()
</script>

<div class="p" transition:fade>
    <div class="t">
        <span class="y">{y}</span>
        <span class="md">
             <span class="m">{m}</span>
             <span class="d">{d}</span>
         </span>
    </div>

    <a class="f" href={`/post/${slug}`}>
        <div class="c" class:ex={!banner}>
            <h3>{title}</h3>
            <p>{content.substr(0,banner?32:256)}...</p>
        </div>
        {#if banner}
            <div class="x">
                <div class="v">
                    <div class="w">
                        <div class="z" style={sty}>
                            <div class="k"></div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </a>
</div>
<style lang="scss">
  @import "./break";
  h3 {
    color: #bac7dc;
    font-weight: 100;
    font-size: 17px;
    margin-bottom: 10px;
  }

  p {
    word-break:break-all;
    white-space: normal;
    line-height: 1.5;
    margin-top: 3px;
    left: var(--pl);
    color: #506c7e;
  }

  a {
    text-decoration: none;
  }

  .p {
    margin-right:var(--mr);
    margin-bottom: 50px;
    * {
      transition: .3s ease-in-out;
    }
    &:hover {
      .y {
        color: #9fa9ad;
      }
     .m,.d{
       color: #7e8fb7;
     }
      .k {
        opacity: 0.1;
      }

      h3 {
        color: #eee;
      }

      p {
        color: #1dafee;
      }
    }
  }

  .t {
    font-weight: 100;
    width: var(--tw);
    display: flex;
    text-align: right;
    flex-direction: var(--td);
    position: absolute;
    left: var(--it);
    @include s(){
       top:-10px;
      align-items: center;
      height: 21px;
      .md{
        padding-left: 4px;
        top:-8px
      }
      .y{
        opacity: .8;
      }
       .m,.d{
         font-size: 16px;
       }
      .d:before{
        height: 20px;
      }
    }
  }

  .y {
    margin-bottom: 5px;
    font-size: 12px;
    color: #6a889b;
  }

  .md {
    font-style: italic;
    font-size: 30px;
    span {
      font-family: Symbol, serif;
      color: #4d6a7c;
      & + span {
        &:before {
          left: 0;
          transform: translateY(-50%) rotate(34deg);
          top: 50%;
          width: 1px;
          background: currentColor;
          height: 40px;
          position: absolute;
          display: block;
          content: '';
        }
      }
    }
  }

  .f {
    display: block;
  }

  .c {
    width: 150px;
    padding: 10px;
  }
  .ex{
    width: var(--ex);
  }

  .x, .v, .z, .w, .k {
    border-radius: 7px;
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
  }

  .x {
    left: 150px;
    transform: skewX(var(--skA));
    @include s(){
      left: 170px;
    }
  }

  .v {
    transform-origin: left top;
    transform: skewX(var(--skB));
  }

  .w {
    transform-origin: left bottom;
    transform: skewX(var(--skA));
  }

  .z {
    background: center no-repeat;
    transform-origin: left bottom;
    transform: skewX(var(--skB));
    background-size: cover;
  }

  .k {
    transform-origin: left bottom;
    transform: skewX(var(--skA));
    background: transparentize(#293f4d, .7) url("./img2/0.png");
    backdrop-filter: grayscale(0.9);
  }
</style>