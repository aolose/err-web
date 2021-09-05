<script>
    import Bg from "$lib/empty.svelte";
    import {slide} from '$lib/transition'
    import {timeFmt} from "$lib/utils";
    import {onDestroy, tick} from "svelte";

    export let title
    export let type = 0
    export let content
    export let show
    export let ipt
    export let re
    export let saved
    const bf = {
        content,
        title,
    }
    $:update = saved ? `update at ${timeFmt(saved)}` : ""
    let history = [];
    let cur = -1;
    if (re) {
        onDestroy(re.subscribe(() => {
            cur = -1
            history = []
            bf.content = content
            bf.title = title
        }))
    }
    const kt = nm => async function kd(en) {
        let sv = 0
        const {code, altKey, ctrlKey} = en;
        let {value, selectionEnd: e, selectionStart: s} = this
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
                sv = [content, s, e]
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
                sv = [content, s, e]
                content = v.slice(0, i0).concat(v.slice(i1)).join('\n');
                await tick()
                const n = ch + 1;
                this.setSelectionRange(n, n);
            } else if (/key[yz]/i.test(code)) {
                const nx = +(code[3] === 'Y');
                const c = history[cur + nx];
                if (c !== undefined) {
                    cur = cur + (nx ? 1 : -1)
                    if (c) {
                        en.preventDefault();
                        content = c[0]
                        await tick()
                        this.setSelectionRange(c[1], c[2])
                        return
                    }
                } else {
                    en.preventDefault()
                }
            } else if (/keys/i.test(code)) {
                e.preventDefault()
            }
        } else if (/Tab/i.test(code)) {
            en.preventDefault()
            sv = [content, s, e]
            content = value.substring(0, s) + "    " + content.subscribe(e);
            await tick()
            this.setSelectionRange(e + 4, e + 4)
        }
        if ((bf[nm] !== this.value && !ctrlKey) || sv) {
            bf[nm] = this.value
            history.push(sv);
            cur++;
            history.length = cur + 1
        }
    }
</script>
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
                      transition:slide={{horizon:1}}
                      bind:value={title}></textarea>
        {/if}
        <slot name="content"/>
        <textarea
                on:keydown={kt('content')}
                transition:slide={{horizon:1}}
                bind:value={content} bind:this={ipt}></textarea>
    {:else }
        <Bg type={type}/>
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