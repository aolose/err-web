<script context="module">
    import {res} from "$lib/res";

    export const load = res('tags');
</script>
<script>
    import Ctx from "$lib/ctx.svelte";
    import Ph from '../../lib/hd.svelte'
    import Canvas from '../../lib/whi/ctx.svelte'
    import {bubbles} from "$lib/utils.js";

    export let d = []
    const cols = [
        '#1d3f72',
        '#5699d2',
        '#efcf89',
        '#71c2cc',
        '#4996a2',
        '#785f54',
        '#855435',
    ];
</script>
<svelte:head>
    <title>Err - tags</title>
</svelte:head>
<Canvas type={2}/>
<div class="o">
    <Ph>Tags</Ph>
    <div class="v">
        <div class="ls">
            {#each d as tag,i}
                <a
                        on:mouseenter={e=>bubbles(e.target)}
                        href={`/tag/${tag.name}/1`}
                        style={`background:${cols[i%cols.length]}`}
                >
                    <span>{tag.name}
                    </span></a>
            {/each}
        </div>
    </div>

</div>
<style lang="scss">
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
    width: 90%;
    margin: 0 auto;
  }

  .ls {
    flex: 1;
    max-width: 800px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
  }
</style>