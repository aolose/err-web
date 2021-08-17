<script>import {session} from '$app/stores'
</script>
<nav>
    <a href="/">Home</a>
    <a href="/posts">Posts</a>
    <a href="/tag">Tags</a>
    <a href={$session.token?'/admin': '/login'}>Admin</a>
</nav>

<slot>

</slot>