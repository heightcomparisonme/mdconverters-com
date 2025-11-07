import { getSharedHtmlAction } from '@/actions/md-to-html';
import Container from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	CopyButton,
	DownloadButton,
} from '@/components/tools/md-to-html/share-actions';
import { Eye } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface SharePageProps {
	params: {
		shareId: string;
		locale: string;
	};
}

export async function generateMetadata({
	params,
}: SharePageProps): Promise<Metadata> {
	const result = await getSharedHtmlAction({ shareId: params.shareId });

	if (!result?.data?.success) {
		return {
			title: 'Shared HTML Not Found',
		};
	}

	const title = result.data.data?.title || 'Shared HTML';

	return {
		title: `${title} - Shared HTML`,
		description: 'View shared HTML content from Markdown to HTML Converter',
	};
}

export default async function SharePage({ params }: SharePageProps) {
	const result = await getSharedHtmlAction({ shareId: params.shareId });

	if (!result?.data?.success || !result.data.data) {
		notFound();
	}

	const { title, html, viewCount, createdAt } = result.data.data;

	return (
		<Container className="py-16 px-4">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span>
							<Eye className="w-4 h-4 inline mr-1" />
							{viewCount} views
						</span>
						<span>Created {new Date(createdAt).toLocaleDateString()}</span>
					</div>
				</div>

				<div className="flex gap-2">
					<CopyButton html={html} />
					<DownloadButton html={html} title={title || 'document'} />
					<Link href="/tools/md-to-html">
						<Button variant="outline" size="sm">
							Create Your Own
						</Button>
					</Link>
				</div>

				<Card className="p-8">
					<style>{`
						.shared-content {
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
							line-height: 1.6;
						}
						.shared-content h1 {
							font-size: 2em;
							font-weight: 600;
							margin-top: 24px;
							margin-bottom: 16px;
							padding-bottom: 0.3em;
							border-bottom: 1px solid #e5e7eb;
						}
						.shared-content h2 {
							font-size: 1.5em;
							font-weight: 600;
							margin-top: 24px;
							margin-bottom: 16px;
							padding-bottom: 0.3em;
							border-bottom: 1px solid #e5e7eb;
						}
						.shared-content h3 {
							font-size: 1.25em;
							font-weight: 600;
							margin-top: 24px;
							margin-bottom: 16px;
						}
						.shared-content pre {
							background: #f6f8fa;
							border-radius: 6px;
							padding: 16px;
							overflow-x: auto;
							margin: 16px 0;
						}
						.shared-content code {
							background: #f6f8fa;
							padding: 0.2em 0.4em;
							border-radius: 3px;
							font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
							font-size: 85%;
						}
						.shared-content pre code {
							background: transparent;
							padding: 0;
						}
						.shared-content blockquote {
							border-left: 4px solid #dfe2e5;
							padding-left: 1em;
							color: #6a737d;
							margin: 16px 0;
						}
						.shared-content table {
							border-collapse: collapse;
							width: 100%;
							margin: 16px 0;
						}
						.shared-content table th,
						.shared-content table td {
							border: 1px solid #dfe2e5;
							padding: 6px 13px;
						}
						.shared-content table th {
							background: #f6f8fa;
							font-weight: 600;
						}
						.shared-content table tr:nth-child(2n) {
							background: #f6f8fa;
						}
						.shared-content ul,
						.shared-content ol {
							padding-left: 2em;
							margin: 16px 0;
						}
						.shared-content li {
							margin: 4px 0;
						}
						.shared-content input[type="checkbox"] {
							margin-right: 0.5em;
						}
						.shared-content hr {
							border: 0;
							border-top: 2px solid #e5e7eb;
							margin: 24px 0;
						}
						.shared-content a {
							color: #0969da;
							text-decoration: none;
						}
						.shared-content a:hover {
							text-decoration: underline;
						}
						.shared-content img {
							max-width: 100%;
						}
					`}</style>
					<div
						className="shared-content"
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</Card>

				<div className="mt-8 p-6 bg-muted rounded-lg">
					<h3 className="text-lg font-semibold mb-2">About This Tool</h3>
					<p className="text-sm text-muted-foreground">
						This HTML was generated using our{' '}
						<Link
							href="/tools/md-to-html"
							className="text-primary hover:underline"
						>
							Markdown to HTML Converter
						</Link>
						. Try it yourself to convert your Markdown documents to HTML with
						real-time preview and shareable links.
					</p>
				</div>
			</div>
		</Container>
	);
}
