<script>
    import Ck from '$lib/checkbox.svelte'
    import List from '$lib/list.svelte'
    import Qa from '$lib/qCard.svelte'
    import {fade} from "svelte/transition";
    import {qaList} from "$lib/store";
    import {qa} from "$lib/store";
    import Edit from '$lib/edit.svelte'
</script>
<div class="qa" transition:fade>
    <nav>
        <List
                icon={1}
                api={'qa'}
                cpm={Qa}
                listStore={qaList}
                curStore={qa}
                baseItem={{
                    id:0,
                    q:"write your question",
                    a:"write your code / answer"
                }}
        />
    </nav>
    <div class="ma">
        <Edit
                type={1}
                saved={$qa.saved}
                show={'id' in $qa}
                bind:title={$qa.q}
                bind:content={$qa.a}
        />
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
    bottom: 0;
    display: flex;
  }

  .ma {
    padding: 10px 0 40px 10px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  nav {
    width: 250px;
    display: block;
    height: 100%;
    background: #121622;
    padding: 0 11px 5px 6px;
  }

  .ts {
    background: #f8ca9e;
    width: 300px;
  }
</style>
