<script>
    export let href
    import {slide} from './transition'
</script>

<a transition:slide|local={{horizon:1}}
   href={href}>
    <slot/>
</a>

<style lang="scss">

  a {
    color: #9bafbe;
    padding: 10px 15px;
    display: block;

    &:hover {
      color: #fff;
    }
  }
</style>