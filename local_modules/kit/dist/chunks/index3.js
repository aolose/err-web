import fs__default from 'fs';
import path__default from 'path';
import { p as print_config_conflicts, a as SVELTE_KIT, d as copy_assets, f as posixify, e as get_aliases, r as resolve_entry, l as load_template, b as runtime, m as mkdirp, h as rimraf } from '../cli.js';
import { d as deep_merge, a as create_app, c as create_manifest_data } from './index2.js';
import { g as generate_manifest } from './index4.js';
import vite from 'vite';
import { s } from './misc.js';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import 'sade';
import 'child_process';
import 'net';
import 'url';
import 'os';

/**
 * @param {{
 *   cwd: string;
 *   assets_base: string;
 *   config: import('types/config').ValidatedConfig
 *   manifest_data: import('types/internal').ManifestData
 *   output_dir: string;
 *   service_worker_entry_file: string | null;
 * }} options
 * @param {import('vite').Manifest} client_manifest
 */
async function build_service_worker(
	{ cwd, assets_base, config, manifest_data, output_dir, service_worker_entry_file },
	client_manifest
) {
	// TODO add any assets referenced in template .html file, e.g. favicon?
	const app_files = new Set();
	for (const key in client_manifest) {
		const { file, css } = client_manifest[key];
		app_files.add(file);
		if (css) {
			css.forEach((file) => {
				app_files.add(file);
			});
		}
	}

	const service_worker = `${cwd}/${SVELTE_KIT}/generated/service-worker.js`;

	fs__default.writeFileSync(
		service_worker,
		`
			export const timestamp = ${Date.now()};

			export const build = [
				${Array.from(app_files)
					.map((file) => `${s(`${config.kit.paths.base}/${config.kit.appDir}/${file}`)}`)
					.join(',\n\t\t\t\t')}
			];

			export const files = [
				${manifest_data.assets
					.map((asset) => `${s(`${config.kit.paths.base}/${asset.file}`)}`)
					.join(',\n\t\t\t\t')}
			];
		`
			.replace(/^\t{3}/gm, '')
			.trim()
	);

	/** @type {[any, string[]]} */
	const [merged_config, conflicts] = deep_merge(config.kit.vite(), {
		configFile: false,
		root: cwd,
		base: assets_base,
		build: {
			lib: {
				entry: service_worker_entry_file,
				name: 'app',
				formats: ['es']
			},
			rollupOptions: {
				output: {
					entryFileNames: 'service-worker.js'
				}
			},
			outDir: `${output_dir}/client`,
			emptyOutDir: false
		},
		resolve: {
			alias: {
				'$service-worker': service_worker,
				$lib: config.kit.files.lib
			}
		}
	});

	print_config_conflicts(conflicts, 'kit.vite.', 'build_service_worker');

	await vite.build(merged_config);
}

/** @param {import('vite').UserConfig} config */
async function create_build(config) {
	const { output } = /** @type {import('rollup').RollupOutput} */ (await vite.build(config));

	const chunks = /** @type {import('rollup').OutputChunk[]} */ (
		output.filter((output) => output.type === 'chunk')
	);

	const assets = /** @type {import('rollup').OutputAsset[]} */ (
		output.filter((output) => output.type === 'asset')
	);

	return { chunks, assets };
}

/**
 * @param {string} file
 * @param {import('vite').Manifest} manifest
 * @param {Set<string>} css
 * @param {Set<string>} js
 * @returns
 */
function find_deps(file, manifest, js, css) {
	const chunk = manifest[file];

	if (js.has(chunk.file)) return;
	js.add(chunk.file);

	if (chunk.css) {
		chunk.css.forEach((file) => css.add(file));
	}

	if (chunk.imports) {
		chunk.imports.forEach((file) => find_deps(file, manifest, js, css));
	}
}

/**
 * @param {{
 *   cwd: string;
 *   assets_base: string;
 *   config: import('types/config').ValidatedConfig
 *   manifest_data: import('types/internal').ManifestData
 *   output_dir: string;
 *   client_entry_file: string;
 *   service_worker_entry_file: string | null;
 *   service_worker_register: boolean;
 * }} options
 */
