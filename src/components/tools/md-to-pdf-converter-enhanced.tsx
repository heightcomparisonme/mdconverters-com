'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { convertMdToPdfAction } from '@/actions/md-to-pdf';
import { toast } from 'sonner';
import {
	FileDown,
	Loader2,
	Upload,
	Eye,
	Code,
	SplitSquareVertical,
	Trash2,
	Save,
} from 'lucide-react';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked for GitHub Flavored Markdown
marked.use(gfmHeadingId());
marked.use(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		},
	}),
);

const HIGHLIGHT_STYLES = [
	'github',
	'github-dark',
	'monokai',
	'tomorrow',
	'vs',
	'atom-one-dark',
	'atom-one-light',
	'solarized-light',
	'solarized-dark',
];

const EXAMPLE_MARKDOWN = `# Markdown to PDF Converter

### GitHub Flavored Markdown Support

This converter supports **GitHub Flavored Markdown** with all the features you love!

## Features

- [x] Real-time preview
- [x] Split view editor
- [x] File drag & drop
- [x] Syntax highlighting
- [ ] Advanced PDF options

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
| Styling | ✅ | Medium |

## Blockquote

> **Tip:** You can drag and drop markdown files into the editor!

---

## Math Support (coming soon)

Inline math: \`E = mc^2\`

Block math:
\`\`\`
∫₀^∞ e^(-x²) dx = √π/2
\`\`\`

*Made with ❤️ using Markdown to PDF*
`;

type ViewMode = 'split' | 'editor' | 'preview';

