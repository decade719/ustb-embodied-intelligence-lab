# 修复 Vercel 404 错误

## 🔍 问题原因

Vercel显示404通常是因为：
1. **根目录配置错误** - 文件不在正确的位置
2. **部署配置错误** - vercel.json配置不正确
3. **文件路径问题** - index.html不在根目录

## ✅ 解决方案

### 方案一：检查Vercel项目设置（最重要！）

1. **进入Vercel项目设置**
   - 登录 https://vercel.com
   - 选择您的项目
   - 点击 **Settings** → **General**

2. **检查Root Directory（根目录）**
   - 如果您的GitHub仓库在根目录，**Root Directory留空**
   - 如果您的仓库结构是：
     ```
     仓库根目录/
     └── 实验室网页/
         ├── index.html
         └── ...
     ```
   - 那么Root Directory应该填：`实验室网页`

3. **检查Build Settings**
   - Framework Preset: `Other`
   - Build Command: **留空**（静态网站不需要构建）
   - Output Directory: `.` 或留空

4. **保存并重新部署**
   - 点击 **Save**
   - 点击 **Deployments** → 选择最新部署 → **Redeploy**

### 方案二：确保文件结构正确

**正确的文件结构应该是：**

```
您的仓库/
├── index.html          ← 必须在根目录
├── cases.html
├── members.html
├── styles.css
├── script.js
├── pictures/
└── ...
```

**如果文件在子文件夹中：**

在Vercel设置中，将 **Root Directory** 设置为该子文件夹名称。

### 方案三：使用正确的vercel.json配置

我已经更新了 `vercel.json` 文件，使用最简单的配置：

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

### 方案四：重新部署

1. **删除旧部署**
   - 进入Vercel项目
   - 删除所有失败的部署

2. **重新部署**
   - 点击 **Deployments** → **Redeploy**
   - 或推送新代码到GitHub触发自动部署

## 🚀 快速修复步骤

### 步骤1：检查GitHub仓库结构

```bash
# 查看仓库结构
ls -la
```

确保 `index.html` 在仓库根目录，或者记住它在哪个子文件夹。

### 步骤2：修改Vercel设置

1. 登录 Vercel
2. 进入项目 → Settings → General
3. **Root Directory**：
   - 如果 `index.html` 在仓库根目录 → 留空
   - 如果 `index.html` 在 `实验室网页/` 文件夹 → 填 `实验室网页`
4. **Build Command**：留空
5. **Output Directory**：`.` 或留空
6. 保存

### 步骤3：重新部署

1. 进入 **Deployments**
2. 点击最新部署右侧的 **...** → **Redeploy**
3. 等待部署完成

### 步骤4：验证

访问您的Vercel域名，应该能看到网站首页了。

## 🔧 如果还是404

### 检查清单：

- [ ] Root Directory设置正确
- [ ] index.html文件存在
- [ ] index.html在Root Directory指定的位置
- [ ] 已重新部署
- [ ] 浏览器缓存已清除（Ctrl+F5）

### 查看部署日志：

1. 进入Vercel项目
2. 点击失败的部署
3. 查看 **Build Logs** 和 **Function Logs**
4. 查找错误信息

## 💡 推荐：使用阿里云OSS（更简单）

如果Vercel一直有问题，推荐使用**阿里云OSS静态网站托管**：

✅ **优点**：
- 操作更简单
- 完全免费（5GB存储+5GB流量/月）
- 自动HTTPS
- 全球CDN

**详细步骤请查看：`阿里云免费部署指南.md`**

---

## 📞 需要帮助？

如果问题仍未解决，请提供：
1. Vercel项目的Root Directory设置
2. GitHub仓库的文件结构
3. 部署日志中的错误信息

