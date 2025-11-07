'use client';

import { shareHtmlAction } from '@/actions/md-to-html';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Code,
	Copy,
	Eye,
	FileDown,
	Link2,
	Loader2,
	Save,
	Share2,
	SplitSquareVertical,
	Trash2,
	Upload,
} from 'lucide-react';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Configure marked for GitHub Flavored Markdown
marked.use(gfmHeadingId());
marked.use({
	gfm: true,
	breaks: true,
});

const EXAMPLE_MARKDOWN = `# Markdown to HTML Converter

## Features

- [x] Real-time preview
- [x] Split view editor
- [x] File drag & drop
- [x] Share HTML with a link
- [ ] Advanced styling options

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
| Sharing | ✅ | High |

## Blockquote

> **Tip:** You can share your converted HTML with a unique link!

---

*Made with ❤️ using Markdown to HTML*
`;

const TURNDOWN_CDN_URL =
	'https://cdn.jsdelivr.net/npm/turndown@7.2.0/dist/turndown.js';
const TURNDOWN_SCRIPT_ID = 'turndown-cdn-script';

type TurndownStatic = new () => {
	turndown: (html: string) => string;
};

declare global {
	interface Window {
		TurndownService?: TurndownStatic;
	}
}

type ViewMode = 'split' | 'editor' | 'preview';
type ConvertMode = 'md2html' | 'html2md';

