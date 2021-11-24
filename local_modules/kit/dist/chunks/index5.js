import * as fs from 'fs';
import fs__default, { readdirSync, statSync } from 'fs';
import http from 'http';
import https from 'https';
import { resolve, join, normalize } from 'path';
import * as require$$7 from 'querystring';
import { s as standard, M as Mime_1 } from './standard.js';
import { pathToFileURL } from 'url';
import { getRawBody } from '../node.js';
import { __fetch_polyfill } from '../install-fetch.js';
import { S as SVELTE_KIT, a as SVELTE_KIT_ASSETS } from './constants.js';
import 'zlib';
import 'stream';
import 'util';
import 'crypto';

/**
 * @typedef ParsedURL
 * @type {import('.').ParsedURL}
 */

/**
 * @typedef Request
 * @property {string} url
 * @property {ParsedURL} _parsedUrl
 */

/**
 * @param {Request} req
 * @returns {ParsedURL|void}
 */
function parse(req) {
	let raw = req.url;
	if (raw == null) return;

	let prev = req._parsedUrl;
	if (prev && prev.raw === raw) return prev;

	let pathname=raw, search='', query;

	if (raw.length > 1) {
		let idx = raw.indexOf('?', 1);

		if (idx !== -1) {
			search = raw.substring(idx);
			pathname = raw.substring(0, idx);
			if (search.length > 1) {
				query = require$$7.parse(search.substring(1));
			}
		}
	}

	return req._parsedUrl = { pathname, search, query, raw };
}

function list(dir, callback, pre='') {
	dir = resolve('.', dir);
	let arr = readdirSync(dir);
	let i=0, abs, stats;
	for (; i < arr.length; i++) {
		abs = join(dir, arr[i]);
		stats = statSync(abs);
		stats.isDirectory()
			? list(abs, callback, join(pre, arr[i]))
			: callback(join(pre, arr[i]), abs, stats);
	}
}

let Mime = Mime_1;
var lite = new Mime(standard);

const noop = () => {};

function isMatch(uri, arr) {
	for (let i=0; i < arr.length; i++) {
		if (arr[i].test(uri)) return true;
	}
}

function toAssume(uri, extns) {
	let i=0, x, len=uri.length - 1;
	if (uri.charCodeAt(len) === 47) {
		uri = uri.substring(0, len);
	}

	let arr=[], tmp=`${uri}/index`;
	for (; i < extns.length; i++) {
		x = extns[i] ? `.${extns[i]}` : '';
		if (uri) arr.push(uri + x);
		arr.push(tmp + x);
	}

	return arr;
}

function viaCache(cache, uri, extns) {
	let i=0, data, arr=toAssume(uri, extns);
	for (; i < arr.length; i++) {
		if (data = cache[arr[i]]) return data;
	}
}

function viaLocal(dir, isEtag, uri, extns) {
	let i=0, arr=toAssume(uri, extns);
	let abs, stats, name, headers;
	for (; i < arr.length; i++) {
		abs = normalize(join(dir, name=arr[i]));
		if (abs.startsWith(dir) && fs.existsSync(abs)) {
			stats = fs.statSync(abs);
			if (stats.isDirectory()) continue;
			headers = toHeaders(name, stats, isEtag);
			headers['Cache-Control'] = isEtag ? 'no-cache' : 'no-store';
			return { abs, stats, headers };
		}
	}
}

function is404(req, res) {
	return (res.statusCode=404,res.end());
}

function send(req, res, file, stats, headers) {
	let code=200, tmp, opts={};
	headers = { ...headers };

	for (let key in headers) {
		tmp = res.getHeader(key);
		if (tmp) headers[key] = tmp;
	}

	if (tmp = res.getHeader('content-type')) {
		headers['Content-Type'] = tmp;
	}

	if (req.headers.range) {
		code = 206;
		let [x, y] = req.headers.range.replace('bytes=', '').split('-');
		let end = opts.end = parseInt(y, 10) || stats.size - 1;
		let start = opts.start = parseInt(x, 10) || 0;

		if (start >= stats.size || end >= stats.size) {
			res.setHeader('Content-Range', `bytes */${stats.size}`);
			res.statusCode = 416;
			return res.end();
		}

		headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
		headers['Content-Length'] = (end - start + 1);
		headers['Accept-Ranges'] = 'bytes';
	}

	res.writeHead(code, headers);
	fs.createReadStream(file, opts).pipe(res);
}