async function build_client({
	cwd,
	assets_base,
	config,
	manifest_data,
	output_dir,
	client_entry_file
}) {
	create_app({
		manifest_data,
		output: `${SVELTE_KIT}/generated`,
		cwd
	});

	copy_assets(`${SVELTE_KIT}/runtime`);

	process.env.VITE_SVELTEKIT_AMP = config.kit.amp ? 'true' : '';

	const client_out_dir = `${output_dir}/client/${config.kit.appDir}`;

	/** @type {Record<string, string>} */
	const input = {
		start: path__default.resolve(cwd, client_entry_file)
	};

	// This step is optional — Vite/Rollup will create the necessary chunks
	// for everything regardless — but it means that entry chunks reflect
	// their location in the source code, which is helpful for debugging
	manifest_data.components.forEach((file) => {
		const resolved = path__default.resolve(cwd, file);
		const relative = path__default.relative(config.kit.files.routes, resolved);

		const name = relative.startsWith('..')
			? path__default.basename(file)
			: posixify(path__default.join('pages', relative));
		input[name] = resolved;
	});

	/** @type {[any, string[]]} */
	const [merged_config, conflicts] = deep_merge(config.kit.vite(), {
		configFile: false,
		root: cwd,
		base: assets_base,
		build: {
			cssCodeSplit: true,
			manifest: true,
			outDir: client_out_dir,
			polyfillDynamicImport: false,
			rollupOptions: {
				input,
				output: {
					entryFileNames: '[name]-[hash].js',
					chunkFileNames: 'chunks/[name]-[hash].js',
					assetFileNames: 'assets/[name]-[hash][extname]'
				},
				preserveEntrySignatures: 'strict'
			}
		},
		resolve: {
			alias: get_aliases(config)
		},
		plugins: [
			svelte({
				extensions: config.extensions,
				emitCss: !config.kit.amp,
				compilerOptions: {
					hydratable: !!config.kit.browser.hydrate
				}
			})
		]
	});

	print_config_conflicts(conflicts, 'kit.vite.', 'build_client');

	const { chunks, assets } = await create_build(merged_config);

	/** @type {import('vite').Manifest} */
	const vite_manifest = JSON.parse(fs__default.readFileSync(`${client_out_dir}/manifest.json`, 'utf-8'));

	const entry = posixify(client_entry_file);
	const entry_js = new Set();
	const entry_css = new Set();
	find_deps(entry, vite_manifest, entry_js, entry_css);

	return {
		assets,
		chunks,
		entry: {
			file: vite_manifest[entry].file,
			js: Array.from(entry_js),
			css: Array.from(entry_css)
		},
		vite_manifest
	};
}

/**
 * @param {{
 *   hooks: string;
 *   config: import('types/config').ValidatedConfig;
 *   has_service_worker: boolean;
 *   template: string;
 * }} opts
 * @returns
 */
const app_template = ({ config, hooks, has_service_worker, template }) => `
import root from '__GENERATED__/root.svelte';
import { respond } from '${runtime}/server/index.js';
import { set_paths, assets, base } from '${runtime}/paths.js';
import { set_prerendering } from '${runtime}/env.js';
import * as user_hooks from ${s(hooks)};

const template = ({ head, body, assets, nonce }) => ${s(template)
	.replace('%svelte.head%', '" + head + "')
	.replace('%svelte.body%', '" + body + "')
	.replace(/%svelte\.assets%/g, '" + assets + "')
	.replace(/%svelte\.nonce%/g, '" + nonce + "')};

let read = null;

set_paths(${s(config.kit.paths)});

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ event, resolve }) => resolve(event)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

let default_protocol = 'https';

// allow paths to be globally overridden
// in svelte-kit preview and in prerendering
export function override(settings) {
	default_protocol = settings.protocol || default_protocol;
	set_paths(settings.paths);
	set_prerendering(settings.prerendering);
	read = settings.read;
}

export class App {
	constructor(manifest) {
		const hooks = get_hooks(user_hooks);

		this.options = {
			amp: ${config.kit.amp},
			csp: ${s(config.kit.csp)},
			dev: false,
			floc: ${config.kit.floc},
			get_stack: error => String(error), // for security
			handle_error: (error, event) => {
				hooks.handleError({
					error,
					event,

					// TODO remove for 1.0
					// @ts-expect-error
					get request() {
						throw new Error('request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details');
					}
				});
				error.stack = this.options.get_stack(error);
			},
			hooks,
			hydrate: ${s(config.kit.browser.hydrate)},
			manifest,
			method_override: ${s(config.kit.methodOverride)},
			paths: { base, assets },
			prefix: assets + '/${config.kit.appDir}/',
			prerender: ${config.kit.prerender.enabled},
			read,
			root,
			service_worker: ${has_service_worker ? "base + '/service-worker.js'" : 'null'},
			router: ${s(config.kit.browser.router)},
			target: ${s(config.kit.target)},
			template,
			template_contains_nonce: ${template.includes('%svelte.nonce%')},
			trailing_slash: ${s(config.kit.trailingSlash)}
		};
	}

	render(request, options = {}) {
		if (!(request instanceof Request)) {
			throw new Error('The first argument to app.render must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details');
		}

		return respond(request, this.options, options);
	}
}
`;

