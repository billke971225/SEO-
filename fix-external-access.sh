#!/bin/bash

echo "=== 修复外部访问配置 ==="

# 1. 配置防火墙
echo "1. 配置防火墙规则..."
ufw allow 3000
ufw allow 3001
ufw allow 3002

# 2. 检查并修复服务绑定地址
echo ""
echo "2. 检查服务绑定配置..."

# 检查主服务
echo "检查主服务绑定地址..."
if grep -q "localhost\|127.0.0.1" /root/seo-tools/main-server.js; then
    echo "主服务需要修改绑定地址"
    sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/main-server.js
    sed -i 's/127.0.0.1/0.0.0.0/g' /root/seo-tools/main-server.js
fi

# 检查仪表板服务
echo "检查仪表板服务绑定地址..."
if grep -q "localhost\|127.0.0.1" /root/seo-tools/dashboard-server.js; then
    echo "仪表板服务需要修改绑定地址"
    sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/dashboard-server.js
    sed -i 's/127.0.0.1/0.0.0.0/g' /root/seo-tools/dashboard-server.js
fi

# 检查SEO分析器服务
echo "检查SEO分析器服务绑定地址..."
if grep -q "localhost\|127.0.0.1" /root/seo-tools/seo-analyzer-server.js; then
    echo "SEO分析器服务需要修改绑定地址"
    sed -i 's/localhost/0.0.0.0/g' /root/seo-tools/seo-analyzer-server.js
    sed -i 's/127.0.0.1/0.0.0.0/g' /root/seo-tools/seo-analyzer-server.js
fi

# 3. 重启所有服务
echo ""
echo "3. 重启所有服务..."
systemctl restart seo-tools-main.service
systemctl restart seo-tools-dashboard.service
systemctl restart seo-tools-analyzer.service

# 4. 等待服务启动
echo "等待服务启动..."
sleep 5

# 5. 检查服务状态
echo ""
echo "4. 检查服务状态..."
systemctl status seo-tools-main.service --no-pager -l | head -10
echo "---"
systemctl status seo-tools-dashboard.service --no-pager -l | head -10
echo "---"
systemctl status seo-tools-analyzer.service --no-pager -l | head -10

# 6. 测试端口监听
echo ""
echo "5. 检查端口监听状态:"
netstat -tlnp | grep -E ':(3000|3001|3002)'

# 7. 测试健康检查
echo ""
echo "6. 测试健康检查:"
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
echo "请在浏览器中测试以上地址的外部访问"