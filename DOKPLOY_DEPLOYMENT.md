# 🚀 Dokploy 部署指南 - Markdown to PDF

## ✅ 为什么选择 Dokploy？

Dokploy 完美支持 Puppeteer，**无需任何妥协**：

| 功能 | Vercel 免费版 | Dokploy |
|------|--------------|---------|
| **Puppeteer 支持** | ❌ 需要特殊配置 | ✅ 开箱即用 |
| **包大小限制** | 250MB | ✅ 无限制 |
| **执行时间** | 10秒 | ✅ 无限制 |
| **内存** | 1GB | ✅ 自定义 |
| **成本** | 免费 | ✅ 自托管（服务器成本） |
| **完整 Chrome** | ❌ | ✅ |

## 📋 前置条件

1. **Dokploy 服务器**
   - 已安装 Dokploy
   - 至少 2GB RAM（推荐 4GB）
   - 至少 10GB 存储空间

2. **Git 仓库**
   - GitHub/GitLab/Gitea 等
   - 代码已推送

## 🎯 部署步骤

### 第 1 步：准备代码

✅ **好消息：Dockerfile 已经配置完成！**

我已经为你更新了 `Dockerfile`，包含：
- ✅ Chromium 和所有依赖
- ✅ 中文字体支持
- ✅ 优化的配置
- ✅ 安全的非 root 用户

### 第 2 步：配置环境变量

在 Dokploy 中设置以下环境变量：

```bash
# 必需的环境变量
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Puppeteer 配置（已在 Dockerfile 中设置，但可以在这里覆盖）
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_DOWNLOAD=true

# 你的应用特定环境变量
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
# ... 其他环境变量
```

### 第 3 步：在 Dokploy 中创建应用

1. **登录 Dokploy Dashboard**
   ```
   https://your-dokploy-server.com
   ```

2. **创建新应用**
   - 点击 "Create Application"
   - 选择 "Docker" 类型

3. **配置 Git**
   - Repository URL: `https://github.com/your-username/your-repo.git`
   - Branch: `main`
   - Dockerfile Path: `./Dockerfile`

4. **构建配置**
   ```yaml
   Build Command: (留空，使用 Dockerfile)
   Build Context: .
   Dockerfile: ./Dockerfile
   ```

5. **部署配置**
   - Port: `3000`
   - Domain: `yourdomain.com`
   - Environment Variables: (从上面复制)

### 第 4 步：部署

点击 **"Deploy"** 按钮，Dokploy 将：

1. ⬇️ 克隆仓库
2. 🔨 构建 Docker 镜像
3. 📦 安装 Chromium 和依赖
4. 🚀 启动容器
5. ✅ 应用就绪！

**预计时间**: 5-10 分钟（首次构建）

### 第 5 步：验证部署

1. **检查健康状态**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **测试 PDF 功能**
   访问: `https://yourdomain.com/tools/md-to-pdf`

3. **检查日志**
   在 Dokploy Dashboard 中查看应用日志

## 🔧 高级配置

### 自定义资源限制

在 Dokploy 中设置资源限制：

```yaml
# Docker Compose 覆盖（如果使用）
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          memory: 2G
```

### 持久化存储

如果需要保存生成的 PDF：

```yaml
volumes:
  - ./data:/app/data
```

### 优化构建时间

使用 Docker 层缓存：

```dockerfile
# 在 Dokploy 中启用 BuildKit
ENV DOCKER_BUILDKIT=1
```

## 🐛 故障排除

### 问题 1: 构建失败 "Cannot install Chromium"

**原因**: 网络问题或镜像源慢

**解决**:
```dockerfile
# 在 Dockerfile 中添加镜像源
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list
```

### 问题 2: PDF 生成超时

**原因**: 内存不足

**解决**:
1. 增加容器内存限制（至少 2GB）
2. 在 Dokploy 中调整资源配置

### 问题 3: 字体缺失

**原因**: 缺少特定语言字体

**解决**:
```dockerfile
# 在 Dockerfile runner 阶段添加
RUN apt-get update && apt-get install -y \
    fonts-noto-cjk \
    fonts-noto-color-emoji
```

### 问题 4: 权限错误

**原因**: 文件权限问题

**解决**:
```dockerfile
# 确保正确的权限
RUN chown -R nextjs:nodejs /app
```

## 📊 性能优化

### 1. 启用 Gzip 压缩

```nginx
# Nginx 配置（如果使用反向代理）
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. 使用 CDN

将静态资源托管到 CDN：

```javascript
// next.config.js
module.exports = {
  assetPrefix: 'https://cdn.yourdomain.com',
};
```

### 3. 启用缓存

```javascript
// PDF 生成缓存
const cache = new Map();
const cacheKey = md5(markdown);
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
```

## 🔄 CI/CD 集成

### 自动部署配置

**选项 A: GitHub Actions**

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Dokploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Dokploy
        run: |
          curl -X POST https://your-dokploy.com/api/deploy \
            -H "Authorization: Bearer ${{ secrets.DOKPLOY_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"app_id": "${{ secrets.APP_ID }}"}'
```

**选项 B: Dokploy Webhook**

1. 在 Dokploy 中启用 Webhook
2. 复制 Webhook URL
3. 在 GitHub 中添加 Webhook

## 📈 监控

### 设置监控

```yaml
# docker-compose.yml
services:
  app:
    labels:
      - "com.dokploy.monitor.enabled=true"
      - "com.dokploy.monitor.interval=30s"
```

### 日志管理

```bash
# 查看实时日志
dokploy logs -f your-app

# 导出日志
dokploy logs your-app > app.log
```

## 💰 成本估算

**推荐配置**:
- 2 vCPU
- 4GB RAM
- 50GB SSD

**月成本**:
- Hetzner: ~€10/月
- DigitalOcean: ~$24/月
- Vultr: ~$18/月

## 🎯 性能基准

预期性能（在 4GB RAM 服务器上）：

| 文档大小 | 生成时间 | 内存使用 |
|---------|---------|---------|
| 小型 (< 10KB) | 1-2秒 | ~500MB |
| 中型 (10-100KB) | 2-5秒 | ~800MB |
| 大型 (> 100KB) | 5-10秒 | ~1.5GB |

## ✅ 检查清单

部署前检查：

- [ ] Dokploy 服务器已准备
- [ ] Git 仓库已推送
- [ ] 环境变量已配置
- [ ] Dockerfile 已更新（✅ 已完成）
- [ ] 域名已配置
- [ ] SSL 证书已设置

部署后检查：

- [ ] 应用可访问
- [ ] PDF 转换功能正常
- [ ] 日志无错误
- [ ] 性能可接受
- [ ] 监控已启用

## 🎉 完成！

你的应用现在应该在 Dokploy 上运行了！

访问: `https://yourdomain.com/tools/md-to-pdf`

测试 PDF 生成功能。

## 📚 相关资源

- [Dokploy 官方文档](https://dokploy.com/docs)
- [Puppeteer Docker 指南](https://pptr.dev/guides/docker)
- [Next.js Standalone 输出](https://nextjs.org/docs/advanced-features/output-file-tracing)

## 🆘 需要帮助？

如果遇到问题：

1. 查看 Dokploy 日志
2. 检查本文档的故障排除部分
3. 参考 `TESTING.md` 进行调试
4. 在 GitHub 创建 Issue

---

**🎊 恭喜！你已成功在 Dokploy 上部署 Markdown to PDF 转换器！**
