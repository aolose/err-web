<script>
    import {logout} from "$lib/utils";
    import {tip} from "./popMsg.svelte";
</script>
<button class="out" on:click={()=>{
    tip("Confirm to sign out?",logout,1)
}}></button>
<style lang="scss">
  .out {
    border-radius: 50%;
    cursor: pointer;
    height: 40px;
    width: 40px;
    background: no-repeat center url("./img/out.svg");
    background-size: 50%;
    border: 2px solid transparent;
    transition: .2s ease-in-out;
    opacity: .8;
    top: 3px;
    margin: 10px;

    &:hover {
      opacity: 1;
      border-color: #1076d2;
      background-color: #161d2f;
      box-shadow: inset rgba(84, 84, 84, 0.4) 0 10px 30px -8px,
      rgba(253, 95, 95, 0.8) 0 4px 10px -8px;
    }
  }
</style>