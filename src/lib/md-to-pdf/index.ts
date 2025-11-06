import grayMatter from 'gray-matter';
import { defaultMdToPdfConfig, type MdToPdfConfig } from './config';
import { getHtml } from './get-html';
import { getMarginObject } from './helpers';
import { getBrowserConfig, getPuppeteerPackage } from './browser-config';
import type { Browser } from 'puppeteer-core';
import type { PuppeteerLike } from './types';

export type { MdToPdfConfig } from './config';

export interface MdToPdfResult {
	content: Buffer;
	success: boolean;
	error?: string;
}

/**
 * Convert markdown content to PDF.
 */
export async function convertMarkdownToPdf(
	markdown: string,
	config: MdToPdfConfig = {},
): Promise<MdToPdfResult> {
	let browser: Browser | null = null;

	try {
		// Parse front-matter
		const { content: md, data: frontMatterConfig } = grayMatter(markdown, {
			engines: {
				js: () =>
					new Error(
						'The JS engine for front-matter is disabled by default for security reasons.',
					),
			},
		});

		// Merge configurations
		let mergedConfig: Required<MdToPdfConfig> = {
			...defaultMdToPdfConfig,
			...config,
		};

		// Merge front-matter config if valid
		if (frontMatterConfig && !(frontMatterConfig instanceof Error)) {
			mergedConfig = {
				...mergedConfig,
				...(frontMatterConfig as MdToPdfConfig),
				pdf_options: {
					...mergedConfig.pdf_options,
					...frontMatterConfig.pdf_options,
				},
			};
		}

		// Handle header/footer templates
		const { headerTemplate, footerTemplate, displayHeaderFooter } = mergedConfig.pdf_options;

		if ((headerTemplate || footerTemplate) && displayHeaderFooter === undefined) {
			mergedConfig.pdf_options.displayHeaderFooter = true;
		}

		// Sanitize margin
		if (typeof mergedConfig.pdf_options.margin === 'string') {
			mergedConfig.pdf_options.margin = getMarginObject(mergedConfig.pdf_options.margin);
		}

		// Ensure body_class is an array
		if (!Array.isArray(mergedConfig.body_class)) {
			mergedConfig.body_class = [mergedConfig.body_class].filter(Boolean);
		}

		// Generate HTML
		const html = getHtml(md, mergedConfig);

		// Load the appropriate puppeteer package (full vs core)
		const puppeteer = await loadPuppeteer();

		// Launch browser with environment-specific config
		const browserConfig = await getBrowserConfig(puppeteer);
		browser = await puppeteer.launch(browserConfig);

		const page = await browser.newPage();

		// Set content
		await page.setContent(html, { waitUntil: 'networkidle0' });

		// Add highlight.js stylesheet
		const highlightStyleUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${mergedConfig.highlight_style}.min.css`;
		await page.addStyleTag({ url: highlightStyleUrl });

		// Add default markdown styles
		await page.addStyleTag({
			content: `
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
					line-height: 1.6;
					padding: 2em;
					max-width: 900px;
					margin: 0 auto;
				}
				pre {
					background: #f6f8fa;
					border-radius: 3px;
					padding: 1em;
					overflow-x: auto;
				}
				code {
					background: #f6f8fa;
					padding: 0.2em 0.4em;
					border-radius: 3px;
					font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
					font-size: 85%;
				}
				pre code {
					background: transparent;
					padding: 0;
				}
				blockquote {
					border-left: 4px solid #dfe2e5;
					padding-left: 1em;
					color: #6a737d;
					margin: 0;
				}
				table {
					border-collapse: collapse;
					width: 100%;
				}
				table th, table td {
					border: 1px solid #dfe2e5;
					padding: 0.5em 1em;
				}
				table th {
					background: #f6f8fa;
				}
				img {
					max-width: 100%;
				}
				.page-break {
					page-break-after: always;
				}
			`,
		});

		// Add custom CSS if provided
		if (mergedConfig.css) {
			await page.addStyleTag({ content: mergedConfig.css });
		}

		// Emulate media type
		await page.emulateMediaType(mergedConfig.page_media_type);

		// Generate PDF
		const pdfBuffer = await page.pdf(mergedConfig.pdf_options);

		await browser.close();

		// Convert Uint8Array to Buffer for consistent return type
		const buffer = Buffer.from(pdfBuffer);

		return {
			content: buffer,
			success: true,
		};
	} catch (error) {
		if (browser) {
			await browser.close();
		}

		return {
			content: Buffer.from([]),
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
}

async function loadPuppeteer(): Promise<PuppeteerLike> {
	const packageName = getPuppeteerPackage();

	if (packageName === 'puppeteer-core') {
		return (await import('puppeteer-core')).default;
	}

	return (await import('puppeteer')).default;
}
