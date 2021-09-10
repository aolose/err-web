<script context="module">
</script>
<script>
    let a = 0
    import Link from './link.svelte'
</script>
<div class="e" on:click={()=>a=1-a} class:act={a}>
    <i class="e0"></i>
    <i class="e1"></i>
    <i class="e2"></i>
</div>
<nav class:act={a}>
    <div class="a">
        {#if a}
            <Link href="/" >HOME</Link>
            <Link href="/posts/1">POST</Link>
            <Link href="/">TAGS</Link>
            <Link href="/admin">ADMIN</Link>
        {/if}

    </div>
</nav>
<style lang="scss">
  nav {
    transition: .3s ease-in-out;
    transform: translate3d(0, -100%, 0);
    height: 30px;
    display: flex;
    align-items: center;
    position: fixed;
    padding: 20px 20px 20px 40px;
    background: #141d25;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0 5px 5px 0;
  }

  .a {
    display: flex;
  }

  .e {
    background: #1f2a3f;
    z-index: 5;
    cursor: pointer;
    opacity: .7;
    position: fixed;
    left: 5px;
    top: 20px;
    transform: translate3d(0, -50%, 0);
    height: 36px;
    width: 36px;
    color: #ffffff;

    i {
      transition: .3s ease-in-out;
      color: inherit;
      left: 9px;
      position: absolute;
      display: block;
      width: 50%;
      height: 1px;
      background: currentColor;
      transform: translate3d(0, 0, 0);
    }

    .e0 {
      top: 12px;
    }

    .e1 {
      top: 18px;
    }

    .e2 {
      top: 24px;
    }
  }

  nav.act {
    transform: translate3d(0, 0, 0);
  }

  .act.e {
    opacity: 1;

    .e0 {
      transform: translate3d(1px, 1px, 0) rotate(34deg) scaleX(.9);
    }

    .e1 {
      transform: translate3d(0, 0, 0) scale(0);
    }

    .e2 {
      transform: translate3d(1px, -1px, 0) rotate(-34deg) scaleX(.9);
    }
  }
</style>