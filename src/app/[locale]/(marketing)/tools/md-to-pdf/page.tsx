import Container from '@/components/layout/container';
import { MdToPdfConverterEnhanced } from '@/components/tools/md-to-pdf-converter-enhanced';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Markdown to PDF Converter',
	description: 'Convert your Markdown content to beautifully formatted PDF documents with syntax highlighting and custom styling.',
};

// Ensure Node.js runtime for Puppeteer
export const runtime = 'nodejs';

export default function MdToPdfPage() {
	return (
		<Container className="py-16 px-4">
			<div className="max-w-5xl mx-auto space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">Markdown to PDF Converter</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Transform your Markdown documents into professional PDF files with syntax
						highlighting, custom styling, and full formatting support.
					</p>
				</div>

				<MdToPdfConverterEnhanced />

				<div className="grid md:grid-cols-2 gap-6 mt-12">
					<div className="space-y-3">
						<h3 className="text-lg font-semibold">Features</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>✓ Full Markdown syntax support</li>
							<li>✓ Syntax highlighting for code blocks</li>
							<li>✓ Customizable code highlight themes</li>
							<li>✓ Front-matter configuration support</li>
							<li>✓ Custom PDF options (margins, format, etc.)</li>
							<li>✓ Table support</li>
							<li>✓ Responsive and professional layout</li>
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
							<li>• Horizontal rules</li>
						</ul>
					</div>
				</div>
			</div>
		</Container>
	);
}
