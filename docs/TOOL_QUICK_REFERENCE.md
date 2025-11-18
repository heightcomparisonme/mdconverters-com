# Tool Development Quick Reference Card

快速参考卡片 - 用于快速查阅工具开发步骤

---

## 📋 File Checklist

创建这些文件：

```
✓ src/components/tools/[tool-name]/
  ✓ index.tsx       - Main component
  ✓ types.ts        - TypeScript interfaces
  ✓ constants.ts    - Configuration & constants
  ✓ utils.ts        - Helper functions
  ✓ README.md       - Component docs

✓ src/app/[locale]/(marketing)/tools/[tool-name]/
  ✓ page.tsx        - SEO-optimized page

✓ src/actions/
  ✓ [tool-action].ts - Server actions (optional)
```

---

## 🔧 Configuration Updates

### 1. Routes (`src/routes.ts`)

```typescript
export enum Routes {
  // Add after existing tools:
  ToolsYourTool = '/tools/your-tool-name',
}
```

### 2. Tools Config (`src/config/tools-config.tsx`) **⭐ NEW - REQUIRED**

**Import icon:**
```typescript
import { YourIcon } from 'lucide-react';
```

**Add to tools array in `getToolsConfig()`:**
```typescript
{
  title: 'Your Tool Name',
  description: 'Brief description for tool listing page',
  icon: <YourIcon className="size-6" />,
  href: Routes.ToolsYourTool,
  category: 'youtube', // Options: 'youtube' | 'thumbnail' | 'music' | 'social'
},
```

**Available categories:**
- `youtube` - YouTube-related tools (analytics, data extraction)
- `thumbnail` - Thumbnail creation and preview tools
- `music` - Music and audio-related tools
- `social` - Social media and engagement tools

### 3. Navbar (`src/config/navbar-config.tsx`)

**Import icon:**
```typescript
import { YourIcon } from 'lucide-react';
```

**Add to tools section:**
```typescript
{
  title: t('tools.items.yourTool.title'),
  description: t('tools.items.yourTool.description'),
  icon: <YourIcon className="size-4 shrink-0" />,
  href: Routes.ToolsYourTool,
  external: false,
},
```

### 4. Translations (`messages/en.json`)

**Add to `Marketing.navbar.tools.items`:**
```json
"yourTool": {
  "title": "Your Tool Name",
  "description": "Brief description for dropdown menu"
}
```

---

## 🎨 Component Structure

### Basic Hook Setup

