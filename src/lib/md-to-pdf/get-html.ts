import type { MdToPdfConfig } from './config';
import { getMarked } from './get-marked';

/**
 * Generates an HTML document from a markdown string and returns it as a string.
 */
export function getHtml(md: string, config: Required<MdToPdfConfig>): string {
	const marked = getMarked(config.marked_options, config.marked_extensions);
	const htmlContent = marked.parse(md) as string;

	return `<!DOCTYPE html>
<html>
	<head>
		<title>${config.document_title}</title>
		<meta charset="utf-8">
	</head>
	<body class="${config.body_class.join(' ')}">
		${htmlContent}
	</body>
</html>`;
}
