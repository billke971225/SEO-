#!/bin/bash

echo "=== 安装SEO分析器缺失的Node.js依赖模块 ==="

# 进入项目目录
cd /root/seo-tools

echo "当前目录: $(pwd)"

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "创建package.json文件..."
    cat > package.json << 'EOF'
{
  "name": "seo-tools-analyzer",
  "version": "1.0.0",
  "description": "SEO Tools Analyzer Service",
  "main": "seo-analyzer-server.js",
  "scripts": {
    "start": "node seo-analyzer-server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.0.0"
  },
  "keywords": ["seo", "analyzer", "tools"],
  "author": "SayWishes",
  "license": "MIT"
}
EOF
fi

echo "安装缺失的依赖模块..."

# 安装cors模块（主要缺失的模块）
npm install cors

# 安装其他可能缺失的模块
npm install axios cheerio puppeteer

echo "检查安装结果..."
npm list cors
npm list axios
npm list cheerio
npm list puppeteer

echo "重启SEO分析器服务..."
systemctl restart seo-tools-analyzer.service

echo "等待服务启动..."
sleep 5

echo "检查服务状态..."
systemctl status seo-tools-analyzer.service --no-pager

echo "检查端口监听..."
netstat -tlnp | grep :3002

echo "检查所有服务端口..."
echo "端口3000 (主服务):"
netstat -tlnp | grep :3000
echo "端口3001 (仪表板):"
netstat -tlnp | grep :3001
echo "端口3002 (SEO分析器):"
netstat -tlnp | grep :3002

echo "=== 依赖安装和服务重启完成 ==="
echo "如果3002端口现在显示监听，则问题已解决"
echo "访问地址："
echo "- 主服务: http://45.76.177.239:3000"
echo "- 仪表板: http://45.76.177.239:3001"
echo "- SEO分析器: http://45.76.177.239:3002"