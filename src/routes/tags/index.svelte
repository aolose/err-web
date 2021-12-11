<script context="module">
    import {res} from "$lib/res";
    export const load = res('tags');
</script>
<script>
    import Ctx from "$lib/ctx.svelte";
    import Ph from '../../lib/hd.svelte'
    import Canvas from '../../lib/whi/ctx.svelte'
    export let d = []
    const cols =  [
        '#1d3f72',
        '#5699d2',
        '#d4a5f3',
        '#71c2cc',
        '#4996a2',
        '#785471',
        '#eacd8d',
    ];
</script>
<svelte:head>
    <title>Err - tags</title>
</svelte:head>
<Canvas type={2}/>
<div class="o">
    <Ph>Tags</Ph>
    <div class="ls">
        <Ctx>
            {#each d as tag,i}
                <a href={`/tag/${tag.name}/1`}
                   style={`background:${cols[i%cols.length]}`}
                ><span>{tag.name}</span></a>
            {/each}
        </Ctx>
    </div>

</div>
<style lang="scss">
  .o{
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
  .ls {

  }

  h1 {
    margin: 0 auto;
    width: 90%;
    color: #000;
    display: flex;
    align-items: center;
    font-weight: 100;
    span{
      color: inherit;
      &:first-letter{
        color: #223bec;
      }
    }
  }

  a {
    font-size: 14px;
    margin: 5px;
    border-radius: 3px;
   position: relative;
    span{
      display: block;
      color: #fff;
      border-radius: inherit;
      padding: 10px;
      transition: .2s ease-in-out;
    }
    &:hover {
      span{
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }

  .ls {
    flex: 1;
    overflow: hidden;
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
</style>