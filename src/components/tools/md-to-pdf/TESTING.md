# Markdown to PDF Converter - Testing Guide

## 🔧 Troubleshooting the base64 Decoding Error

If you're encountering the `InvalidCharacterError` when converting to PDF, follow these steps:

### ✅ Fixes Applied

1. **Added Runtime Configuration**
   - Server Action now explicitly uses Node.js runtime
   - Page component also uses Node.js runtime
   - This is required for Puppeteer to work

2. **Enhanced Error Handling**
   - Added detailed logging to track the conversion flow
   - Validates base64 data before decoding
   - Better error messages

3. **Debugging Information**
   - Console logs show the data structure
   - Validates each step of the conversion

### 🧪 How to Test

#### Step 1: Start Development Server

```bash
pnpm dev
```

#### Step 2: Open the Demo Page

Navigate to: `http://localhost:3000/tools/md-to-pdf`

#### Step 3: Test Basic Conversion

1. The editor should already have example markdown content
2. Click "Download PDF" button
3. Check the browser console (F12) for debug logs

#### Step 4: Check Console Output

You should see logs like:
```
PDF converted successfully, base64 length: 123456
Server Action Result: { data: { success: true, data: { pdf: "...", size: 123456 } } }
```

If you see errors, note:
- Error message
- Console logs
- Network tab (check if the action completes)

### 🐛 Common Issues

#### Issue 1: Puppeteer Not Installed

**Error**: `Cannot find module 'puppeteer'`

**Solution**:
```bash
pnpm add puppeteer
```

#### Issue 2: Edge Runtime Error

**Error**: `Dynamic Code Evaluation is not allowed`

**Solution**: Verify that both files have the runtime config:

`src/actions/md-to-pdf.ts`:
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

`src/app/[locale]/(marketing)/tools/md-to-pdf/page.tsx`:
```typescript
export const runtime = 'nodejs';
```

#### Issue 3: Puppeteer Chrome Download Failed

**Error**: `Could not find Chrome`

**Solution**:
```bash
# Windows
set PUPPETEER_SKIP_DOWNLOAD=false
pnpm add puppeteer

# Linux/Mac
PUPPETEER_SKIP_DOWNLOAD=false pnpm add puppeteer
```

Or install manually:
```bash
npx puppeteer browsers install chrome
```

#### Issue 4: Invalid Base64

**Error**: `The string to be decoded is not correctly encoded`

**Check**:
1. Look at console logs for "Base64 string length"
2. If length is 0 or very small, the PDF generation failed
3. Check server logs for Puppeteer errors

### 📋 Test Checklist

- [ ] Development server is running
- [ ] `/tools/md-to-pdf` page loads without errors
- [ ] Can type in the editor
- [ ] Preview updates in real-time
- [ ] Can switch between Split/Editor/Preview modes
- [ ] Can drag & drop .md files
- [ ] Can upload .md files via button
- [ ] Download PDF button works
- [ ] PDF file downloads and opens correctly
- [ ] Console shows successful logs

### 🔍 Debugging Steps

#### 1. Check Server Action Response

Add this to your browser console:
```javascript
// Open the Network tab
// Click "Download PDF"
// Look for the server action request
// Check the response data
```

#### 2. Verify PDF Content

After download:
- Open the PDF in a viewer
- Verify formatting matches preview
- Check syntax highlighting
- Verify images (if any) are included

#### 3. Test Different Scenarios

- **Small markdown** (< 1KB)
- **Large markdown** (> 100KB)
- **With images** (base64 or URLs)
- **With code blocks** (multiple languages)
- **With tables**
- **With task lists**

### 💡 Expected Behavior

#### Successful Conversion

1. Click "Download PDF"
2. See "Converting..." loading state
3. Console logs:
   ```
   PDF converted successfully, base64 length: [number]
   Server Action Result: { data: { success: true, ... } }
   ```
4. Toast notification: "PDF generated successfully!"
5. File downloads automatically

#### Failed Conversion

If conversion fails, you'll see:
1. Error toast with specific message
2. Console error logs
3. No file download

### 🛠️ Advanced Debugging

#### Enable Verbose Logging

In `src/lib/md-to-pdf/index.ts`, add:
```typescript
console.log('Starting PDF conversion...');
console.log('Markdown length:', markdown.length);
console.log('Config:', config);
```

#### Test Server Action Directly

Create a test page:
```typescript
// app/test-pdf/page.tsx
'use client';

import { convertMdToPdfAction } from '@/actions/md-to-pdf';

export default function TestPage() {
  const test = async () => {
    const result = await convertMdToPdfAction({
      markdown: '# Test',
      config: { document_title: 'Test' }
    });
    console.log('Result:', result);
  };

  return <button onClick={test}>Test PDF</button>;
}
```

### 📊 Performance Expectations

- **Small document** (< 10KB): 1-2 seconds
- **Medium document** (10-100KB): 2-5 seconds
- **Large document** (> 100KB): 5-10 seconds

Times may vary based on:
- Server performance
- Number of images
- Code block complexity
- Table count

### ✅ Success Criteria

The component is working correctly when:

1. ✅ No console errors
2. ✅ PDF downloads successfully
3. ✅ PDF content matches preview
4. ✅ Syntax highlighting works
5. ✅ Images are included
6. ✅ Tables are formatted correctly
7. ✅ Page breaks work (if used)
8. ✅ Custom styles are applied (if configured)

### 🆘 Getting Help

If you're still experiencing issues:

1. **Check the logs**
   - Browser console (F12)
   - Server logs (terminal)
   - Network tab (XHR requests)

2. **Verify dependencies**
   ```bash
   pnpm list puppeteer marked gray-matter highlight.js
   ```

3. **Test in isolation**
   - Create a minimal test case
   - Remove custom configurations
   - Use default example markdown

4. **Check system requirements**
   - Node.js 18+
   - Sufficient RAM (Puppeteer uses ~200MB)
   - Disk space for Chrome download

### 📝 Reporting Issues

When reporting issues, include:

1. Error message (full stack trace)
2. Console logs
3. Server logs
4. Markdown content (if safe to share)
5. Environment details:
   - OS
   - Node.js version
   - Next.js version
   - Puppeteer version

### 🎯 Next Steps

Once basic conversion works:

1. Test with your own markdown files
2. Customize PDF options
3. Try different highlight themes
4. Test front-matter configuration
5. Experiment with custom CSS
