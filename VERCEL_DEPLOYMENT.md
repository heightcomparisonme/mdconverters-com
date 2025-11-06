# Vercel 部署指南 - Markdown to PDF

## ⚠️ 重要提示

Vercel 免费版**不支持** Puppeteer，因为：

- ❌ 包大小限制：250MB（Puppeteer + Chromium ≈ 300MB）
- ❌ 执行时间限制：10 秒（PDF 生成可能需要更长时间）
- ❌ 内存限制：1GB（Chromium 需要更多）

## 🎯 推荐方案

### 方案 1: 使用 Vercel Pro（推荐）

Vercel Pro 解除了这些限制：
- ✅ 无包大小限制
- ✅ 执行时间 60 秒
- ✅ 内存 3GB

**价格**: $20/月

### 方案 2: 使用 @sparticuz/chromium（轻量级）

使用专为 Serverless 优化的 Chromium：

```bash
pnpm remove puppeteer
pnpm add puppeteer-core @sparticuz/chromium
```

修改 `src/lib/md-to-pdf/index.ts`:

```typescript
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// 在 convertMarkdownToPdf 函数中
const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

**优势**:
- ✅ 包大小 ~50MB
- ✅ 适用于 Vercel 免费版
- ✅ 性能优化

**劣势**:
- ⚠️ 某些高级 PDF 功能可能不可用

### 方案 3: 使用外部 PDF 服务

使用第三方 API：

#### 选项 A: PDFShift
```typescript
const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${process.env.PDFSHIFT_API_KEY}`)}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    source: htmlContent,
  }),
});
```

#### 选项 B: Browserless
```typescript
const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
});
```

### 方案 4: 客户端生成（最简单）

使用纯浏览器方案（无服务器组件）：

```bash
pnpm add jspdf html2canvas
```

```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const element = document.getElementById('preview');
const canvas = await html2canvas(element);
const imgData = canvas.toDataURL('image/png');
const pdf = new jsPDF();
pdf.addImage(imgData, 'PNG', 0, 0);
pdf.save('document.pdf');
```

**优势**:
- ✅ 完全在浏览器运行
- ✅ 无服务器限制
- ✅ 免费

**劣势**:
- ⚠️ 质量可能不如 Puppeteer
- ⚠️ 大文档可能有性能问题

## 🚀 推荐配置（方案 2 详细步骤）

### 1. 安装依赖

```bash
pnpm remove puppeteer
pnpm add puppeteer-core @sparticuz/chromium
```

### 2. 更新 `src/lib/md-to-pdf/index.ts`

```typescript
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function convertMarkdownToPdf(
	markdown: string,
	config: MdToPdfConfig = {},
): Promise<MdToPdfResult> {
	let browser: Browser | null = null;

	try {
		// ... 前面的代码保持不变 ...

		// 修改 browser.launch 部分
		const isProduction = process.env.NODE_ENV === 'production';

		browser = await puppeteer.launch(
			isProduction
				? {
						args: chromium.args,
						defaultViewport: chromium.defaultViewport,
						executablePath: await chromium.executablePath(),
						headless: chromium.headless,
				  }
				: {
						headless: true,
						args: ['--no-sandbox', '--disable-setuid-sandbox'],
				  },
		);

		// ... 其余代码保持不变 ...
	}
}
```

### 3. 配置环境变量

`.env.local`:
```bash
NODE_ENV=development
```

Vercel 环境变量会自动设置 `NODE_ENV=production`

### 4. 部署到 Vercel

```bash
git add .
git commit -m "Add Vercel-compatible PDF generation"
git push
```

## 📊 方案对比

| 方案 | 成本 | 质量 | 速度 | 复杂度 |
|------|------|------|------|--------|
| Vercel Pro | $20/月 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| @sparticuz/chromium | 免费 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 外部服务 | $$ 按量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 客户端 jsPDF | 免费 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

## 🎯 我的推荐

**开发阶段**: 使用当前的 Puppeteer 配置（本地测试）

**生产部署**:
- **预算充足**: Vercel Pro ($20/月)
- **免费方案**: @sparticuz/chromium
- **高质量需求**: 外部 PDF 服务
- **简单项目**: 客户端 jsPDF

## 📝 当前构建修复

类型错误已修复：
```typescript
// 将 Uint8Array 转换为 Buffer
const buffer = Buffer.from(pdfBuffer);
```

现在可以尝试构建：
```bash
pnpm build
```

## ⚡ 快速修复（仅用于测试构建）

如果只是想测试构建通过，可以临时禁用 PDF 路由：

`src/app/[locale]/(marketing)/tools/md-to-pdf/page.tsx`:
```typescript
// 临时注释掉以通过构建
export const dynamic = 'force-dynamic';

export default function MdToPdfPage() {
  return (
    <div>
      <h1>PDF Converter - Coming Soon</h1>
      <p>This feature requires Puppeteer which is not available in Vercel Free tier.</p>
    </div>
  );
}
```

## 🔗 相关资源

- [Vercel Limits](https://vercel.com/docs/concepts/limits/overview)
- [@sparticuz/chromium](https://github.com/Sparticuz/chromium)
- [Puppeteer in Serverless](https://pptr.dev/guides/docker)
- [PDFShift](https://pdfshift.io/)
- [Browserless](https://www.browserless.io/)
