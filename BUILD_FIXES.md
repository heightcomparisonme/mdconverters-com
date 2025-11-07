# Build Fixes for MD to HTML Component

## 修复的问题

### 1. ✅ 数据库导入问题

**问题**: `Module not found: Can't resolve '@/db/drizzle'`

**原因**: 代码中使用了错误的数据库导入路径

**修复**:
- 修改 `src/actions/md-to-html.ts`
- 从 `import { db } from '@/db/drizzle'` 改为 `import { getDb } from '@/db'`
- 在函数内部使用 `const db = await getDb()` 异步获取数据库实例

修复文件: `src/actions/md-to-html.ts:3,28,77`

### 2. ✅ Turndown 依赖包安装

**问题**: `Module not found: Can't resolve 'turndown'`

**原因**: 缺少 turndown 依赖包（用于 HTML → Markdown 转换）

**修复**: 已在 package.json 中添加依赖
```json
"turndown": "^7.2.0"
```

修复文件: `package.json:148`

## 修复后的代码变更

### src/actions/md-to-html.ts

```typescript
'use server';

import { getDb } from '@/db';  // ✅ 修复：使用正确的导入路径
import { sharedHtml } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const shareHtmlAction = actionClient
	.schema(shareHtmlSchema)
	.action(async ({ parsedInput: { markdown, html, title } }) => {
		try {
			const db = await getDb();  // ✅ 修复：异步获取数据库实例

			// ... 其余代码
		}
	});

export const getSharedHtmlAction = actionClient
	.schema(getSharedHtmlSchema)
	.action(async ({ parsedInput: { shareId } }) => {
		try {
			const db = await getDb();  // ✅ 修复：异步获取数据库实例

			// ... 其余代码
		}
	});
```

## 下一步

所有代码修复已完成！现在请执行以下步骤：

1. **安装依赖** (包括 turndown):
   ```bash
   pnpm install
   ```

2. **运行数据库迁移** (创建 sharedHtml 表):
   ```bash
   pnpm db:migrate
   ```

3. **重新构建项目**:
   ```bash
   pnpm build
   ```

4. **启动开发服务器**:
   ```bash
   pnpm dev
   ```

5. **测试功能**:
   - 访问 `http://localhost:3000/tools/md-to-html`
   - 测试 Markdown → HTML 转换
   - 测试 HTML → Markdown 转换
   - 测试分享功能（点击 "Share Link" 按钮）

## 其他注意事项

- 数据库表 `sharedHtml` 已经通过迁移文件创建: `0007_talented_wallop.sql`
- 分享功能需要数据库正常运行
- 确保环境变量 `DATABASE_URL` 配置正确
