<script>
    export let fn
    export let cls
    let a

    function f() {
        if (a || !fn) return
        a = 1
        const v = () => setTimeout(() => a = 0, 1e3);
        const p = fn()
        if (p && p.then) p.then(v).catch(v)
    }
</script>
<i class={cls} class:ld={a} on:click={f}>
    <slot/>
</i>

<style>
    @keyframes ss {
        0%, 50%, 100% {
            opacity: 8;
        }
        25%, 75% {
            opacity: .3;
        }
    }

    .ld {
        transition: .3s ease-in-out;
        pointer-events: none;
        animation: ss .3s linear infinite;
    }
</style>