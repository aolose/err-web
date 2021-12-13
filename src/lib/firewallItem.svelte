<script>
    import LD from './loading.svelte'
    import {query} from "$lib/res.js";
    import {errorCatch, isIp, timeFmt, trim} from "$lib/utils.js";
    import {slide} from "$lib/transition.js";

    export let mod = 0
    export let change;
    let editMode = mod
    const dft = {
        ip: '',
        id: 0,
        pa: '',
        ua: '',
        rf: '',
        sv: '',
        st: [0, 0, 0, 0],
        at: 1,
        rk: '',
        ti: ''
    }
    export let d = {...dft}
    export let raw = ""
    let back = {};
    let ld, po, t
    let api
    let ok = 0
    $:{
        try {
            back = JSON.parse(raw)
        } catch (e) {
        }
        d.pa = trim(d.pa)
        d.rf = trim(d.rf)
        d.ua = trim(d.ua)
        d.ip = trim(d.ip)
        d.sv = trim(d.sv)
        d.rk = trim(d.rk)
        ok = (isIp(d.ip) || d.pa || d.ua || d.rf) && d.st.reduce((a, b) => a + b);
        if (editMode) {
            api = ['ediBk', 'addBk'][mod]
            if (po && !t) {
                t = setTimeout(() => {
                    po = ''
                    t = 0
                }, 1e3)
            }
        } else {
            api = ''
        }
    }

    function clear() {
        clearTimeout(t)
        t = 0
        po = ''
    }

    async function add() {
        if (!ok) return;
        clear();
        ld = 'committing...'
        const r = await query(api, d)
        ld = 0
        if (r && r.error) {
            errorCatch(r.error)
        } else {
            if (!mod) {
                d.id = +r
                Object.assign(back, d)
            } else {
                Object.assign(d, dft)
            }
            if ('function' === typeof change) change(d)
            po = 'successfully committed!'
            if (!mod) editMode = 0
        }
    }

    async function del() {
        clear();
        ld = 'committing...'
        const r = await query('delBk', d.ti)
        ld = 0
        if (r && r.error) {
            errorCatch(r.error)
        } else {
            po = 'successfully deleted!'
            debugger
            if ('function' === typeof change) change()
        }
    }

    const edi = () => {
        editMode = 1
        Object.assign(d, back)
    };
    const can = () => {
        Object.assign(d, back)
        editMode = 0
    };
