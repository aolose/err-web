<script context="module">
    import {res} from "$lib/res";

    export const load = res('post')
</script>
<script>
    import Ctx from "$lib/ctx.svelte";
    import Md from "$lib/md.svelte"
    import DC from "$lib/derection.svelte"
    import {cacheSrvData} from "$lib/res";
    import {onDestroy} from "svelte";
    import {bg} from "$lib/store";
    import {timeFmt} from "$lib/utils";

    export let d;
    export let s;
    $:{
        cacheSrvData(s, d)
        if (d.banner) {
            bg.set(d.banner)
        }
    }
    onDestroy(() => {
        bg.set('')
    })
</script>
{#if d && d.updated}
    <div class="c">
        <Ctx>
            <div class="art">
                <div class="h">
                    <DC color="currentColor">
                        <h1>{d.title}</h1>
                    </DC>
                    <p>{d.desc}</p>
                    <span>{timeFmt(d.updated)}</span>
                </div>
                <div class='ct'>
                    <Md value={d.pubCont}/>
                </div>
            </div>
        </Ctx>
    </div>
{/if}
<style lang="scss">
  .art {
    border-radius: 4px;
    overflow: hidden;
    background: white;
    padding:  40px;
  }

  .c {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    padding: 20px;
    overflow: auto;
  }

  .h {
    color: #3c444f;
    display: flex;
    padding-top: 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 30px 0 100px;

    p {
      color: #19283d;
      margin: 10px 0;
      font-size: 14px;
    }

    span {
      font-size: 12px;
      color: #9a9aa1;
    }
  }

  h1 {
    max-width: 70%;
    color: inherit;
    margin: 14px 0 20px;
    font-weight: 100;
    text-align: center;
  }

  :global {
    p {
      font-size: 15px;
      line-height: 2;
      margin: 10px 0;
    }
  }

  .ct {
  }
</style>