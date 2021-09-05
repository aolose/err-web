<script>
    import {slide} from '$lib/transition'
    import {timeFmt} from "$lib/utils";
    import D from "./debug.svelte"
    import {onDestroy, tick} from "svelte";
    import {extraHis, initEdit} from "$lib/store";

    export let title
    export let type = 0
    export let content
    export let show
    export let ipt
    export let saved
    $:update = saved ? `update at ${timeFmt(saved)}` : ""
    let editHis = {};
    onDestroy(extraHis.subscribe(a=>{
        if(a.length){
            pushHis("content",...a)
        }
    }))
    function initHis() {
        editHis = {
            old: {
                content,
                title,
            },
            next: {
                content: [[content, -1, -1]],
                title: [[title, -1, -1]],
            },
            pre: {
                content: [],
                title: []
            }
        }
    }

    onDestroy(initEdit.subscribe((c) => {
        if (c) initHis()
        else editHis = {}
    }))
    const kt = nm => async function kd(en) {
        const {code, altKey, ctrlKey} = en;
        const {value, selectionEnd: e, selectionStart: s} = this
        if (/arrow(up|down)/i.test(code)) {
            if (altKey) {
                en.preventDefault();
                let ch = 0
                let i0 = value.substring(0, s).split('\n').length - 1
                let i1 = i0 + value.substring(s, e).split('\n').length
                let v = value.split('\n');
                let cr = v.slice(i0, i1)
                if (ctrlKey) {
                    v = v.slice(0, i0).concat(cr, v.slice(i0))
                    if (/down/i.test(code)) {
                        ch = cr.join().length + 1
                    }
                } else {
                    if (/up/i.test(code)) {
                        if (!i0) return;
                        cr = v.slice(i0 - 1, i0)
                        ch = -cr.join().length - 1
                        v = v.slice(0, i0 - 1).concat(v.slice(i0, i1), cr, v.slice(i1))
                    } else {
                        cr = v.slice(i1, i1 + 1)
                        ch = cr.join().length + 1
                        v = v.slice(0, i0).concat(cr, v.slice(i0, i1), v.slice(i1 + 1))
                    }
                }
                content = v.join('\n')
                await tick()
                this.setSelectionRange(s + ch, e + ch)
            }
        } else if (ctrlKey) {
            if (/keyD/i.test(code)) {
                en.preventDefault();
                let v = value.split('\n');
                let i0 = value.substring(0, s).split('\n').length - 1
                let i1 = i0 + value.substring(s, e).split('\n').length
                const ch = v.slice(0, i0).join().length;
                content = v.slice(0, i0).concat(v.slice(i1)).join('\n');
                await tick()
                const n = ch + 1;
                this.setSelectionRange(n, n);
            } else if (/key[yz]/i.test(code)) {
                en.preventDefault()
                const forward = code[3] === 'Y'
                const c = hisBack(nm, forward)
                if (c) {
                    content = c[0]
                    await tick()
                    this.setSelectionRange(c[1], c[2])
                }
            } else if (/keys/i.test(code)) {
                e.preventDefault()
            }
        } else if (/Tab/i.test(code)) {
            en.preventDefault()
            content = value.substring(0, s) + "    " + content.subscribe(e);
            await tick()
            this.setSelectionRange(e + 4, e + 4)
        }
    }

    const kp = nm => async function ku() {
        pushHis(nm, this.value, this.selectionStart, this.selectionEnd);
    }

    function pushHis(nm, sv, s, e) {
        const {old, pre, next} = editHis;
        if (sv !== old[nm]) {
            next[nm].push([sv, s, e]);
            pre[nm].length = 0;
            old[nm] = sv;
        }
    }

    function hisBack(nm, forward) {
        forward = +forward
        const {old, pre: {[nm]: pre}, next: {[nm]: next}} = editHis;
        if ((forward && !pre.length) || (!forward && next.length < 2)) return;
        const v = [next, pre][forward].pop();
        if (v) {
            [pre, next][forward].push(v);
        }
        const cur = next[next.length - 1]
        old[nm] = cur[0];
        return cur
    }
</script>
<D d={editHis}/>
<div class="edit">
    {#if show}
        <slot name="title"/>
        {#if type === 0}
            <input
                    transition:slide={{horizon:1}}
                    bind:value={title}/>
        {/if}
        {#if type === 1}
            <textarea class="h"
                      on:keydown={kt('title')}
                      on:keyup={kp('title')}
                      transition:slide={{horizon:1}}
                      bind:value={title}></textarea>
        {/if}
        <slot name="content"/>
        <textarea
                on:keydown={kt('content')}
                on:keyup={kp('content')}
                transition:slide={{horizon:1}}
                bind:value={content} bind:this={ipt}></textarea>
    {:else }
    {/if}
    <div class="sv">{update}</div>
</div>

<style lang="scss">
  .edit {
    max-width: 600px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;

    textarea {
      flex: 1;
      overflow: auto;
    }

    input {
      height: 40px;
      margin-bottom: 10px;
    }

    input, textarea {
      color: #8db2e9;
      line-height: 1.5;
      border: 1px solid #1d314a;
      border-radius: 6px;
      background: rgba(36, 46, 65, .4);
      padding: 10px;
      resize: none;
      display: block;
    }

    .h {
      flex: 0.5;
      margin-bottom: 20px;
    }
  }

</style>