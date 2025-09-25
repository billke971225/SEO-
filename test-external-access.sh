#!/bin/bash

echo "=== 测试外部访问和防火墙配置 ==="

# 检查防火墙状态
echo "1. 检查防火墙状态:"
ufw status

echo ""
echo "2. 检查端口监听状态:"
netstat -tlnp | grep -E ':(3000|3001|3002)'

echo ""
echo "3. 检查服务绑定地址:"
echo "检查主服务绑定:"
ps aux | grep "node.*main-server.js" | head -1
echo "检查仪表板服务绑定:"
ps aux | grep "node.*dashboard-server.js" | head -1
echo "检查SEO分析器服务绑定:"
ps aux | grep "node.*seo-analyzer-server.js" | head -1

echo ""
echo "4. 测试本地访问:"
echo "主服务本地测试:"
curl -s -w "HTTP状态: %{http_code}\n" http://localhost:3000/health || echo "本地访问失败"

echo "仪表板本地测试:"
curl -s -w "HTTP状态: %{http_code}\n" http://localhost:3001/health || echo "本地访问失败"

echo "SEO分析器本地测试:"
curl -s -w "HTTP状态: %{http_code}\n" http://localhost:3002/health || echo "本地访问失败"

echo ""
echo "5. 配置防火墙规则 (如果需要):"
echo "如果防火墙阻止了访问，运行以下命令:"
echo "sudo ufw allow 3000"
echo "sudo ufw allow 3001" 
echo "sudo ufw allow 3002"

echo ""
echo "6. 检查服务器配置文件中的绑定地址:"
echo "主服务配置检查:"
grep -n "listen\|bind\|host" /root/seo-tools/main-server.js | head -5

echo "仪表板配置检查:"
grep -n "listen\|bind\|host" /root/seo-tools/dashboard-server.js | head -5

echo "SEO分析器配置检查:"
grep -n "listen\|bind\|host" /root/seo-tools/seo-analyzer-server.js | head -5

echo ""
echo "=== 外部访问地址 ==="
echo "🌐 主服务: http://45.76.177.239:3000"
echo "📊 仪表板: http://45.76.177.239:3001"
echo "🔍 SEO分析器: http://45.76.177.239:3002"