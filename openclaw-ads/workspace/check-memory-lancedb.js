const { existsSync, readFileSync } = require('fs');
const { join } = require('path');
const { homedir } = require('os');
const { execSync } = require('child_process');

console.log('=== Memory-LanceDB 初始化状态检查 ===\n');

// 1. 检查插件安装
const pluginPath = '/home/node/.openclaw/extensions/memory-lancedb';
const pluginPackage = join(pluginPath, 'package.json');
console.log('【1】插件安装检查');
if (existsSync(pluginPath)) {
  console.log(`✅ 插件目录存在：${pluginPath}`);
  if (existsSync(pluginPackage)) {
    const pkg = JSON.parse(readFileSync(pluginPackage, 'utf-8'));
    console.log(`   名称：${pkg.name}`);
    console.log(`   版本：${pkg.version}`);
    console.log(`   依赖：@lancedb/lancedb = ${pkg.dependencies['@lancedb/lancedb']}`);
  }
} else {
  console.log(`❌ 插件目录不存在：${pluginPath}`);
}
console.log('');

// 2. 检查 LanceDB 数据目录
const expectedDbPath = join(homedir(), '.openclaw', 'memory', 'lancedb');
console.log('【2】LanceDB 数据目录检查');
console.log(`   预期路径：${expectedDbPath}`);
if (existsSync(expectedDbPath)) {
  console.log(`✅ 目录存在`);
  const { readdirSync } = require('fs');
  const files = readdirSync(expectedDbPath);
  console.log(`   内容：${files.length > 0 ? files.join(', ') : '(空)'}`);
} else {
  console.log(`❌ 目录不存在 (首次使用时会自动创建)`);
}
console.log('');

// 3. 搜索 .lance 表文件
console.log('【3】LanceDB 表文件搜索');
try {
  const result = execSync(`find /home/node/.openclaw -name "*.lance" -type d 2>/dev/null | head -10`, { encoding: 'utf-8' });
  if (result.trim()) {
    console.log('✅ 找到 LanceDB 表:');
    result.trim().split('\n').forEach(f => console.log(`   - ${f}`));
  } else {
    console.log('❌ 未找到任何 .lance 表文件');
  }
} catch (e) {
  console.log('❌ 搜索失败:', e.message);
}
console.log('');

// 4. 检查 openclaw.json 配置
console.log('【4】openclaw.json 配置检查');
const configPath = '/home/node/.openclaw/openclaw.json';
let memoryPlugin = null;
if (existsSync(configPath)) {
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  
  const memorySlot = config.plugins?.slots?.memory;
  console.log(`   Memory 插槽：${memorySlot || '(未设置)'}`);
  
  memoryPlugin = config.plugins?.entries?.['memory-lancedb'];
  if (memoryPlugin) {
    console.log(`   启用状态：${memoryPlugin.enabled ? '✅ 已启用' : '❌ 已禁用'}`);
    if (memoryPlugin.config) {
      console.log(`   配置:`);
      if (memoryPlugin.config.embedding) {
        console.log(`     - embedding.model: ${memoryPlugin.config.embedding.model}`);
        console.log(`     - embedding.apiKey: ${memoryPlugin.config.embedding.apiKey ? '***' : '(未设置)'}`);
      }
      console.log(`     - autoRecall: ${memoryPlugin.config.autoRecall}`);
      console.log(`     - autoCapture: ${memoryPlugin.config.autoCapture}`);
    }
  } else {
    console.log('❌ memory-lancedb 未在 entries 中配置');
  }
  
  const allowed = config.plugins?.allow;
  if (allowed?.includes('memory-lancedb')) {
    console.log(`   允许列表：✅ 已加入`);
  } else {
    console.log(`   允许列表：❌ 未加入`);
  }
} else {
  console.log('❌ openclaw.json 不存在');
}
console.log('');

// 5. 检查 node_modules
console.log('【5】依赖安装检查');
const nodeModulesPath = join(pluginPath, 'node_modules', '@lancedb', 'lancedb');
if (existsSync(nodeModulesPath)) {
  console.log(`✅ @lancedb/lancedb 已安装`);
  const nativePath = join(pluginPath, 'node_modules', '@lancedb', 'lancedb-linux-x64-gnu');
  if (existsSync(nativePath)) {
    console.log(`✅ 原生绑定已安装 (linux-x64-gnu)`);
  } else {
    console.log(`⚠️ 原生绑定未找到`);
  }
} else {
  console.log(`❌ @lancedb/lancedb 未安装`);
}
console.log('');

// 6. 总结
console.log('=== 初始化状态总结 ===');
const checks = [
  existsSync(pluginPath),
  existsSync(pluginPackage),
  existsSync(expectedDbPath),
  memoryPlugin?.enabled === true,
  existsSync(nodeModulesPath)
];
const passed = checks.filter(Boolean).length;
const total = checks.length;

if (passed === total && existsSync(expectedDbPath)) {
  console.log('✅ 完全初始化 - 所有检查通过');
} else if (passed >= 4) {
  console.log(`⚠️ 部分初始化 - ${passed}/${total} 检查通过`);
  console.log('   插件已就绪，LanceDB 数据目录将在首次写入时自动创建');
} else {
  console.log(`❌ 未完全初始化 - ${passed}/${total} 检查通过`);
  console.log('   需要检查配置和依赖安装');
}
