<script>
    import {onDestroy, onMount} from "svelte";
    import {host, query} from "$lib/res";
    import {browser} from "$app/env";
    import Art from './_art.svelte'
    import Qa from './_qa.svelte'
    import {isLogin, upLoadInfo, upLoadSeq} from "$lib/store";

    query('loadTags')
    let close = () => {
    }
    onMount(() => {
        if (browser) {
            const taskUpdater = new EventSource(host + "/msg", {withCredentials: true});
            if (taskUpdater) {
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
    let Cpm = Art
    onDestroy(isLogin.subscribe(a => {
        switch (a) {
            case 1:
                Cpm=Art
                break;
            case 2:
                Cpm=Qa
                break
        }
    }))
</script>
<svelte:component this={Cpm}/>
<style lang="scss">


</style>