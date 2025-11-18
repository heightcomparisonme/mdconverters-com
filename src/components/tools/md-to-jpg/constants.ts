export const EXAMPLE_MARKDOWN = `# Markdown to JPG Converter

## Features

- [x] Real-time preview
- [x] High-quality image export
- [x] Custom dimensions and styles
- [x] Support for all Markdown syntax

## Code Example

\`\`\`javascript
function convertMarkdown(text) {
  return marked.parse(text, {
    gfm: true,
    breaks: true,
  });
}

console.log('Hello, World!');
\`\`\`

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Preview | ✅ | High |
| Export | ✅ | High |
| Custom | ✅ | High |

## Blockquote

> **Tip:** You can convert your Markdown documents to high-quality JPG images!

---

*Made with ❤️ using Markdown to JPG Converter*
`;

export const DEFAULT_CONFIG = {
	width: 1200,
	height: 1600,
	scale: 2,
	backgroundColor: '#ffffff',
	quality: 0.95,
} as const;

export const IMAGE_QUALITY_OPTIONS = [
	{ label: 'Low Quality (0.7)', value: 0.7 },
	{ label: 'Medium Quality (0.85)', value: 0.85 },
	{ label: 'High Quality (0.95)', value: 0.95 },
	{ label: 'Maximum Quality (1.0)', value: 1.0 },
] as const;

export const PRESET_SIZES = [
	{ label: 'A4 Portrait (1200x1600)', width: 1200, height: 1600 },
	{ label: 'A4 Landscape (1600x1200)', width: 1600, height: 1200 },
	{ label: 'Square (1200x1200)', width: 1200, height: 1200 },
	{ label: 'Social Media (1080x1080)', width: 1080, height: 1080 },
	{ label: 'Banner (1920x1080)', width: 1920, height: 1080 },
] as const;

