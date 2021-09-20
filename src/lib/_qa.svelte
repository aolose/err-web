<script>
    import {fade} from "svelte/transition";
    import { qaList, qState} from "./store";
    import {qa} from "./store";
    import {query} from "$lib/res";
    import {onDestroy} from "svelte";
     let last=""
    let curQ=-1
    $:{
        const newPa = {}
        const q = $qa

        function syncParam(p) {
            const k = p.replace(/[{}]/g, '')
            newPa[k] = params[k] || [3, 9]
        }

        const {params = {}, a = "", q: b = ""} = q;
        (a.match(/\{\w+\}/g) || []).forEach(syncParam);
        (b.match(/\{\w+\}/g) || []).forEach(syncParam);
        Object.values(newPa).forEach(o => {
            o[0] = +((o[0] + '').replace(/[^0-9]/g, ''));
            o[1] = +((o[1] + '').replace(/[^0-9]/g, ''));
        })
        q.params = newPa;
        qa.set({...q})
    }

    let ld=0
    async function del() {
        if(ld)return
        const {id} = $qa
        if(id){
            ld=1
            await query('delQ', id)
            setTimeout(()=>ld=0,1e3)
        }
        qa.set({})
        qaList.update(c=>{
            const idx = c.findIndex(a=>a.id===id)
            if(idx!==-1){
                c=c.splice(idx,1)
                return c.slice()
            }
        })
    }
    let tm=-1;
    function tesQ() {
        clearTimeout(tm)
        tm=setTimeout(function (){
            curQ= $qa.id
            query('tesQ', $qa)
        },1e3)
    }

    function svQ() {
       clearTimeout(tm)
        tm=setTimeout(function (){
            curQ= $qa.id
            query('svQ', $qa)
        },2e3)
    }
    function ku(){
        qa.update(a=>a)
    }
    onDestroy(qa.subscribe(async q => {
        const idx = $qaList.findIndex(a=>a.id===q.id)
        if(idx!==-1){
            $qaList[idx]={...q}
            qaList.set($qaList.slice())
        }
        const l =JSON.stringify(q)
        if (q.q&&q.a&&last!==l) {
            if(q.saved||!q.id){
                if(curQ===q.id)return;
                if (/{\w+}|[a-z]+\.|[()]/i.test(q.a)) {
                    tesQ()
                } else {
                    qState.set({q: q.q, e: "",a:q.a, pending: 0})
                }
            }else {
                last=l;
                svQ()
            }
        }
    }))
    onDestroy(()=>{
        qa.set({})
        qaList.set([])
        qState.init()
    })
</script>
<div class="qa" transition:fade>


</div>

