'use client';

import { Button } from '@/components/ui/button';
import { Copy, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export function CopyButton({ html }: { html: string }) {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(html);
			toast.success('HTML copied to clipboard!');
		} catch (error) {
			toast.error('Failed to copy HTML');
		}
	};

	return (
		<Button onClick={handleCopy} size="sm">
			<Copy className="w-4 h-4 mr-2" />
			Copy HTML
		</Button>
	);
}

export function DownloadButton({
	html,
	title,
}: {
	html: string;
	title: string;
}) {
	const handleDownload = () => {
		const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
        }
        pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            background: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        table th,
        table td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        table th {
            background: #f5f5f5;
            font-weight: 600;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1rem;
            color: #666;
            margin: 1rem 0;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

		const blob = new Blob([fullHtml], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${title || 'document'}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast.success('HTML file downloaded!');
	};

	return (
		<Button onClick={handleDownload} variant="outline" size="sm">
			<FileDown className="w-4 h-4 mr-2" />
			Download
		</Button>
	);
}
