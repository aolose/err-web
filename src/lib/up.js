let host, title, cur, total, nm, tp, token
onmessage = async function ({data, target}) {
    if (typeof data === "string") {
        if (data[0] === '_') {
            token = data.substr(1)
        } else [host, title, cur, total, nm, tp] = data.split(',')
    } else {
        const fd = new FormData();
        if (nm) fd.append('name', nm)
        fd.append('title', title)
        fd.append('part', cur)
        fd.append('total', total)
        fd.append('data', data)
        await fetch(host + '/upload', {
            method: 'POST',
            mode: 'cors',
            headers: {
                token: token
            },
            credentials: "include",
            body: fd
        });
        target.postMessage("ok")
    }
}