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
    console.trace(e)
    alert(e)
}