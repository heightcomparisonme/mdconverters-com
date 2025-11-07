import { MarkdownViewer } from '@/components/tools/markdown-viewer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'markdown viewer -markdown Real-time Editor & Viewer',
	description:
		'Live Markdown editor with real-time preview, syntax highlighting, and sync scrolling. Edit and preview your Markdown documents side by side with instant updates.',
};

export default function MarkdownViewerPage() {
	return <MarkdownViewer fullScreen />;
}
