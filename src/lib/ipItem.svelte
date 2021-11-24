<script>

    import {timeFmt} from "$lib/utils";
     import {slide} from "$lib/transition"
    export let d = {}
    export let act
    export let click
    const {
        k, i, s, f, p, u
    } = d;
</script>
<div class="ip" class:act  in:slide|local>
    <div class="m" on:click={()=>{click&&click(k)}}>
        <div class="i"><label>IP: </label><span>{i}</span></div>
        <div class="a"><label>City: </label><span>{f}</span></div>
        <div class="d"><span>{timeFmt(s)||'0000'}</span></div>
    </div>
    <div class="p"><span>{p}</span></div>
    {#if (act)}
        <div  transition:slide={{duration:200}} class="u"><p>{u}</p></div>
    {/if}
</div>
<style lang="scss">
  .ip {
    opacity: .9;
    transition: .1s ease-in-out;
    border-radius: 5px;
    background: transparentize(#243957,.8);
    margin: 10px;
    &:hover{
      opacity: 1;
      background: transparentize(#17293d,.6);
    }
  }

  .m {
    cursor: pointer;
    background: inherit;
    padding: 10px;
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
  }

  label, p, span {
    color: inherit;
  }
  label{
    opacity: .6;
  }

  .i {
    color: #ff821c;
    width: 120px;
  }
  .d{
    color: #567929;
  }
  .a {
    color: #33bbef;
    flex: 1;
    min-width: 150px;
  }
 .p{
   color: #798a9f;
   padding: 10px 10px 0;
 }
  p {
    color: #537288;
      padding: 10px;
  }
</style>