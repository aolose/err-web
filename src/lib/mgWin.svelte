<script>
    import SWin from './slideWin.svelte'
    import Pag from './pag.svelte'
    import Sc from './sc.svelte'
    import {query} from './res';
    import Item from './mgItem.svelte';
    import {mgList, post} from './store';
    import Switch from './switch.svelte';
    import {slide} from '$lib/transition';
    import {tip} from '$lib/popMsg.svelte';

    let sc = ''
    let ld = 0
    let cur = 1
    let total = 0
    let sc1 = ''
    let selected = {}
    let on = 0

    function loadList(res) {
        if (res) {
            mgList.set(res.ls || [])
            cur = res.cur || 1
            total = res.total
        }
    }

    let se = 0
    $:{
        se = 0
        Object.keys(selected).forEach(k => {
            if (!selected[k]) delete selected[k]
            else se++
        })
    }

    async function search() {
        loadList(await query('lsMg', 1, {
            id: on ? $post.id : undefined,
            text: sc
        }))
        sc1 = sc
    }

    async function go(x) {
        ld = 0
        cur = x
        loadList(await query('lsMg', x, {
            id: on ? $post.id : undefined,
            text: sc1
        }))
    }

    async function ch() {
        loadList(await query('lsMg', 1, {
            id: on ? $post.id : undefined,
            text: sc
        }))
    }

    function del() {
        const ids = Object.keys(selected)
        tip('Delete selected comment' + (ids.length === 1 ? '' : 's') + '?',
            async function () {
                const r = await query('cmDel', ids)
                if (r === "") {
                    selected = {}
                }
            }, 1)
    }

</script>

<SWin act={5} onAct={()=>go(1)}>
    <div slot='btn' class='btn'>
        <div class='sc'>
            {#if se}
                <i class='can' on:click={()=>selected={}} transition:slide={{horizon:1}}></i>
                <i class='del' on:click={del} transition:slide={{horizon:1}}><span>{se}</span></i>
            {/if}
            <s></s>
            <Sc bind:value={sc} search={search}/>
            {#if ('id' in $post)}
                <Switch bind:on name='Current' change={ch}/>
            {/if}
        </div>
    </div>
    <div class='ls'>
        {#each $mgList as b (b.i)}
            <Item d={b} act={selected[b.i]} click={
                i=> {
                    selected={...selected,[i]:1-(selected[i]||0)}
                }
            }/>
        {/each}
    </div>
    <Pag cur={cur} total={total} url={go}/>
</SWin>
<style lang='scss'>
  .btn {
    display: flex;
    justify-content: flex-end;
  }

  .sc {
    width: 100%;
    display: flex;
    align-items: center;

    s {
      width: 15px;
    }

    i {
      opacity: .9;
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 90% auto;
      position: relative;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }

      span {
        color: red;
        font-style: normal;
        position: absolute;
        font-size: 12px;
        left: 110%;
        top: -3px;
      }
    }
  }

  .ls {
    flex: 1;
    overflow: auto;
    padding: 20px 30px;
  }

  .can {
    background-image: url('./img/can.svg');
  }

  .del {
    background-image: url('./img/del.svg');
  }
</style>
