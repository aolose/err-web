<script>
    import List from '$lib/list.svelte'
    import Qa from '$lib/qCard.svelte'
    import {fade} from "svelte/transition";
    import {qaList} from "$lib/store";
    import {qa} from "$lib/store";
    import Edit from '$lib/edit.svelte'
    let params=[]
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
                    act:0,
                    params:'',
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
        >
            <div  class="r" slot="title">
                <h3 transition:fade>Question:</h3>
                <div class="tl">
                    <i class="del"></i>
                    <i class="sav"></i>
                    <i class="act"></i>
                    <i class="dis"></i>
                </div>
            </div>
            <div class="r" slot="content">
                <h3 transition:fade>Answer:</h3>
            </div>
        </Edit>
        <div class="pms">
            {#each params as p,i}
                <div>
                    <label>i</label>
                    <div>
                        <span>Min</span>
                        <span>Max</span>
                    </div>
                    <div>
                        <input type="tel" bind:value={p.min}>
                        <input type="tel" bind:value={p.max}/>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
<style lang="scss">
  .tl{
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  i{
    background: red;
    height: 20px;
    width: 20px;
    margin-left: 10px;
  }
  h3{
    font-size: 20px;
    font-weight: 200;
    color: #233e5d;
    line-height: 1;
    font-style: italic;
  }
  .r{
    height: 60px;
    display: flex;
    align-items: center;
  }
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
</style>
