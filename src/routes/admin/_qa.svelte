<script>
    import Ck from '$lib/checkbox.svelte'
    import {fade} from "svelte/transition";
    import Hd from '$lib/listHead.svelte'
    let hi
    let sc
    function search(){}
    function add(){}
</script>
<div class="qa" transition:fade>
    <div class="ls">
        <Hd
                bind:value={sc}
                search={search}
                add={add}
                hi={hi}
        />
    </div>
    <div class="ne">
        <div class="r">
            <label>Question</label>
            <input/>
        </div>
        <div class="r">
            <label>Answer</label>
            <textarea></textarea>
        </div>
    </div>
    <div class="ts">
        <div class="opt">
            <Ck>Login Protect</Ck>
            <Ck>Comment Protect</Ck>
        </div>
        <div class="st">

        </div>
        <div class="q">
            <label>Q?</label>
            <p>
                sadsad sadsadwada ?
            </p>
        </div>
        <div class="q">
            <label>A:</label>
            <input/>
        </div>
    </div>
</div>
<style lang="scss">
  .qa {
    position: absolute;
    left: 0;
    right: 60px;
    top: 0;
    bottom: 50px;
    display: flex;
  }

  .ne {
    flex: 1;
    background: #00bbff;
  }

  .ls {
    width: 300px;
  }

  .ts {
    background: #f8ca9e;
    width: 300px;
  }
</style>
