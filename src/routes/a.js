function sortedSquares_base(arr){
    return arr.map(a=>a*a).sort((a,b)=>a>b?1:-1)
}

function sortedSquares_office(nums) {
    const ans = [];
    for (let l = 0, r = nums.length - 1, p = r; l <= r; p--) {
        const sl = nums[l] ** 2,
            sr = nums[r] ** 2;
        ans[p] = sl > sr ? (l++, sl) : (r--, sr);
    }
    return ans;
};

function sortedSquares_modify(arr) {
    if (!arr.length) return arr;
    if (arr.length === 1) return [arr * arr];
    const sq = []
    let cur = arr.length - 1
    let al = 0, ar = cur;
    while (cur > -1) {
        let a = arr[al]
        if (a > 0) {
            for (let i = ar; i >= al; i--) {
                sq[cur--] = arr[i] ** 2
            }
        } else {
            let b = arr[ar]
            if (b < 0) {
                for (let i = al; i <= ar; i++) {
                    sq[cur--] = arr[i] ** 2
                }
            } else {
                sq[cur--] = -a > b ? (al++, a * a) : (ar--, b * b)
            }
        }
    }
    return sq
}


function randArr(length) {
    const step = 20
    let n = -Math.ceil(Math.random() * length * step)
    const arr = [n]
    for (let i = 0; i < length; i++) {
        arr.push(n += Math.ceil(step))
    }
    return arr
}

function buildTest(n,length,...fn){
    console.log(
        ` test times:\t\t${n}\n array length:\t\t${length}\n`
    )
    const test = []
    const result=[]
    for(let i=0;i<n;i++){
        let r
         test.push(r=randArr(length))
        result.push(r.map(a=>a*a).sort((a,b)=>a-b>0?1:-1).join())
    }

    fn.forEach(a=>{
        console.time(a.name)
        for(let i=0,l=test.length;i<l;i++){
            const r =test[i]
            const ru = result[i]
            const target = a(r).join()
            console.assert(ru===target,`${a.name}\n params:\t[${r.join()}]\n result:\t[${target}]\n should:\t[${ru}]\n`)
        }
        console.timeEnd(a.name)
    })
}

buildTest(10,100000,sortedSquares_base,sortedSquares_modify,sortedSquares_office)
