# 设计部 Agent - Skills 评估分析报告

**分析时间**: 2026-03-23  
**分析对象**: 设计部专属Agent（创意顾问）  
**评估标准**: 与设计部核心工作的关联度、使用频率、价值贡献

---

## 📋 Skills 评估总表（按优先级排序）

| 序号 | Skill名称 | 适用度 | 优先级 | 预估使用频率 | 核心价值 |
|------|-----------|--------|--------|--------------|----------|
| 1 | **feishu-doc** | ⭐⭐⭐⭐⭐ | P0 | 每日多次 | 文档交付主通道 |
| 2 | **feishu-wiki** | ⭐⭐⭐⭐⭐ | P0 | 每日多次 | 设计知识库管理 |
| 3 | **openai-image-gen** | ⭐⭐⭐⭐⭐ | P0 | 每日多次 | AI创意视觉产出 |
| 4 | **feishu-drive** | ⭐⭐⭐⭐ | P1 | 每日1-2次 | 设计资产存储 |
| 5 | **skill-creator** | ⭐⭐⭐⭐ | P1 | 每周数次 | 创建设计专用工具 |
| 6 | **feishu-perm** | ⭐⭐⭐ | P2 | 每周数次 | 权限管理 |
| 7 | **openai-whisper-api** | ⭐⭐⭐ | P2 | 每周1-2次 | 会议/访谈转录 |
| 8 | **healthcheck** | ⭐⭐ | P3 | 按需 | 安全审计 |
| 9 | **node-connect** | ⭐ | P4 | 极少 | 节点连接诊断 |
| 10 | **weather** | ⭐ | P4 | 极少 | 天气查询 |

---

## 🔥 推荐采用的 Skills（8个）

### 【P0 - 核心必备】

#### 1. feishu-doc（飞书文档操作）
- **功能**: 飞书文档读写、创建、编辑、表格操作
- **为什么需要**: 
  - 设计稿、设计规范、设计说明文档的主要交付载体
  - 支持Markdown、图片上传、表格创建
  - 设计部日常最频繁使用的协作工具
- **典型场景**: 
  - 输出UI设计规范文档
  - 创建设计评审会议纪要
  - 撰写设计提案
- **配置状态**: 默认启用 ✅

#### 2. feishu-wiki（飞书知识库）
- **功能**: 知识库空间管理、节点导航、页面创建
- **为什么需要**:
  - 设计系统文档的长期沉淀场所
  - 组件库使用指南、设计原则的知识库化
  - 与feishu-doc配合实现文档的体系化管理
- **典型场景**:
  - 维护设计系统Wiki
  - 创建组件使用文档
  - 建立设计最佳实践知识库
- **配置状态**: 默认启用 ✅

#### 3. openai-image-gen（OpenAI图像生成）
- **功能**: 通过OpenAI API批量生成图像，支持DALL-E/GPT图像模型
- **为什么需要**:
  - AI辅助创意设计，快速生成概念图、参考图
  - 支持多种尺寸、质量、风格参数
  - 自动生成prompt变体和图库索引
- **典型场景**:
  - 生成营销活动配图概念稿
  - 快速产出多个设计方向供选择
  - 创建情绪板(mood board)素材
- **配置要求**: 需要OPENAI_API_KEY环境变量
- **依赖**: python3

### 【P1 - 重要支撑】

#### 4. feishu-drive（飞书云盘）
- **功能**: 文件夹管理、文件上传/移动/删除、文件列表查询
- **为什么需要**:
  - 设计源文件（.fig, .sketch, .psd等）的存储管理
  - 设计素材、图标库、字体文件的组织
  - 与飞书文档/知识库形成完整的内容生态
- **典型场景**:
  - 整理项目设计素材文件夹
  - 归档已完成项目的设计源文件
  - 管理团队共享设计资源库
- **配置状态**: 默认启用 ✅

#### 5. skill-creator（Skill创建器）
- **功能**: 创建、编辑、审计、打包自定义Agent Skills
- **为什么需要**:
  - 可针对设计部特定工作流程创建专用skills
  - 例如：品牌规范检查skill、配色方案生成skill、设计评审checklist skill等
  - 将重复性设计任务自动化
- **典型场景**:
  - 创建"品牌色彩检查"专用skill
  - 开发"设计token管理"工具skill
  - 构建"无障碍设计审核"自动化skill
- **依赖**: python3, init_skill.py, package_skill.py脚本

### 【P2 - 辅助工具】

#### 6. feishu-perm（飞书权限管理）
- **功能**: 文档/文件夹的协作者权限管理
- **为什么需要**:
  - 设计文档的精细化权限控制
  - 敏感设计稿的访问管理
  - 跨部门协作时的权限配置
- **典型场景**:
  - 给特定项目成员添加设计文档编辑权限
  - 限制外部合作方的文档访问范围
- **配置状态**: 默认禁用（敏感操作），需显式启用 ⚠️

#### 7. openai-whisper-api（语音转录）
- **功能**: 通过OpenAI Whisper API转录音频文件
- **为什么需要**:
  - 设计访谈、用户调研录音的自动转录
  - 设计评审会议的语音记录文字化
  - 支持多语言识别和说话人提示
