#!/bin/bash

echo "=== 检查服务重启后的状态 ==="

# 1. 检查所有服务状态
echo "1. 检查服务状态:"
echo "主服务状态:"
systemctl status seo-tools-main.service --no-pager -l | head -8
echo ""
echo "仪表板服务状态:"
systemctl status seo-tools-dashboard.service --no-pager -l | head -8
echo ""
echo "SEO分析器服务状态:"
systemctl status seo-tools-analyzer.service --no-pager -l | head -8

# 2. 检查端口监听
echo ""
echo "2. 检查端口监听状态:"
netstat -tlnp | grep -E ':(3000|3001|3002)' | sort

# 3. 检查服务绑定地址
echo ""
echo "3. 检查服务绑定配置:"
echo "主服务绑定检查:"
grep -n "listen\|app.listen\|server.listen" /root/seo-tools/main-server.js | head -3

echo "仪表板服务绑定检查:"
grep -n "listen\|app.listen\|server.listen" /root/seo-tools/dashboard-server.js | head -3

echo "SEO分析器服务绑定检查:"
grep -n "listen\|app.listen\|server.listen" /root/seo-tools/seo-analyzer-server.js | head -3

# 4. 测试本地健康检查
echo ""
echo "4. 测试本地健康检查:"
echo "主服务健康检查:"
curl -s -w "HTTP状态: %{http_code}\n" http://localhost:3000/health || echo "主服务健康检查失败"

echo "仪表板健康检查:"
curl -s -w "HTTP状态: %{http_code}\n" http://localhost:3001/health || echo "仪表板健康检查失败"

echo "SEO分析器健康检查:"
curl -s -w "HTTP状态: %{http_code}\n" http://localhost:3002/health || echo "SEO分析器健康检查失败"

# 5. 检查防火墙状态
echo ""
echo "5. 防火墙状态:"
ufw status | grep -E '(3000|3001|3002)'

echo ""
echo "=== 外部访问地址 ==="
echo "🌐 主服务: http://45.76.177.239:3000"
echo "📊 仪表板: http://45.76.177.239:3001"
echo "🔍 SEO分析器: http://45.76.177.239:3002"
echo ""
echo "请在浏览器中测试以上地址的外部访问"