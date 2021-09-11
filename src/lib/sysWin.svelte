<script context="module">
    import {res} from "$lib/res";
    export const load = res('sys')

</script>
<script>
    import SWin from './slideWin.svelte'
    import Fade from './fadeCpm.svelte'
    import Tabs from './tabs.svelte'
     let usr
     let pwd
    let ld = 0
    let selected={}
    let cur=0
</script>

<SWin act={4}>
    <div slot="btn">
        <Tabs item={[
        'account',
        'Links',
        'Tags',
        'blank3',
    ]} bind:cur={cur}/>
    </div>
    <div class="p">
        <Fade act={cur===0}>
            <label>Change username/password</label>
            <div class="r">
                <input placeholder="username"/>
                <input placeholder="password"/>
            </div>
        </Fade>
    </div>
</SWin>
<style lang="scss">

</style>