/**
 * @param {{
 *   cwd: string;
 *   assets_base: string;
 *   config: import('types/config').ValidatedConfig
 *   manifest_data: import('types/internal').ManifestData
 *   build_dir: string;
 *   output_dir: string;
 *   service_worker_entry_file: string | null;
 *   service_worker_register: boolean;
 * }} options
 * @param {{ vite_manifest: import('vite').Manifest, assets: import('rollup').OutputAsset[] }} client
 */
async function build_server(
	{
		cwd,
		assets_base,
		config,
		manifest_data,
		build_dir,
		output_dir,
		service_worker_entry_file,
		service_worker_register
	},
	client
) {
	let hooks_file = resolve_entry(config.kit.files.hooks);
	if (!hooks_file || !fs__default.existsSync(hooks_file)) {
		hooks_file = path__default.resolve(cwd, `${SVELTE_KIT}/build/hooks.js`);
		fs__default.writeFileSync(hooks_file, '');
	}

	/** @type {Record<string, string>} */
	const input = {
		app: `${build_dir}/app.js`
	};

	// add entry points for every endpoint...
	manifest_data.routes.forEach((route) => {
		if (route.type === 'endpoint') {
			const resolved = path__default.resolve(cwd, route.file);
			const relative = path__default.relative(config.kit.files.routes, resolved);
			const name = posixify(path__default.join('entries/endpoints', relative.replace(/\.js$/, '')));
			input[name] = resolved;
		}
	});

	// ...and every component used by pages
	manifest_data.components.forEach((file) => {
		const resolved = path__default.resolve(cwd, file);
		const relative = path__default.relative(config.kit.files.routes, resolved);

		const name = relative.startsWith('..')
			? posixify(path__default.join('entries/pages', path__default.basename(file)))
			: posixify(path__default.join('entries/pages', relative));
		input[name] = resolved;
	});

	/** @type {(file: string) => string} */
	const app_relative = (file) => {
		const relative_file = path__default.relative(build_dir, path__default.resolve(cwd, file));
		return relative_file[0] === '.' ? relative_file : `./${relative_file}`;
	};

	fs__default.writeFileSync(
		input.app,
		app_template({
			config,
			hooks: app_relative(hooks_file),
			has_service_worker: service_worker_register && !!service_worker_entry_file,
			template: load_template(cwd, config)
		})
	);

	/** @type {import('vite').UserConfig} */
	const vite_config = config.kit.vite();

	const default_config = {
		build: {
			target: 'es2020'
		}
	};

	// don't warn on overriding defaults
	const [modified_vite_config] = deep_merge(default_config, vite_config);

	/** @type {[any, string[]]} */
	const [merged_config, conflicts] = deep_merge(modified_vite_config, {
		configFile: false,
		root: cwd,
		base: assets_base,
		build: {
			ssr: true,
			outDir: `${output_dir}/server`,
			manifest: true,
			polyfillDynamicImport: false,
			rollupOptions: {
				input,
				output: {
					format: 'esm',
					entryFileNames: '[name].js',
					chunkFileNames: 'chunks/[name]-[hash].js',
					assetFileNames: 'assets/[name]-[hash][extname]'
				},
				preserveEntrySignatures: 'strict'
			}
		},
		plugins: [
			svelte({
				extensions: config.extensions,
				compilerOptions: {
					hydratable: !!config.kit.browser.hydrate
				}
			})
		],
		resolve: {
			alias: get_aliases(config)
		}
	});

	print_config_conflicts(conflicts, 'kit.vite.', 'build_server');

	const { chunks } = await create_build(merged_config);

	/** @type {Record<string, string[]>} */
	const lookup = {};
	chunks.forEach((chunk) => {
		if (!chunk.facadeModuleId) return;
		const id = chunk.facadeModuleId.slice(cwd.length + 1);
		lookup[id] = chunk.exports;
	});

	/** @type {Record<string, import('types/internal').HttpMethod[]>} */
	const methods = {};
	manifest_data.routes.forEach((route) => {
		if (route.type === 'endpoint' && lookup[route.file]) {
			methods[route.file] = lookup[route.file]
				.map((x) => /** @type {import('types/internal').HttpMethod} */ (method_names[x]))
				.filter(Boolean);
		}
	});

	/** @type {import('vite').Manifest} */
	const vite_manifest = JSON.parse(fs__default.readFileSync(`${output_dir}/server/manifest.json`, 'utf-8'));

	mkdirp(`${output_dir}/server/nodes`);
	mkdirp(`${output_dir}/server/stylesheets`);

	const stylesheet_lookup = new Map();

	client.assets.forEach((asset) => {
		if (asset.fileName.endsWith('.css')) {
			if (config.kit.amp || asset.source.length < config.kit.inlineStyleThreshold) {
				const index = stylesheet_lookup.size;
				const file = `${output_dir}/server/stylesheets/${index}.js`;

				fs__default.writeFileSync(file, `// ${asset.fileName}\nexport default ${s(asset.source)};`);
				stylesheet_lookup.set(asset.fileName, index);
			}
		}
	});

	manifest_data.components.forEach((component, i) => {
		const file = `${output_dir}/server/nodes/${i}.js`;

		const js = new Set();
		const css = new Set();
		find_deps(component, client.vite_manifest, js, css);

		const imports = [`import * as module from '../${vite_manifest[component].file}';`];

		const exports = [
			'export { module };',
			`export const entry = '${client.vite_manifest[component].file}';`,
			`export const js = ${s(Array.from(js))};`,
			`export const css = ${s(Array.from(css))};`
		];

		/** @type {string[]} */
		const styles = [];

		css.forEach((file) => {
			if (stylesheet_lookup.has(file)) {
				const index = stylesheet_lookup.get(file);
				const name = `stylesheet_${index}`;
				imports.push(`import ${name} from '../stylesheets/${index}.js';`);
				styles.push(`\t${s(file)}: ${name}`);
			}
		});

		if (styles.length > 0) {
			exports.push(`export const styles = {\n${styles.join(',\n')}\n};`);
		}

		fs__default.writeFileSync(file, `${imports.join('\n')}\n\n${exports.join('\n')}\n`);
	});

	return {
		chunks,
		vite_manifest,
		methods: get_methods(cwd, chunks, manifest_data)
	};
}

