# VPS SEO工具手动修复指南

## 问题分析
根据部署日志，主要问题是：
1. systemd目录缺失
2. SEO分析器服务文件不存在
3. 需要手动创建和配置服务

## 解决步骤

### 1. SSH连接到VPS
```bash
ssh root@23.94.61.101
```

### 2. 进入项目目录
```bash
cd /root/seo-tools
```

### 3. 创建SEO分析器服务文件
```bash
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
```

### 4. 重新加载systemd并启动服务
```bash
systemctl daemon-reload
systemctl enable seo-tools-analyzer.service
systemctl start seo-tools-analyzer.service
```

### 5. 检查所有服务状态
```bash
systemctl status seo-tools-main.service
systemctl status seo-tools-dashboard.service
systemctl status seo-tools-analyzer.service
```

### 6. 检查端口状态
```bash
netstat -tlnp | grep -E ':(3000|3001|3002)'
```

### 7. 测试健康检查
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 预期结果
- 主服务器: http://23.94.61.101:3000 ✅
- 仪表板: http://23.94.61.101:3001 ✅
- SEO分析器: http://23.94.61.101:3002 ✅

## 如果仍有问题
如果SEO分析器服务启动失败，检查日志：
```bash
journalctl -u seo-tools-analyzer.service -f
```

确保seo-analyzer-server.js文件存在：
```bash
ls -la /root/seo-tools/seo-analyzer-server.js
```

如果文件不存在，从GitHub重新拉取：
```bash
git pull origin master --allow-unrelated-histories
```