const ENCODING = {
	'.br': 'br',
	'.gz': 'gzip',
};

function toHeaders(name, stats, isEtag) {
	let enc = ENCODING[name.slice(-3)];

	let ctype = lite.getType(name.slice(0, enc && -3)) || '';
	if (ctype === 'text/html') ctype += ';charset=utf-8';

	let headers = {
		'Content-Length': stats.size,
		'Content-Type': ctype,
		'Last-Modified': stats.mtime.toUTCString(),
	};

	if (enc) headers['Content-Encoding'] = enc;
	if (isEtag) headers['ETag'] = `W/"${stats.size}-${stats.mtime.getTime()}"`;

	return headers;
}

function sirv (dir, opts={}) {
	dir = resolve(dir || '.');

	let isNotFound = opts.onNoMatch || is404;
	let setHeaders = opts.setHeaders || noop;

	let extensions = opts.extensions || ['html', 'htm'];
	let gzips = opts.gzip && extensions.map(x => `${x}.gz`).concat('gz');
	let brots = opts.brotli && extensions.map(x => `${x}.br`).concat('br');

	const FILES = {};

	let fallback = '/';
	let isEtag = !!opts.etag;
	let isSPA = !!opts.single;
	if (typeof opts.single === 'string') {
		let idx = opts.single.lastIndexOf('.');
		fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
	}

	let ignores = [];
	if (opts.ignores !== false) {
		ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/); // any extn
		if (opts.dotfiles) ignores.push(/\/\.\w/);
		else ignores.push(/\/\.well-known/);
		[].concat(opts.ignores || []).forEach(x => {
			ignores.push(new RegExp(x, 'i'));
		});
	}

	let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
	if (cc && opts.immutable) cc += ',immutable';
	else if (cc && opts.maxAge === 0) cc += ',must-revalidate';

	if (!opts.dev) {
		list(dir, (name, abs, stats) => {
			if (/\.well-known[\\+\/]/.test(name)) ; // keep
			else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name)) return;

			let headers = toHeaders(name, stats, isEtag);
			if (cc) headers['Cache-Control'] = cc;

			FILES['/' + name.normalize().replace(/\\+/g, '/')] = { abs, stats, headers };
		});
	}

	let lookup = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);

	return function (req, res, next) {
		let extns = [''];
		let pathname = parse(req).pathname;
		let val = req.headers['accept-encoding'] || '';
		if (gzips && val.includes('gzip')) extns.unshift(...gzips);
		if (brots && /(br|brotli)/i.test(val)) extns.unshift(...brots);
		extns.push(...extensions); // [...br, ...gz, orig, ...exts]

		if (pathname.indexOf('%') !== -1) {
			try { pathname = decodeURIComponent(pathname); }
			catch (err) { /* malform uri */ }
		}

		let data = lookup(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns);
		if (!data) return next ? next() : isNotFound(req, res);

		if (isEtag && req.headers['if-none-match'] === data.headers['ETag']) {
			res.writeHead(304);
			return res.end();
		}

		if (gzips || brots) {
			res.setHeader('Vary', 'Accept-Encoding');
		}

		setHeaders(res, pathname, data.stats);
		send(req, res, data.abs, data.stats, data.headers);
	};
}

/** @param {string} dir */
const mutable = (dir) =>
	sirv(dir, {
		etag: true,
		maxAge: 0
	});

/**
 * @param {{
 *   port: number;
 *   host?: string;
 *   config: import('types/config').ValidatedConfig;
 *   https?: boolean;
 *   cwd?: string;
 * }} opts
 */
