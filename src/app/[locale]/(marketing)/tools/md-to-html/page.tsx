import Container from '@/components/layout/container';
import { MdToHtmlConverter } from '@/components/tools/md-to-html';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Markdown to HTML Converter',
	description:
		'Convert your Markdown content to HTML with real-time preview, syntax highlighting, and shareable links. Perfect for WordPress and web publishing.',
};

export default function MdToHtmlPage() {
	return (
		<Container className="py-16 px-4">
			<div className="max-w-5xl mx-auto space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">
						Markdown to HTML Converter
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Transform your Markdown documents into clean HTML with real-time preview,
						syntax highlighting, and shareable links. Ideal for WordPress content,
						blog posts, and web publishing.
					</p>
				</div>

				<MdToHtmlConverter />

				<div className="grid md:grid-cols-2 gap-6 mt-12">
					<div className="space-y-3">
						<h3 className="text-lg font-semibold">Features</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>✓ Real-time HTML preview</li>
							<li>✓ Bidirectional conversion (Markdown ↔ HTML)</li>
							<li>✓ Share HTML with unique links</li>
							<li>✓ Remove Perplexity.ai citations automatically</li>
							<li>✓ Download as complete HTML file</li>
							<li>✓ Split view editor</li>
							<li>✓ File drag & drop support</li>
							<li>✓ Copy to clipboard</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="text-lg font-semibold">Supported Markdown Elements</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>• Headers (H1-H6)</li>
							<li>• Lists (ordered and unordered)</li>
							<li>• Code blocks with syntax highlighting</li>
							<li>• Tables</li>
							<li>• Blockquotes</li>
							<li>• Links and images</li>
							<li>• Bold, italic, and strikethrough text</li>
							<li>• Task lists</li>
							<li>• Horizontal rules</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 p-6 bg-muted rounded-lg">
					<h3 className="text-lg font-semibold mb-3">Use Cases</h3>
					<div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
						<div>
							<h4 className="font-medium text-foreground mb-2">WordPress Publishing</h4>
							<p>
								Convert Markdown to HTML for easy WordPress content creation and
								publishing.
							</p>
						</div>
						<div>
							<h4 className="font-medium text-foreground mb-2">AI Content Conversion</h4>
							<p>
								Transform ChatGPT, Claude, or Perplexity outputs into clean HTML
								format.
							</p>
						</div>
						<div>
							<h4 className="font-medium text-foreground mb-2">Content Sharing</h4>
							<p>
								Generate shareable links to your HTML content for easy collaboration.
							</p>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
