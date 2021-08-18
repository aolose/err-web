<script>
    import marked from 'marked'

    export let value = ''
    $:out = marked(value)
</script>

<div class="md">
    {@html out}
</div>

<style lang="scss">
  .md {
    :global {
      h1,h2,h3,h4,h5,h6{
        line-height: 2;
        margin: 10px 0;
      }
      ul{
        margin:0 0 10px 20px;
      }
      h1 {
        font-size: 26px
      }

      h2 {
        font-size: 23px
      }

      h3 {
        font-size: 20px
      }

      h4 {
        font-size: 17px
      }

      h5 {
        font-size: 14px
      }

      h6 {
        font-size: 12px
      }

      thead {
        background: #8db2e9;

        th {
          color: #1d2a3e;
        }
      }

      td, th {
        padding: 3px 5px;
        border: 1px solid #5d799d;
      }

      table {
        margin: 10px 0;
        border-collapse: collapse;
      }

      img {
        max-width: 90%;
      }

      code, pre {
        background: rgba(255, 255, 255, .05);
        padding: 2px 3px;
      }

      pre {
        margin: 10px 0;
        border-radius: 3px;
        padding: 10px;
      }

      hr {
        margin: 10px 0;
        border-top: 1px solid currentColor;
        color: rgba(255, 255, 255, .5);
      }

      li {
        margin-top: 5px;
        list-style: none;
      }
    }
  }

</style>