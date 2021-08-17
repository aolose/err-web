<script context="module">
    import {res} from "$lib/res";
    export const load = res('post')
</script>
<script>
    export let d;
</script>
<h1>{d.title}</h1>
<h2>{d.author.name}</h2>
<p>{d.content}</p>