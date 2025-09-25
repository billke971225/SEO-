#!/bin/bash

echo "=== 修复服务绑定地址 ==="

# 备份原文件
echo "1. 备份原文件..."
cp /root/seo-tools/main-server.js /root/seo-tools/main-server.js.backup
cp /root/seo-tools/dashboard-server.js /root/seo-tools/dashboard-server.js.backup
cp /root/seo-tools/seo-analyzer-server.js /root/seo-tools/seo-analyzer-server.js.backup

# 修复主服务绑定地址
echo "2. 修复主服务绑定地址..."
if grep -q "localhost\|127.0.0.1" /root/seo-tools/main-server.js; then
    echo "修改主服务绑定地址从localhost到0.0.0.0"
    sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/main-server.js
    sed -i 's/127.0.0.1/0.0.0.0/g' /root/seo-tools/main-server.js
    echo "主服务绑定地址已修改"
else
    echo "主服务绑定地址无需修改"
fi

# 修复仪表板服务绑定地址
echo "3. 修复仪表板服务绑定地址..."
if grep -q "localhost\|127.0.0.1" /root/seo-tools/dashboard-server.js; then
    echo "修改仪表板服务绑定地址从localhost到0.0.0.0"
    sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/dashboard-server.js
    sed -i 's/127.0.0.1/0.0.0.0/g' /root/seo-tools/dashboard-server.js
    echo "仪表板服务绑定地址已修改"
else
    echo "仪表板服务绑定地址无需修改"
fi

# 修复SEO分析器服务绑定地址
echo "4. 修复SEO分析器服务绑定地址..."
if grep -q "localhost\|127.0.0.1" /root/seo-tools/seo-analyzer-server.js; then
    echo "修改SEO分析器服务绑定地址从localhost到0.0.0.0"
    sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/seo-analyzer-server.js
    sed -i 's/127.0.0.1/0.0.0.0/g' /root/seo-tools/seo-analyzer-server.js
    echo "SEO分析器服务绑定地址已修改"
else
    echo "SEO分析器服务绑定地址无需修改"
fi

# 显示修改后的绑定配置
echo ""
echo "5. 检查修改后的绑定配置:"
echo "主服务绑定配置:"
grep -n "listen\|app.listen\|server.listen" /root/seo-tools/main-server.js | head -3

echo "仪表板服务绑定配置:"
grep -n "listen\|app.listen\|server.listen" /root/seo-tools/dashboard-server.js | head -3

echo "SEO分析器服务绑定配置:"
grep -n "listen\|app.listen\|server.listen" /root/seo-tools/seo-analyzer-server.js | head -3

# 重启所有服务
echo ""
echo "6. 重启所有服务..."
systemctl restart seo-tools-main.service
systemctl restart seo-tools-dashboard.service
systemctl restart seo-tools-analyzer.service

# 等待服务启动
echo "等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "7. 检查服务状态..."
systemctl is-active seo-tools-main.service
systemctl is-active seo-tools-dashboard.service
systemctl is-active seo-tools-analyzer.service

# 检查端口监听
echo ""
echo "8. 检查端口监听:"
netstat -tlnp | grep -E ':(3000|3001|3002)' | sort

# 测试健康检查
echo ""
echo "9. 测试健康检查:"
echo "主服务健康检查:"
curl -s http://localhost:3000/health || echo "主服务健康检查失败"
echo ""
echo "仪表板健康检查:"
curl -s http://localhost:3001/health || echo "仪表板健康检查失败"
echo ""
echo "SEO分析器健康检查:"
curl -s http://localhost:3002/health || echo "SEO分析器健康检查失败"

echo ""
echo "=== 修复完成 ==="
echo "🌐 主服务: http://45.76.177.239:3000"
echo "📊 仪表板: http://45.76.177.239:3001"
echo "🔍 SEO分析器: http://45.76.177.239:3002"
echo ""
echo "现在可以在浏览器中测试外部访问了！"