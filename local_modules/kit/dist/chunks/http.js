/**
 * @param {Record<string, string | string[]>} headers
 * @param {string} key
 * @returns {string | undefined}
 * @throws {Error}
 */
function get_single_valued_header(headers, key) {
	const value = headers[key];
	if (Array.isArray(value)) {
		if (value.length === 0) {
			return undefined;
		}
		if (value.length > 1) {
			throw new Error(
				`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`
			);
		}
		return value[0];
	}
	return value;
}

export { get_single_valued_header as g };