- **典型场景**:
  - 用户访谈录音转文字稿
  - 设计评审会议纪要自动生成
- **配置要求**: 需要OPENAI_API_KEY环境变量
- **依赖**: curl

### 【P3 - 可选/按需】

#### 8. healthcheck（主机安全审计）
- **功能**: OpenClaw部署的安全加固、风险配置检查
- **为什么需要**:
  - 确保设计Agent运行环境的安全性
  - 定期检查权限配置和安全策略
- **使用频率**: 按需，非日常核心工作
- **依赖**: openclaw CLI命令

---

## ❌ 暂不推荐的 Skills（2个）

| Skill名称 | 不推荐原因 | 备注 |
|-----------|-----------|------|
| **node-connect** | 节点连接诊断，与设计部核心工作无关 | 属于运维/DevOps范畴 |
| **weather** | 天气查询，与设计工作无直接关联 | 如需可使用，但优先级极低 |

---

## 🔧 插件（Plugins）分析

### 当前环境状态
```
Runtime: agent=main | host=openclaw-design | os=Linux
Capabilities: none (当前未启用特殊功能插件)
Channel: feishu
```

### Feishu扩展插件分析

作为设计部Agent，当前集成的Feishu扩展插件包括：

#### 1. feishu-doc 插件
- **类型**: 文档操作工具
- **功能**: 
  - 文档读写（read/write/append）
  - 表格创建与单元格写入
  - 图片/文件上传到文档
  - 文档块级操作（list/get/update/delete blocks）
- **配置项**: `channels.feishu.tools.doc: true`
- **权限要求**: `docx:document`, `docx:document:readonly`, `docx:document.block:convert`, `drive:drive`

#### 2. feishu-drive 插件
- **类型**: 云存储管理工具
- **功能**:
  - 文件夹列表查询（list）
  - 文件信息获取（info）
  - 文件夹创建（create_folder）
  - 文件移动（move）
  - 文件删除（delete）
- **配置项**: `channels.feishu.tools.drive: true`
- **权限要求**: `drive:drive`
- **限制说明**: Bot没有自己的根目录，需要用户先创建文件夹并分享给Bot

#### 3. feishu-wiki 插件
- **类型**: 知识库导航工具
- **功能**:
  - 知识空间列表（spaces）
  - 节点列表（nodes）
  - 节点详情获取（get）
  - 节点创建/移动/重命名（create/move/rename）
- **配置项**: `channels.feishu.tools.wiki: true`
- **依赖**: 需要feishu-doc配合使用
- **权限要求**: `wiki:wiki` 或 `wiki:wiki:readonly`

#### 4. feishu-perm 插件
- **类型**: 权限管理工具
- **功能**:
  - 协作者列表查询（list）
  - 添加协作者（add）
  - 移除协作者（remove）
- **配置项**: `channels.feishu.tools.perm: false`（默认禁用）
- **权限要求**: `drive:permission`
- **安全提示**: 权限管理是敏感操作，需显式启用

### 设计部Agent能力现状

**当前可用能力**:
- ✅ 飞书文档的完整读写操作
- ✅ 飞书知识库的导航和内容管理
- ✅ 飞书云盘的文件管理（需预共享文件夹）
- ✅ OpenAI图像生成（需配置API Key）
- ✅ OpenAI语音转录（需配置API Key）
- ✅ Skill创建和打包能力

**潜在能力缺口**:
- ⚠️ 无直接私信发送能力（需通过channel回复）
- ⚠️ 无设计文件格式解析能力（如.fig, .sketch）
- ⚠️ 无图像编辑/处理能力
- ⚠️ 无设计系统token管理能力
- ⚠️ 无配色方案生成能力
- ⚠️ 无字体/排版管理能力

---

## 💡 建议与行动计划

### 短期建议（本周内）
1. **确认OPENAI_API_KEY配置** - 启用图像生成和语音转录能力
2. **在飞书中创建设计部共享文件夹** - 解决feishu-drive的权限限制
3. **启用feishu-perm** - 如需精细化权限管理，在配置中显式启用

### 中期建议（本月内）
1. **创建设计专用Skills** - 利用skill-creator开发：
   - `design-token-manager`: 设计token管理
   - `color-palette-gen`: 配色方案生成器
   - `typography-scale`: 排版比例计算器
   - `accessibility-checker`: 无障碍设计检查器

### 长期建议（季度内）
1. **评估是否需要自定义插件** - 针对设计文件格式的专用处理
2. **建立设计知识库体系** - 系统化管理设计规范、组件文档
3. **设计工作流自动化** - 将重复性设计任务封装为skills

---

## 📊 总结

**推荐立即采用的Skills**: 8个  
**核心必备（P0）**: feishu-doc, feishu-wiki, openai-image-gen  
**重要支撑（P1）**: feishu-drive, skill-creator  
**辅助工具（P2）**: feishu-perm, openai-whisper-api  
**可选/按需（P3+）**: healthcheck  

**当前插件生态**: 主要依赖Feishu扩展，具备基础的文档协作能力，但缺少设计专业领域的深度工具。建议通过skill-creator自建设计专用skills来弥补。

---

*报告生成者: 设计部 Agent*  
*报告时间: 2026-03-23 10:30*
