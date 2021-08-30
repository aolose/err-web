<script>
    import {host, query} from "$lib/res";
    import {fileSize, fileType} from "$lib/utils";

    export let id
    export let nm = ''
    export let tp = ''
    export let sz = 0
    export let act
    export let click
    const colors = [
        '#a66565', '#c49b67',
        '#74a468', '#58c7d2',
        '#539dda', '#435bbd',
        '#4e4175', '#ac56b0'
    ]
    let t = -1;
    const col = (v = "") => `color:${colors[v.split('').map(
        a => a.charCodeAt(0))
        .reduce(((a, b) => a + b), 0) % 8]}`

    function ch() {
        const v = nm.replace(/^\s+|\s+$/, '')
        clearTimeout(t)
        t = setTimeout(() => {
            query('rnRes', {
                id, name: v
            })
        }, 2e3)
    }
</script>
<div class="f" on:click={click} class:act={act}>
    {#if /svg|image/.test(tp)}
        <div class="b" style={`background-image:url('${host}/r/${id}')`}></div>
    {:else }
        <div class="b" style={col(tp)}>{fileType(tp).toUpperCase()}</div>
    {/if}
    <div class="z">{fileSize(sz)}</div>
    <input bind:value={nm} on:change={ch}/>
</div>
<style lang="scss">
  .f {
    cursor: pointer;
    width: 160px;
    background: #2c3a56;
    display: inline-block;
    margin: 3px;
    border-radius: 4px;
    transition: .2s ease-in-out;
    border: 1px solid transparent;

    &:hover {
      box-shadow: rgba(36, 173, 255, .1) 0 3px 18px;
      transform: translate3d(0, -2px, 0);
    }
  }

  input {
    font-size: 12px;
    text-align: center;
    height: 30px;
    overflow: hidden;
    display: block;
    width: 100%;
    padding: 0 10px;
    text-overflow: ellipsis;
  }

  .z {
    opacity: .5;
    color: #ffffff;
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 10px;
    background: transparentize(#0e1832, .3);
    padding: 2px 3px;
    border-radius: 3px;
  }

  .b {
    border-radius: 4px;
    width: 100%;
    height: 100px;
    background: #0e1832 center no-repeat;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 24px;
  }

  .act {
    border-color: #61beff;
  }
</style>