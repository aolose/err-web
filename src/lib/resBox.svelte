<script>
    import {col, fileSize} from "./utils";
    import {host} from './res'

    export let src = ""
    export let attr = ""
    let url = ''
    let tp = '', nm, sz, w, h;
    $:{
        url = `${host}/r/${src}`
        attr.split('|').forEach(a => {
            const [, v0, , v1] = a.match(/^(\d+%?)?(x(\d+%?))?$/) || []
            if (v0 || v1) {
                w = v0
                h = v1
                return
            }
            const [k, v] = a.split(':')
            switch (k) {
                case 't':
                    tp = v
                    break
                case 'n':
                    nm = v
                    break
                case 's':
                    sz = fileSize(+v)
                    break
            }
        })
    }

</script>

{#if /jpg|png|webp|svg|bmp|gif/i.test(tp)}
    <img alt={nm} src={url} width={w} height={h}>
{:else }
    {#if /mp3|aac|ogg/i.test(tp)}
        <audio controls>
            <source src={url} type={'audio/'+tp}>
        </audio>
    {:else }
        {#if /mp4|flv/i.test(tp)}
            <video controls width={w} height={h}>
                <source src={url} type={'video/'+tp}>
            </video>
        {:else }
            <div class="dw">
                <div class="t" style={`${col(tp)}`}>
                    {(tp || '').toUpperCase()}
                </div>
                <div class="v">
                    <p class="h" title={`'${nm}'`}>{nm}</p>
                    <p class="s">{sz}</p>
                </div>
                <a download={`'${nm}'`} href={`${host}/r/${src}`}>
                </a>
            </div>
        {/if}
    {/if}
{/if}
<style lang="scss">
  .t {
    width: 40px;
    height: 40px;
    background: transparentize(#1d1e1f,.3);
    font-weight: bold;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px 5px 3px 3px;
    border-radius: 3px;
  }

  .h {
    color: #050a13;
    font-size: 13px;
  }

  .s {
    font-size: 10px;
    color: #3e3f4f;
  }

  .v {
    padding-right: 4px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    flex: 1;
    overflow: hidden;

    p {
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .dw {
    margin: 10px 3px;
    align-items: center;
    width: 170px;
    border-radius: 4px;
    box-shadow: rgba(14, 24, 50, 0.51) 0 2px 4px;
    background: linear-gradient(#f1efef, #cbcdd0);
    display: flex;
    text-decoration: none;

    a {
      transition: .2s ease-in-out;
      opacity: .5;
      cursor: pointer;
      height: 40px;
      background: url("./img/dw.svg") center no-repeat;
      background-size: 100% auto;
      width: 30px;
      display: block;

      &:hover {
        opacity: 1;
      }


    }
  }
</style>