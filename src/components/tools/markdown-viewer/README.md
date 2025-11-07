# Markdown Viewer Component

A full-featured, real-time Markdown editor and preview component for Next.js, ported from [markdown-live-preview](https://markdownlivepreview.com/).

## Features

- **Monaco Editor**: Professional code editing experience with syntax highlighting
- **Real-time Preview**: Instant Markdown to HTML conversion
- **Split View**: Adjustable side-by-side editor and preview
- **Sync Scrolling**: Optional synchronized scrolling between editor and preview
- **Local Storage**: Automatically saves your work
- **Copy to Clipboard**: One-click copy of Markdown content
- **GitHub-styled Preview**: Uses GitHub Markdown CSS for consistent styling
- **Secure**: DOMPurify sanitization to prevent XSS attacks

## Usage

### Full-screen Mode

```tsx
import { MarkdownViewer } from '@/components/tools/markdown-viewer';

export default function Page() {
  return <MarkdownViewer fullScreen />;
}
```

### Embedded Mode

```tsx
import { MarkdownViewer } from '@/components/tools/markdown-viewer';

export default function Page() {
  return (
    <div className="h-[600px]">
      <MarkdownViewer
        fullScreen={false}
        defaultValue="# Hello World"
        onValueChange={(value) => console.log(value)}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | Template | Initial Markdown content |
| `onValueChange` | `(value: string) => void` | - | Callback when content changes |
| `className` | `string` | `''` | Additional CSS classes |
| `fullScreen` | `boolean` | `true` | Whether to use full viewport height |

## Files Structure

```
src/components/tools/markdown-viewer/
├── MarkdownViewer.tsx       # Main component
├── types.ts                  # TypeScript definitions
├── default-template.ts       # Default Markdown template
├── markdown-viewer.css       # Component styles
├── index.ts                  # Public exports
└── README.md                 # This file
```

## Dependencies

- `@monaco-editor/react` - Monaco Editor React wrapper
- `marked` - Markdown parser
- `dompurify` - HTML sanitizer
- `github-markdown-css` - GitHub-style Markdown CSS

## Page Route

The component is available at: `/[locale]/tools/markdown-viewer`

For example:
- `/en/tools/markdown-viewer`
- `/zh/tools/markdown-viewer`

## Development

To test the component locally:

```bash
pnpm dev
```

Then visit: http://localhost:3000/en/tools/markdown-viewer

## Features in Detail

### Drag to Resize
- Click and drag the divider between editor and preview to adjust sizes
- Double-click the divider to reset to 50/50 split

### Keyboard Shortcuts
- All Monaco Editor shortcuts are available
- Standard copy/paste/undo/redo operations

### Storage
- Content is automatically saved to `localStorage`
- Scroll sync preference is remembered
- Reset button clears storage and restores default template

## Dark Mode

The component supports dark mode through Tailwind CSS classes. The preview area will automatically adjust based on the active theme.
