import wrk from './up?url';
import SparkMD5 from 'spark-md5'
import {host} from './res'
import imageCompression from 'browser-image-compression';
import {isLogin, tok, upLoadInfo, upLoadSeq} from "$lib/store";
import {goto} from "$app/navigation";

export const logout = () => {
    fetch(host+'/ot', {
        credentials: "include",
        mode: 'cors',
        method: 'GET',
    }).then(res => {
        if (res.ok) {
            isLogin.set(0)
            tok.set('')
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
    const x = Math.floor(Math.log2(n) / 10)
    const v = [
        ['B', 1],
        ['KB', 1 << 10],
        ['MB', 1 << 20],
        ['GB', 1 << 30]
    ][x] || ['B', 1]
    return parseFloat((n / [v[1]]).toFixed(2)) + v[0]
}

const colors = [
    '#ff684d', '#ffca68',
    '#9aff67', '#ab00ff',
    '#b7e1ff', '#77ffec',
    '#a583ff', '#ff6161'
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
           '孤寡','大卫·','史密斯·',
            '周','张','赵','李','孙','吴','王','周','雷斯','胖子',
            '尼古拉斯·','哈利','马克思','吃瓜','呆萌','唐纳德·',
            '奥斯卡','扶她','秀吉','钢板','泥人','光头','乔布斯·','漏气',
            '胸毛','葛优','司马','欧阳','电动','芭比','阿里','充气',
            '心碎','亢奋','猛男','迷路','路痴','花痴','机器','爱德华·',
            '玻璃','钻石','自恋','愤青','忧郁','金刚','红烧','油炸','清蒸'
        ]
    const c=[
        '小狗','小猫','小鸡','小鸭','小猪','大佬','班长',
        '师傅','八戒','大妈','大爷','二狗','六','二','三',
        '蛋蛋','星星','菩萨','妖精','老师','狗狗','喵喵',
        '奶奶','子龙','蒙德','玄烨','玄奘','斯基','全蛋','佩恩',
        '树人','市民','奥特曼','同志','怪兽','达鸭','泰龙',
        '彦祖','斯坦森','美丽','真人','道士','尼姑','蛤蛤',
        '大大','童鞋','卡丘','少女','灯泡','肉丝','辣子鸡',
        '肥肠','凤爪','鸡丁','花鸡','豆腐','跳墙','上树',
        '佩奇','宝宝','老板','呆毛','奶茶','娃娃','火腿'
    ]


    return localStorage.nm = rndAr(b)+rndAr(c)
}

export  function redirectPage1({page:{path}}){
    return {
        status:302,
        redirect:path+"/1"
    }
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