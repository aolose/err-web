/** @type {import('@sveltejs/kit').Config} */
import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
const config = {
	compilerOptions:{
		cssHash:({hash, css, name, filename })=>`_${hash(css)}`
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