export function MdToHtmlConverter() {
	const [markdown, setMarkdown] = useState(EXAMPLE_MARKDOWN);
	const [html, setHtml] = useState('');
	const [documentTitle, setDocumentTitle] = useState('Markdown Document');
	const [viewMode, setViewMode] = useState<ViewMode>('split');
	const [convertMode, setConvertMode] = useState<ConvertMode>('md2html');
	const [isDragging, setIsDragging] = useState(false);
	const [isSaved, setIsSaved] = useState(true);
	const [isSharing, setIsSharing] = useState(false);
	const [removeCitations, setRemoveCitations] = useState(true);
	const [isTurndownReady, setIsTurndownReady] = useState(false);

	useEffect(() => {
		if (
			typeof window === 'undefined' ||
			convertMode !== 'html2md' ||
			isTurndownReady
		) {
			return;
		}

		if (window.TurndownService) {
			setIsTurndownReady(true);
			return;
		}

		const existingScript = document.getElementById(
			TURNDOWN_SCRIPT_ID,
		) as HTMLScriptElement | null;

		const handleLoad = () => {
			setIsTurndownReady(true);
		};

		const handleError = () => {
			toast.error(
				'Unable to load the HTML to Markdown converter. Please try again.',
			);
		};

		const script =
			existingScript ??
			Object.assign(document.createElement('script'), {
				id: TURNDOWN_SCRIPT_ID,
				src: TURNDOWN_CDN_URL,
				async: true,
			});

		script.addEventListener('load', handleLoad);
		script.addEventListener('error', handleError);

		if (!existingScript) {
			document.body.appendChild(script);
		}

		return () => {
			script.removeEventListener('load', handleLoad);
			script.removeEventListener('error', handleError);
		};
	}, [convertMode, isTurndownReady]);

	// Update preview whenever markdown changes
	useEffect(() => {
		try {
			if (convertMode === 'md2html') {
				let processedMarkdown = markdown;

				// Remove citations if enabled
				if (removeCitations) {
					processedMarkdown = processedMarkdown
						// Remove Citations: section
						.replace(/Citations:\s*(\n\[\d+\].*)*$/gm, '')
						// Remove citation markers
						.replace(/\[[\d,\s]+\](?:\[\d+\])?/g, '')
						// Remove Perplexity ***** format
						.replace(/\*{4,}\s*([^\n]+)/g, '$1')
						// Remove empty lines
						.replace(/^\s*[\r\n]/gm, '\n')
						// Remove multiple empty lines
						.replace(/\n{3,}/g, '\n\n')
						.trim();
				}

				const htmlContent = marked.parse(processedMarkdown, {
					gfm: true,
					breaks: true,
				}) as string;
				setHtml(htmlContent);
			} else {
				// HTML to Markdown
				if (
					typeof window === 'undefined' ||
					!isTurndownReady ||
					!window.TurndownService
				) {
					return;
				}

				const turndownService = new window.TurndownService();
				const mdContent = turndownService.turndown(markdown);
				setHtml(mdContent);
			}
		} catch (error) {
			console.error('Error converting:', error);
		}
	}, [markdown, convertMode, removeCitations, isTurndownReady]);

	// Auto-save indicator
	useEffect(() => {
		setIsSaved(false);
		const timer = setTimeout(() => {
			setIsSaved(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, [markdown]);

	const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file && (file.name.endsWith('.md') || file.name.endsWith('.html'))) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				setMarkdown(content);
				setDocumentTitle(file.name.replace(/\.(md|html)$/, ''));
				toast.success(`File "${file.name}" loaded successfully!`);
			};
			reader.readAsText(file);
		} else {
			toast.error('Please drop a .md or .html file');
		}
	}, []);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				setMarkdown(content);
				setDocumentTitle(file.name.replace(/\.(md|html)$/, ''));
				toast.success(`File "${file.name}" loaded successfully!`);
			};
			reader.readAsText(file);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const clearEditor = () => {
		setMarkdown('');
		toast.info('Editor cleared');
	};

	const loadExample = () => {
		setMarkdown(EXAMPLE_MARKDOWN);
		setDocumentTitle('Markdown Document');
		setConvertMode('md2html');
		toast.info('Example loaded');
	};

	const copyOutput = () => {
		navigator.clipboard.writeText(html);
		toast.success('Copied to clipboard!');
	};

	const downloadHtml = () => {
		const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentTitle}</title>
    <style>
        body {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
        }
        pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            background: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        table th,
        table td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        table th {
            background: #f5f5f5;
            font-weight: 600;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1rem;
            color: #666;
            margin: 1rem 0;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

		const blob = new Blob([fullHtml], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${documentTitle || 'document'}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast.success('HTML file downloaded!');
	};

	const shareHtml = async () => {
		if (!html.trim()) {
			toast.error('Please convert some markdown first');
			return;
		}

		setIsSharing(true);

		try {
			const result = await shareHtmlAction({
				markdown,
				html,
				title: documentTitle,
			});

			if (!result?.data) {
				toast.error('Failed to share HTML');
				return;
			}

			const actionData = result.data;

			if (!actionData.success) {
				toast.error(actionData.error || 'Failed to share HTML');
				return;
			}

			const shareId = actionData.data?.shareId;
			if (!shareId) {
				toast.error('Failed to generate share link');
				return;
			}

			// Generate share URL
			const shareUrl = `${window.location.origin}/share/${shareId}`;

			// Copy to clipboard
			await navigator.clipboard.writeText(shareUrl);

			toast.success('Share link copied to clipboard!');
		} catch (error) {
			console.error('Error sharing HTML:', error);
			toast.error('An error occurred while sharing');
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<div className="w-full space-y-4">
			{/* Header with controls */}
			<Card className="p-4">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 space-y-2">
						<Label htmlFor="document-title">Document Title</Label>
						<Input
							id="document-title"
							value={documentTitle}
							onChange={(e) => setDocumentTitle(e.target.value)}
							placeholder="Enter document title"
						/>
					</div>
					<div className="w-full md:w-48 space-y-2">
						<Label htmlFor="convert-mode">Convert Mode</Label>
						<select
							id="convert-mode"
							value={convertMode}
							onChange={(e) => setConvertMode(e.target.value as ConvertMode)}
							className="w-full h-10 px-3 rounded-md border border-input bg-background"
						>
							<option value="md2html">Markdown → HTML</option>
							<option value="html2md">HTML → Markdown</option>
						</select>
					</div>
				</div>

				{convertMode === 'md2html' && (
					<div className="flex items-center gap-2 mt-4">
						<input
							type="checkbox"
							id="remove-citations"
							checked={removeCitations}
							onChange={(e) => setRemoveCitations(e.target.checked)}
							className="w-4 h-4"
						/>
						<Label htmlFor="remove-citations" className="text-sm text-muted-foreground">
							Remove citations (from Perplexity.ai)
						</Label>
					</div>
				)}

				<div className="flex flex-wrap gap-2 mt-4">
					<Button onClick={shareHtml} disabled={isSharing} size="sm">
						{isSharing ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Sharing...
							</>
						) : (
							<>
								<Share2 className="w-4 h-4 mr-2" />
								Share Link
							</>
						)}
					</Button>

					<Button onClick={downloadHtml} variant="outline" size="sm">
						<FileDown className="w-4 h-4 mr-2" />
						Download HTML
					</Button>

					<Button onClick={copyOutput} variant="outline" size="sm">
						<Copy className="w-4 h-4 mr-2" />
						Copy Output
					</Button>

					<label>
						<Button variant="outline" size="sm" asChild>
							<span className="cursor-pointer">
								<Upload className="w-4 h-4 mr-2" />
								Upload File
							</span>
						</Button>
						<input
							type="file"
							accept=".md,.markdown,.html"
							onChange={handleFileInput}
							className="hidden"
						/>
					</label>

					<Button variant="outline" onClick={clearEditor} size="sm">
						<Trash2 className="w-4 h-4 mr-2" />
						Clear
					</Button>

					<Button variant="outline" onClick={loadExample} size="sm">
						Load Example
					</Button>

					<div className="ml-auto flex items-center gap-2">
						{isSaved ? (
							<span className="text-xs text-green-600 flex items-center gap-1">
								<Save className="w-3 h-3" />
								Saved
							</span>
						) : (
							<span className="text-xs text-muted-foreground">Saving...</span>
						)}
					</div>
				</div>
			</Card>

			{/* View mode selector */}
			<Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
				<TabsList className="grid w-full max-w-md grid-cols-3">
					<TabsTrigger value="split">
						<SplitSquareVertical className="w-4 h-4 mr-2" />
						Split
					</TabsTrigger>
					<TabsTrigger value="editor">
						<Code className="w-4 h-4 mr-2" />
						Editor
					</TabsTrigger>
					<TabsTrigger value="preview">
						<Eye className="w-4 h-4 mr-2" />
						Preview
					</TabsTrigger>
				</TabsList>

				<TabsContent value="split" className="mt-4">
					<div className="grid md:grid-cols-2 gap-4">
						<EditorPanel
							content={markdown}
							setContent={setMarkdown}
							isDragging={isDragging}
							handleDragOver={handleDragOver}
							handleDragLeave={handleDragLeave}
							handleFileDrop={handleFileDrop}
							label={convertMode === 'md2html' ? 'Markdown Input' : 'HTML Input'}
						/>
						<PreviewPanel
							html={html}
							isRaw={convertMode === 'html2md'}
							label={convertMode === 'md2html' ? 'HTML Output' : 'Markdown Output'}
						/>
					</div>
				</TabsContent>

				<TabsContent value="editor" className="mt-4">
					<EditorPanel
						content={markdown}
						setContent={setMarkdown}
						isDragging={isDragging}
						handleDragOver={handleDragOver}
						handleDragLeave={handleDragLeave}
						handleFileDrop={handleFileDrop}
						label={convertMode === 'md2html' ? 'Markdown Input' : 'HTML Input'}
					/>
				</TabsContent>

				<TabsContent value="preview" className="mt-4">
					<PreviewPanel
						html={html}
						isRaw={convertMode === 'html2md'}
						label={convertMode === 'md2html' ? 'HTML Output' : 'Markdown Output'}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

interface EditorPanelProps {
	content: string;
	setContent: (value: string) => void;
	isDragging: boolean;
	handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragLeave: () => void;
	handleFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	label: string;
}

function EditorPanel({
	content,
	setContent,
	isDragging,
	handleDragOver,
	handleDragLeave,
	handleFileDrop,
	label,
}: EditorPanelProps) {
	const lineCount = content.split('\n').length;

	return (
		<div>
			<h3 className="text-sm font-medium mb-2">{label}</h3>
			<Card
				className={`relative overflow-hidden transition-all h-[600px] ${
					isDragging ? 'border-primary border-2 bg-primary/5' : ''
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleFileDrop}
			>
				<div className="flex h-full">
					{/* Line numbers */}
					<div className="w-12 bg-muted/30 text-muted-foreground text-xs font-mono p-4 select-none overflow-hidden">
						{Array.from({ length: lineCount }, (_, i) => (
							<div key={i} className="text-right leading-6">
								{i + 1}
							</div>
						))}
					</div>

					{/* Editor */}
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-transparent leading-6"
						placeholder="Type or paste your content here, or drag and drop a file..."
					/>
				</div>

				{isDragging && (
					<div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
						<div className="text-center">
							<Upload className="w-12 h-12 mx-auto mb-2 text-primary" />
							<p className="text-lg font-semibold">Drop your file here</p>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}

interface PreviewPanelProps {
	html: string;
	isRaw?: boolean;
	label: string;
}

function PreviewPanel({ html, isRaw = false, label }: PreviewPanelProps) {
	return (
		<div>
			<h3 className="text-sm font-medium mb-2">{label}</h3>
			<Card className="p-6 h-[600px] overflow-auto">
				{isRaw ? (
					<pre className="font-mono text-sm whitespace-pre-wrap">{html}</pre>
				) : (
					<>
						<style>{`
							.preview-content {
								font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
								line-height: 1.6;
							}
							.preview-content h1 {
								font-size: 2em;
								font-weight: 600;
								margin-top: 24px;
								margin-bottom: 16px;
								padding-bottom: 0.3em;
								border-bottom: 1px solid #e5e7eb;
							}
							.preview-content h2 {
								font-size: 1.5em;
								font-weight: 600;
								margin-top: 24px;
								margin-bottom: 16px;
								padding-bottom: 0.3em;
								border-bottom: 1px solid #e5e7eb;
							}
							.preview-content h3 {
								font-size: 1.25em;
								font-weight: 600;
								margin-top: 24px;
								margin-bottom: 16px;
							}
							.preview-content pre {
								background: #f6f8fa;
								border-radius: 6px;
								padding: 16px;
								overflow-x: auto;
								margin: 16px 0;
							}
							.preview-content code {
								background: #f6f8fa;
								padding: 0.2em 0.4em;
								border-radius: 3px;
								font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
								font-size: 85%;
							}
							.preview-content pre code {
								background: transparent;
								padding: 0;
							}
							.preview-content blockquote {
								border-left: 4px solid #dfe2e5;
								padding-left: 1em;
								color: #6a737d;
								margin: 16px 0;
							}
							.preview-content table {
								border-collapse: collapse;
								width: 100%;
								margin: 16px 0;
							}
							.preview-content table th,
							.preview-content table td {
								border: 1px solid #dfe2e5;
								padding: 6px 13px;
							}
							.preview-content table th {
								background: #f6f8fa;
								font-weight: 600;
							}
							.preview-content table tr:nth-child(2n) {
								background: #f6f8fa;
							}
							.preview-content ul,
							.preview-content ol {
								padding-left: 2em;
								margin: 16px 0;
							}
							.preview-content li {
								margin: 4px 0;
							}
							.preview-content input[type="checkbox"] {
								margin-right: 0.5em;
							}
							.preview-content hr {
								border: 0;
								border-top: 2px solid #e5e7eb;
								margin: 24px 0;
							}
							.preview-content a {
								color: #0969da;
								text-decoration: none;
							}
							.preview-content a:hover {
								text-decoration: underline;
							}
							.preview-content img {
								max-width: 100%;
							}
						`}</style>
						<div
							className="preview-content"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</>
				)}
			</Card>
		</div>
	);
}
