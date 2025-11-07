# MD to HTML Converter Component

这是一个功能完整的 Markdown 到 HTML 转换器组件，参考了 `md-to-pdf` 的实现，并在原有基础上扩展了可分享网址功能。

## 功能特性

### 核心功能
- ✅ **双向转换**：支持 Markdown → HTML 和 HTML → Markdown
- ✅ **实时预览**：编辑器和预览实时同步
- ✅ **分割视图**：支持编辑器、预览、分割三种视图模式
- ✅ **文件操作**：支持拖拽上传、文件导入
- ✅ **引文移除**：自动移除 Perplexity.ai 的引文标记

### 分享功能（新增）
- ✅ **生成分享链接**：一键生成可分享的 HTML 网址
- ✅ **访问统计**：记录分享内容的浏览次数
- ✅ **分享页面**：独立的分享页面展示 HTML 内容
- ✅ **下载功能**：支持下载完整的 HTML 文件
- ✅ **复制功能**：一键复制 HTML 代码

## 文件结构

```
src/
├── components/tools/md-to-html/
│   ├── md-to-html-converter.tsx  # 主转换器组件
│   ├── share-actions.tsx          # 分享功能客户端组件
│   └── index.ts                   # 导出文件
├── actions/
│   └── md-to-html.ts              # Server Actions
├── app/[locale]/(marketing)/
│   ├── tools/md-to-html/
│   │   └── page.tsx               # 工具页面
│   └── share/[shareId]/
│       └── page.tsx               # 分享页面
└── db/
    ├── schema.ts                  # 数据库 Schema (新增 sharedHtml 表)
    └── migrations/
        └── 0007_talented_wallop.sql  # 数据库迁移文件
```

## 数据库结构

### sharedHtml 表
- `id`: 主键
- `shareId`: 唯一的短 ID（8位），用于分享链接
- `title`: 文档标题
- `markdown`: 原始 Markdown 内容
- `html`: 转换后的 HTML 内容
- `userId`: 用户 ID（可选，支持匿名分享）
- `viewCount`: 浏览次数
- `expiresAt`: 过期时间（可选）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

## API

### Server Actions

#### shareHtmlAction
保存 HTML 内容并生成分享链接。

```typescript
await shareHtmlAction({
  markdown: string,
  html: string,
  title?: string
});
```

#### getSharedHtmlAction
根据 shareId 获取分享的 HTML 内容。

```typescript
await getSharedHtmlAction({
  shareId: string
});
```

## 使用方法

### 1. 运行数据库迁移

```bash
pnpm db:migrate
```

### 2. 访问工具页面

```
/tools/md-to-html
```

### 3. 使用分享功能

1. 在转换器中输入或编辑 Markdown
2. 点击"Share Link"按钮
3. 自动生成分享链接并复制到剪贴板
4. 分享链接格式：`/share/{shareId}`

## 技术栈

- **框架**: Next.js 15
- **UI**: Radix UI + TailwindCSS
- **Markdown**: marked + marked-gfm-heading-id
- **HTML → Markdown**: turndown
- **数据库**: PostgreSQL + Drizzle ORM
- **验证**: Zod
- **状态管理**: React Hooks

## 与 md-to-pdf 的区别

| 特性 | md-to-pdf | md-to-html |
|------|-----------|------------|
| 输出格式 | PDF | HTML |
| 双向转换 | ❌ | ✅ |
| 分享功能 | ❌ | ✅ |
| 代码高亮主题 | ✅ (多种主题) | ❌ (使用默认) |
| 引文移除 | ❌ | ✅ |
| 数据库存储 | ❌ | ✅ |

## 部署注意事项

1. 确保数据库环境变量配置正确
2. 运行数据库迁移：`pnpm db:migrate`
3. 分享链接使用 8 位 nanoid 生成，冲突概率极低
4. 可选：设置过期时间自动清理旧的分享内容

## 未来改进

- [ ] 添加分享链接过期时间设置
- [ ] 添加密码保护分享
- [ ] 添加分享内容编辑功能
- [ ] 添加代码高亮主题选择
- [ ] 添加自定义 CSS 样式
- [ ] 添加导出为 PDF 功能
- [ ] 添加国际化支持
