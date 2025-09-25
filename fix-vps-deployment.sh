#!/bin/bash

# VPS SEO工具部署修复脚本
# 解决Git冲突并完成完整部署

echo "🚀 开始修复VPS上的SEO工具部署..."

# 进入项目目录
cd /root/seo-tools

# 1. 解决Git冲突
echo "📝 解决Git分支冲突..."
git config pull.rebase false
git reset --hard HEAD
git clean -fd
git pull origin master --force

# 2. 确保所有文件权限正确
echo "🔧 设置文件权限..."
chmod +x deploy.sh
chmod +x *.js
chmod 644 systemd/*.service

# 3. 安装/更新Node.js依赖
echo "📦 安装Node.js依赖..."
npm install --production

# 4. 复制systemd服务文件
echo "⚙️ 配置systemd服务..."
sudo cp systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload

# 5. 启用并启动所有服务
echo "🔄 启动SEO工具服务..."
sudo systemctl enable seo-tools-main seo-tools-dashboard seo-tools-analyzer
sudo systemctl stop seo-tools-main seo-tools-dashboard seo-tools-analyzer 2>/dev/null || true
sudo systemctl start seo-tools-main
sleep 2
sudo systemctl start seo-tools-dashboard
sleep 2
sudo systemctl start seo-tools-analyzer

# 6. 检查服务状态
echo "📊 检查服务状态..."
echo "=== 主服务状态 ==="
sudo systemctl status seo-tools-main --no-pager -l
echo ""
echo "=== 仪表板服务状态 ==="
sudo systemctl status seo-tools-dashboard --no-pager -l
echo ""
echo "=== 分析器服务状态 ==="
sudo systemctl status seo-tools-analyzer --no-pager -l

# 7. 检查端口占用
echo ""
echo "🌐 检查端口状态..."
netstat -tlnp | grep -E ':(3000|3001|3002)'

# 8. 显示访问地址
echo ""
echo "✅ 部署完成！访问地址："
echo "主服务器: http://$(curl -s ifconfig.me):3000"
echo "仪表板: http://$(curl -s ifconfig.me):3001"
echo "SEO分析器: http://$(curl -s ifconfig.me):3002"
echo ""
echo "健康检查:"
echo "curl http://localhost:3000/health"
echo "curl http://localhost:3001/health"
echo "curl http://localhost:3002/health"

echo ""
echo "🎉 SEO工具部署修复完成！"