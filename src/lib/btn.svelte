<script>
    import {slide} from './transition'
    export let fn
    export let cls
    let a

    function f() {
        if (a || !fn) return
        a = 1
        const v = () => setTimeout(() => a = 0, 1e3);
        const p = fn()
        if (p && p.then) p.then(v).catch(v)
        else {
            a=0
        }
    }
</script>
<i
        transition:slide|local
        class={cls} class:ld={a} on:click={f}>
    <slot/>
</i>

<style>

</style>