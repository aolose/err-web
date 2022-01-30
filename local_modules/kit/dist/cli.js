import sade from 'sade';
import path__default, { join, relative } from 'path';
import { exec as exec$1 } from 'child_process';
import { createConnection, createServer } from 'net';
import fs__default from 'fs';
import * as url from 'url';
import { fileURLToPath } from 'url';
import { networkInterfaces, release } from 'os';

let FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY=true;
if (typeof process !== 'undefined') {
	({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env);
	isTTY = process.stdout && process.stdout.isTTY;
}

const $ = {
	enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== 'dumb' && (
		FORCE_COLOR != null && FORCE_COLOR !== '0' || isTTY
	),

	// modifiers
	reset: init(0, 0),
	bold: init(1, 22),
	dim: init(2, 22),
	italic: init(3, 23),
	underline: init(4, 24),
	inverse: init(7, 27),
	hidden: init(8, 28),
	strikethrough: init(9, 29),

	// colors
	black: init(30, 39),
	red: init(31, 39),
	green: init(32, 39),
	yellow: init(33, 39),
	blue: init(34, 39),
	magenta: init(35, 39),
	cyan: init(36, 39),
	white: init(37, 39),
	gray: init(90, 39),
	grey: init(90, 39),

	// background colors
	bgBlack: init(40, 49),
	bgRed: init(41, 49),
	bgGreen: init(42, 49),
	bgYellow: init(43, 49),
	bgBlue: init(44, 49),
	bgMagenta: init(45, 49),
	bgCyan: init(46, 49),
	bgWhite: init(47, 49)
};

function run(arr, str) {
	let i=0, tmp, beg='', end='';
	for (; i < arr.length; i++) {
		tmp = arr[i];
		beg += tmp.open;
		end += tmp.close;
		if (!!~str.indexOf(tmp.close)) {
			str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
	}
	return beg + str + end;
}

function chain(has, keys) {
	let ctx = { has, keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);
	ctx.grey = $.grey.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	return ctx;
}

function init(open, close) {
	let blk = {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
	return function (txt) {
		if (this !== void 0 && this.has !== void 0) {
			!!~this.has.indexOf(open) || (this.has.push(open),this.keys.push(blk));
			return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
		}
		return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
	};
}

function exec(cmd) {
	return new Promise((fulfil, reject) => {
		exec$1(cmd, (error, stdout, stderr) => {
			if (error) return reject(error);
			fulfil({ stdout, stderr });
		});
	});
}

async function blame(port) {
	try {
		const { stdout } = await exec(`lsof -i :${port} -sTCP:LISTEN -Fp`);

		if (!stdout) return null;
		const pid = parseInt(stdout.slice(1), 10);
		if (isNaN(pid)) throw new Error(`Invalid stdout ${stdout}`);

		return pid;
	} catch (error) {
		return null;
	}
}

let promise;

function weird() {
	if (!promise) {
		promise = get_weird(9000);
	}
	return promise;
}

function get_weird(port) {
	return new Promise(fulfil => {
		const server = createServer();

		server.unref();

		server.on('error', () => {
			fulfil(get_weird(port + 1));
		});

		server.listen({ port }, () => {
			const server2 = createServer();

			server2.unref();

			server2.on('error', () => {
				server.close(() => {
					fulfil(false);
				});
			});

			server2.listen({ port }, () => {
				server2.close(() => {
					server.close(() => {
						fulfil(true);
					});
				});
			});
		});
	});
}

function check(port) {
	return weird().then(weird => {
		if (weird) {
			return check_weird(port);
		}

		return new Promise(fulfil => {
			const server = createServer();

			server.unref();

			server.on('error', () => {
				fulfil(false);
			});

			server.listen({ port }, () => {
				server.close(() => {
					fulfil(true);
				});
			});
		});
	});
}

function check_weird(port) {
	return new Promise(fulfil => {
		const client = createConnection({ port }, () => {
				client.end();
				fulfil(false);
			})
			.on('error', () => {
				fulfil(true);
			});
	});
}

/** @param {string} dir */
function mkdirp(dir) {
	try {
		fs__default.mkdirSync(dir, { recursive: true });
	} catch (/** @type {any} */ e) {
		if (e.code === 'EEXIST') return;
		throw e;
	}
}

/** @param {string} path */
function rimraf(path) {
	(fs__default.rmSync || fs__default.rmdirSync)(path, { recursive: true, force: true });
}

/**
 * @param {string} source
 * @param {string} target
 * @param {{
 *   filter?: (basename: string) => boolean;
 *   replace?: Record<string, string>;
 * }} opts
 */
function copy(source, target, opts = {}) {
	if (!fs__default.existsSync(source)) return [];

	/** @type {string[]} */
	const files = [];

	const prefix = posixify(target) + '/';

	const regex = opts.replace
		? new RegExp(`\\b(${Object.keys(opts.replace).join('|')})\\b`, 'g')
		: null;

	/**
	 * @param {string} from
	 * @param {string} to
	 */
	function go(from, to) {
		if (opts.filter && !opts.filter(path__default.basename(from))) return;

		const stats = fs__default.statSync(from);

		if (stats.isDirectory()) {
			fs__default.readdirSync(from).forEach((file) => {
				go(path__default.join(from, file), path__default.join(to, file));
			});
		} else {
			mkdirp(path__default.dirname(to));

			if (opts.replace) {
				const data = fs__default.readFileSync(from, 'utf-8');
				fs__default.writeFileSync(
					to,
					data.replace(
						/** @type {RegExp} */ (regex),
						(match, key) => /** @type {Record<string, string>} */ (opts.replace)[key]
					)
				);
			} else {
				fs__default.copyFileSync(from, to);
			}

			files.push(to === target ? posixify(path__default.basename(to)) : posixify(to).replace(prefix, ''));
		}
	}

	go(source, target);

	return files;
}

/**
 * Get a list of all files in a directory
 * @param {string} cwd - the directory to walk
 * @param {boolean} [dirs] - whether to include directories in the result
 */
function walk(cwd, dirs = false) {
	/** @type {string[]} */
	const all_files = [];

	/** @param {string} dir */
	function walk_dir(dir) {
		const files = fs__default.readdirSync(path__default.join(cwd, dir));

		for (const file of files) {
			const joined = path__default.join(dir, file);
			const stats = fs__default.statSync(path__default.join(cwd, joined));
			if (stats.isDirectory()) {
				if (dirs) all_files.push(joined);
				walk_dir(joined);
			} else {
				all_files.push(joined);
			}
		}
	}

	return walk_dir(''), all_files;
}

/** @param {string} str */
function posixify(str) {
	return str.replace(/\\/g, '/');
}

const SVELTE_KIT = '.svelte-kit';

// in `svelte-kit dev` and `svelte-kit preview`, we use a fake
// asset path so that we can serve local assets while still
// verifying that requests are correctly prefixed
const SVELTE_KIT_ASSETS = '/_svelte_kit_assets';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path__default.dirname(__filename);

const runtime = posixify_path(path__default.resolve(`${SVELTE_KIT}/runtime`))
	;

/** @param {string} str */
function posixify_path(str) {
	const parsed = path__default.parse(str);
	return `/${parsed.dir.slice(parsed.root.length).split(path__default.sep).join('/')}/${parsed.base}`;
}

/** @param {string} dest */
function copy_assets(dest) {
	{
		let prefix = '..';
		do {
			// we jump through these hoops so that this function
			// works whether or not it's been bundled
			const resolved = path__default.resolve(__dirname, `${prefix}/assets`);

			if (fs__default.existsSync(resolved)) {
				copy(resolved, dest);
				return;
			}

			prefix = `../${prefix}`;
		} while (true); // eslint-disable-line
	}
}

function noop() {}

/** @param {{ verbose: boolean }} opts */
function logger({ verbose }) {
	/** @type {import('types/internal').Logger} */
	const log = (msg) => console.log(msg.replace(/^/gm, '  '));

	/** @param {string} msg */
	const err = (msg) => console.error(msg.replace(/^/gm, '  '));

	log.success = (msg) => log($.green(`✔ ${msg}`));
	log.error = (msg) => err($.bold().red(msg));
	log.warn = (msg) => log($.bold().yellow(msg));

	log.minor = verbose ? (msg) => log($.grey(msg)) : noop;
	log.info = verbose ? log : noop;

	return log;
}

/**
 * Given an entry point like [cwd]/src/hooks, returns a filename like [cwd]/src/hooks.js or [cwd]/src/hooks/index.js
 * @param {string} entry
 * @returns {string|null}
 */
function resolve_entry(entry) {
	if (fs__default.existsSync(entry)) {
		const stats = fs__default.statSync(entry);
		if (stats.isDirectory()) {
			return resolve_entry(path__default.join(entry, 'index'));
		}

		return entry;
	} else {
		const dir = path__default.dirname(entry);

		if (fs__default.existsSync(dir)) {
			const base = path__default.basename(entry);
			const files = fs__default.readdirSync(dir);

			const found = files.find((file) => file.replace(/\.[^.]+$/, '') === base);

			if (found) return path__default.join(dir, found);
		}
	}

	return null;
}

/** @param {import('./create_app/index.js').ManifestData} manifest_data */
function get_mime_lookup(manifest_data) {
	/** @type {Record<string, string>} */
	const mime = {};

	manifest_data.assets.forEach((asset) => {
		if (asset.type) {
			const ext = path__default.extname(asset.file);
			mime[ext] = asset.type;
		}
	});

	return mime;
}

/** @param {import('@sveltejs/kit').ValidatedConfig} config */
function get_aliases(config) {
	const alias = {
		__GENERATED__: path__default.posix.resolve(`${SVELTE_KIT}/generated`),
		$app: `${runtime}/app`,
		$lib: config.kit.files.lib
	};

	return alias;
}

/** @typedef {import('./types').Validator} Validator */

/** @type {Validator} */
const options = object(
	{
		extensions: validate(['.svelte'], (input, keypath) => {
			if (!Array.isArray(input) || !input.every((page) => typeof page === 'string')) {
				throw new Error(`${keypath} must be an array of strings`);
			}

			input.forEach((extension) => {
				if (extension[0] !== '.') {
					throw new Error(`Each member of ${keypath} must start with '.' — saw '${extension}'`);
				}

				if (!/^(\.[a-z0-9]+)+$/i.test(extension)) {
					throw new Error(`File extensions must be alphanumeric — saw '${extension}'`);
				}
			});

			return input;
		}),

		kit: object({
			adapter: validate(null, (input, keypath) => {
				if (typeof input !== 'object' || !input.adapt) {
					let message = `${keypath} should be an object with an "adapt" method`;

					if (Array.isArray(input) || typeof input === 'string') {
						// for the early adapter adopters
						message += ', rather than the name of an adapter';
					}

					throw new Error(`${message}. See https://kit.svelte.dev/docs#adapters`);
				}

				return input;
			}),

			amp: boolean(false),

			appDir: validate('_app', (input, keypath) => {
				assert_string(input, keypath);

				if (input) {
					if (input.startsWith('/') || input.endsWith('/')) {
						throw new Error(
							"config.kit.appDir cannot start or end with '/'. See https://kit.svelte.dev/docs#configuration"
						);
					}
				} else {
					throw new Error(`${keypath} cannot be empty`);
				}

				return input;
			}),

			browser: object({
				hydrate: boolean(true),
				router: boolean(true)
			}),

			csp: object({
				mode: list(['auto', 'hash', 'nonce']),
				directives: object({
					'child-src': string_array(),
					'default-src': string_array(),
					'frame-src': string_array(),
					'worker-src': string_array(),
					'connect-src': string_array(),
					'font-src': string_array(),
					'img-src': string_array(),
					'manifest-src': string_array(),
					'media-src': string_array(),
					'object-src': string_array(),
					'prefetch-src': string_array(),
					'script-src': string_array(),
					'script-src-elem': string_array(),
					'script-src-attr': string_array(),
					'style-src': string_array(),
					'style-src-elem': string_array(),
					'style-src-attr': string_array(),
					'base-uri': string_array(),
					sandbox: string_array(),
					'form-action': string_array(),
					'frame-ancestors': string_array(),
					'navigate-to': string_array(),
					'report-uri': string_array(),
					'report-to': string_array(),
					'require-trusted-types-for': string_array(),
					'trusted-types': string_array(),
					'upgrade-insecure-requests': boolean(false),
					'require-sri-for': string_array(),
					'block-all-mixed-content': boolean(false),
					'plugin-types': string_array(),
					referrer: string_array()
				})
			}),

			files: object({
				assets: string('static'),
				hooks: string(join('src', 'hooks')),
				lib: string(join('src', 'lib')),
				routes: string(join('src', 'routes')),
				serviceWorker: string(join('src', 'service-worker')),
				template: string(join('src', 'app.html'))
			}),

			floc: boolean(false),

			// TODO: remove this for the 1.0 release
			headers: error(
				(keypath) =>
					`${keypath} has been removed. See https://github.com/sveltejs/kit/pull/3384 for details`
			),

			// TODO: remove this for the 1.0 release
			host: error(
				(keypath) =>
					`${keypath} has been removed. See https://github.com/sveltejs/kit/pull/3384 for details`
			),

			// TODO remove for 1.0
			hydrate: error((keypath) => `${keypath} has been moved to config.kit.browser.hydrate`),

			inlineStyleThreshold: number(0),

			methodOverride: object({
				parameter: string('_method'),
				allowed: validate([], (input, keypath) => {
					if (!Array.isArray(input) || !input.every((method) => typeof method === 'string')) {
						throw new Error(`${keypath} must be an array of strings`);
					}

					if (input.map((i) => i.toUpperCase()).includes('GET')) {
						throw new Error(`${keypath} cannot contain "GET"`);
					}

					return input;
				})
			}),

			package: object({
				dir: string('package'),
				// excludes all .d.ts and filename starting with _
				exports: fun((filepath) => !/^_|\/_|\.d\.ts$/.test(filepath)),
				files: fun(() => true),
				emitTypes: boolean(true)
			}),

			paths: object({
				base: validate('', (input, keypath) => {
					assert_string(input, keypath);

					if (input !== '' && (input.endsWith('/') || !input.startsWith('/'))) {
						throw new Error(
							`${keypath} option must be a root-relative path that starts but doesn't end with '/'. See https://kit.svelte.dev/docs#configuration-paths`
						);
					}

					return input;
				}),
				assets: validate('', (input, keypath) => {
					assert_string(input, keypath);

					if (input) {
						if (!/^[a-z]+:\/\//.test(input)) {
							throw new Error(
								`${keypath} option must be an absolute path, if specified. See https://kit.svelte.dev/docs#configuration-paths`
							);
						}

						if (input.endsWith('/')) {
							throw new Error(
								`${keypath} option must not end with '/'. See https://kit.svelte.dev/docs#configuration-paths`
							);
						}
					}

					return input;
				})
			}),

			prerender: object({
				concurrency: number(1),
				crawl: boolean(true),
				createIndexFiles: boolean(true),
				enabled: boolean(true),
				entries: validate(['*'], (input, keypath) => {
					if (!Array.isArray(input) || !input.every((page) => typeof page === 'string')) {
						throw new Error(`${keypath} must be an array of strings`);
					}

					input.forEach((page) => {
						if (page !== '*' && page[0] !== '/') {
							throw new Error(
								`Each member of ${keypath} must be either '*' or an absolute path beginning with '/' — saw '${page}'`
							);
						}
					});

					return input;
				}),

				// TODO: remove this for the 1.0 release
				force: validate(undefined, (input, keypath) => {
					if (typeof input !== undefined) {
						const newSetting = input ? 'continue' : 'fail';
						const needsSetting = newSetting === 'continue';
						throw new Error(
							`${keypath} has been removed in favor of \`onError\`. In your case, set \`onError\` to "${newSetting}"${
								needsSetting ? '' : ' (or leave it undefined)'
							} to get the same behavior as you would with \`force: ${JSON.stringify(input)}\``
						);
					}
				}),

				onError: validate('fail', (input, keypath) => {
					if (typeof input === 'function') return input;
					if (['continue', 'fail'].includes(input)) return input;
					throw new Error(
						`${keypath} should be either a custom function or one of "continue" or "fail"`
					);
				}),

				// TODO: remove this for the 1.0 release
				pages: error((keypath) => `${keypath} has been renamed to \`entries\`.`)
			}),

			// TODO: remove this for the 1.0 release
			protocol: error(
				(keypath) =>
					`${keypath} has been removed. See https://github.com/sveltejs/kit/pull/3384 for details`
			),

			// TODO remove for 1.0
			router: error((keypath) => `${keypath} has been moved to config.kit.browser.router`),

			routes: fun((filepath) => !/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(filepath)),

			serviceWorker: object({
				register: boolean(true),
				files: fun((filename) => !/\.DS_STORE/.test(filename))
			}),

			// TODO remove this for 1.0
			ssr: error(
				(keypath) =>
					`${keypath} has been removed — use the handle hook instead: https://kit.svelte.dev/docs#hooks-handle'`
			),

			target: string(null),

			trailingSlash: list(['never', 'always', 'ignore']),

			vite: validate(
				() => ({}),
				(input, keypath) => {
					if (typeof input === 'object') {
						const config = input;
						input = () => config;
					}

					if (typeof input !== 'function') {
						throw new Error(
							`${keypath} must be a Vite config object (https://vitejs.dev/config) or a function that returns one`
						);
					}

					return input;
				}
			)
		})
	},
	true
);

/**
 * @param {Record<string, Validator>} children
 * @param {boolean} [allow_unknown]
 * @returns {Validator}
 */
function object(children, allow_unknown = false) {
	return (input, keypath) => {
		/** @type {Record<string, any>} */
		const output = {};

		if ((input && typeof input !== 'object') || Array.isArray(input)) {
			throw new Error(`${keypath} should be an object`);
		}

		for (const key in input) {
			if (!(key in children)) {
				if (allow_unknown) {
					output[key] = input[key];
				} else {
					let message = `Unexpected option ${keypath}.${key}`;

					// special case
					if (keypath === 'config.kit' && key in options) {
						message += ` (did you mean config.${key}?)`;
					}

					throw new Error(message);
				}
			}
		}

		for (const key in children) {
			const validator = children[key];
			output[key] = validator(input && input[key], `${keypath}.${key}`);
		}

		return output;
	};
}

/**
 * @param {any} fallback
 * @param {(value: any, keypath: string) => any} fn
 * @returns {Validator}
 */
function validate(fallback, fn) {
	return (input, keypath) => {
		return input === undefined ? fallback : fn(input, keypath);
	};
}

/**
 * @param {string | null} fallback
 * @param {boolean} allow_empty
 * @returns {Validator}
 */
function string(fallback, allow_empty = true) {
	return validate(fallback, (input, keypath) => {
		assert_string(input, keypath);

		if (!allow_empty && input === '') {
			throw new Error(`${keypath} cannot be empty`);
		}

		return input;
	});
}

/**
 * @param {string[] | undefined} [fallback]
 * @returns {Validator}
 */
function string_array(fallback) {
	return validate(fallback, (input, keypath) => {
		if (input === undefined) return input;

		if (!Array.isArray(input) || input.some((value) => typeof value !== 'string')) {
			throw new Error(`${keypath} must be an array of strings, if specified`);
		}

		return input;
	});
}

/**
 * @param {number} fallback
 * @returns {Validator}
 */
function number(fallback) {
	return validate(fallback, (input, keypath) => {
		if (typeof input !== 'number') {
			throw new Error(`${keypath} should be a number, if specified`);
		}
		return input;
	});
}

/**
 * @param {boolean} fallback
 * @returns {Validator}
 */
function boolean(fallback) {
	return validate(fallback, (input, keypath) => {
		if (typeof input !== 'boolean') {
			throw new Error(`${keypath} should be true or false, if specified`);
		}
		return input;
	});
}

/**
 * @param {string[]} options
 * @returns {Validator}
 */
function list(options, fallback = options[0]) {
	return validate(fallback, (input, keypath) => {
		if (!options.includes(input)) {
			// prettier-ignore
			const msg = options.length > 2
				? `${keypath} should be one of ${options.slice(0, -1).map(input => `"${input}"`).join(', ')} or "${options[options.length - 1]}"`
				: `${keypath} should be either "${options[0]}" or "${options[1]}"`;

			throw new Error(msg);
		}
		return input;
	});
}

/**
 * @param {(filename: string) => boolean} fallback
 * @returns {Validator}
 */
function fun(fallback) {
	return validate(fallback, (input, keypath) => {
		if (typeof input !== 'function') {
			throw new Error(`${keypath} should be a function, if specified`);
		}
		return input;
	});
}

/**
 * @param {string} input
 * @param {string} keypath
 */
function assert_string(input, keypath) {
	if (typeof input !== 'string') {
		throw new Error(`${keypath} should be a string, if specified`);
	}
}

/** @param {(keypath?: string) => string} fn */
function error(fn) {
	return validate(undefined, (input, keypath) => {
		if (input !== undefined) {
			throw new Error(fn(keypath));
		}
	});
}

/**
 * @param {string} cwd
 * @param {import('types/config').ValidatedConfig} config
 */
function load_template(cwd, config) {
	const { template } = config.kit.files;
	const relative = path__default.relative(cwd, template);

	if (fs__default.existsSync(template)) {
		const contents = fs__default.readFileSync(template, 'utf8');
		const expected_tags = ['%svelte.head%', '%svelte.body%'];
		expected_tags.forEach((tag) => {
			if (contents.indexOf(tag) === -1) {
				throw new Error(`${relative} is missing ${tag}`);
			}
		});
	} else {
		throw new Error(`${relative} does not exist`);
	}

	return fs__default.readFileSync(template, 'utf-8');
}

async function load_config({ cwd = process.cwd() } = {}) {
	const config_file = path__default.join(cwd, 'svelte.config.js');

	if (!fs__default.existsSync(config_file)) {
		throw new Error(
			'You need to create a svelte.config.js file. See https://kit.svelte.dev/docs#configuration'
		);
	}

	const config = await import(url.pathToFileURL(config_file).href);

	const validated = validate_config(config.default);

	validated.kit.files.assets = path__default.resolve(cwd, validated.kit.files.assets);
	validated.kit.files.hooks = path__default.resolve(cwd, validated.kit.files.hooks);
	validated.kit.files.lib = path__default.resolve(cwd, validated.kit.files.lib);
	validated.kit.files.routes = path__default.resolve(cwd, validated.kit.files.routes);
	validated.kit.files.serviceWorker = path__default.resolve(cwd, validated.kit.files.serviceWorker);
	validated.kit.files.template = path__default.resolve(cwd, validated.kit.files.template);

	return validated;
}

/**
 * @param {import('types/config').Config} config
 * @returns {import('types/config').ValidatedConfig}
 */
function validate_config(config) {
	if (typeof config !== 'object') {
		throw new Error(
			'svelte.config.js must have a configuration object as its default export. See https://kit.svelte.dev/docs#configuration'
		);
	}

	return options(config, 'config');
}

/**
 * @param {string[]} conflicts - array of conflicts in dotted notation
 * @param {string=} pathPrefix - prepended in front of the path
 * @param {string=} scope - used to prefix the whole error message
 */
function print_config_conflicts(conflicts, pathPrefix = '', scope) {
	const prefix = scope ? scope + ': ' : '';
	const log = logger({ verbose: false });
	conflicts.forEach((conflict) => {
		log.error(
			`${prefix}The value for ${pathPrefix}${conflict} specified in svelte.config.js has been ignored. This option is controlled by SvelteKit.`
		);
	});
}

/**
 * @param {unknown} err
 * @return {Error}
 */
function coalesce_to_error(err) {
	return err instanceof Error ||
		(err && /** @type {any} */ (err).name && /** @type {any} */ (err).message)
		? /** @type {Error} */ (err)
		: new Error(JSON.stringify(err));
}

/** @param {unknown} e */
function handle_error(e) {
	const error = coalesce_to_error(e);

	if (error.name === 'SyntaxError') throw error;

	console.error($.bold().red(`> ${error.message}`));
	if (error.stack) {
		console.error($.gray(error.stack.split('\n').slice(1).join('\n')));
	}

	process.exit(1);
}

/**
 * @param {number} port
 * @param {boolean} https
 */
async function launch(port, https) {
	const { exec } = await import('child_process');
	let cmd = 'open';
	if (process.platform == 'win32') {
		cmd = 'start';
	} else if (process.platform == 'linux') {
		if (/microsoft/i.test(release())) {
			cmd = 'cmd.exe /c start';
		} else {
			cmd = 'xdg-open';
		}
	}
	exec(`${cmd} ${https ? 'https' : 'http'}://localhost:${port}`);
}

const prog = sade('svelte-kit').version('1.0.0-next.251');

prog
	.command('dev')
	.describe('Start a development server')
	.option('-p, --port', 'Port')
	.option('-o, --open', 'Open a browser tab')
	.option('--host', 'Host (only use this on trusted networks)')
	.option('--https', 'Use self-signed HTTPS certificate')
	.option('-H', 'no longer supported, use --https instead') // TODO remove for 1.0
	.action(async ({ port, host, https, open, H }) => {
		try {
			if (H) throw new Error('-H is no longer supported — use --https instead');

			process.env.NODE_ENV = process.env.NODE_ENV || 'development';
			const config = await load_config();

			const { dev } = await import('./chunks/index.js');

			const cwd = process.cwd();

			const { address_info, server_config } = await dev({
				cwd,
				port,
				host,
				https,
				config
			});

			welcome({
				port: address_info.port,
				host: address_info.address,
				https: !!(https || server_config.https),
				open: open || !!server_config.open,
				loose: server_config.fs.strict === false,
				allow: server_config.fs.allow,
				cwd
			});
		} catch (error) {
			handle_error(error);
		}
	});

prog
	.command('build')
	.describe('Create a production build of your app')
	.option('--verbose', 'Log more stuff', false)
	.action(async ({ verbose }) => {
		try {
			process.env.NODE_ENV = process.env.NODE_ENV || 'production';
			const config = await load_config();

			const { build } = await import('./chunks/index3.js');
			const build_data = await build(config);

			console.log(
				`\nRun ${$.bold().cyan('npm run preview')} to preview your production build locally.`
			);

			if (config.kit.adapter) {
				const { adapt } = await import('./chunks/index5.js');
				await adapt(config, build_data, { verbose });

				// this is necessary to close any open db connections, etc
				process.exit(0);
			}

			console.log($.bold().yellow('\nNo adapter specified'));

			// prettier-ignore
			console.log(
				`See ${$.bold().cyan('https://kit.svelte.dev/docs#adapters')} to learn how to configure your app to run on the platform of your choosing`
			);
		} catch (error) {
			handle_error(error);
		}
	});

prog
	.command('preview')
	.describe('Serve an already-built app')
	.option('-p, --port', 'Port', 3000)
	.option('-o, --open', 'Open a browser tab', false)
	.option('--host', 'Host (only use this on trusted networks)', 'localhost')
	.option('--https', 'Use self-signed HTTPS certificate', false)
	.option('-H', 'no longer supported, use --https instead') // TODO remove for 1.0
	.action(async ({ port, host, https, open, H }) => {
		try {
			if (H) throw new Error('-H is no longer supported — use --https instead');

			await check_port(port);

			process.env.NODE_ENV = process.env.NODE_ENV || 'production';
			const config = await load_config();

			const { preview } = await import('./chunks/index6.js');

			await preview({ port, host, config, https });

			welcome({ port, host, https, open });
		} catch (error) {
			handle_error(error);
		}
	});

prog
	.command('package')
	.describe('Create a package')
	.option('-d, --dir', 'Destination directory', 'package')
	.action(async () => {
		try {
			const config = await load_config();

			const { make_package } = await import('./chunks/index7.js');

			await make_package(config);
		} catch (error) {
			handle_error(error);
		}
	});

prog.parse(process.argv, { unknown: (arg) => `Unknown option: ${arg}` });

/** @param {number} port */
async function check_port(port) {
	if (await check(port)) {
		return;
	}
	console.error($.bold().red(`Port ${port} is occupied`));
	const n = await blame(port);
	if (n) {
		// prettier-ignore
		console.error(
			`Terminate process ${$.bold(n)} or specify a different port with ${$.bold('--port')}\n`
		);
	} else {
		// prettier-ignore
		console.error(
			`Terminate the process occupying the port or specify a different port with ${$.bold('--port')}\n`
		);
	}
	process.exit(1);
}

/**
 * @param {{
 *   open: boolean;
 *   host: string;
 *   https: boolean;
 *   port: number;
 *   loose?: boolean;
 *   allow?: string[];
 *   cwd?: string;
 * }} param0
 */
function welcome({ port, host, https, open, loose, allow, cwd }) {
	if (open) launch(port, https);

	console.log($.bold().cyan(`\n  SvelteKit v${'1.0.0-next.251'}\n`));

	const protocol = https ? 'https:' : 'http:';
	const exposed = typeof host !== 'undefined' && host !== 'localhost' && host !== '127.0.0.1';

	Object.values(networkInterfaces()).forEach((interfaces) => {
		if (!interfaces) return;
		interfaces.forEach((details) => {
			if (details.family !== 'IPv4') return;

			// prettier-ignore
			if (details.internal) {
				console.log(`  ${$.gray('local:  ')} ${protocol}//${$.bold(`localhost:${port}`)}`);
			} else {
				if (details.mac === '00:00:00:00:00:00') return;

				if (exposed) {
					console.log(`  ${$.gray('network:')} ${protocol}//${$.bold(`${details.address}:${port}`)}`);
					if (loose) {
						console.log(`\n  ${$.yellow('Serving with vite.server.fs.strict: false. Note that all files on your machine will be accessible to anyone on your network.')}`);
					} else if (allow?.length && cwd) {
						console.log(`\n  ${$.yellow('Note that all files in the following directories will be accessible to anyone on your network: ' + allow.map(a => relative(cwd, a)).join(', '))}`);
					}
				} else {
					console.log(`  ${$.gray('network: not exposed')}`);
				}
			}
		});
	});

	if (!exposed) {
		console.log('\n  Use --host to expose server to other devices on this network');
	}

	console.log('\n');
}

export { $, SVELTE_KIT_ASSETS as S, SVELTE_KIT as a, runtime as b, coalesce_to_error as c, copy_assets as d, get_aliases as e, posixify as f, get_mime_lookup as g, rimraf as h, copy as i, logger as j, load_template as l, mkdirp as m, print_config_conflicts as p, resolve_entry as r, walk as w };
