/** @type {import('@sveltejs/kit').Config} */
import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
const a={}
let i=10
function uniqCssName(n){
	if(a[n]){
		return a[n]
	}else {
        return  a[n]='_'+((i++).toString(36))
	}
}

const config = {
	compilerOptions:{
		cssHash:({hash, css, name, filename })=>uniqCssName(hash(css))
	},
	preprocess: preprocess(),
	kit: {
		adapter: vercel(),
		target: '#err',
		ssr:true,
		vite: {
			define: {
				'process.env': process.env,
			},
		},
	}
};

export default config;
