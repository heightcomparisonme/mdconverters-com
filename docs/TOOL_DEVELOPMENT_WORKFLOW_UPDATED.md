# 工具开发流程 - 更新版本

## 📋 重要变更

由于添加了动态生成工具列表的功能，现在创建新工具需要更新 **4 个配置文件**（之前是 3 个）。

---

## 🚀 完整开发流程

### 第一步：创建组件文件

在 `src/components/tools/[tool-name]/` 创建：

```
✓ index.tsx       - 主组件
✓ types.ts        - TypeScript 接口
✓ constants.ts    - 配置和常量
✓ utils.ts        - 辅助函数
✓ README.md       - 组件文档
```

### 第二步：创建页面文件

在 `src/app/[locale]/(marketing)/tools/[tool-name]/` 创建：

```
✓ page.tsx        - SEO 优化的页面
```

### 第三步：更新配置文件（按顺序）

#### 1️⃣ 添加路由 (`src/routes.ts`)

```typescript
export enum Routes {
  // 在现有工具路由后添加：
  ToolsYourTool = '/tools/your-tool-name',
}
```

#### 2️⃣ 添加工具配置 (`src/config/tools-config.tsx`) ⭐ **新增必需步骤**

```typescript
// 1. 导入图标
import { YourIcon } from 'lucide-react';

// 2. 在 getToolsConfig() 的返回数组中添加：
{
  title: 'Your Tool Name',
  description: 'Brief description for tool listing page',
  icon: <YourIcon className="size-6" />,
  href: Routes.ToolsYourTool,
  category: 'youtube', // 选择合适的分类
},
```

**可用分类：**
- `'youtube'` - YouTube 相关工具（分析、数据提取）
- `'thumbnail'` - 缩略图创建和预览工具
- `'music'` - 音乐和音频相关工具
- `'social'` - 社交媒体和互动工具

**图标大小说明：**
- Tools config: `className="size-6"` (用于工具列表页)
- Navbar config: `className="size-4 shrink-0"` (用于导航菜单)

#### 3️⃣ 添加导航菜单 (`src/config/navbar-config.tsx`)

```typescript
// 1. 导入图标
import { YourIcon } from 'lucide-react';

// 2. 在 tools.items 数组中添加：
{
  title: t('tools.items.yourTool.title'),
  description: t('tools.items.yourTool.description'),
  icon: <YourIcon className="size-4 shrink-0" />,
  href: Routes.ToolsYourTool,
  external: false,
},
```

#### 4️⃣ 添加翻译 (`messages/en.json`)

在 `Marketing.navbar.tools.items` 中添加：

```json
"yourTool": {
  "title": "Your Tool Name",
  "description": "Brief description for dropdown menu"
}
```

---

## ✅ 完整检查清单

### 组件开发
- [ ] 创建所有组件文件（5 个文件）
- [ ] 实现核心功能
- [ ] 添加输入验证
- [ ] 添加错误处理
- [ ] 添加加载状态
- [ ] 移动端适配

### 页面开发
- [ ] 创建 page.tsx
- [ ] 添加完整 Metadata
- [ ] 添加 JSON-LD 结构化数据
- [ ] 编写 1500+ 字内容
- [ ] 添加 FAQ 部分
- [ ] 添加内部链接

### 配置更新 ⭐ **按顺序完成**
- [ ] 1. 添加路由 (`src/routes.ts`)
- [ ] 2. 添加工具配置 (`src/config/tools-config.tsx`) **新增**
- [ ] 3. 更新导航菜单 (`src/config/navbar-config.tsx`)
- [ ] 4. 添加翻译 (`messages/en.json`)

### 质量检查
- [ ] TypeScript 无错误
- [ ] Biome 无警告
- [ ] 深色模式正常
- [ ] 移动端测试通过
- [ ] 桌面端测试通过

---

## 🎯 配置文件对比

### 之前（3 个文件）
1. `src/routes.ts`
2. `src/config/navbar-config.tsx`
3. `messages/en.json`

### 现在（4 个文件）⭐
1. `src/routes.ts`
2. **`src/config/tools-config.tsx`** ← **新增**
3. `src/config/navbar-config.tsx`
4. `messages/en.json`

---

## 💡 实际示例：Fake YouTube Comment Generator

### 1. Routes (`src/routes.ts`)
```typescript
ToolsFakeYouTubeCommentGenerator = '/tools/fake-youtube-comment-generator',
```

### 2. Tools Config (`src/config/tools-config.tsx`) ⭐
```typescript
import { MessageSquareIcon } from 'lucide-react';

{
  title: 'Fake YouTube Comment Generator',
  description: 'Create realistic YouTube comments with custom details and reactions',
  icon: <MessageSquareIcon className="size-6" />,
  href: Routes.ToolsFakeYouTubeCommentGenerator,
  category: 'social',
},
```

### 3. Navbar Config (`src/config/navbar-config.tsx`)
```typescript
import { MessageSquareIcon } from 'lucide-react';

{
  title: t('tools.items.fakeYoutubeCommentGenerator.title'),
  description: t('tools.items.fakeYoutubeCommentGenerator.description'),
  icon: <MessageSquareIcon className="size-4 shrink-0" />,
  href: Routes.ToolsFakeYouTubeCommentGenerator,
  external: false,
},
```

### 4. Translations (`messages/en.json`)
```json
"fakeYoutubeCommentGenerator": {
  "title": "Fake YouTube Comment Generator",
  "description": "Create realistic YouTube comments with custom details and reactions"
}
```

---

## 🆘 常见问题

### ❌ 工具不显示在 /tools 页面
**原因：**未添加到 `tools-config.tsx`

**解决：**
```typescript
// src/config/tools-config.tsx
import { YourIcon } from 'lucide-react';
import { Routes } from '@/routes';

// 在 getToolsConfig() 返回数组中添加
{
  title: 'Your Tool Name',
  description: 'Description',
  icon: <YourIcon className="size-6" />,
  href: Routes.ToolsYourTool,
  category: 'youtube',
}
```

### ❌ 导航菜单不显示工具
**检查清单：**
1. ✅ `src/routes.ts` - 路由枚举已添加
2. ✅ `src/config/tools-config.tsx` - 工具配置已添加 ⭐
3. ✅ `src/config/navbar-config.tsx` - 导航配置已添加
4. ✅ `messages/en.json` - 翻译已添加

### ❌ 图标大小不一致
**说明：**
- **工具列表页** (`tools-config.tsx`): 使用 `className="size-6"`
- **导航菜单** (`navbar-config.tsx`): 使用 `className="size-4 shrink-0"`

---

## 📚 相关文档

- **快速参考：**`docs/TOOL_QUICK_REFERENCE.md`
- **完整指南：**`docs/tool-development-guide.md`
- **示例代码：**查看现有工具实现

---

## 🎉 总结

新的工具开发流程添加了 `tools-config.tsx` 配置文件，使工具列表可以动态生成。

**关键变化：**
- ✅ 现在需要更新 **4 个** 配置文件（之前是 3 个）
- ✅ 工具会自动出现在 `/tools` 页面
- ✅ 支持分类筛选和展示
- ✅ 统一的工具卡片样式

**记住顺序：**
1. Routes → 2. Tools Config → 3. Navbar Config → 4. Translations

按照这个流程，你的工具将会：
- ✅ 出现在导航菜单下拉列表
- ✅ 显示在 /tools 工具列表页
- ✅ 按分类正确归类
- ✅ 拥有统一的视觉样式


