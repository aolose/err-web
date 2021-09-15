/** @type {import('@sveltejs/kit').Config} */
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';

import fs from 'fs'

let nm = {}
const cssCacheFile = "./cssCache.json"
try {
    nm = JSON.parse(fs.readFileSync(cssCacheFile).toString())
} catch (e) {
}
let i = 10, t
const b = {}

function uniqCssName(n) {
    if (nm[n]) {
        return b[n] = nm[n]
    } else {
        clearTimeout(t)
        t = setTimeout(function () {
            fs.writeFileSync(cssCacheFile, JSON.stringify(b))
        }, 300)
        return b[n] = '_' + ((i++).toString(36))
    }
}

const config = {
    compilerOptions: {
        cssHash: ({hash, css, name, filename}) => uniqCssName(hash(css))
    },
    preprocess: preprocess(),
    kit: {
        target: '#err',
        adapter: adapter({
            precompress: true,
        }),
        ssr: true,
        vite: {
            define: {
                'process.env': process.env,
            },
        },
    }
};

export default config;
