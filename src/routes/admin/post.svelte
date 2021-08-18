<script>

    import List from '$lib/postLs.svelte'
    import Md from '$lib/md.svelte'
    import PostMu from '$lib/postMenu.svelte'
    import {list} from "$lib/store";

    let post

    function reset() {
        post = {
            title: '',
            content: '',
        }
    }

    reset();
    $:{
        if (post.id) list.update(a => {
            const i = a.findIndex(({id}) => id === post.id)
            if (i !== -1) a[i] = post;
            return [...a]
        })
    }

    $:content = post.content
    $:title = post.title

</script>

<nav>
    <List onSelect={(d)=>{ post=d }}/>
</nav>
<div class="ma">
    <div class="write">
        <div class="edit">
            <input bind:value={post.title}/>
            <textarea bind:value={post.content}></textarea>
        </div>
        <div class="prev">
            <div>
                <h1>{title}</h1>
                <Md value={post.content}/>
            </div>
        </div>
    </div>
    <div class="res">

    </div>
</div>
<PostMu/>
<style lang="scss">

  nav {
    width: 240px;
    display: block;
    height: 100%;
  }

  .write {
    padding: 10px;
    flex: 1;
    display: flex;
  }

  .prev {
    border-radius: 10px;
    flex: 1;
    max-width: 600px;
    margin-left: 30px;
    margin-right: 60px;
    overflow: hidden;

    & > div {
      overflow: auto;
      word-break: break-all;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 20px;
      background: #171c2f;

      & > :global div {
        background: linear-gradient(#171c2f 24px, #104169 25px) repeat;
        background-size: 1px 25px;
      }
    }


    :global {
      p {
        line-height: 24px;
      }
    }
  }

  .edit {
    max-width: 600px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;

    textarea {
      flex: 1;
      overflow: auto;
    }

    input {
      height: 40px;
      margin-bottom: 10px;
    }

    input, textarea {
      color: #8db2e9;
      line-height: 1.5;
      border: 1px solid #1d314a;
      border-radius: 6px;
      background: rgba(36, 46, 65, .4);
      padding: 10px;
      resize: none;
      display: block;
    }
  }

  .ma {
    padding: 10px 0 40px 10px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

</style>