<script>
    import {onDestroy, onMount} from "svelte";
    import {host, query} from "$lib/res";
    import {browser} from "$app/env";
    import Art from '$lib/_art.svelte'
    import {upLoadInfo, upLoadSeq} from "$lib/store";
    query('loadTags')
    let close = () => {
    }
    onMount(() => {
        if (browser) {
            const taskUpdater = new EventSource(host + "/msg", {withCredentials: true});
            if (taskUpdater) {
                taskUpdater.onerror=e=>{
                    console.log("msg connect err:",e)
                }
                taskUpdater.onmessage = ({data}) => {
                    const [key, p, t, e] = data.split(",")
                    if (t) {
                        upLoadInfo.update(a => {
                            return {
                                ...a, [key]: {
                                    ...(a[key] || {}),
                                    id: key,
                                    type: t,
                                    ext: e,
                                }
                            }
                        })
                    }
                    upLoadSeq.update(u => {
                        if (u[key]) u[key][p] = 1
                        return {...u}
                    })
                }
                close = () => {
                    taskUpdater.onmessage = null;
                    taskUpdater.close()
                }
            }
        }
    })
    onDestroy(() => close())
</script>
<Art/>