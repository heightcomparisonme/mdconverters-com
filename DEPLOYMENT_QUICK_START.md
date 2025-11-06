# 🚀 Markdown to PDF - 部署快速开始

## ✅ 类型错误已修复

TypeScript 构建错误已修复：
```typescript
const buffer = Buffer.from(pdfBuffer); // Uint8Array → Buffer
```

## 🎯 选择你的部署方案

### 本地开发（当前配置）

**无需修改**，直接使用：
```bash
pnpm dev
```

访问: `http://localhost:3000/tools/md-to-pdf`

---

### 方案 A: Vercel 免费版 ⭐ 推荐

使用轻量级 Chromium 适配 Vercel 限制。

#### 1. 安装依赖

```bash
pnpm remove puppeteer
pnpm add puppeteer-core @sparticuz/chromium
```

#### 2. 部署

```bash
git add .
git commit -m "Add Vercel-compatible PDF generation"
git push
```

**优点**:
- ✅ 免费
- ✅ 适用于 Vercel 免费版
- ✅ 包大小 ~50MB

**缺点**:
- ⚠️ 首次启动较慢（冷启动）

---

### 方案 B: Vercel Pro

升级到 Vercel Pro，使用完整 Puppeteer。

**价格**: $20/月

**优点**:
- ✅ 无限制
- ✅ 最佳性能
- ✅ 更多内存

**无需代码修改**，直接部署。

---

### 方案 C: 其他云平台

部署到 Railway, Render, Fly.io 等支持 Docker 的平台。

**优点**:
- ✅ 无包大小限制
- ✅ 使用当前代码
- ✅ 更便宜

**部署**:
1. 添加 `Dockerfile`
2. 推送到平台

---

## 📦 当前代码特性

代码已自动适配不同环境：

```typescript
// browser-config.ts
- 本地开发: 使用 Puppeteer + 本地 Chrome
- Vercel 生产: 自动检测并使用 @sparticuz/chromium（如已安装）
- 其他平台: 使用优化的 Puppeteer 配置
```

## 🔨 立即测试

### 1. 本地测试（确保功能正常）

```bash
pnpm dev
```

访问并测试 PDF 下载。

### 2. 构建测试

```bash
pnpm build
```

应该能成功构建（类型错误已修复）。

### 3. 选择方案并部署

根据预算和需求选择上述方案之一。

## 💡 推荐路径

**初学者/测试阶段**:
```bash
1. 本地开发测试 (当前配置)
2. 尝试 Vercel 免费版 (方案 A)
3. 如需更好性能，升级 Pro (方案 B)
```

**生产项目**:
```bash
1. 使用 Vercel Pro (方案 B) - 最简单
2. 或使用其他云平台 (方案 C) - 更便宜
```

## 🐛 常见问题

### Q: 构建失败 "Type error: Buffer"?
**A**: 已修复，运行 `pnpm build` 应该成功。

### Q: Vercel 部署后 "Cannot find Chrome"?
**A**: 安装 `@sparticuz/chromium` (方案 A)。

### Q: 本地开发正常，部署后失败?
**A**: 检查云平台是否支持 Puppeteer，或使用方案 A。

### Q: PDF 生成太慢?
**A**:
- Vercel: 首次冷启动慢是正常的
- 考虑升级到 Pro 或使用其他平台

## 📚 详细文档

- `VERCEL_DEPLOYMENT.md` - 完整 Vercel 部署指南
- `src/components/tools/README.md` - 组件使用文档
- `src/components/tools/TESTING.md` - 测试指南

## ✅ 检查清单

- [x] TypeScript 类型错误已修复
- [x] 环境自动适配已实现
- [ ] 选择部署方案
- [ ] 本地测试通过
- [ ] 部署到生产环境

## 🎉 下一步

1. **测试本地功能**: `pnpm dev`
2. **确认构建成功**: `pnpm build`
3. **选择方案**: 阅读上述方案
4. **部署**: 按照选择的方案操作

需要帮助？查看详细文档或创建 Issue！
