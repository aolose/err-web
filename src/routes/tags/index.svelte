<script context="module">
    import {res} from "$lib/res";

    export const load = res('tags');
</script>
<script>
    import Ph from '../../lib/hd.svelte'
    import Canvas from '../../lib/whi/ctx.svelte'
    import {bubbles, getColor} from "$lib/utils.js";
    import UpDownScroll from "$lib/UpDownScroll.svelte";
    let a =0
    export let d = []
</script>
<svelte:head>
    <title>Err - tags</title>
</svelte:head>
<UpDownScroll bind:down={a}/>
<Canvas type={2}/>
<div class="o">
    <Ph bind:shrink={a}>Tags</Ph>
    <div class="v" class:s={a}>
    <div class="ls">
        {#each d as tag,i}
            <a
                    on:mouseenter={e=>bubbles(e.target)}
                    href={`/tag/${tag.name}/1`}
                    style={`background:${getColor(i)}`}
            >
                    <span>{tag.name}
                    </span></a>
        {/each}
    </div>
    </div>

</div>
<style lang="scss">
  @import "../../lib/break";
  .o {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .cc {
    padding: 60px 0 20px;
    position: relative;
    border-bottom: 1px solid #eee;
    box-shadow: rgba(0, 0, 0, .05) 0 10px 10px -5px;
  }

  h1 {
    margin: 0 auto;
    width: 90%;
    color: #000;
    display: flex;
    align-items: center;
    font-weight: 100;

    span {
      color: inherit;

      &:first-letter {
        color: #223bec;
      }
    }
  }

  a {
    display: block;
    min-width: 100px;
    text-align: center;
    font-size: 14px;
    margin: 10px 15px;
    border-radius: 3px;
    position: relative;

    span {
      display: block;
      color: #fff;
      border-radius: inherit;
      padding: 7px 10px;
      transition: .2s ease-in-out;
    }

    &:hover {
      span {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }

  .v {
    position: absolute;
    top: 30px;
    bottom: 10px;
    left: 50%;
    width: 90%;
    transform: translate3d(-50%,0,0);
    overflow: auto;
    padding: 100px 0 0;
    transition: .3s ease-in-out;
    clip-path: inset(80px 0px 10px 0 round 8px);
  }

  .ls {
    flex: 1;
    max-width: 800px;
    align-content: flex-start;
    display: flex;
    flex-wrap: wrap;
  }
  .s{
    @include s(){
      clip-path: inset(10px 0px 10px 0 round 8px);
    }
  }
</style>
