<script context="module">
    import {res} from "$lib/res";

    export const load = res('sys')

</script>
<script>
    import SWin from './slideWin.svelte'
    import Fade from './fadeCpm.svelte'
    import Tabs from './tabs.svelte'
    import {trim} from "$lib/utils";
    import {query} from "$lib/res";
    import LD from '$lib/loading.svelte'

    let usr=''
    let pwd=''
    let ld = 0
    let selected = {}
    let cur = 0
    $:{
        usr = trim(usr)
        pwd = trim(pwd)
    }
    async function  sPwd(){
        ld=1
        await query('pwd',[usr,pwd])
        setTimeout(()=>{
            ld=0
        },1e3)
    }
</script>

<SWin act={4}>
    <div slot="btn">
        <Tabs item={[
        'System',
        'Links',
        'Tags',
    ]} bind:cur={cur}/>
    </div>
    <div class="p">
        <Fade act={cur===0}>
            <div class="r">
                <label>Account</label>
                <div class="r0">
                    <input type="text" placeholder="username" bind:value={usr}/>
                    <input placeholder="password" bind:value={pwd}/>
                    <div on:click={sPwd} class="btn" class:dis={usr.length<2||pwd.length<2}>Update</div>
                    <LD text="updating" act={ld}/>
                </div>
            </div>
        </Fade>
    </div>
</SWin>
<style lang="scss">
  .dis{
    pointer-events: none;
    opacity: .5;
  }
  .btn{
    cursor: pointer;
    color: #3c6a93;
    padding:  5px 20px;
    border-radius: 40px;
    margin: 10px 0;
    display: inline-flex;
    border: 1px solid currentColor;
    transition: .3s ease-in-out;
    &:hover{
      background: #1c93ff;
      color: #000;
    }
  }
  .r {
    padding:  36px 20px 30px;
    border-bottom: dashed 1px #1c334a;
    border-top: dashed 1px #1c334a;
    width: 90%;
    margin: 10px auto 20px;
  }
  .r0{
    max-width: 300px;
  }
  input {
    &::placeholder{
      color: #4c7db2;
    }
    color: #99b0d0;
    width: 80%;
    border-radius: 4px;
    padding: 0 15px;
    margin:  10px 0;
    height: 40px;
    border: 1px solid #294157;
    background: #1e2c3d;
  }

  label {
    padding: 0 10px;
    position: absolute;
    background: #121622;
    left: 20px;
    top: -15px;
    font-size: 18px;
    color: #30455b;
    display: block;
  }

  .p {
    left: 20px;
    right: 10px;
    top: 10px;
    bottom: 0;
    position: absolute;
  }
</style>