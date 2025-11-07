'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { DEFAULT_MARKDOWN_TEMPLATE } from './default-template';
import type { MarkdownViewerProps } from './types';
import './markdown-viewer.css';
import 'github-markdown-css/github-markdown-light.css';

const LOCAL_STORAGE_KEY = 'markdown-viewer-content';
const SCROLL_SYNC_KEY = 'markdown-viewer-scroll-sync';

export function MarkdownViewer({
	defaultValue,
	onValueChange,
	className = '',
	fullScreen = true,
}: MarkdownViewerProps) {
	const [markdown, setMarkdown] = useState<string>('');
	const [html, setHtml] = useState<string>('');
	const [scrollSync, setScrollSync] = useState<boolean>(false);
	const [hasEdited, setHasEdited] = useState<boolean>(false);
	const [leftWidth, setLeftWidth] = useState<number>(50); // percentage
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
	const previewRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const dividerRef = useRef<HTMLDivElement>(null);

	// Load initial content from localStorage or use default
	useEffect(() => {
		const savedContent =
			typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
		const syncSetting =
			typeof window !== 'undefined' ? localStorage.getItem(SCROLL_SYNC_KEY) : null;

		const initialContent = defaultValue || savedContent || DEFAULT_MARKDOWN_TEMPLATE;
		setMarkdown(initialContent);
		convertMarkdown(initialContent);

		if (syncSetting) {
			setScrollSync(syncSetting === 'true');
		}
	}, [defaultValue]);

	// Convert markdown to HTML
	const convertMarkdown = useCallback((md: string) => {
		const rawHtml = marked.parse(md) as string;
		const sanitized = DOMPurify.sanitize(rawHtml);
		setHtml(sanitized);
	}, []);

	// Handle editor mount
	const handleEditorMount: OnMount = useCallback((editor) => {
		editorRef.current = editor;

		// Setup scroll sync listener
		editor.onDidScrollChange((e) => {
			if (!scrollSync || !previewRef.current) return;

			const scrollTop = e.scrollTop;
			const scrollHeight = e.scrollHeight;
			const height = editor.getLayoutInfo().height;
			const maxScrollTop = scrollHeight - height;

			if (maxScrollTop <= 0) return;

			const scrollRatio = scrollTop / maxScrollTop;
			const previewElement = previewRef.current;
			const targetY = (previewElement.scrollHeight - previewElement.clientHeight) * scrollRatio;
			previewElement.scrollTo(0, targetY);
		});
	}, [scrollSync]);

	// Handle content change
	const handleEditorChange = useCallback(
		(value: string | undefined) => {
			const newValue = value || '';
			setMarkdown(newValue);
			convertMarkdown(newValue);
			setHasEdited(true);

			// Save to localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem(LOCAL_STORAGE_KEY, newValue);
			}

			// Call parent callback
			onValueChange?.(newValue);
		},
		[convertMarkdown, onValueChange],
	);

	// Handle reset
	const handleReset = useCallback(() => {
		if (hasEdited || markdown !== DEFAULT_MARKDOWN_TEMPLATE) {
			const confirmed = window.confirm(
				'Are you sure you want to reset? Your changes will be lost.',
			);
			if (!confirmed) return;
		}

		setMarkdown(DEFAULT_MARKDOWN_TEMPLATE);
		convertMarkdown(DEFAULT_MARKDOWN_TEMPLATE);
		setHasEdited(false);

		if (editorRef.current) {
			editorRef.current.setValue(DEFAULT_MARKDOWN_TEMPLATE);
			editorRef.current.revealPosition({ lineNumber: 1, column: 1 });
			editorRef.current.focus();
		}

		if (previewRef.current) {
			previewRef.current.scrollTo({ top: 0 });
		}
	}, [hasEdited, markdown, convertMarkdown]);

	// Handle copy
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(markdown);
			// Could show a toast notification here
			alert('Copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}, [markdown]);

	// Handle scroll sync toggle
	const handleScrollSyncToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;
		setScrollSync(checked);
		if (typeof window !== 'undefined') {
			localStorage.setItem(SCROLL_SYNC_KEY, String(checked));
		}
	}, []);

	// Handle divider dragging
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging || !containerRef.current) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const offsetX = e.clientX - containerRect.left;
			const percentage = (offsetX / containerRect.width) * 100;

			// Constrain between 20% and 80%
			const newWidth = Math.max(20, Math.min(80, percentage));
			setLeftWidth(newWidth);
		};

		const handleMouseUp = () => {
			if (isDragging) {
				setIsDragging(false);
				document.body.style.cursor = 'default';
				document.body.style.userSelect = '';
			}
		};

		if (isDragging) {
			document.body.style.cursor = 'col-resize';
			document.body.style.userSelect = 'none';
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging]);

	const handleDividerMouseDown = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleDividerDoubleClick = useCallback(() => {
		setLeftWidth(50);
	}, []);

	const containerClass = fullScreen
		? 'markdown-viewer-container'
		: `markdown-viewer-container ${className}`;

	return (
		<div className={containerClass}>
			<header className="markdown-viewer-header">
				<div className="markdown-viewer-menu-items">
					<div className="markdown-viewer-menu-item">
						<a href="#">Markdown Viewer</a>
					</div>
					<div className="markdown-viewer-menu-item">
						<a href="#" onClick={(e) => { e.preventDefault(); handleReset(); }}>
							Reset
						</a>
					</div>
					<div className="markdown-viewer-menu-item">
						<a href="#" onClick={(e) => { e.preventDefault(); handleCopy(); }}>
							Copy
						</a>
					</div>
					<div className="markdown-viewer-menu-item">
						<input
							type="checkbox"
							id="sync-scroll-checkbox"
							checked={scrollSync}
							onChange={handleScrollSyncToggle}
						/>
						<label htmlFor="sync-scroll-checkbox">Sync scroll</label>
					</div>
				</div>
			</header>

			<div ref={containerRef} className="markdown-viewer-split-container">
				<div
					className="markdown-viewer-editor-pane"
					style={{ width: `${leftWidth}%` }}
				>
					<div className="markdown-viewer-editor-wrapper">
						<Editor
							height="100%"
							defaultLanguage="markdown"
							value={markdown}
							onChange={handleEditorChange}
							onMount={handleEditorMount}
							theme="vs-light"
							options={{
								fontSize: 14,
								minimap: { enabled: false },
								scrollBeyondLastLine: false,
								automaticLayout: true,
								wordWrap: 'on',
								hover: { enabled: false },
								quickSuggestions: false,
								suggestOnTriggerCharacters: false,
								folding: false,
								lineNumbers: 'on',
								renderLineHighlight: 'none',
								scrollbar: {
									vertical: 'visible',
									horizontal: 'visible',
								},
							}}
						/>
					</div>
				</div>

				<div
					ref={dividerRef}
					className={`markdown-viewer-split-divider ${isDragging ? 'active' : ''}`}
					onMouseDown={handleDividerMouseDown}
					onDoubleClick={handleDividerDoubleClick}
					onMouseEnter={() => dividerRef.current?.classList.add('hover')}
					onMouseLeave={() => !isDragging && dividerRef.current?.classList.remove('hover')}
				/>

				<div
					className="markdown-viewer-preview-pane"
					style={{ width: `${100 - leftWidth}%` }}
				>
					<div ref={previewRef} className="markdown-viewer-preview-wrapper">
						<div
							className="markdown-body"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with DOMPurify
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
