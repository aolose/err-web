let host, title, cur, total, nm, tp
onmessage = async function ({data,target}) {
    if (typeof data === "string") {
        [host, title, cur, total,nm,tp] = data.split(',')
        console.log('name',nm)
    } else {
        const fd = new FormData();
        if (nm) fd.append('name', nm)
        if (tp) fd.append('type', tp)
        fd.append('title', title)
        fd.append('part', cur)
        fd.append('total', total)
        fd.append('data', data)
        await fetch(host + '/upload', {
            method: 'POST',
            credentials: 'same-origin',
            body: fd
        });
        target.postMessage("ok")
    }
}