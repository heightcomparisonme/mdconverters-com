'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import hljs from 'highlight.js';
import {
  Code,
  Eye,
  FileDown,
  FileText,
  Loader2,
  SplitSquareVertical,
  Trash2,
  Upload,
} from 'lucide-react';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type PdfjsModule = typeof import('pdfjs-dist');
const PDFJS_WORKER_URL =
  'https://esm.sh/pdfjs-dist@5.4.394/build/pdf.worker.mjs';

let pdfjsLibPromise: Promise<PdfjsModule> | null = null;

const loadPdfjs = async (): Promise<PdfjsModule> => {
  if (!pdfjsLibPromise) {
    if (typeof window === 'undefined') {
      throw new Error('PDF.js can only be loaded in the browser.');
    }

    pdfjsLibPromise = import(
      /* webpackIgnore: true */
      'https://esm.sh/pdfjs-dist@5.4.394/build/pdf.mjs'
    ) as Promise<PdfjsModule>;
  }

  return pdfjsLibPromise;
};

// Configure marked for GitHub Flavored Markdown
marked.use(gfmHeadingId());
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

type ViewMode = 'split' | 'editor' | 'preview';
type ProcessingStage = 'idle' | 'loading' | 'parsing' | 'converting' | 'done';

interface TextItem {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  font: string;
}

interface Page {
  index: number;
  items: TextItem[];
}

