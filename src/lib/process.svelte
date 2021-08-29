<script>
    import {upLoadSeq} from "$lib/store";
    import {onDestroy} from "svelte";

    export let id=""
    let p=0
    onDestroy(upLoadSeq.subscribe(u=>{
        const v = u[id]
        if(v){
            p=Math.floor(v.reduce((a,b)=>a+b,0)*100/v.length)
        }
    }))
</script>
<div class="t">
    {p}%
</div>
<style lang="scss">
  .t {
    height: 60px;
    border-radius: 8px;
    margin: 10px 0;
    background: #242848;
  }
</style>