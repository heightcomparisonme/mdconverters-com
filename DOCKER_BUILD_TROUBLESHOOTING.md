# Docker 构建故障排除

## ✅ fumadocs-mdx + vite 错误已修复

### 问题
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite'
imported from fumadocs-mdx
```

### 原因
- `fumadocs-mdx` 在 postinstall 脚本中需要 `vite`
- 使用 `--frozen-lockfile` 且只安装生产依赖时，vite 被排除

### 解决方案 ✅

已在 `Dockerfile` 和 `.npmrc` 中修复：

#### 1. Dockerfile 修改
```dockerfile
# 安装所有依赖（包括 devDependencies）
RUN pnpm install --frozen-lockfile --prod=false
```

#### 2. .npmrc 配置
```ini
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

这样确保：
- ✅ 所有依赖都被安装
- ✅ Peer dependencies 自动安装
- ✅ 依赖提升，避免找不到模块

## 🔧 其他常见构建问题

### 问题 1: pnpm-lock.yaml 版本不匹配

**错误**:
```
ERR_PNPM_LOCKFILE_VERSION_MISMATCH
```

**解决**:
```bash
# 本地更新 lockfile
pnpm install
git add pnpm-lock.yaml
git commit -m "Update pnpm-lock.yaml"
git push
```

### 问题 2: 内存不足

**错误**:
```
JavaScript heap out of memory
```

**解决**:
```dockerfile
# 在 builder 阶段添加
ENV NODE_OPTIONS="--max-old-space-size=4096"
```

### 问题 3: Chromium 安装慢

**症状**: 构建卡在安装 Chromium

**解决**:
```dockerfile
# 使用国内镜像（如果在中国）
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources
```

### 问题 4: 构建缓存问题

**解决**:
```bash
# 清除 Docker 缓存重新构建
docker build --no-cache -t your-app .

# 或在 Dokploy 中
# 勾选 "Clear build cache" 选项
```

### 问题 5: pnpm store 问题

**错误**:
```
ERR_PNPM_STORE_BREAKING_CHANGE
```

**解决**:
```bash
# 删除本地 pnpm store
rm -rf ~/.pnpm-store

# 重新安装
pnpm install
```

## 🚀 构建优化

### 1. 多阶段构建缓存

当前 Dockerfile 已优化，使用三个阶段：
- `deps`: 只安装依赖（缓存友好）
- `builder`: 构建应用
- `runner`: 运行时镜像（最小）

### 2. 减小镜像大小

```dockerfile
# 已实现：
- 使用 node:20-slim（而非 node:20）
- 清理 apt 缓存
- 使用 Next.js standalone 输出
- 只复制必要文件
```

### 3. 加快构建速度

```bash
# 使用 BuildKit
DOCKER_BUILDKIT=1 docker build -t your-app .

# 并行构建多个阶段
# BuildKit 会自动优化
```

## 🔍 调试技巧

### 1. 进入失败的构建阶段

```bash
# 构建到特定阶段
docker build --target deps -t debug-deps .

# 运行容器检查
docker run -it debug-deps sh

# 检查 node_modules
ls -la node_modules
```

### 2. 查看详细日志

```bash
# 构建时显示所有输出
docker build --progress=plain -t your-app .
```

### 3. 检查依赖树

```bash
# 在本地检查
pnpm why vite

# 在容器中检查
docker run -it debug-deps pnpm list vite
```

## 📊 构建成功标准

构建成功后应该看到：

```bash
✅ deps stage: 所有依赖安装完成
✅ builder stage: Next.js 构建成功
✅ runner stage:
   - Chromium 安装完成
   - 字体安装完成
   - 应用文件复制完成
   - 权限设置正确

最终镜像大小: ~1.5GB (包含 Chromium)
```

## 🧪 测试构建

### 本地测试

```bash
# 1. 构建镜像
docker build -t md-to-pdf-test .

# 2. 运行容器
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=... \
  md-to-pdf-test

# 3. 测试应用
curl http://localhost:3000/api/health

# 4. 测试 PDF 功能
# 浏览器访问 http://localhost:3000/tools/md-to-pdf
```

### Dokploy 测试

```bash
# 1. 推送代码
git push

# 2. 在 Dokploy 中触发构建
# 3. 查看构建日志
# 4. 检查应用状态
```

## ✅ 检查清单

构建前检查：

- [ ] `Dockerfile` 已更新
- [ ] `.npmrc` 已创建
- [ ] `pnpm-lock.yaml` 已提交
- [ ] 环境变量已配置
- [ ] Git 仓库已推送

构建中检查：

- [ ] deps 阶段成功（依赖安装）
- [ ] builder 阶段成功（应用构建）
- [ ] runner 阶段成功（运行时设置）
- [ ] 无错误日志

构建后检查：

- [ ] 镜像大小合理（~1.5GB）
- [ ] 容器可以启动
- [ ] 应用可以访问
- [ ] PDF 功能正常

## 🆘 仍然有问题？

### 1. 检查日志

```bash
# Docker 构建日志
docker build --progress=plain -t your-app . 2>&1 | tee build.log

# Dokploy 日志
# 在 Dokploy Dashboard 查看
```

### 2. 验证依赖

```bash
# 本地验证
pnpm install --frozen-lockfile --prod=false
pnpm build

# 如果本地成功但 Docker 失败，可能是环境差异
```

### 3. 清理并重试

```bash
# 清理本地
rm -rf node_modules .next
pnpm install
pnpm build

# 清理 Docker
docker system prune -a
docker build --no-cache -t your-app .
```

### 4. 创建最小复现

```dockerfile
# 创建简单的测试 Dockerfile
FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod=false
```

## 📚 相关资源

- [Docker 多阶段构建](https://docs.docker.com/build/building/multi-stage/)
- [pnpm in Docker](https://pnpm.io/docker)
- [Next.js Docker 部署](https://nextjs.org/docs/deployment#docker-image)
- [Puppeteer in Docker](https://pptr.dev/guides/docker)

---

**如果问题仍未解决，请：**

1. 复制完整错误日志
2. 检查 `package.json` 和 `pnpm-lock.yaml`
3. 确认 Node.js 版本匹配（20.x）
4. 在 GitHub Issues 中报告
