<script context="module">
    export function load({error, status}) {
        return {
            props: {
                title: `${status}: ${error.message}`
            }
        };
    }
</script>

<script>
    export let title;
</script>

<div class="er">
    <h1>{title}</h1>
</div>

<style>
    .er {
        white-space: normal;
        word-break: break-word;
        padding: 10px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h1 {
        color: #4e6175;
     font-weight: 100;
    }
</style>