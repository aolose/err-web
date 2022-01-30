import { m as mkdirp, a as SVELTE_KIT, h as rimraf, i as copy, $, j as logger } from '../cli.js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { pathToFileURL, URL } from 'url';
import { __fetch_polyfill } from '../install-fetch.js';
import { e as escape_html_attr, r as resolve$1, i as is_root_relative } from './url.js';
import { g as generate_manifest } from './index4.js';
import 'sade';
import 'child_process';
import 'net';
import 'os';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:util';
import 'node:url';
import './misc.js';

/** @typedef {{
 *   fn: () => Promise<any>,
 *   fulfil: (value: any) => void,
 *   reject: (error: Error) => void
 * }} Task */

/** @param {number} concurrency */
function queue(concurrency) {
	/** @type {Task[]} */
	const tasks = [];

	let current = 0;

	/** @type {(value?: any) => void} */
	let fulfil;

	/** @type {(error: Error) => void} */
	let reject;

	let closed = false;

	const done = new Promise((f, r) => {
		fulfil = f;
		reject = r;
	});

	done.catch(() => {
		// this is necessary in case a catch handler is never added
		// to the done promise by the user
	});

	function dequeue() {
		if (current < concurrency) {
			const task = tasks.shift();

			if (task) {
				current += 1;
				const promise = Promise.resolve(task.fn());

				promise
					.then(task.fulfil, (err) => {
						task.reject(err);
						reject(err);
					})
					.then(() => {
						current -= 1;
						dequeue();
					});
			} else if (current === 0) {
				closed = true;
				fulfil();
			}
		}
	}

	return {
		/** @param {() => any} fn */
		add: (fn) => {
			if (closed) throw new Error('Cannot add tasks to a queue that has ended');

			const promise = new Promise((fulfil, reject) => {
				tasks.push({ fn, fulfil, reject });
			});

			dequeue();
			return promise;
		},

		done: () => {
			if (current === 0) {
				closed = true;
				fulfil();
			}

			return done;
		}
	};
}

const DOCTYPE = 'DOCTYPE';
const CDATA_OPEN = '[CDATA[';
const CDATA_CLOSE = ']]>';
const COMMENT_OPEN = '--';
const COMMENT_CLOSE = '-->';