```typescript
const [input, setInput] = useState<ToolInput>({ /* ... */ });
const [result, setResult] = useState<ToolResult | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Related Tools Import

```typescript
// Add to page imports
import { RelatedTools } from '@/components/blocks/related-tools';
```

### Input Handler

```typescript
const handleInputChange = (field: keyof ToolInput, value: any) => {
  setInput(prev => ({ ...prev, [field]: value }));
};
```

### Calculate Handler

```typescript
const handleCalculate = async () => {
  if (!validateInput(input)) return;
  
  setIsLoading(true);
  try {
    const result = processInput(input);
    setResult(result);
  } catch (err) {
    setError('Error message');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📄 Page Template Essentials

### Metadata

```typescript
export const metadata: Metadata = {
  title: 'Tool Name - Description | Site Name',
  description: 'SEO description (160 chars)',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
  alternates: { canonical: '/tools/tool-name' },
};
```

### JSON-LD Structured Data

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tool Name',
  description: 'Tool description',
  url: 'https://domain.com/tools/tool-name',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};
```

---

## 🎯 UI Components

### Common Imports

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RelatedTools } from '@/components/blocks/related-tools';
```

### Common Icons

```typescript
import { 
  Calculator,      // Calculation tools
  Search,          // Search/lookup tools
  Settings,        // Configuration tools
  BarChart,        // Analytics tools
  FileText,        // Document tools
  Loader2,         // Loading state
  AlertCircle,     // Error state
  CheckCircle,     // Success state
} from 'lucide-react';
```

### Responsive Grid

```typescript
// 1 col mobile, 2 cols tablet, 3 cols desktop
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// 1 col mobile, 2 cols desktop
<div className="grid md:grid-cols-2 gap-8">
```

### Card with Results

```typescript
<Card className="border-2 border-green-500/20 bg-green-500/5">
  <CardContent className="p-6 space-y-4">
    <h3 className="text-xl font-semibold">Result Title</h3>
    <div className="text-4xl font-bold">{result.value}</div>
    <p className="text-sm text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

---

## 🎨 Color Coding

### Result Level Colors

```typescript
// Excellent/Success
className="text-green-500 bg-green-500/10 border-green-500/20"

// Good/Info  
className="text-blue-500 bg-blue-500/10 border-blue-500/20"

// Fair/Warning
className="text-orange-500 bg-orange-500/10 border-orange-500/20"

// Poor/Error
className="text-red-500 bg-red-500/10 border-red-500/20"
```

---

## 📱 Mobile-First Classes

```css
/* Spacing */
py-8 md:py-16          /* Vertical padding */
px-4 md:px-8           /* Horizontal padding */
space-y-4 md:space-y-8 /* Vertical spacing */

/* Typography */
text-2xl md:text-4xl   /* Responsive text size */
leading-tight          /* Line height */

/* Layout */
max-w-4xl mx-auto      /* Centered container */
w-full                 /* Full width */

/* Inputs */
h-12 text-lg           /* Large touch-friendly inputs */
```

---

## 🔍 SEO Content Structure

### Essential Sections

1. **Hero** - Tool title + description
2. **Tool Interface** - Input form + results
3. **What Is** - Explanation (200-300 words)
4. **How to Use** - Step-by-step guide
5. **Benefits** - Grid of 3-6 benefits
6. **FAQ** - 4-6 common questions
7. **Related Tools** - Internal links (use RelatedTools component)

### Heading Hierarchy

```
H1 - Page title (once)
H2 - Major sections
H3 - Subsections
```

### Related Tools Component ⭐ NEW

**Always include at the bottom of tool pages:**

```typescript
import { RelatedTools } from '@/components/blocks/related-tools';

// At the end of page content, before closing </div>
<RelatedTools
  title="Related YouTube Tools"
  tools={[
    {
      title: 'Tool Name',
      description: 'Brief description (1-2 sentences)',
      href: '/tools/tool-url',
      cta: 'Try Tool Name →', // Optional, defaults to "Try {title} →"
    },
    // Add 2-5 more related tools
  ]}
/>
```

**Guidelines:**
- Place at the very bottom of page content
- Include 3-6 related tools (3 is optimal)
- Keep descriptions concise (50-100 chars)
- Use consistent CTA format
- Group by category or workflow relevance

---

## ✅ Pre-Launch Checklist

**Component:**
- [ ] Types defined
- [ ] Constants extracted
- [ ] Utils tested
- [ ] Error handling
- [ ] Loading states
- [ ] Input validation
- [ ] Mobile responsive

**Page:**
- [ ] Metadata complete
- [ ] JSON-LD added
- [ ] 1500+ words content
- [ ] FAQ section
- [ ] Internal links
- [ ] Semantic HTML
- [ ] RelatedTools component at bottom

**Integration:**
- [ ] Route added (`src/routes.ts`)
- [ ] Tools config updated (`src/config/tools-config.tsx`) ⭐
- [ ] Navbar updated (`src/config/navbar-config.tsx`)
- [ ] Translations added (`messages/en.json`)
- [ ] No TS errors
- [ ] No lint warnings

**Testing:**
- [ ] Desktop tested
- [ ] Mobile tested
- [ ] Dark mode works
- [ ] All inputs work
- [ ] Results display correctly

---

## 🚀 Common Patterns

### Client-Side Calculation

```typescript
// Fast, no server needed
const result = calculateLocally(input);
setResult(result);
```

### Server Action

```typescript
// For heavy processing or API calls
const { execute, isExecuting } = useAction(serverAction, {
  onSuccess: ({ data }) => setResult(data),
  onError: ({ error }) => setError(error.message),
});
```

### Debounced Input

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedCalculate = useDebouncedCallback(() => {
  calculate();
}, 500);
```

---

## 📚 Helpful Resources

- **Icons:** https://lucide.dev/icons/
- **UI Components:** `src/components/ui/`
- **Existing Tools:** `src/components/tools/`
- **Schema.org:** https://schema.org/
- **SEO Test:** https://search.google.com/test/rich-results

---

## 🆘 Quick Fixes

**404 Error:**
```bash
# Check file path
src/app/[locale]/(marketing)/tools/[tool-name]/page.tsx

# Restart dev server
pnpm dev
```

**Navbar Not Showing:**
```typescript
// Check all 4 files updated:
1. src/routes.ts - enum added
2. src/config/tools-config.tsx - tool config added ⭐
3. src/config/navbar-config.tsx - icon + config
4. messages/en.json - translation
```

**Tool Not in /tools Page:**
```typescript
// Make sure tool is added to tools-config.tsx
import { Routes } from '@/routes';
import { YourIcon } from 'lucide-react';

// Add to getToolsConfig() return array:
{
  title: 'Your Tool Name',
  description: 'Description',
  icon: <YourIcon className="size-6" />,
  href: Routes.ToolsYourTool,
  category: 'youtube', // or 'thumbnail', 'music', 'social'
}
```

**Type Errors:**
```typescript
// Ensure proper imports
import type { YourType } from './types';

// Use type annotations
const [state, setState] = useState<YourType>({...});
```

---

## 💡 Pro Tips

1. **Copy from existing tools** - YouTube Thumbnail Resizer is a good reference
2. **Mobile-first** - Test on small screens first
3. **Semantic HTML** - Use proper heading hierarchy
4. **Dark mode** - Use muted-foreground, card, border classes
5. **Accessibility** - Add labels, ARIA attributes
6. **Performance** - Avoid unnecessary re-renders
7. **SEO** - 1500+ words, structured data, internal links
8. **Related Tools** - Always add at page bottom for cross-promotion

---

**Need help?** Check:
- 📖 Full guide: `docs/tool-development-guide.md`
- 🇨🇳 中文指南: `docs/tool-development-guide-zh.md`
- 📋 Templates: `docs/templates/tool-template.md`
- 🔧 Component docs: `src/components/blocks/related-tools/README.md`

---

## 📚 Complete Page Example with RelatedTools

```typescript
import { RelatedTools } from '@/components/blocks/related-tools';
import { YourToolComponent } from '@/components/tools/your-tool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Tool - Description',
  description: 'SEO description',
  // ... other metadata
};

export default async function YourToolPage() {
  return (
    <>
      <script type="application/ld+json" {...jsonLd} />
      
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">
        {/* Hero */}
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">Tool Name</h1>
          <p className="text-lg text-muted-foreground">Description</p>
        </div>

        {/* Tool Component */}
        <div className="mb-16">
          <YourToolComponent />
        </div>

        {/* Content Sections */}
        <section className="mb-16">...</section>
        <section className="mb-16">...</section>

        {/* Related Tools - Always Last! */}
        <RelatedTools
          title="Related YouTube Tools"
          tools={[
            {
              title: 'Related Tool 1',
              description: 'Brief description of what this tool does',
              href: '/tools/related-tool-1',
            },
            {
              title: 'Related Tool 2',
              description: 'Brief description of what this tool does',
              href: '/tools/related-tool-2',
            },
            {
              title: 'Related Tool 3',
              description: 'Brief description of what this tool does',
              href: '/tools/related-tool-3',
            },
          ]}
        />
      </div>
    </>
  );
}
```

