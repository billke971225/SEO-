#!/bin/bash

# SEO工具VPS部署脚本
echo "🚀 开始部署完整SEO工具到VPS..."

# 创建项目目录
PROJECT_DIR="/opt/seo-tools"
sudo mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 安装Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo "📦 安装Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

echo "5. 设置文件权限..."
chown -R root:root $PROJECT_DIR
chmod +x $PROJECT_DIR/deploy.sh
chmod 644 $PROJECT_DIR/*.js
chmod 644 $PROJECT_DIR/web/*
chmod 644 $PROJECT_DIR/systemd/*.service

echo "6. 配置 systemd 服务..."
cp $PROJECT_DIR/systemd/seo-tools-main.service /etc/systemd/system/
cp $PROJECT_DIR/systemd/seo-tools-dashboard.service /etc/systemd/system/

echo "7. 重新加载 systemd 并启动服务..."
systemctl daemon-reload
systemctl enable seo-tools-main
systemctl enable seo-tools-dashboard

# 停止可能正在运行的服务
systemctl stop seo-tools-main 2>/dev/null || true
systemctl stop seo-tools-dashboard 2>/dev/null || true

# 启动服务
systemctl start seo-tools-main
systemctl start seo-tools-dashboard

echo "8. 等待服务启动..."
sleep 5

echo "9. 检查服务状态..."
echo "--- 主服务状态 ---"
systemctl status seo-tools-main --no-pager -l
echo ""
echo "--- 仪表板服务状态 ---"
systemctl status seo-tools-dashboard --no-pager -l

echo "10. 检查端口监听..."
echo "--- 端口监听状态 ---"
netstat -tlnp | grep -E ':(3000|3001)' || echo "端口监听检查失败，请检查服务状态"

echo "11. 配置防火墙..."
# 检测防火墙类型并开放端口
if command -v ufw &> /dev/null; then
    echo "配置 UFW 防火墙..."
    ufw allow 3000/tcp
    ufw allow 3001/tcp
elif command -v firewall-cmd &> /dev/null; then
    echo "配置 firewalld 防火墙..."
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --permanent --add-port=3001/tcp
    firewall-cmd --reload
else
    echo "未检测到防火墙，请手动开放端口 3000 和 3001"
fi

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "=== 部署完成! ==="
echo "服务器IP: $SERVER_IP"
echo "主服务器: http://$SERVER_IP:3000"
echo "仪表板: http://$SERVER_IP:3001"
echo "健康检查: http://$SERVER_IP:3000/health"
echo "API状态: http://$SERVER_IP:3000/api/status"
echo ""
echo "=== 管理命令 ==="
echo "查看主服务日志: journalctl -u seo-tools-main -f"
echo "查看仪表板日志: journalctl -u seo-tools-dashboard -f"
echo "重启主服务: systemctl restart seo-tools-main"
echo "重启仪表板: systemctl restart seo-tools-dashboard"
echo ""
echo "=== 测试连接 ==="
echo "正在测试服务连接..."
sleep 2

# 测试主服务
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 主服务连接正常"
else
    echo "❌ 主服务连接失败"
fi

# 测试仪表板服务
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ 仪表板服务连接正常"
else
    echo "❌ 仪表板服务连接失败"
fi

echo ""
echo "部署脚本执行完成！"