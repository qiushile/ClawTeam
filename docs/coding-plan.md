# Team Coding Plan — 模型配置方案

> **更新日期：** 2026-04-27
> **版本：** v2

---

## 一、模型分配总览

Team 使用两个主力模型，按业务特性分工：

| 模型 | 提供商 | 端点 | 上下文 | 定位 |
|------|--------|------|--------|------|
| **qwen3.6-plus** | 阿里通义 (DashScope) | `coding.dashscope.aliyuncs.com/v1` | 1M | 通用推理、代码生成、多模态 |
| **GLM-5.1** (`astron-code-latest`) | 科大讯飞 | `maas-coding-api.cn-huabei-1.xf-yun.com/v2` | 200K | 代码理解、长上下文分析、专业领域推理 |

---

## 二、Agent → 模型映射

### 使用 qwen3.6-plus 的 Agent（10 个）

| Agent | 部门 | 原因 |
|-------|------|------|
| orchestrator | 协调中枢 | 需要多模态理解（图像+文本），qwen 支持视觉 |
| dev | 工程部 | 代码生成主力，qwen3.6-plus 代码能力最强 |
| ads | 付费媒体部 | 广告文案+数据分析，通用推理足够 |
| project | 项目管理部 | 任务拆解、进度跟踪，通用推理 |
| qa | 测试部 | 测试用例生成、代码审查，用 qwen3-coder-plus |
| spatial | 空间计算部 | 技术性强，需要代码+推理 |
| game | 游戏开发部 | 代码生成（多引擎），用 qwen3-coder-plus |
| finance | 财务部 | 数据分析、财务建模 |
| hr | 人事部 | 文本处理、招聘流程 |
| supply-chain | 供应链部 | 库存预测、供应商评估 |

### 使用 GLM-5.1 的 Agent（8 个）

| Agent | 部门 | 原因 |
|-------|------|------|
| pm | 产品部 | PRD 撰写、需求分析，需要长上下文理解 |
| design | 设计部 | 设计评审、用户体验分析 |
| sales | 销售部 | 客户分析、投标方案，长文本处理 |
| marketing | 营销部 | 35 个智能体，内容创作量大，200K 上下文支撑 |
| support | 支持部 | 多领域综合（财务/人力/法务/供应链），需要广泛知识 |
| expert | 专家组 | 45+ 个专项智能体，覆盖领域最广 |
| academic | 学术部 | 学术研究，长文献处理 |
| legal | 合规部 | 合同审查、制度撰写，需要精确理解和长文本 |

---

## 三、API 端点配置

### 阿里通义 (qwen3.6-plus)

```
OPENAI_BASE_URL=https://coding.dashscope.aliyuncs.com/v1
OPENAI_MODEL=qwen3.6-plus
```

⚠️ **注意：** `sk-sp-*` 前缀的 Key 仅对 `coding.dashscope.aliyuncs.com/v1` 有效，不能用于 `dashscope.aliyuncs.com/compatible-mode/v1`。

### 科大讯飞 (GLM-5.1)

```
# OpenAI 兼容端点
OPENAI_BASE_URL=https://maas-coding-api.cn-huabei-1.xf-yun.com/v2

# Anthropic 兼容端点（备用）
ANTHROPIC_BASE_URL=https://maas-coding-api.cn-huabei-1.xf-yun.com/anthropic

# 模型 ID
OPENAI_MODEL=astron-code-latest

# API Key 格式: app_id:api_secret
API_KEY=85a53040dd0131990831644a4ada436d:NjFmYzNkOTZjMTU0NGUxZDJmOTkwNmQ3
```

**特性：**
- 实际调用模型：GLM-5.1
- 上下文长度：200K tokens
- 支持 reasoning（推理模式）
- 支持 text + image 输入
- max output tokens：65536

---

## 四、环境变量

```bash
# .env 中的配置
ALIYUN_API_KEY=sk-sp-xxxxx
ALIYUN_BASE_URL=https://coding.dashscope.aliyuncs.com/v1

IFLYTEK_API_KEY=85a53040dd0131990831644a4ada436d:NjFmYzNkOTZjMTU0NGUxZDJmOTkwNmQ3
IFLYTEK_OPENAI_URL=https://maas-coding-api.cn-huabei-1.xf-yun.com/v2
IFLYTEK_ANTHROPIC_URL=https://maas-coding-api.cn-huabei-1.xf-yun.com/anthropic
IFLYTEK_MODEL=astron-code-latest
```

---

## 五、docker-compose.yml 配置模式

### qwen3.6-plus Agent 模板

```yaml
environment:
  - OPENAI_API_KEY=${ALIYUN_API_KEY}
  - OPENAI_BASE_URL=${ALIYUN_BASE_URL}
  - OPENAI_MODEL=qwen3.6-plus
```

### GLM-5.1 Agent 模板

```yaml
environment:
  - OPENAI_API_KEY=${IFLYTEK_API_KEY}
  - OPENAI_BASE_URL=${IFLYTEK_OPENAI_URL}
  - OPENAI_MODEL=${IFLYTEK_MODEL}
```

---

## 六、变更日志

| 日期 | 变更 |
|------|------|
| 2026-04-27 | 新增科大讯飞 GLM-5.1 coding plan；pm/design/sales/marketing/support/expert/academic/legal 切换到 GLM-5.1 |
| 2026-03-30 | 初始配置，全部使用 DashScope 端点 |
