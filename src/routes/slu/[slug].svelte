<script>
    import { page } from '$app/stores';
    let p_slug = $page.params.slug;
</script>

<h1>{p_slug}</h1>
<a href={`/slu/${p_slug}_x`}>Click me - {p_slug}</a>
<style>
    a,h1{
        display: block;
         margin: 100px;
    }
</style>