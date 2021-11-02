<script>
    export let name = 'switch'
    export let on = 0
    export let change
</script>
<div class='swi' class:on={on} on:click={()=>{
    on=1-on
    if(change){
        change()
    }
}}>
    {name}
    <div class="wp">
        <div class="f">{name}</div>
        <div class="o">{name}</div>
        <i></i>
    </div>
</div>
<style lang="scss">
  $h: 28px;
  .swi {
    color: transparent;
    padding: 0 $h;
    margin-left: 15px;
    height: $h;
    position: relative;
    border-radius: 100px;
    overflow: hidden;
  }

  i {
    transition: .3s ease-in-out;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: $h;
    height: inherit;
    background: #344464;
    border-radius: 50%;
  }

  .on {
    i {
      background: #365698;
    }

    .wp {
      transform: translateX(-50%);
      left: $h / 2;
    }
  }

  .wp {
    align-items: center;
    cursor: pointer;
    transition: .3s ease-in-out;
    display: flex;
    position: absolute;
    left: -$h / 2;
    top: 0;
    height: inherit;
    width: 200%;
    background: #0b141a;
  }

  .o, .f {
    font-size: 13px;
    border-radius: 4px;
    align-items: center;
    display: flex;
    justify-content: center;
    width: 50%;
    height: 80%;
    padding: 0 $h;
    background: #23233a;
    color: #619db9;
    text-decoration: line-through;
  }

  .o {
    text-decoration: none;
    background: #132d52;
    color: #82a6ff;
  }
</style>