/** @type {Record<string, string>} */
const method_names = {
	get: 'get',
	head: 'head',
	post: 'post',
	put: 'put',
	del: 'delete',
	patch: 'patch'
};

/**
 *
 * @param {string} cwd
 * @param {import('rollup').OutputChunk[]} output
 * @param {import('types/internal').ManifestData} manifest_data
 */
function get_methods(cwd, output, manifest_data) {
	/** @type {Record<string, string[]>} */
	const lookup = {};
	output.forEach((chunk) => {
		if (!chunk.facadeModuleId) return;
		const id = chunk.facadeModuleId.slice(cwd.length + 1);
		lookup[id] = chunk.exports;
	});

	/** @type {Record<string, import('types/internal').HttpMethod[]>} */
	const methods = {};
	manifest_data.routes.forEach((route) => {
		if (route.type === 'endpoint' && lookup[route.file]) {
			methods[route.file] = lookup[route.file]
				.map((x) => /** @type {import('types/internal').HttpMethod} */ (method_names[x]))
				.filter(Boolean);
		}
	});

	return methods;
}

/**
 * @param {import('types/config').ValidatedConfig} config
 * @returns {Promise<import('types/internal').BuildData>}
 */
async function build(config) {
	const cwd = process.cwd(); // TODO is this necessary?

	const build_dir = path__default.resolve(`${SVELTE_KIT}/build`);
	rimraf(build_dir);
	mkdirp(build_dir);

	const output_dir = path__default.resolve(`${SVELTE_KIT}/output`);
	rimraf(output_dir);
	mkdirp(output_dir);

	const options = {
		cwd,
		config,
		build_dir,
		// TODO this is so that Vite's preloading works. Unfortunately, it fails
		// during `svelte-kit preview`, because we use a local asset path. If Vite
		// used relative paths, I _think_ this could get fixed. Issue here:
		// https://github.com/vitejs/vite/issues/2009
		assets_base: `${config.kit.paths.assets || config.kit.paths.base}/${config.kit.appDir}/`,
		manifest_data: create_manifest_data({
			config,
			cwd
		}),
		output_dir,
		client_entry_file: path__default.relative(cwd, `${runtime}/client/start.js`),
		service_worker_entry_file: resolve_entry(config.kit.files.serviceWorker),
		service_worker_register: config.kit.serviceWorker.register
	};

	const client = await build_client(options);
	const server = await build_server(options, client);

	if (options.service_worker_entry_file) {
		if (config.kit.paths.assets) {
			throw new Error('Cannot use service worker alongside config.kit.paths.assets');
		}

		await build_service_worker(options, client.vite_manifest);
	}

	const build_data = {
		app_dir: config.kit.appDir,
		manifest_data: options.manifest_data,
		service_worker: options.service_worker_entry_file ? 'service_worker.js' : null, // TODO make file configurable?
		client,
		server,
		static: options.manifest_data.assets.map((asset) => posixify(asset.file)),
		entries: options.manifest_data.routes
			.map((route) => (route.type === 'page' ? route.path : ''))
			.filter(Boolean)
	};

	const manifest = `export const manifest = ${generate_manifest(build_data, '.')};\n`;
	fs__default.writeFileSync(`${output_dir}/server/manifest.js`, manifest);

	return build_data;
}

export { build };
