import {writable} from 'svelte/store';

export const bannerMod =  writable(0);
export const artList = writable([]);
export const bkList = writable([]);
export const qaList = writable([]);
export const resList = writable([]);
export const tips = writable([]);
export const msg = writable("");
export const initEdit = writable(0);
export const extraHis = writable([]);
export const post = writable({})
export const qa = writable({})
export const mk = writable({})
export const qState = writable({})
qState.init = ()=>{
    qState.update(()=>{
        return {
            pending:0,
            a:"",
            q:"question preview",
            e:""
        }
    })
}
qState.init()
export const winAct = writable(0)
export const bg = writable('')
export const tags = writable([])
export const isLogin = writable(0)
export const upLoadSeq = writable({})
export const upLoadInfo = writable({})
const sq = [];
let inf = {};
upLoadInfo.subscribe(v => {
    inf = v
})
let t = -1;
resList.add = function (re) {
    if (re && sq.find(a => a.id === re)) return;
    sq.push({
        ...inf[re],
        id:re
    })
    clearTimeout(t)
    t = setTimeout(function () {
        resList.update(u => {
            const o = sq.slice()
            sq.length = 0
            u.forEach(v => {
                if (o.find(a => a.id === v.id)) return;
                o.push(v)
            })
            return o
        })
    }, 600)
}
tags.add = ne => {
    if (!ne) return tags;
    tags.update(a => {
        ne.split(' ').forEach(b => {
            if (a.indexOf(b === -1)) {
                a.push(b)
            }
        })
        a.sort((c, d) => {
            return c > d ? 1 : -1
        })
        return [...a]
    })
    return tags
}
tags.del = od => {
    if (!od) return tags;
    tags.update(a => {
        const l = od.split(' ')
        for (let i = a.length - 1; i > -1; i--) {
            if (l.indexOf(a[i]) !== -1) {

            }
        }
    })
    return tags
}

export function openWin(i) {
    return ()=>winAct.update(a=>{
        return a===i ? 0 : i
    })
}