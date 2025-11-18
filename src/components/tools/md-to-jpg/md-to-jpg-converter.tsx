'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Download,
	FileImage,
	Image as ImageIcon,
	Loader2,
	Settings,
	Trash2,
	Upload,
	X,
} from 'lucide-react';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import html2canvas from 'html2canvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { EXAMPLE_MARKDOWN, IMAGE_QUALITY_OPTIONS, PRESET_SIZES } from './constants';
import type { MdToJpgConfig } from './types';
import { downloadImage, mergeConfig, validateConfig } from './utils';

// Configure marked for GitHub Flavored Markdown
marked.use(gfmHeadingId());
marked.use({
	gfm: true,
	breaks: true,
});

type ViewMode = 'split' | 'editor' | 'preview';

export function MdToJpgConverter() {
	const [markdown, setMarkdown] = useState(EXAMPLE_MARKDOWN);
	const [html, setHtml] = useState('');
	const [documentTitle, setDocumentTitle] = useState('Markdown Document');
	const [viewMode, setViewMode] = useState<ViewMode>('split');
	const [isDragging, setIsDragging] = useState(false);
	const [isConverting, setIsConverting] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [config, setConfig] = useState<MdToJpgConfig>({});
	const previewRef = useRef<HTMLDivElement>(null);

	// Update HTML preview whenever markdown changes
	useEffect(() => {
		try {
			const htmlContent = marked.parse(markdown, {
				gfm: true,
				breaks: true,
			}) as string;
			setHtml(htmlContent);
		} catch (error) {
			console.error('Error converting markdown:', error);
			toast.error('Markdown parsing error');
		}
	}, [markdown]);

	const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file && file.name.endsWith('.md')) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				setMarkdown(content);
				setDocumentTitle(file.name.replace(/\.md$/, ''));
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
				setDocumentTitle(file.name.replace(/\.md$/, ''));
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

	const handleConfigChange = (field: keyof MdToJpgConfig, value: any) => {
		setConfig((prev) => ({ ...prev, [field]: value }));
	};

	const applyPresetSize = (preset: (typeof PRESET_SIZES)[number]) => {
		setConfig((prev) => ({
			...prev,
			width: preset.width,
			height: preset.height,
		}));
		toast.success(`Preset size applied: ${preset.label}`);
	};

	const convertToJpg = async () => {
		if (!previewRef.current) {
			toast.error('Preview area not found');
			return;
		}

		const validationError = validateConfig(config);
		if (validationError) {
			toast.error(validationError);
			return;
		}

		setIsConverting(true);

		try {
			const mergedConfig = mergeConfig(config);

			// Create temporary container for screenshot
			const tempContainer = document.createElement('div');
			tempContainer.style.position = 'absolute';
			tempContainer.style.left = '-9999px';
			tempContainer.style.top = '0';
			tempContainer.style.width = `${mergedConfig.width}px`;
			tempContainer.style.minHeight = `${mergedConfig.height}px`;
			tempContainer.style.backgroundColor = mergedConfig.backgroundColor;
			tempContainer.style.padding = '40px';
			tempContainer.style.fontFamily =
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
			tempContainer.style.lineHeight = '1.6';
			tempContainer.style.color = '#333';
			tempContainer.style.boxSizing = 'border-box';

			// Copy preview content and styles
			const previewContent = previewRef.current.cloneNode(true) as HTMLElement;
			previewContent.style.width = '100%';
			previewContent.style.height = 'auto';
			tempContainer.appendChild(previewContent);

			document.body.appendChild(tempContainer);

			// Wait for content rendering and image loading
			await new Promise((resolve) => setTimeout(resolve, 300));

			// Use html2canvas to capture screenshot
			const canvas = await html2canvas(tempContainer, {
				width: mergedConfig.width,
				height: Math.max(mergedConfig.height, tempContainer.scrollHeight),
				scale: mergedConfig.scale,
				backgroundColor: mergedConfig.backgroundColor,
				useCORS: true,
				logging: false,
				allowTaint: false,
				removeContainer: true,
			});

			// Clean up temporary container
			document.body.removeChild(tempContainer);

			// Convert to JPG
			const dataUrl = canvas.toDataURL('image/jpeg', mergedConfig.quality);

			// Download image
			const filename = `${documentTitle || 'markdown'}.jpg`;
			downloadImage(dataUrl, filename);

			toast.success('JPG image generated and downloaded!');
		} catch (error) {
			console.error('Error converting to JPG:', error);
			toast.error('Conversion failed, please try again');
		} finally {
			setIsConverting(false);
		}
	};

	const mergedConfig = mergeConfig(config);

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
					<div className="flex items-end gap-2">
						<Button
							onClick={() => setShowSettings(!showSettings)}
							variant={showSettings ? 'default' : 'outline'}
							size="sm"
						>
							<Settings className="w-4 h-4 mr-2" />
							Settings
						</Button>
						<Button
							onClick={convertToJpg}
							disabled={isConverting || !html.trim()}
							size="sm"
						>
							{isConverting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Converting...
								</>
							) : (
								<>
									<FileImage className="w-4 h-4 mr-2" />
									Convert to JPG
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Settings Panel */}
				{showSettings && (
					<div className="mt-4 p-4 border rounded-lg space-y-4 bg-muted/50">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold">Image Settings</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowSettings(false)}
							>
								<X className="w-4 h-4" />
							</Button>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="width">Width (px)</Label>
								<Input
									id="width"
									type="number"
									value={config.width ?? mergedConfig.width}
									onChange={(e) =>
										handleConfigChange('width', parseInt(e.target.value, 10))
									}
									min={100}
									max={5000}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="height">Height (px)</Label>
								<Input
									id="height"
									type="number"
									value={config.height ?? mergedConfig.height}
									onChange={(e) =>
										handleConfigChange('height', parseInt(e.target.value, 10))
									}
									min={100}
									max={5000}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="scale">Scale</Label>
								<Input
									id="scale"
									type="number"
									step="0.1"
									value={config.scale ?? mergedConfig.scale}
									onChange={(e) =>
										handleConfigChange('scale', parseFloat(e.target.value))
									}
									min={0.5}
									max={5}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="quality">Image Quality</Label>
								<Select
									value={String(config.quality ?? mergedConfig.quality)}
									onValueChange={(value) =>
										handleConfigChange('quality', parseFloat(value))
									}
								>
									<SelectTrigger id="quality">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{IMAGE_QUALITY_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={String(option.value)}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="backgroundColor">Background Color</Label>
								<div className="flex gap-2">
									<Input
										id="backgroundColor"
										type="color"
										value={config.backgroundColor ?? mergedConfig.backgroundColor}
										onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
										className="w-20"
									/>
									<Input
										type="text"
										value={config.backgroundColor ?? mergedConfig.backgroundColor}
										onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
										placeholder="#ffffff"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Preset Sizes</Label>
							<div className="flex flex-wrap gap-2">
								{PRESET_SIZES.map((preset) => (
									<Button
										key={preset.label}
										variant="outline"
										size="sm"
										onClick={() => applyPresetSize(preset)}
									>
										{preset.label}
									</Button>
								))}
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-wrap gap-2 mt-4">
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
				</div>
			</Card>

			{/* View mode selector */}
			<div className="flex gap-2">
				<Button
					variant={viewMode === 'split' ? 'default' : 'outline'}
					size="sm"
					onClick={() => setViewMode('split')}
				>
					Split
				</Button>
				<Button
					variant={viewMode === 'editor' ? 'default' : 'outline'}
					size="sm"
					onClick={() => setViewMode('editor')}
				>
					Editor
				</Button>
				<Button
					variant={viewMode === 'preview' ? 'default' : 'outline'}
					size="sm"
					onClick={() => setViewMode('preview')}
				>
					<ImageIcon className="w-4 h-4 mr-2" />
					Preview
				</Button>
			</div>

			{/* Content panels */}
			{viewMode === 'split' && (
				<div className="grid md:grid-cols-2 gap-4">
					<EditorPanel
						content={markdown}
						setContent={setMarkdown}
						isDragging={isDragging}
						handleDragOver={handleDragOver}
						handleDragLeave={handleDragLeave}
						handleFileDrop={handleFileDrop}
					/>
					<PreviewPanel html={html} previewRef={previewRef} />
				</div>
			)}

			{viewMode === 'editor' && (
				<EditorPanel
					content={markdown}
					setContent={setMarkdown}
					isDragging={isDragging}
					handleDragOver={handleDragOver}
					handleDragLeave={handleDragLeave}
					handleFileDrop={handleFileDrop}
				/>
			)}

			{viewMode === 'preview' && (
				<PreviewPanel html={html} previewRef={previewRef} />
			)}
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
}

function EditorPanel({
	content,
	setContent,
	isDragging,
	handleDragOver,
	handleDragLeave,
	handleFileDrop,
}: EditorPanelProps) {
	const lineCount = content.split('\n').length;

	return (
		<div>
			<h3 className="text-sm font-medium mb-2">Markdown Input</h3>
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
						placeholder="Type or paste your Markdown content here, or drag and drop a file..."
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
	previewRef: React.RefObject<HTMLDivElement | null>;
}

function PreviewPanel({ html, previewRef }: PreviewPanelProps) {
	return (
		<div>
			<h3 className="text-sm font-medium mb-2">Preview</h3>
			<Card className="p-6 h-[600px] overflow-auto">
				<style>{`
					.preview-content {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
						line-height: 1.6;
						color: #333;
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
						height: auto;
					}
				`}</style>
				<div
					ref={previewRef}
					className="preview-content"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</Card>
		</div>
	);
}

