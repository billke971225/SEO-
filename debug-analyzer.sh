#!/bin/bash

echo "🔍 调试SEO分析器服务..."

cd /root/seo-tools

echo "=== 检查文件是否存在 ==="
ls -la seo-analyzer-server.js

echo "=== 检查服务状态 ==="
systemctl status seo-tools-analyzer.service

echo "=== 检查服务日志 ==="
journalctl -u seo-tools-analyzer.service --no-pager -n 20

echo "=== 检查端口监听 ==="
netstat -tlnp | grep 3002

echo "=== 检查进程 ==="
ps aux | grep seo-analyzer

echo "=== 手动测试启动 ==="
echo "尝试手动启动服务器..."
timeout 5 node seo-analyzer-server.js &
sleep 2
netstat -tlnp | grep 3002

echo "=== 如果文件不存在，从GitHub下载 ==="
if [ ! -f "seo-analyzer-server.js" ]; then
    echo "文件不存在，从GitHub下载..."
    wget -O seo-analyzer-server.js https://raw.githubusercontent.com/billke971225/SEO-/master/seo-analyzer-server.js
    chmod +x seo-analyzer-server.js
    
    echo "重启服务..."
    systemctl restart seo-tools-analyzer.service
    sleep 3
    systemctl status seo-tools-analyzer.service
    netstat -tlnp | grep 3002
fi

echo "🎯 调试完成！"