import wrk from './up?url';
import SparkMD5 from 'spark-md5'
import {host} from './res'
import imageCompression from 'browser-image-compression';
import {isLogin, upLoadInfo, upLoadSeq} from "$lib/store";
import {goto} from '$app/navigation'

export const logout = () => {
    fetch('/logout', {
        credentials: "include",
        method: 'POST',
    }).then(res => {
        if (res.ok) {
            isLogin.set(0)
        }
    }).catch(e => {
        console.error(e)
    })
}

const md5 = async file => {
    return new Promise(resolve => {
        const chunkSize = 8097152,
            spark = new SparkMD5.ArrayBuffer();
        const fr = new FileReader()
        fr.onload = e => {
            spark.append(e.target.result);
            resolve(spark.end())
        }
        fr.readAsArrayBuffer(file.slice(0, chunkSize))
    })
}

const tasks = {}
const maxThreads = 5

function runTask() {
    let n = maxThreads
    const ts = Object.keys(tasks).map(k => {
        const t = tasks[k].filter(a => a)
        if (!t.length) delete tasks[k]
        return t
    }).reduce((a, b) => a.concat(b), [])
    for (const t of ts) {
        if (!n) return
        if (typeof t === "function") {
            t()
            n--
        } else if (t.stop) {
            n--
        }
    }
}

export async function upload(token) {
    const chunkSize = 2 << 20;
    const fs = [].slice.call(this.files || [])
    const uu = {}
    if (fs.length) {
        this.value = '';
        for (let f of fs) {
            const tp = f.type
            const nm = f.name
            const key = await md5(f)
            upLoadSeq.update(u => {
                return {...u, [key]: [0]}
            })
            let url
            if (/image/i.test(f.type)) {
                f = await imageCompression(f, {
                    useWebWorker: true,
                    initialQuality: 1
                })
            }

            if (/image|svg/.test(f.type)) {
                url = URL.createObjectURL(f)
            }
            upLoadInfo.update(a => {
                return {
                    ...a, [key]: {
                        type: tp,
                        ext: nm.replace(/.*?\./g, ''),
                        url,
                        name: nm,
                        size: f.size
                    }
                }
            })
            const s = f.size;
            const t = Math.ceil(s / chunkSize)
            uu[key] = []
            for (let i = 0; i < t; i++) {
                uu[key][i] = 0
                uploader(key, i, t, f.slice(chunkSize * i, chunkSize * (i + 1)), nm, tp,token)
            }
        }
    }
    upLoadSeq.update(u => {
        return {...u, ...uu}
    })
    runTask()
}

export const uploader = function (k, p, t, f, nm, tp, token) {
    const tk = (tasks[k] = tasks[k] || [])
    tk[p] = () => {
        tk[p] = {
            stop: () => {
                wk.postMessage(0)
            }
        }
        const wk = new Worker(wrk)
        wk.onmessage = ({data}) => {
            wk.terminate()
            if (/^fail/.test(data)) {
                //todo

            } else if (data === 'ok') {
                tk[p] = 0;
                setTimeout(runTask, 30)
            } else if (/\d+/.test(data)) {
                tk[p] = data
            } else {
                tk[p] = f
            }
        }
        const v = [host, k, p, t]
        if (!p) v.push(nm, tp)
        wk.postMessage("_" + token)
        wk.postMessage(v.join())
        wk.postMessage(f)
    }
}

export const timeFmt = function (a) {
    if (!a) return ""
    const formatter = new Intl.DateTimeFormat('zh-cn', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(a * 1e3)
}


export const errorCatch = e => {
    if (e) {
        console.trace(e)
        alert(e)
    }
}

export const fileSize = n => {
    if (!n) return '0B';
    const x = Math.floor(Math.log10(Math.log2(n)))
    const v = [
        ['B', 1],
        ['KB', 1 << 10],
        ['MB', 1 << 20],
        ['GB', 1 << 30]
    ][x] || ['B', 1]
    return parseFloat((n / [v[1]]).toFixed(2)) + v[0]
}

const colors = [
    '#a66565', '#c49b67',
    '#74a468', '#58c7d2',
    '#539dda', '#435bbd',
    '#4e4175', '#ac56b0'
]

export const col = (v = "") => `color:${colors[v.split('').map(
    a => a.charCodeAt(0))
    .reduce(((a, b) => a + b), 0) % 8]}`


export const getArtDesc = post => {
    return post.desc || (post.content || '')
        .replace(/\n+/g, '')
        .replace(/```.*?```/g, '')
        .replace(/!?\(.*\)/g, '')
        .replace(/!?\[.*]/g, '')
        .substr(0, 128)
}
export const resUrl = (a, b = '') => a && (`${host}/r/${a}${b}`) || ''


export function goBack(root = '/posts/1') {
    const ref = document.referrer;
    goto(ref.length > 0 ? ref : root)
}

export function trim(a) {
    if (/^\s|\s$/.test(a)) {
        return a.replace(/^\s+|\s+$/, '')
    }
    return a
}

export function enc(usr = '', pwd = '', key = '', ans = '') {
    return '_' + btoa([usr, pwd, key, ans].map(a => btoa(a)).join("\u0001"))
}