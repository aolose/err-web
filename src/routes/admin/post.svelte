<script>
    import marked from 'marked'
    import List from '$lib/postLs.svelte'

    let post

    function reset() {
        post = {
            title: '',
            content: '',
        }
    }

    reset();
    $:content = post.content
    $:title = post.title
    $:out = marked(content)
</script>

<nav>
    <List onSelect={(d)=>{
       post=d;
    }}/>
</nav>
<div class="ma">
    <div class="opt">
        <button>publish</button>
        <button>Un publish</button>
        <button>Save Draft</button>
        <button>Delete</button>
        <button>Preview</button>
        <button>Res</button>
    </div>
    <div class="write">
        <div class="edit">
            <input bind:value={post.title}/>
            <textarea bind:value={post.content}></textarea>
        </div>
        <div class="prev">
            <h3>{title}</h3>
            {@html out}
        </div>
    </div>
    <div class="res">

    </div>
</div>
<style lang="scss">
  nav {
    width: 200px;
    display: block;
    height: 100%;
    background: #ddd;
  }

  .write {
    padding: 10px;
    flex: 1;
    display: flex;
  }

  .prev {
    padding: 20px;
  }

  .edit {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;

    textarea {
      flex: 1;
    }

    input {
      height: 30px;
      margin-bottom: 5px;
    }

    input, textarea {
      padding: 10px;
      resize: none;
      display: block;
    }
  }

  .ma {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>