#!/bin/bash

echo "🚀 强制修复VPS上的SEO工具部署..."

# 进入项目目录
cd /root/seo-tools

echo "📝 强制解决Git分支冲突..."
# 备份当前状态
git stash
# 强制重置到远程master分支
git fetch origin
git reset --hard origin/master
# 强制拉取最新代码，允许不相关历史
git pull origin master --allow-unrelated-histories --strategy-option=theirs

echo "📁 创建systemd目录..."
mkdir -p systemd

echo "📋 手动创建SEO分析器服务文件..."
cat > /etc/systemd/system/seo-tools-analyzer.service << 'EOF'
[Unit]
Description=SayWishes SEO Tools Analyzer Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/seo-tools
ExecStart=/usr/bin/node /root/seo-tools/seo-analyzer-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3002

# 日志配置
StandardOutput=journal
StandardError=journal
SyslogIdentifier=seo-analyzer

# 安全配置
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

echo "🔧 设置文件权限..."
chmod +x *.js
chmod +x *.sh
chmod 644 /etc/systemd/system/seo-tools-analyzer.service

echo "📦 安装Node.js依赖..."
npm install --production

echo "🔄 重新加载systemd并启动所有服务..."
systemctl daemon-reload

# 停止所有服务
systemctl stop seo-tools-main.service 2>/dev/null || true
systemctl stop seo-tools-dashboard.service 2>/dev/null || true
systemctl stop seo-tools-analyzer.service 2>/dev/null || true

# 启用并启动所有服务
systemctl enable seo-tools-main.service
systemctl enable seo-tools-dashboard.service
systemctl enable seo-tools-analyzer.service

systemctl start seo-tools-main.service
systemctl start seo-tools-dashboard.service
systemctl start seo-tools-analyzer.service

echo "⏳ 等待服务启动..."
sleep 5

echo "📊 检查服务状态..."
echo "=== 主服务状态 ==="
systemctl status seo-tools-main.service --no-pager -l

echo "=== 仪表板服务状态 ==="
systemctl status seo-tools-dashboard.service --no-pager -l

echo "=== 分析器服务状态 ==="
systemctl status seo-tools-analyzer.service --no-pager -l

echo "🌐 检查端口状态..."
netstat -tlnp | grep -E ':(3000|3001|3002)'

echo "🔍 检查进程状态..."
ps aux | grep node | grep -v grep

echo "✅ 强制修复完成！访问地址："
echo "主服务器: http://23.94.61.101:3000"
echo "仪表板: http://23.94.61.101:3001"
echo "SEO分析器: http://23.94.61.101:3002"

echo ""
echo "健康检查:"
echo "curl http://localhost:3000/health"
echo "curl http://localhost:3001/health"
echo "curl http://localhost:3002/health"

echo ""
echo "🎉 SEO工具强制修复完成！"