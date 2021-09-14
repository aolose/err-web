<script context="module">
    import marked from "marked";
    import hljs from 'highlight.js/lib/core';
    import javascript from 'highlight.js/lib/languages/javascript';
    import go from 'highlight.js/lib/languages/go';
    import text from 'highlight.js/lib/languages/plaintext';
    import yml from 'highlight.js/lib/languages/yaml';
    import xml from 'highlight.js/lib/languages/xml';
    import scss from 'highlight.js/lib/languages/scss';
    import 'highlight.js/styles/github.css';

    hljs.registerLanguage('js', javascript);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('yml', yml);
    hljs.registerLanguage('scss', scss);
    hljs.registerLanguage('go', go);
    hljs.registerLanguage('txt', text);

    const resTag = '\u0005'
    const resSp = '\u0003'
    const br = {
        name: 'br',
        level: 'block',
        start(src) {
            return src.match(/^\.\.\n?/)?.index;
        }, // Hint to Marked.js to stop and check for a match
        tokenizer(src, tokens) {
            const rule = /^\.\.\n?/;    // Regex for the complete token
            const match = rule.exec(src);
            if (match) {
                const token = {
                    type: 'br',
                    raw: match[0],
                    text: `<br>`,
                    tokens: []
                };
                this.lexer.inline(token.text, token.tokens);
                return token;
            }
        },
        renderer(token) {
            return `<br>`;
        }
    };
    const resRender = {
        name: 'resRender',
        level: 'inline',
        start(src) {
            return src.match(/^!\(\w*?\)\n?\[.*?]/)?.index;
        }, // Hint to Marked.js to stop and check for a match
        tokenizer(src, tokens) {
            const rule = /^!\((\w*?)\)\n?\[(.*?)]/;    // Regex for the complete token
            const match = rule.exec(src);
            if (match) {
                const token = {
                    type: 'resRender',
                    raw: match[0],
                    text: `${match[1]}${resSp}${match[2]}`,
                    tokens: []
                };
                this.lexer.inline(token.text, token.tokens);
                return token;
            }
        },
        renderer(token) {
            return `${resTag}${this.parser.parseInline(token.tokens)}${resTag}`;
        }
    };
    marked.setOptions({
        highlight: function (code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'txt';
            return hljs.highlight(code, {language}).value;
        },
        langPrefix: 'hljs language-',
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    })
    marked.use({extensions: [resRender, br]})
</script>
<script>
    import Res from './resBox.svelte';
    export let value = ''
    function content() {
        return marked(value || '').split(resTag).map(a => a.split(resSp))
    }
</script>
{#key value}
    <div class="md">
        {#each content() as [u, p]}
            {#if p}
                <Res attr={p} src={u}/>
            {:else }
                <div class="p">
                    {@html u}
                </div>
            {/if}
        {/each}
    </div>

{/key}

<style lang="scss">
  .p {
    :global {
      h1, h2, h3, h4, h5, h6 {
        line-height: 2;
        margin: 10px 0;
      }

      ul {
        margin: 0 0 10px 20px;
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

      code, pre {
        background: rgb(37, 40, 55);
        padding: 2px 3px;
        color: #dadada;

        code {
          background: none;
        }
      }

      a {
        text-decoration: underline;
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