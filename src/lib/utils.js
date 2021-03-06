import wrk from './up?url';
import SparkMD5 from 'spark-md5'
import {host} from './res'
import imageCompression from 'browser-image-compression';
import {isLogin, upLoadInfo, upLoadSeq} from "$lib/store";
import {goto} from "$app/navigation";
import {token} from "$lib/store.js";


export const logout = () => {
    fetch(host+'/ot', {
        credentials: "include",
        mode: 'cors',
        method: 'GET',
    }).then(res => {
        if (res.ok) {
            token.set('');
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
            if (/image/i.test(f.type) && /!gif$/i.test(f.type)) {
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
                uploader(key, i, t, f.slice(chunkSize * i, chunkSize * (i + 1)), nm, tp, token)
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

export const timeFmt = function (a,b=1) {
    if (!a) return ""
    const o = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }
    if(b)Object.assign(o,{
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    })
    const formatter = new Intl.DateTimeFormat('zh-cn', o);
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
    const x = Math.floor(Math.log2(n) / 10)
    const v = [
        ['B', 1],
        ['KB', 1 << 10],
        ['MB', 1 << 20],
        ['GB', 1 << 30]
    ][x] || ['B', 1]
    return parseFloat((n / [v[1]]).toFixed(2)) + v[0]
}


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
    if (history && window.name === 'err') history.go(-1)
    else goto('/posts/1', {replaceState: true})
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

export const rndAr=a=>{
    return a[Math.floor(Math.random()*a.length)]
}

export function randNm(){
    const b=[
           '??????','????????','???????????',
            '???','???','???','???','???','???','???','???','??????','??????',
            '??????????????','??????','?????????','??????','??????','???????????',
            '?????????','??????','??????','??????','??????','??????','???????????','??????',
            '??????','??????','??????','??????','??????','??????','??????','??????',
            '??????','??????','??????','??????','??????','??????','??????','???????????',
            '??????','??????','??????','??????','??????','??????','??????','??????','??????'
        ]
    const c=[
        '??????','??????','??????','??????','??????','??????','??????',
        '??????','??????','??????','??????','??????','???','???','???',
        '??????','??????','??????','??????','??????','??????','??????',
        '??????','??????','??????','??????','??????','??????','??????','??????',
        '??????','??????','?????????','??????','??????','??????','??????',
        '??????','?????????','??????','??????','??????','??????','??????',
        '??????','??????','??????','??????','??????','??????','?????????',
        '??????','??????','??????','??????','??????','??????','??????',
        '??????','??????','??????','??????','??????','??????','??????'
    ]


    return localStorage.nm = rndAr(b)+rndAr(c)
}

export  function redirectPage1({url: pathname}){
    return {
        status:302,
        redirect: pathname+"/1"
    }
}

const colors =[
    '#9CAFB7',
    '#E6B89C',
    '#274C77',
    '#EAD2AC',
    '#6096BA',
    '#B7B7A4',
    '#8B8C89',
    '#014F86',
    '#89B0AE',
    '#2C7DA0',
    '#A5A58D',
    '#5C677D',
    '#4281A4'
]

export const getColor=(a)=>{
    a=Math.floor(a);
    return  colors[a%colors.length]
}

export function isIp(ip){
    const [a,b] = ip.split('/')
    if(b&&!/^\d+$/.test(b))return false
    return(/(^::1$)|(^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$)|(^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$)/.test(a))
}

export function bubbles(btn, click) {
    const p = btn.offsetParent;
    if (btn.ani) return;
    btn.ani = true;
    const sl = getComputedStyle(btn);
    if (sl.position !== 'absolute' && sl.position !== 'relative') {
        btn.style.position = 'relative';
    }
    let cv = btn.cv;
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    if (!btn.cv) {
        const t = btn.offsetTop - h / 2;
        const l = btn.offsetLeft - w / 2 + 8;
        cv = btn.cv = document.createElement('canvas');
        const s = cv.style;
        s.width = w * 2 + 'px';
        s.height = h * 2 + 'px';
        s.position = 'absolute';
        s.left = l + 'px';
        s.top = t + 'px';
        s.cursor = 'point';
        s.pointerEvents = 'none';
        if(click)cv.onclick = e => {
            e.stopPropagation();
            e.preventDefault();
            click()
        };
        cv.width = w * 2;
        cv.height = h * 2;
    }
    p.appendChild(cv);
    const ctx = cv.getContext('2d');
    const bs = [];
    const max = 6;

    function create(x, i) {
        const idx = i % 2;
        bs.push({
            x: [1.5 * w, 0.5 * w][idx],
            y: [0.5 * h, 1.5 * h][idx],
            r: 5,
            s: 0,
            v: 2 + Math.random() * 2,
            q: (0.5 - Math.random()) * Math.PI,
            i: i
        });
    }

    function draw(o) {
        ctx.beginPath();
        const i = [1, -1][o.i % 2];
        const x = o.s * Math.cos(o.q);
        const y = o.s * Math.sin(o.q);
        ctx.arc(o.x + x * i, o.y - y * i, o.r, 0, Math.PI * 2);
        ctx.fillStyle = sl.backgroundColor;
        ctx.fill();
        ctx.closePath();
    }

    function next(o) {
        o.r *= 0.9;
        o.v *= 0.95;
        o.s += o.v;
        if ((o.r * o.v <= 0.08) && o.i === max) {
            ctx.clearRect(0, 0, cv.width, cv.height);
            p.removeChild(cv);
            btn.cv = null;
            btn.ani = false;
        } else draw(o);
    }

    const run = (fn, m = 0, i = 0, t = 1) => {
        if (!m || i <= m * t) {
            if (!m || i % t === 0) {
                if (fn(0, i / t)) return;
            }
            requestAnimationFrame(() => run(fn, m, i + 1, t));
        }
    };
    run(create, max, 0, 2);
    run(() => {
        if (!document.body.contains(cv)) return;
        ctx.clearRect(0, 0, cv.width, cv.height);
        bs.forEach(next);
    });
}


export const upDownScroller =(fn)=>{
    let e = 0, t;
    let stop = 0;
    let a =0
    let tm
    return function (x) {
        const tr = x.target;
        if (tr === t) {
            const v = t.scrollTop - e
            if (Math.abs(v) > 10) {
                const z = v > 0 ? 1 : 0
                if (z !== a && !stop) {
                    a = z
                    fn(z)
                    stop = 1
                    tm = setTimeout(() => stop = 0, 300)
                }
                e = t.scrollTop;
            }
        } else {
            t = tr
            e = t.scrollTop
        }
    }
}
