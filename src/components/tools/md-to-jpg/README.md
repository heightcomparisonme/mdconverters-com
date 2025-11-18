# Markdown to JPG Converter

将 Markdown 文档转换为高质量 JPG 图片的工具组件。

## 功能特性

- ✅ 实时预览 Markdown 渲染效果
- ✅ 高质量 JPG 图片导出
- ✅ 自定义图片尺寸和比例
- ✅ 可调节图片质量（0.7 - 1.0）
- ✅ 支持预设尺寸（A4、社交媒体等）
- ✅ 文件拖放上传
- ✅ 自定义背景颜色
- ✅ 支持所有 GitHub Flavored Markdown 语法

## 使用方法

```tsx
import { MdToJpgConverter } from '@/components/tools/md-to-jpg';

export default function Page() {
  return <MdToJpgConverter />;
}
```

## 配置选项

### MdToJpgConfig

```typescript
interface MdToJpgConfig {
  width?: number;           // 图片宽度（默认: 1200px）
  height?: number;         // 图片高度（默认: 1600px）
  scale?: number;           // 缩放比例（默认: 2）
  backgroundColor?: string; // 背景颜色（默认: '#ffffff'）
  quality?: number;        // 图片质量 0.1-1.0（默认: 0.95）
}
```

## 预设尺寸

- A4 纵向 (1200x1600)
- A4 横向 (1600x1200)
- 正方形 (1200x1200)
- 社交媒体 (1080x1080)
- 横幅 (1920x1080)

## 技术实现

- 使用 `marked` 解析 Markdown
- 使用 `html2canvas` 将 HTML 转换为 Canvas
- 使用 Canvas API 导出为 JPG 格式

## 注意事项

1. 转换大文档时可能需要一些时间
2. 确保预览区域的内容已完全加载
3. 图片质量越高，文件越大
4. 建议使用预设尺寸以获得最佳效果