const TAG_OPEN = /[a-zA-Z]/;
const TAG_CHAR = /[a-zA-Z0-9]/;
const ATTRIBUTE_NAME = /[^\t\n\f />"'=]/;

const EXTERNAL = /\bexternal\b/;

const WHITESPACE = /[\s\n\r]/;

/** @param {string} html */
function crawl(html) {
	/** @type {string[]} */
	const hrefs = [];

	let i = 0;
	main: while (i < html.length) {
		const char = html[i];

		if (char === '<') {
			if (html[i + 1] === '!') {
				i += 2;

				if (html.substr(i, DOCTYPE.length).toUpperCase() === DOCTYPE) {
					i += DOCTYPE.length;
					while (i < html.length) {
						if (html[i++] === '>') {
							continue main;
						}
					}
				}

				// skip cdata
				if (html.substr(i, CDATA_OPEN.length) === CDATA_OPEN) {
					i += CDATA_OPEN.length;
					while (i < html.length) {
						if (html.substr(i, CDATA_CLOSE.length) === CDATA_CLOSE) {
							i += CDATA_CLOSE.length;
							continue main;
						}

						i += 1;
					}
				}

				// skip comments
				if (html.substr(i, COMMENT_OPEN.length) === COMMENT_OPEN) {
					i += COMMENT_OPEN.length;
					while (i < html.length) {
						if (html.substr(i, COMMENT_CLOSE.length) === COMMENT_CLOSE) {
							i += COMMENT_CLOSE.length;
							continue main;
						}

						i += 1;
					}
				}
			}

			// parse opening tags
			const start = ++i;
			if (TAG_OPEN.test(html[start])) {
				while (i < html.length) {
					if (!TAG_CHAR.test(html[i])) {
						break;
					}

					i += 1;
				}

				const tag = html.slice(start, i).toUpperCase();

				if (tag === 'SCRIPT' || tag === 'STYLE') {
					while (i < html.length) {
						if (
							html[i] === '<' &&
							html[i + 1] === '/' &&
							html.substr(i + 2, tag.length).toUpperCase() === tag
						) {
							continue main;
						}

						i += 1;
					}
				}

				let rel = '';
				let href = '';

				while (i < html.length) {
					const start = i;

					const char = html[start];
					if (char === '>') break;

					if (ATTRIBUTE_NAME.test(char)) {
						i += 1;

						while (i < html.length) {
							if (!ATTRIBUTE_NAME.test(html[i])) {
								break;
							}

							i += 1;
						}

						const name = html.slice(start, i).toLowerCase();

						while (WHITESPACE.test(html[i])) i += 1;

						if (html[i] === '=') {
							i += 1;
							while (WHITESPACE.test(html[i])) i += 1;

							let value;

							if (html[i] === "'" || html[i] === '"') {
								const quote = html[i++];

								const start = i;
								let escaped = false;

								while (i < html.length) {
									if (!escaped) {
										const char = html[i];

										if (html[i] === quote) {
											break;
										}

										if (char === '\\') {
											escaped = true;
										}
									}

									i += 1;
								}

								value = html.slice(start, i);
							} else {
								const start = i;
								while (html[i] !== '>' && !WHITESPACE.test(html[i])) i += 1;
								value = html.slice(start, i);

								i -= 1;
							}

							if (name === 'rel') {
								rel = value;
							} else if (name === 'href') {
								href = value;
							} else if (name === 'src') {
								hrefs.push(value);
							} else if (name === 'srcset') {
								const candidates = [];
								let insideURL = true;
								value = value.trim();
								for (let i = 0; i < value.length; i++) {
									if (value[i] === ',' && (!insideURL || (insideURL && value[i + 1] === ' '))) {
										candidates.push(value.slice(0, i));
										value = value.substring(i + 1).trim();
										i = 0;
										insideURL = true;
									} else if (value[i] === ' ') {
										insideURL = false;
									}
								}
								candidates.push(value);
								for (const candidate of candidates) {
									const src = candidate.split(WHITESPACE)[0];
									hrefs.push(src);
								}
							}
						}
					}

					i += 1;
				}

				if (href && !EXTERNAL.test(rel)) {
					hrefs.push(href);
				}
			}
		}

		i += 1;
	}

	return hrefs;
}

/**
 * @typedef {import('types/config').PrerenderErrorHandler} PrerenderErrorHandler
 * @typedef {import('types/config').PrerenderOnErrorValue} OnError
 * @typedef {import('types/internal').Logger} Logger
 */

/** @type {(errorDetails: Parameters<PrerenderErrorHandler>[0] ) => string} */
function errorDetailsToString({ status, path, referrer, referenceType }) {
	return `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`;
}

/** @type {(log: Logger, onError: OnError) => PrerenderErrorHandler} */
function chooseErrorHandler(log, onError) {
	switch (onError) {
		case 'continue':
			return (errorDetails) => {
				log.error(errorDetailsToString(errorDetails));
			};
		case 'fail':
			return (errorDetails) => {
				throw new Error(errorDetailsToString(errorDetails));
			};
		default:
			return onError;
	}
}

const OK = 2;
const REDIRECT = 3;

/**
 * @param {{
 *   cwd: string;
 *   out: string;
 *   log: Logger;
 *   config: import('types/config').ValidatedConfig;
 *   build_data: import('types/internal').BuildData;
 *   fallback?: string;
 *   all: boolean; // disregard `export const prerender = true`
 * }} opts
 * @returns {Promise<{ paths: string[] }>} returns a promise that resolves to an array of paths corresponding to the files that have been prerendered.
 */
async function prerender({ cwd, out, log, config, build_data, fallback, all }) {
	if (!config.kit.prerender.enabled && !fallback) {
		return { paths: [] };
	}

	__fetch_polyfill();

	mkdirp(out);

	const dir = resolve(cwd, `${SVELTE_KIT}/output`);

	const seen = new Set();

	const server_root = resolve(dir);

	/** @type {import('types/internal').AppModule} */
	const { App, override } = await import(pathToFileURL(`${server_root}/server/app.js`).href);

	override({
		paths: config.kit.paths,
		prerendering: true,
		read: (file) => readFileSync(join(config.kit.files.assets, file))
	});

	const { manifest } = await import(pathToFileURL(`${server_root}/server/manifest.js`).href);

	const app = new App(manifest);

	const error = chooseErrorHandler(log, config.kit.prerender.onError);

	const files = new Set([
		...build_data.static,
		...build_data.client.chunks.map((chunk) => `${config.kit.appDir}/${chunk.fileName}`),
		...build_data.client.assets.map((chunk) => `${config.kit.appDir}/${chunk.fileName}`)
	]);

	/** @type {string[]} */
	const paths = [];

	build_data.static.forEach((file) => {
		if (file.endsWith('/index.html')) {
			files.add(file.slice(0, -11));
		}
	});

	/**
	 * @param {string} path
	 */
	function normalize(path) {
		if (config.kit.trailingSlash === 'always') {
			return path.endsWith('/') ? path : `${path}/`;
		} else if (config.kit.trailingSlash === 'never') {
			return !path.endsWith('/') || path === '/' ? path : path.slice(0, -1);
		}

		return path;
	}

	const q = queue(config.kit.prerender.concurrency);

	/**
	 * @param {string} path
	 * @param {boolean} is_html
	 */
	function output_filename(path, is_html) {
		if (path === '/') {
			return '/index.html';
		}
		const parts = path.split('/');
		if (is_html && parts[parts.length - 1] !== 'index.html') {
			if (config.kit.prerender.createIndexFiles) {
				parts.push('index.html');
			} else {
				parts[parts.length - 1] += '.html';
			}
		}
		return parts.join('/');
	}

	/**
	 * @param {string} decoded_path
	 * @param {string?} referrer
	 */
	function enqueue(decoded_path, referrer) {
		const path = encodeURI(normalize(decoded_path));

		if (seen.has(path)) return;
		seen.add(path);

		return q.add(() => visit(path, decoded_path, referrer));
	}

	/**
	 * @param {string} path
	 * @param {string} decoded_path
	 * @param {string?} referrer
	 */
	async function visit(path, decoded_path, referrer) {
		/** @type {Map<string, import('types/internal').PrerenderDependency>} */
		const dependencies = new Map();

		const render_path = config.kit.paths?.base
			? `http://sveltekit-prerender${config.kit.paths.base}${path === '/' ? '' : path}`
			: `http://sveltekit-prerender${path}`;

		const rendered = await app.render(new Request(render_path), {
			prerender: {
				all,
				dependencies
			}
		});

		if (rendered) {
			const response_type = Math.floor(rendered.status / 100);
			const type = rendered.headers.get('content-type');
			const is_html = response_type === REDIRECT || type === 'text/html';

			const file = `${out}${output_filename(decoded_path, is_html)}`;

			if (response_type === REDIRECT) {
				const location = rendered.headers.get('location');

				if (location) {
					mkdirp(dirname(file));

					log.warn(`${rendered.status} ${decoded_path} -> ${location}`);

					writeFileSync(
						file,
						`<meta http-equiv="refresh" content=${escape_html_attr(`0;url=${location}`)}>`
					);

					const resolved = resolve$1(path, location);
					if (is_root_relative(resolved)) {
						enqueue(resolved, path);
					}
				} else {
					log.warn(`location header missing on redirect received from ${decoded_path}`);
				}

				return;
			}

			const text = await rendered.text();

			if (rendered.status === 200) {
				mkdirp(dirname(file));

				log.info(`${rendered.status} ${decoded_path}`);
				writeFileSync(file, text);
				paths.push(normalize(decoded_path));
			} else if (response_type !== OK) {
				error({ status: rendered.status, path, referrer, referenceType: 'linked' });
			}

			for (const [dependency_path, result] of dependencies) {
				const { status, headers } = result.response;

				const response_type = Math.floor(status / 100);

				const is_html = headers.get('content-type') === 'text/html';

				const file = `${out}${output_filename(dependency_path, is_html)}`;
				mkdirp(dirname(file));

				writeFileSync(
					file,
					result.body === null ? new Uint8Array(await result.response.arrayBuffer()) : result.body
				);
				paths.push(dependency_path);

				if (response_type === OK) {
					log.info(`${status} ${dependency_path}`);
				} else {
					error({
						status,
						path: dependency_path,
						referrer: path,
						referenceType: 'fetched'
					});
				}
			}

			if (is_html && config.kit.prerender.crawl) {
				for (const href of crawl(text)) {
					if (href.startsWith('data:') || href.startsWith('#')) continue;

					const resolved = resolve$1(path, href);
					if (!is_root_relative(resolved)) continue;

					const parsed = new URL(resolved, 'http://localhost');

					let pathname = decodeURI(parsed.pathname);

					if (config.kit.paths.base) {
						if (!pathname.startsWith(config.kit.paths.base)) continue;
						pathname = pathname.slice(config.kit.paths.base.length) || '/';
					}

					const file = pathname.slice(1);
					if (files.has(file)) continue;

					if (parsed.search) ;

					enqueue(pathname, path);
				}
			}
		}
	}

	if (config.kit.prerender.enabled) {
		for (const entry of config.kit.prerender.entries) {
			if (entry === '*') {
				for (const entry of build_data.entries) {
					enqueue(entry, null);
				}
			} else {
				enqueue(entry, null);
			}
		}

		await q.done();
	}

	if (fallback) {
		const rendered = await app.render(new Request('http://sveltekit-prerender/[fallback]'), {
			prerender: {
				fallback,
				all: false,
				dependencies: new Map()
			}
		});

		const file = join(out, fallback);
		mkdirp(dirname(file));
		writeFileSync(file, await rendered.text());
	}

	return {
		paths
	};
}

/**
 * @param {{
 *   cwd: string;
 *   config: import('types/config').ValidatedConfig;
 *   build_data: import('types/internal').BuildData;
 *   log: import('types/internal').Logger;
 * }} opts
 * @returns {import('types/config').Builder}
 */
function create_builder({ cwd, config, build_data, log }) {
	/** @type {Set<string>} */
	const prerendered_paths = new Set();
	let generated_manifest = false;

	/** @param {import('types/internal').RouteData} route */
	function not_prerendered(route) {
		if (route.type === 'page' && route.path) {
			return !prerendered_paths.has(route.path);
		}

		return true;
	}

	return {
		log,
		rimraf,
		mkdirp,
		copy,

		appDir: config.kit.appDir,

		createEntries(fn) {
			generated_manifest = true;

			const { routes } = build_data.manifest_data;

			/** @type {import('types/config').RouteDefinition[]} */
			const facades = routes.map((route) => ({
				type: route.type,
				segments: route.segments,
				pattern: route.pattern,
				methods: route.type === 'page' ? ['get'] : build_data.server.methods[route.file]
			}));

			const seen = new Set();

			for (let i = 0; i < routes.length; i += 1) {
				const route = routes[i];
				const { id, filter, complete } = fn(facades[i]);

				if (seen.has(id)) continue;
				seen.add(id);

				const group = [route];

				// figure out which lower priority routes should be considered fallbacks
				for (let j = i + 1; j < routes.length; j += 1) {
					if (filter(facades[j])) {
						group.push(routes[j]);
					}
				}

				const filtered = new Set(group.filter(not_prerendered));

				// heuristic: if /foo/[bar] is included, /foo/[bar].json should
				// also be included, since the page likely needs the endpoint
				filtered.forEach((route) => {
					if (route.type === 'page') {
						const length = route.segments.length;

						const endpoint = routes.find((candidate) => {
							if (candidate.segments.length !== length) return false;

							for (let i = 0; i < length; i += 1) {
								const a = route.segments[i];
								const b = candidate.segments[i];

								if (i === length - 1) {
									return b.content === `${a.content}.json`;
								}

								if (a.content !== b.content) return false;
							}
						});

						if (endpoint) {
							filtered.add(endpoint);
						}
					}
				});

				if (filtered.size > 0) {
					complete({
						generateManifest: ({ relativePath, format }) =>
							generate_manifest(build_data, relativePath, Array.from(filtered), format)
					});
				}
			}
		},

		generateManifest: ({ relativePath, format }) => {
			generated_manifest = true;
			return generate_manifest(
				build_data,
				relativePath,
				build_data.manifest_data.routes.filter(not_prerendered),
				format
			);
		},

		getBuildDirectory(name) {
			return `${cwd}/${SVELTE_KIT}/${name}`;
		},

		getClientDirectory() {
			return `${cwd}/${SVELTE_KIT}/output/client`;
		},

		getServerDirectory() {
			return `${cwd}/${SVELTE_KIT}/output/server`;
		},

		getStaticDirectory() {
			return config.kit.files.assets;
		},

		writeClient(dest) {
			return copy(`${cwd}/${SVELTE_KIT}/output/client`, dest, {
				filter: (file) => file[0] !== '.'
			});
		},

		writeServer(dest) {
			return copy(`${cwd}/${SVELTE_KIT}/output/server`, dest, {
				filter: (file) => file[0] !== '.'
			});
		},

		writeStatic(dest) {
			return copy(config.kit.files.assets, dest);
		},

		async prerender({ all = false, dest, fallback }) {
			if (generated_manifest) {
				throw new Error(
					'Adapters must call prerender(...) before createEntries(...) or generateManifest(...)'
				);
			}

			const prerendered = await prerender({
				out: dest,
				all,
				cwd,
				config,
				build_data,
				fallback,
				log
			});

			prerendered.paths.forEach((path) => {
				prerendered_paths.add(path);
				prerendered_paths.add(path + '/');
			});

			return prerendered;
		}
	};
}

/**
 * @param {import('types/config').ValidatedConfig} config
 * @param {import('types/internal').BuildData} build_data
 * @param {{ cwd?: string, verbose: boolean }} opts
 */
async function adapt(config, build_data, { cwd = process.cwd(), verbose }) {
	const { name, adapt } = config.kit.adapter;

	console.log($.bold().cyan(`\n> Using ${name}`));

	const log = logger({ verbose });
	const builder = create_builder({ cwd, config, build_data, log });
	await adapt(builder);

	log.success('done');
}

export { adapt };