async function preview({
	port,
	host,
	config,
	https: use_https = false,
	cwd = process.cwd()
}) {
	__fetch_polyfill();

	const app_file = resolve(cwd, `${SVELTE_KIT}/output/server/app.js`);

	/** @type {import('types/internal').App} */
	const app = await import(pathToFileURL(app_file).href);

	/** @type {import('sirv').RequestHandler} */
	const static_handler = fs__default.existsSync(config.kit.files.assets)
		? mutable(config.kit.files.assets)
		: (_req, _res, next) => {
				if (!next) throw new Error('No next() handler is available');
				return next();
		  };

	const assets_handler = sirv(resolve(cwd, `${SVELTE_KIT}/output/client`), {
		maxAge: 31536000,
		immutable: true
	});

	const has_asset_path = !!config.kit.paths.assets;

	app.init({
		paths: {
			base: config.kit.paths.base,
			assets: has_asset_path ? SVELTE_KIT_ASSETS : config.kit.paths.base
		},
		prerendering: false,
		read: (file) => fs__default.readFileSync(join(config.kit.files.assets, file))
	});

	/** @type {import('vite').UserConfig} */
	const vite_config = (config.kit.vite && config.kit.vite()) || {};

	const server = await get_server(use_https, vite_config, (req, res) => {
		if (req.url == null) {
			throw new Error('Invalid request url');
		}

		const initial_url = req.url;

		const render_handler = async () => {
			if (!req.method) throw new Error('Incomplete request');

			let body;

			try {
				body = await getRawBody(req);
			} catch (/** @type {any} */ err) {
				res.statusCode = err.status || 400;
				return res.end(err.reason || 'Invalid request body');
			}

			const parsed = new URL(initial_url, 'http://localhost/');

			const rendered =
				parsed.pathname.startsWith(config.kit.paths.base) &&
				(await app.render({
					host: /** @type {string} */ (
						config.kit.host || req.headers[config.kit.hostHeader || 'host']
					),
					method: req.method,
					headers: /** @type {import('types/helper').RequestHeaders} */ (req.headers),
					path: parsed.pathname.replace(config.kit.paths.base, ''),
					query: parsed.searchParams,
					rawBody: body
				}));

			if (rendered) {
				res.writeHead(rendered.status, rendered.headers);
				if (rendered.body) res.write(rendered.body);
				res.end();
			} else {
				res.statusCode = 404;
				res.end('Not found');
			}
		};

		if (has_asset_path) {
			if (initial_url.startsWith(SVELTE_KIT_ASSETS)) {
				// custom assets path
				req.url = initial_url.slice(SVELTE_KIT_ASSETS.length);
				assets_handler(req, res, () => {
					static_handler(req, res, render_handler);
				});
			} else {
				render_handler();
			}
		} else {
			if (initial_url.startsWith(config.kit.paths.base)) {
				req.url = initial_url.slice(config.kit.paths.base.length);
			}
			assets_handler(req, res, () => {
				static_handler(req, res, render_handler);
			});
		}
	});

	await server.listen(port, host || '0.0.0.0');

	return Promise.resolve(server);
}

/**
 * @param {boolean} use_https
 * @param {import('vite').UserConfig} user_config
 * @param {(req: http.IncomingMessage, res: http.ServerResponse) => void} handler
 * @returns {Promise<import('net').Server>}
 */
async function get_server(use_https, user_config, handler) {
	/** @type {https.ServerOptions} */
	const https_options = {};

	if (use_https) {
		const secure_opts = user_config.server
			? /** @type {import('tls').SecureContextOptions} */ (user_config.server.https)
			: {};

		if (secure_opts.key && secure_opts.cert) {
			https_options.key = secure_opts.key.toString();
			https_options.cert = secure_opts.cert.toString();
		} else {
			https_options.key = https_options.cert = (await import('./cert.js')).createCertificate();
		}
	}

	return Promise.resolve(
		use_https
			? https.createServer(/** @type {https.ServerOptions} */ (https_options), handler)
			: http.createServer(handler)
	);
}

export { preview };