</script>
<div class="fr-rule"
     transition:slide|local
     class:atv={d.at}
     class:t={mod}
     class:edit={editMode}>
    {#if !mod}
        <p>{timeFmt(d.sv, 0)}</p>
    {/if}
    {#if editMode || d.ip}
        <div class="r" transition:slide|local>
            <label>IP</label>
            <input type="text" placeholder="0.0.0.0/0" bind:value={d.ip} disabled={!editMode}/>
        </div>
    {/if}
    {#if editMode || d.pa}
        <div class="r" transition:slide|local>
            <label>Path</label>
            <input type="text" placeholder="path" bind:value={d.pa} disabled={!editMode}/>
        </div>
    {/if}
    {#if editMode || d.ua}
        <div class="r" transition:slide|local>
            <label>UA</label>
            <input type="text" placeholder="user agent" bind:value={d.ua} disabled={!editMode}/>
        </div>
    {/if}
    {#if editMode || d.rf}
        <div class="r" transition:slide|local>
            <label>Refer</label>
            <input type="text" placeholder="user agent" bind:value={d.rf} disabled={!editMode}/>
        </div>
    {/if}
    {#if editMode || d.rk}
        <div class="r" transition:slide|local>
            <label>Remark</label>
            <input type="text" placeholder="user agent" bind:value={d.rk} disabled={!editMode}/>
        </div>
    {/if}
    <div class="rr">
        {#if editMode || d.at}
            <label class:act={d.at} transition:slide|local={{horizon:1}}>
                <span>Active</span>
                <input type="checkbox" bind:checked={d.at} disabled={!editMode}/>
            </label>
        {/if}
        {#if editMode || d.st[0]}
            <label class:act={d.st[0]} class="l1" transition:slide|local={{horizon:1}}>
                <span>Skip Log</span>
                <input type="checkbox" bind:checked={d.st[0]} disabled={!editMode}/>
            </label>
        {/if}
        {#if editMode || d.st[1]}
            <label class:act={d.st[1]} class="l2" transition:slide|local={{horizon:1}}>
                <span>No Login</span>
                <input type="checkbox" bind:checked={d.st[1]} disabled={!editMode}/>
            </label>
        {/if}
        {#if editMode || d.st[2]}
            <label class:act={d.st[2]} class="l3" transition:slide|local={{horizon:1}}>
                <span>No Comments</span>
                <input type="checkbox" bind:checked={d.st[2]} disabled={!editMode}/>
            </label>
        {/if}
        {#if editMode || d.st[3]}
            <label class:act={d.st[3]} class="l4" transition:slide|local={{horizon:1}}>
                <span>No Access</span>
                <input type="checkbox" bind:checked={d.st[3]} disabled={!editMode}/>
            </label>
        {/if}
    </div>

    <div class="bns">
        {#if editMode}
            <button class="cmt" disabled={!ok} on:click={add} transition:slide={{horizon:1}}></button>
        {/if}
        {#if !mod}
            <button class="del" on:click={del} transition:slide={{horizon:1}}></button>
            {#if !editMode}
                <button transition:slide={{horizon:1}} class="edi" on:click={edi}></button>
            {:else }
                <button transition:slide={{horizon:1}} class="can" on:click={can}></button>
            {/if}
        {/if}
    </div>
    <LD act={ld}>{ld}</LD>
</div>

<style lang="scss">
  span {
    white-space: nowrap;
  }

  p {
    color: #e8c94b;
    padding: 1px 10px 10px;
    font-size: 10px;
  }

  .fr-rule {
    min-height: 60px;
    position: relative;
    padding: 10px 80px 10px 10px;
    margin: 5px;
    border-radius: 5px;
    background: #1a2638;
  }

  .t {
    border-radius: 0;
    background: none;
  }

  .r {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    min-height: 30px;
    margin-bottom: 5px;
    padding: 0 15px;

    label {
      width: 60px;
      margin: 5px 0;
    }

    input {
      border-radius: 5px;
      padding: 0 10px;
      height: 24px;
      background: #1a2638;
    }
  }

  .atv:not(.t) {
    background: #0f2642;
  }

  [disabled] {
    pointer-events: none !important;
    opacity: .5;
  }

  .edit {
    &:not(.t) {
      .r {
        input {
          background: black;
        }
      }
    }

    .rr {
      label {
        border: 1px solid currentColor;
      }
    }
  }

  .rr {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    label {
      border: 1px solid transparent;
      transition: .3s ease-in-out;
      overflow: hidden;
      color: #616d80;
      display: flex;
      align-items: center;
      position: relative;
      min-width: 60px;
      padding: 0 10px;
      height: 24px;
      justify-content: center;
      margin: 5px 2px;
      cursor: pointer;
    }

    span {
      color: inherit;
    }

    .act {
      color: #38c907;
      &.l1 {
        color: #EAD2AC;
      }

      &.l2 {
        color: #E6B89C;
      }

      &.l3 {
        color: #60b4ec;
      }

      &.l4 {
        color: #ba94e1;
      }
    }

    input {
      opacity: 0;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: red;
      display: block;
    }
  }

  button {
    margin: 2px;
    position: relative;
    cursor: pointer;
    color: #fff;
    width: 22px;
    height: 22px;
    background: #3e5679 center no-repeat;
    background-size: 40%;
    border-radius: 50%;
  }

  .cmt {
    background-image: url("../lib/img/ok.svg");
    background-color: #447044;
  }

  .can {
    background-image: url("../lib/img/er.svg");
  }

  .edi {
    background-size: 60%;
    background-image: url("../lib/img/edit.svg");
  }

  .del {
    background-image: url("../lib/img/del2.svg");
    background-size: 56%;
    background-color: #943106;
  }

  .bns {
    z-index: 8;
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px 10px;
  }

</style>