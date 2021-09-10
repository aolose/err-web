/** @type {import('@sveltejs/kit').Config} */
import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: vercel(),
		target: '#svelte',
		ssr:true,
		vite: {
			define: {
				'process.env': process.env,
			},
		},
	}
};

export default config;
