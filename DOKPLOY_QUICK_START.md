# 🚀 Dokploy 快速开始 - 5 分钟部署

## ✅ 是的，Dokploy 完美解决 Puppeteer 问题！

与 Vercel 相比：

| 限制 | Vercel 免费版 | Dokploy |
|------|--------------|---------|
| Puppeteer | ❌ 需要特殊配置 | ✅ 直接支持 |
| 包大小 | 250MB 限制 | ✅ 无限制 |
| 执行时间 | 10秒 | ✅ 无限制 |
| Chrome | ❌ 精简版 | ✅ 完整版 |

## 🎯 三步部署

### 步骤 1: 推送代码

```bash
git add .
git commit -m "Ready for Dokploy deployment"
git push
```

✅ **Dockerfile 已配置好** - 无需修改！

### 步骤 2: 在 Dokploy 创建应用

1. 登录 Dokploy
2. **Create Application** → **Docker**
3. 配置：
   ```
   Repository: https://github.com/your-username/your-repo
   Branch: main
   Dockerfile: ./Dockerfile
   Port: 3000
   ```

### 步骤 3: 设置环境变量

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_DOWNLOAD=true

# 你的其他环境变量
DATABASE_URL=...
# 等等
```

点击 **Deploy** → 等待 5-10 分钟 → 完成！

## 🎉 就这么简单！

访问: `https://yourdomain.com/tools/md-to-pdf`

测试 PDF 下载 - 应该完美工作！

## 💡 已经为你准备好的

✅ **Dockerfile** - 包含 Chromium 和所有依赖
✅ **中文字体** - 支持多语言
✅ **优化配置** - 最佳性能
✅ **安全设置** - 非 root 用户

## 📊 为什么 Dokploy 更好？

1. **完全控制** - 你的服务器，你的规则
2. **无限制** - 包大小、执行时间、内存
3. **成本低** - 服务器 ~€10/月，无其他费用
4. **性能好** - 完整 Chrome，不是精简版
5. **简单** - 一键部署，自动 SSL

## 🔧 已配置的功能

Dockerfile 已包含：

```dockerfile
✅ Chromium + 完整依赖
✅ 多语言字体（中文、日文、韩文等）
✅ 优化的 Node.js 20
✅ 安全的用户权限
✅ 环境变量配置
✅ Next.js Standalone 输出
```

## 🐛 如果有问题

**问题**: 构建失败
**检查**:
1. Dokploy 日志
2. 服务器内存（至少 2GB）
3. 网络连接

**问题**: PDF 生成失败
**检查**:
1. 环境变量是否设置
2. 容器内存（推荐 4GB）
3. 查看应用日志

## 📚 更多信息

- 详细指南: `DOKPLOY_DEPLOYMENT.md`
- 测试指南: `src/components/tools/TESTING.md`
- Dokploy 文档: https://dokploy.com/docs

## 💰 推荐服务器

**最小配置**:
- 2 vCPU
- 2GB RAM
- 20GB SSD
- 成本: ~€5-10/月

**推荐配置**:
- 2 vCPU
- 4GB RAM
- 50GB SSD
- 成本: ~€10-15/月

**服务商**:
- Hetzner (便宜)
- DigitalOcean (稳定)
- Vultr (快速)

## ✅ 对比总结

| 方案 | 成本 | 配置难度 | Puppeteer | 性能 |
|------|------|---------|-----------|------|
| **Dokploy** | €10/月 | ⭐ | ✅ 完美 | ⭐⭐⭐⭐⭐ |
| Vercel 免费 | 免费 | ⭐⭐ | ⚠️ 需妥协 | ⭐⭐⭐ |
| Vercel Pro | $20/月 | ⭐ | ✅ | ⭐⭐⭐⭐ |

## 🎯 结论

**Dokploy 是最佳选择**，因为：

✅ **完美支持 Puppeteer** - 无需任何妥协
✅ **价格实惠** - 只需服务器成本
✅ **性能优秀** - 完整 Chrome
✅ **配置简单** - Dockerfile 已准备好
✅ **完全控制** - 你的服务器

---

**准备好了吗？开始部署吧！** 🚀
