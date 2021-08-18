/** @type {import('@sveltejs/kit').Config} */
import preprocess from 'svelte-preprocess';
const config = {
	preprocess: preprocess(),
	kit: {
		target: '#svelte',
		ssr:true,
	}
};

export default config;
