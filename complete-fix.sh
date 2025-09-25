#!/bin/bash

echo "=== 完整诊断和修复外部访问问题 ==="

# 1. 检查当前服务状态
echo "1. 检查当前服务状态:"
systemctl is-active seo-tools-main.service
systemctl is-active seo-tools-dashboard.service  
systemctl is-active seo-tools-analyzer.service

# 2. 检查端口监听情况
echo ""
echo "2. 当前端口监听状态:"
netstat -tlnp | grep -E ':(3000|3001|3002)'

# 3. 检查服务器文件中的绑定配置
echo ""
echo "3. 检查当前绑定配置:"
echo "主服务绑定:"
grep -n "listen\|3000" /root/seo-tools/main-server.js | head -5
echo "仪表板绑定:"
grep -n "listen\|3001" /root/seo-tools/dashboard-server.js | head -5
echo "SEO分析器绑定:"
grep -n "listen\|3002" /root/seo-tools/seo-analyzer-server.js | head -5

# 4. 强制修复绑定地址
echo ""
echo "4. 强制修复所有服务绑定地址..."

# 备份文件
cp /root/seo-tools/main-server.js /root/seo-tools/main-server.js.bak
cp /root/seo-tools/dashboard-server.js /root/seo-tools/dashboard-server.js.bak
cp /root/seo-tools/seo-analyzer-server.js /root/seo-tools/seo-analyzer-server.js.bak

# 修复主服务
echo "修复主服务..."
sed -i 's/app\.listen(3000)/app.listen(3000, "0.0.0.0")/g' /root/seo-tools/main-server.js
sed -i 's/server\.listen(3000)/server.listen(3000, "0.0.0.0")/g' /root/seo-tools/main-server.js
sed -i 's/listen(3000)/listen(3000, "0.0.0.0")/g' /root/seo-tools/main-server.js
sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/main-server.js
sed -i 's/127\.0\.0\.1/0.0.0.0/g' /root/seo-tools/main-server.js

# 修复仪表板服务
echo "修复仪表板服务..."
sed -i 's/app\.listen(3001)/app.listen(3001, "0.0.0.0")/g' /root/seo-tools/dashboard-server.js
sed -i 's/server\.listen(3001)/server.listen(3001, "0.0.0.0")/g' /root/seo-tools/dashboard-server.js
sed -i 's/listen(3001)/listen(3001, "0.0.0.0")/g' /root/seo-tools/dashboard-server.js
sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/dashboard-server.js
sed -i 's/127\.0\.0\.1/0.0.0.0/g' /root/seo-tools/dashboard-server.js

# 修复SEO分析器服务
echo "修复SEO分析器服务..."
sed -i 's/app\.listen(3002)/app.listen(3002, "0.0.0.0")/g' /root/seo-tools/seo-analyzer-server.js
sed -i 's/server\.listen(3002)/server.listen(3002, "0.0.0.0")/g' /root/seo-tools/seo-analyzer-server.js
sed -i 's/listen(3002)/listen(3002, "0.0.0.0")/g' /root/seo-tools/seo-analyzer-server.js
sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/seo-analyzer-server.js
sed -i 's/127\.0\.0\.1/0.0.0.0/g' /root/seo-tools/seo-analyzer-server.js

# 5. 停止所有服务
echo ""
echo "5. 停止所有服务..."
systemctl stop seo-tools-main.service
systemctl stop seo-tools-dashboard.service
systemctl stop seo-tools-analyzer.service

# 等待服务完全停止
sleep 3

# 6. 启动所有服务
echo ""
echo "6. 启动所有服务..."
systemctl start seo-tools-main.service
systemctl start seo-tools-dashboard.service
systemctl start seo-tools-analyzer.service

# 等待服务启动
sleep 5

# 7. 检查服务状态
echo ""
echo "7. 检查服务启动状态:"
systemctl status seo-tools-main.service --no-pager -l | head -8
echo "---"
systemctl status seo-tools-dashboard.service --no-pager -l | head -8
echo "---"
systemctl status seo-tools-analyzer.service --no-pager -l | head -8

# 8. 检查新的端口监听状态
echo ""
echo "8. 检查修复后的端口监听:"
netstat -tlnp | grep -E ':(3000|3001|3002)' | sort

# 9. 测试本地健康检查
echo ""
echo "9. 测试本地健康检查:"
echo "主服务:"
curl -s -w "状态码: %{http_code}\n" http://localhost:3000/health || echo "主服务测试失败"
echo ""
echo "仪表板:"
curl -s -w "状态码: %{http_code}\n" http://localhost:3001/health || echo "仪表板测试失败"
echo ""
echo "SEO分析器:"
curl -s -w "状态码: %{http_code}\n" http://localhost:3002/health || echo "SEO分析器测试失败"

# 10. 检查防火墙状态
echo ""
echo "10. 检查防火墙状态:"
ufw status | grep -E '(3000|3001|3002|ALLOW)'

# 11. 显示修复后的配置
echo ""
echo "11. 修复后的绑定配置:"
echo "主服务绑定:"
grep -n "listen.*3000" /root/seo-tools/main-server.js | head -3
echo "仪表板绑定:"
grep -n "listen.*3001" /root/seo-tools/dashboard-server.js | head -3
echo "SEO分析器绑定:"
grep -n "listen.*3002" /root/seo-tools/seo-analyzer-server.js | head -3

echo ""
echo "=== 修复完成！外部访问地址 ==="
echo "🌐 主服务: http://45.76.177.239:3000"
echo "📊 仪表板: http://45.76.177.239:3001"
echo "🔍 SEO分析器: http://45.76.177.239:3002"
echo ""
echo "现在应该可以从浏览器访问了！"