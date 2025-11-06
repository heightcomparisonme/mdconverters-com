/**
 * Check if a string is a valid HTTP URL.
 */
export function isHttpUrl(str: string): boolean {
	try {
		const url = new URL(str);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * Convert a CSS margin string to a margin object.
 */
export function getMarginObject(margin: string) {
	const margins = margin.split(' ');

	if (margins.length === 1) {
		return {
			top: margins[0],
			right: margins[0],
			bottom: margins[0],
			left: margins[0],
		};
	}

	if (margins.length === 2) {
		return {
			top: margins[0],
			right: margins[1],
			bottom: margins[0],
			left: margins[1],
		};
	}

	if (margins.length === 3) {
		return {
			top: margins[0],
			right: margins[1],
			bottom: margins[2],
			left: margins[1],
		};
	}

	return {
		top: margins[0],
		right: margins[1],
		bottom: margins[2],
		left: margins[3],
	};
}
