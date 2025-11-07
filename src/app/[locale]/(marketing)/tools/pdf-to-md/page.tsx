import Container from '@/components/layout/container';
import { PdfToMarkdownConverter } from '@/components/tools/pdf-to-markdown';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Markdown Converter',
  description:
    'Convert your PDF documents to Markdown format with intelligent text extraction and formatting preservation.',
};

export default function PdfToMarkdownPage() {
  return (
    <Container className="py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            PDF to Markdown Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Extract text from your PDF files and convert them to clean Markdown
            format with intelligent heading detection and formatting.
          </p>
        </div>

        <PdfToMarkdownConverter />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Client-side PDF processing (privacy-focused)</li>
              <li>✓ Intelligent heading detection</li>
              <li>✓ Real-time Markdown preview</li>
              <li>✓ Split view editor</li>
              <li>✓ Editable output for refinement</li>
              <li>✓ Download Markdown file</li>
              <li>✓ Drag & drop support</li>
              <li>✓ Fast and responsive</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">How It Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1. Upload or drag & drop your PDF file</li>
              <li>2. The tool extracts text and detects structure</li>
              <li>3. Text is converted to Markdown format</li>
              <li>4. Headings are detected based on font size</li>
              <li>5. Review and edit the output as needed</li>
              <li>6. Download your Markdown file</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Important Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • This tool works best with text-based PDFs. Scanned documents
              (images) may not produce good results.
            </li>
            <li>
              • Complex layouts with multiple columns or tables may require
              manual editing after conversion.
            </li>
            <li>
              • All processing happens in your browser - your files are never
              uploaded to our servers.
            </li>
            <li>
              • For best results, review and edit the output before using it in
              your projects.
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