export function MdToPdfConverterEnhanced() {
	const [markdown, setMarkdown] = useState(EXAMPLE_MARKDOWN);
	const [isConverting, setIsConverting] = useState(false);
	const [documentTitle, setDocumentTitle] = useState('Markdown Document');
	const [highlightStyle, setHighlightStyle] = useState('github');
	const [viewMode, setViewMode] = useState<ViewMode>('split');
	const [previewHtml, setPreviewHtml] = useState('');
	const [isDragging, setIsDragging] = useState(false);
	const [isSaved, setIsSaved] = useState(true);

	// Update preview whenever markdown changes
	useEffect(() => {
		try {
			const html = marked.parse(markdown, {
				gfm: true,
				breaks: true,
			}) as string;
			setPreviewHtml(html);
		} catch (error) {
			console.error('Error parsing markdown:', error);
		}
	}, [markdown]);

	// Auto-save indicator
	useEffect(() => {
		setIsSaved(false);
		const timer = setTimeout(() => {
			setIsSaved(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, [markdown]);

	const handleConvert = async () => {
		if (!markdown.trim()) {
			toast.error('Please enter some markdown content');
			return;
		}

		setIsConverting(true);

		try {
			const result = await convertMdToPdfAction({
				markdown,
				config: {
					document_title: documentTitle,
					highlight_style: highlightStyle,
					page_media_type: 'screen',
				},
			});

			// Debug: Log the result structure
			console.log('Server Action Result:', result);

			// Check if the action was successful
			if (!result?.data) {
				toast.error('No data returned from server');
				console.error('Result:', result);
				return;
			}

			const actionData = result.data;

			// Check if the conversion was successful
			if (!actionData.success) {
				toast.error(actionData.error || 'Failed to convert markdown to PDF');
				return;
			}

			// Get the PDF data
			if (!actionData.data?.pdf) {
				toast.error('No PDF data in response');
				console.error('Action Data:', actionData);
				return;
			}

			const base64Pdf = actionData.data.pdf;

			// Validate base64 string
			if (typeof base64Pdf !== 'string' || base64Pdf.length === 0) {
				toast.error('Invalid PDF data received');
				console.error('Invalid base64 PDF:', base64Pdf);
				return;
			}

			// Decode base64 and create blob
			try {
				const binaryString = atob(base64Pdf);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}
				const blob = new Blob([bytes], { type: 'application/pdf' });

				// Download the file
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${documentTitle || 'document'}.pdf`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				toast.success('PDF generated successfully!');
			} catch (decodeError) {
				console.error('Error decoding base64:', decodeError);
				console.error('Base64 string length:', base64Pdf.length);
				console.error('First 100 chars:', base64Pdf.substring(0, 100));
				toast.error('Failed to decode PDF data');
			}
		} catch (error) {
			console.error('Error converting markdown to PDF:', error);
			toast.error('An error occurred while converting to PDF');
		} finally {
			setIsConverting(false);
		}
	};

	const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file && file.name.endsWith('.md')) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				setMarkdown(content);
				setDocumentTitle(file.name.replace('.md', ''));
				toast.success(`File "${file.name}" loaded successfully!`);
			};
			reader.readAsText(file);
		} else {
			toast.error('Please drop a .md file');
		}
	}, []);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				setMarkdown(content);
				setDocumentTitle(file.name.replace('.md', ''));
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
		toast.info('Example loaded');
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
						<Label htmlFor="highlight-style">Highlight Style</Label>
						<Select value={highlightStyle} onValueChange={setHighlightStyle}>
							<SelectTrigger id="highlight-style">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{HIGHLIGHT_STYLES.map((style) => (
									<SelectItem key={style} value={style}>
										{style}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 mt-4">
					<Button onClick={handleConvert} disabled={isConverting} size="sm">
						{isConverting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Converting...
							</>
						) : (
							<>
								<FileDown className="w-4 h-4 mr-2" />
								Download PDF
							</>
						)}
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
							accept=".md,.markdown"
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
							markdown={markdown}
							setMarkdown={setMarkdown}
							isDragging={isDragging}
							handleDragOver={handleDragOver}
							handleDragLeave={handleDragLeave}
							handleFileDrop={handleFileDrop}
						/>
						<PreviewPanel html={previewHtml} highlightStyle={highlightStyle} />
					</div>
				</TabsContent>

				<TabsContent value="editor" className="mt-4">
					<EditorPanel
						markdown={markdown}
						setMarkdown={setMarkdown}
						isDragging={isDragging}
						handleDragOver={handleDragOver}
						handleDragLeave={handleDragLeave}
						handleFileDrop={handleFileDrop}
					/>
				</TabsContent>

				<TabsContent value="preview" className="mt-4">
					<PreviewPanel html={previewHtml} highlightStyle={highlightStyle} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

interface EditorPanelProps {
	markdown: string;
	setMarkdown: (value: string) => void;
	isDragging: boolean;
	handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragLeave: () => void;
	handleFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

function EditorPanel({
	markdown,
	setMarkdown,
	isDragging,
	handleDragOver,
	handleDragLeave,
	handleFileDrop,
}: EditorPanelProps) {
	const lineCount = markdown.split('\n').length;

	return (
		<Card
			className={`relative overflow-hidden transition-all ${
				isDragging ? 'border-primary border-2 bg-primary/5' : ''
			}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleFileDrop}
		>
			<div className="flex h-[600px]">
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
					value={markdown}
					onChange={(e) => setMarkdown(e.target.value)}
					className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-transparent leading-6"
					placeholder="Type or paste your markdown here, or drag and drop a .md file..."
				/>
			</div>

			{isDragging && (
				<div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
					<div className="text-center">
						<Upload className="w-12 h-12 mx-auto mb-2 text-primary" />
						<p className="text-lg font-semibold">Drop your .md file here</p>
					</div>
				</div>
			)}
		</Card>
	);
}

interface PreviewPanelProps {
	html: string;
	highlightStyle: string;
}

function PreviewPanel({ html, highlightStyle }: PreviewPanelProps) {
	return (
		<Card className="p-6 h-[600px] overflow-auto">
			<link
				rel="stylesheet"
				href={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${highlightStyle}.min.css`}
			/>
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
		</Card>
	);
}
