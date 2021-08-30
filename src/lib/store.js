import {writable} from 'svelte/store';
export const artList = writable([]);
export const resList = writable([]);
export const msg = writable(new Date().toLocaleString());
export const post = writable({})
export const winAct = writable(0)
export const tags = writable([])
export const ipt = writable({})
export const upLoadSeq = writable({})
export const upLoadInfo = writable({})
resList.add = function (re){
    resList.update(u=>{
        const idx = u.findIndex(a => a.id === re.id)
        if (idx !== -1) {
            u.splice(idx, 1)
        }
        return [re].concat(u)
    })
}
tags.add = ne => {
    if(!ne)return tags;
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
    if(!od)return tags;
    tags.update(a => {
        const l = od.split(' ')
        for (let i = a.length - 1; i > -1; i--) {
            if (l.indexOf(a[i]) !== -1) {

            }
        }
    })
    return tags
}