export function PdfToMarkdownConverter() {
  const [markdown, setMarkdown] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] =
    useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [documentTitle, setDocumentTitle] = useState('PDF Document');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [pdfjsLib, setPdfjsLib] = useState<PdfjsModule | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let isMounted = true;

    loadPdfjs()
      .then((module) => {
        if (!isMounted) {
          return;
        }

        module.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        setPdfjsLib(module);
      })
      .catch((error) => {
        console.error('Failed to load PDF.js:', error);
        toast.error('Failed to load the PDF engine. Please refresh and try again.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const convertToMarkdown = useCallback((parsedPages: Page[]): string => {
    let markdownText = '';

    parsedPages.forEach((page) => {
      // Group text items by y-coordinate (lines)
      const lines: { [key: number]: TextItem[] } = {};

      page.items.forEach((item) => {
        const lineY = Math.round(item.y / 5) * 5; // Group items within 5px
        if (!lines[lineY]) {
          lines[lineY] = [];
        }
        lines[lineY].push(item);
      });

      // Sort lines by y-coordinate (top to bottom)
      const sortedLineYs = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a); // PDF coords go bottom-up

      sortedLineYs.forEach((lineY) => {
        // Sort items in line by x-coordinate (left to right)
        const lineItems = lines[lineY].sort((a, b) => a.x - b.x);

        let lineText = '';
        let lastX = 0;

        lineItems.forEach((item, index) => {
          if (index > 0) {
            // Add space if items are far apart
            const gap = item.x - (lastX + lineItems[index - 1].width);
            if (gap > 10) {
              lineText += ' ';
            }
          }
          lineText += item.text;
          lastX = item.x;
        });

        // Detect headings based on font size
        const avgHeight =
          lineItems.reduce((sum, item) => sum + item.height, 0) /
          lineItems.length;

        if (lineText.trim()) {
          if (avgHeight > 20) {
            markdownText += `# ${lineText.trim()}\n\n`;
          } else if (avgHeight > 16) {
            markdownText += `## ${lineText.trim()}\n\n`;
          } else if (avgHeight > 14) {
            markdownText += `### ${lineText.trim()}\n\n`;
          } else {
            markdownText += `${lineText.trim()}\n\n`;
          }
        }
      });

      markdownText += '\n---\n\n'; // Page separator
    });

    return markdownText;
  }, []);

  const processPdf = useCallback(
    async (file: File) => {
      if (!pdfjsLib) {
        toast.error('PDF engine is still loading. Please try again in a moment.');
        return;
      }

      setIsProcessing(true);
      setProcessingStage('loading');
      setProgress(0);

      try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        setProcessingStage('parsing');
        setProgress(10);

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdfDocument = await loadingTask.promise;

        setProgress(20);

        const numPages = pdfDocument.numPages;
        const parsedPages: Page[] = [];

        // Parse each page
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const scale = 1.0;
          const viewport = page.getViewport({ scale });

          const textContent = await page.getTextContent();

          const textItems: TextItem[] = textContent.items.map((item: any) => {
            const tx = pdfjsLib.Util.transform(
              viewport.transform,
              item.transform
            );
            const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
            const dividedHeight = item.height / fontHeight;

            return {
              x: Math.round(item.transform[4]),
              y: Math.round(item.transform[5]),
              width: Math.round(item.width),
              height: Math.round(
                dividedHeight <= 1 ? item.height : dividedHeight
              ),
              text: item.str,
              font: item.fontName,
            };
          });

          parsedPages.push({
            index: i - 1,
            items: textItems,
          });

          setProgress(20 + (i / numPages) * 60);
        }

        setPages(parsedPages);
        setProcessingStage('converting');
        setProgress(85);

        // Convert to markdown
        const markdownText = convertToMarkdown(parsedPages);
        setMarkdown(markdownText);

        setProgress(100);
        setProcessingStage('done');

        toast.success('PDF converted to Markdown successfully!');
      } catch (error) {
        console.error('Error processing PDF:', error);
        toast.error('Failed to process PDF file');
        setProcessingStage('idle');
      } finally {
        setIsProcessing(false);
      }
    },
    [convertToMarkdown, pdfjsLib]
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        setDocumentTitle(file.name.replace('.pdf', ''));
        processPdf(file);
      } else {
        toast.error('Please drop a PDF file');
      }
    },
    [processPdf]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setDocumentTitle(file.name.replace('.pdf', ''));
        processPdf(file);
      }
    },
    [processPdf]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearEditor = () => {
    setMarkdown('');
    setPages([]);
    setProcessingStage('idle');
    setProgress(0);
    toast.info('Editor cleared');
  };

  const downloadMarkdown = () => {
    if (!markdown.trim()) {
      toast.error('No markdown content to download');
      return;
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Markdown file downloaded!');
  };

  const getStageText = () => {
    switch (processingStage) {
      case 'loading':
        return 'Loading PDF...';
      case 'parsing':
        return 'Parsing pages...';
      case 'converting':
        return 'Converting to Markdown...';
      case 'done':
        return 'Conversion complete!';
      default:
        return '';
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
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            onClick={downloadMarkdown}
            disabled={!markdown.trim()}
            size="sm"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Download Markdown
          </Button>

          <label>
            <Button variant="outline" size="sm" asChild disabled={isProcessing}>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </span>
            </Button>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
              disabled={isProcessing}
            />
          </label>

          <Button
            variant="outline"
            onClick={clearEditor}
            size="sm"
            disabled={isProcessing}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {getStageText()}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </Card>

      {/* Upload area or Editor/Preview */}
      {processingStage === 'idle' || processingStage === 'loading' ? (
        <Card
          className={`p-12 border-2 border-dashed transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <FileText className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold">Drop your PDF file here!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              This tool converts a PDF file into Markdown format. Simply drag &
              drop your PDF file or click the upload button above.
            </p>
          </div>
        </Card>
      ) : (
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as ViewMode)}
        >
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
              <EditorPanel markdown={markdown} setMarkdown={setMarkdown} />
              <PreviewPanel html={previewHtml} />
            </div>
          </TabsContent>

          <TabsContent value="editor" className="mt-4">
            <EditorPanel markdown={markdown} setMarkdown={setMarkdown} />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <PreviewPanel html={previewHtml} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface EditorPanelProps {
  markdown: string;
  setMarkdown: (value: string) => void;
}

function EditorPanel({ markdown, setMarkdown }: EditorPanelProps) {
  const lineCount = markdown.split('\n').length;

  return (
    <Card className="relative overflow-hidden h-[600px]">
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
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-transparent leading-6"
          placeholder="Converted markdown will appear here..."
        />
      </div>
    </Card>
  );
}

interface PreviewPanelProps {
  html: string;
}

function PreviewPanel({ html }: PreviewPanelProps) {
  return (
    <Card className="p-6 h-[600px] overflow-auto">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
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
