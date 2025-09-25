# SEO Tools VPS 部署

🚀 专业的SEO工具平台，支持一键VPS部署

## 功能特性

- ✅ 现代化Web界面
- ✅ 双服务器架构（主服务器 + 仪表板）
- ✅ 自动化systemd服务管理
- ✅ 健康检查和API状态监控
- ✅ 响应式设计，支持移动端

## 快速部署

### 方法1：一键部署脚本

```bash
# SSH连接到VPS
ssh root@your-vps-ip

# 克隆仓库
git clone https://github.com/your-username/seo-tools-vps.git
cd seo-tools-vps

# 运行一键部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方法2：手动部署

```bash
# 1. 克隆仓库
git clone https://github.com/your-username/seo-tools-vps.git
cd seo-tools-vps

# 2. 安装依赖
npm install

# 3. 复制systemd服务文件
sudo cp systemd/*.service /etc/systemd/system/

# 4. 启动服务
sudo systemctl daemon-reload
sudo systemctl enable seo-tools-main seo-tools-dashboard
sudo systemctl start seo-tools-main seo-tools-dashboard
```

## 访问地址

部署完成后，你可以通过以下地址访问：

- **主页面**: http://your-vps-ip:3000
- **仪表板**: http://your-vps-ip:3001
- **健康检查**: http://your-vps-ip:3000/health
- **API状态**: http://your-vps-ip:3000/api/status

## 服务管理

```bash
# 查看服务状态
sudo systemctl status seo-tools-main
sudo systemctl status seo-tools-dashboard

# 查看日志
sudo journalctl -u seo-tools-main -f
sudo journalctl -u seo-tools-dashboard -f

# 重启服务
sudo systemctl restart seo-tools-main
sudo systemctl restart seo-tools-dashboard

# 停止服务
sudo systemctl stop seo-tools-main seo-tools-dashboard
```

## 系统要求

- Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- Node.js 16+
- 至少 512MB RAM
- 至少 1GB 磁盘空间

## 端口配置

- 主服务器：3000
- 仪表板服务器：3001

确保防火墙已开放这些端口：

```bash
# Ubuntu/Debian
sudo ufw allow 3000
sudo ufw allow 3001

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

## 故障排除

### 服务无法启动
```bash
# 检查端口占用
sudo netstat -tlnp | grep -E ':(3000|3001)'

# 检查Node.js是否安装
node --version
npm --version
```

### 无法访问Web界面
```bash
# 检查防火墙状态
sudo ufw status
# 或
sudo firewall-cmd --list-all
```

## 许可证

MIT License

## 支持

如有问题，请提交 Issue 或联系技术支持。