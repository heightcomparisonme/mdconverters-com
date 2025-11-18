import Container from '@/components/layout/container';
import { MdToJpgConverter } from '@/components/tools/md-to-jpg';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Markdown to JPG Converter - Online Markdown to JPG Image Tool',
	description:
		'Convert your Markdown documents to high-quality JPG images. Support custom dimensions, quality settings, real-time preview, and one-click export. Perfect for document sharing, social media publishing, and more.',
	keywords: [
		'markdown to jpg',
		'markdown to image',
		'md to jpg',
		'markdown converter',
		'online converter',
		'jpg converter',
	],
	openGraph: {
		title: 'Markdown to JPG Converter - Online Markdown to JPG Image Tool',
		description:
			'Convert your Markdown documents to high-quality JPG images. Support custom dimensions, quality settings, real-time preview, and one-click export.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Markdown to JPG Converter',
		description: 'Convert your Markdown documents to high-quality JPG images',
	},
	alternates: {
		canonical: '/tools/md-to-jpg',
	},
};

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebApplication',
	name: 'Markdown to JPG Converter',
	description: 'Convert Markdown documents to high-quality JPG images',
	url: 'https://mdconverters.com/tools/md-to-jpg',
	applicationCategory: 'UtilityApplication',
	operatingSystem: 'Any',
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
	},
	featureList: [
		'Real-time preview',
		'Custom dimensions',
		'Quality settings',
		'File drag & drop',
		'One-click export',
	],
};

export default function MdToJpgPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Container className="py-16 px-4">
				<div className="max-w-5xl mx-auto space-y-8">
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold tracking-tight">
							Markdown to JPG Converter
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Transform your Markdown documents into high-quality JPG images. Support custom
							dimensions, quality settings, real-time preview, and one-click export. Perfect
							for document sharing, social media publishing, and more.
						</p>
					</div>

					<MdToJpgConverter />

					<div className="grid md:grid-cols-2 gap-6 mt-12">
						<div className="space-y-3">
							<h3 className="text-lg font-semibold">Features</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>✓ Real-time Markdown rendering preview</li>
								<li>✓ High-quality JPG image export</li>
								<li>✓ Custom image dimensions and aspect ratio</li>
								<li>✓ Adjustable image quality</li>
								<li>✓ Preset sizes (A4, social media, etc.)</li>
								<li>✓ File drag & drop upload</li>
								<li>✓ Custom background color</li>
								<li>✓ Support for all Markdown syntax</li>
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
								<h4 className="font-medium text-foreground mb-2">Document Sharing</h4>
								<p>
									Convert Markdown documents to image format for easy sharing and
									displaying in environments that don't support Markdown.
								</p>
							</div>
							<div>
								<h4 className="font-medium text-foreground mb-2">Social Media</h4>
								<p>
									Convert technical documentation, tutorials, and other content to images
									for publishing on social media platforms like Twitter, Facebook, etc.
								</p>
							</div>
							<div>
								<h4 className="font-medium text-foreground mb-2">Presentations</h4>
								<p>
									Convert Markdown content to images for creating presentations, posters,
									and other visual content.
								</p>
							</div>
						</div>
					</div>

					<div className="mt-12 p-6 border rounded-lg">
						<h3 className="text-lg font-semibold mb-3">How to Use</h3>
						<ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
							<li>Type or paste your Markdown content in the editor</li>
							<li>View the rendered preview in the preview area</li>
							<li>Click the "Settings" button to adjust image dimensions, quality, etc.</li>
							<li>Choose a preset size or customize dimensions</li>
							<li>Click the "Convert to JPG" button to generate and download the image</li>
						</ol>
					</div>

					<div className="mt-12 p-6 border rounded-lg">
						<h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
						<div className="space-y-4 text-sm">
							<div>
								<h4 className="font-medium text-foreground mb-1">
									What image formats are supported?
								</h4>
								<p className="text-muted-foreground">
									Currently, we support exporting as JPG format. JPG format has good
									compression ratio and is suitable for most use cases.
								</p>
							</div>
							<div>
								<h4 className="font-medium text-foreground mb-1">
									How do I set the image quality?
								</h4>
								<p className="text-muted-foreground">
									You can select different quality levels in the settings, from 0.7 (low
									quality) to 1.0 (maximum quality). Higher quality means larger file
									size but clearer images.
								</p>
							</div>
							<div>
								<h4 className="font-medium text-foreground mb-1">
									Can I customize the image dimensions?
								</h4>
								<p className="text-muted-foreground">
									Yes. You can manually enter width and height (100-5000 pixels), or
									choose preset sizes like A4, social media, etc.
								</p>
							</div>
							<div>
								<h4 className="font-medium text-foreground mb-1">
									What Markdown syntax is supported?
								</h4>
								<p className="text-muted-foreground">
									We support all GitHub Flavored Markdown (GFM) syntax, including
									headers, lists, code blocks, tables, links, images, and more.
								</p>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}

