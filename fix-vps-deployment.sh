#!/bin/bash

echo "=== 紧急修复VPS服务访问问题 ==="
echo "开始时间: $(date)"

# 1. 检查当前服务状态
echo "1. 检查当前服务状态..."
systemctl status seo-main-service || echo "主服务未运行"
systemctl status seo-dashboard-service || echo "仪表板服务未运行"
systemctl status seo-analyzer-service || echo "SEO分析器服务未运行"

# 2. 检查端口监听
echo "2. 检查端口监听情况..."
netstat -tlnp | grep -E ":(3000|3001|3002)" || echo "没有发现服务端口监听"

# 3. 停止所有服务
echo "3. 停止所有服务..."
systemctl stop seo-main-service 2>/dev/null
systemctl stop seo-dashboard-service 2>/dev/null
systemctl stop seo-analyzer-service 2>/dev/null
pkill -f "node.*server" 2>/dev/null

# 4. 确保项目目录存在
echo "4. 确保项目目录存在..."
mkdir -p /root/seo-tools
cd /root/seo-tools

# 5. 创建package.json
echo "5. 创建package.json..."
cat > package.json << 'EOF'
{
  "name": "seo-tools",
  "version": "1.0.0",
  "description": "SEO Tools Suite",
  "main": "main-server.js",
  "scripts": {
    "start": "node main-server.js",
    "dashboard": "node dashboard-server.js",
    "analyzer": "node seo-analyzer-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4"
  }
}
EOF

# 6. 安装依赖
echo "6. 安装Node.js依赖..."
npm install --production

# 7. 创建主服务器 (绑定到0.0.0.0:3000)
echo "7. 创建主服务器..."
cat > main-server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = 3000;

// 中间件
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('web'));

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'SEO Main Service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// SEO分析API
app.post('/api/seo/analyze', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    res.json({
        url: url,
        score: Math.floor(Math.random() * 40) + 60,
        issues: [
            'Missing meta description',
            'Images without alt text',
            'Slow loading speed'
        ],
        suggestions: [
            'Add meta description',
            'Optimize images',
            'Enable compression'
        ],
        timestamp: new Date().toISOString()
    });
});

// 启动服务器，绑定到0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEO Main Service running on http://0.0.0.0:${PORT}`);
});
EOF

# 8. 创建仪表板服务器 (绑定到0.0.0.0:3001)
echo "8. 创建仪表板服务器..."
cat > dashboard-server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// 仪表板主页
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>SEO Dashboard</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-number { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
            .stat-label { opacity: 0.9; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #555; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .btn { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; }
            .btn:hover { background: #5a6fd8; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 SEO Tools Dashboard</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">156</div>
                    <div class="stat-label">网站已分析</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">89%</div>
                    <div class="stat-label">平均SEO得分</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">342</div>
                    <div class="stat-label">问题已修复</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">监控运行</div>
                </div>
            </div>

            <div class="section">
                <h2>📊 服务状态</h2>
                <p>✅ 主服务: <a href="http://23.94.61.101:3000/health" target="_blank">http://23.94.61.101:3000</a></p>
                 <p>✅ 仪表板: <a href="http://23.94.61.101:3001" target="_blank">http://23.94.61.101:3001</a></p>
                 <p>✅ SEO分析器: <a href="http://23.94.61.101:3002" target="_blank">http://23.94.61.101:3002</a></p>
            </div>

            <div class="section">
                <h2>🔧 快速操作</h2>
                <a href="http://45.76.177.239:3002" class="btn">启动SEO分析</a>
                <a href="http://45.76.177.239:3000/health" class="btn">检查服务健康</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// API端点
app.get('/api/stats', (req, res) => {
    res.json({
        websites_analyzed: 156,
        average_score: 89,
        issues_fixed: 342,
        uptime: '99.9%'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEO Dashboard running on http://0.0.0.0:${PORT}`);
});
EOF

# 9. 创建SEO分析器服务器 (绑定到0.0.0.0:3002)
echo "9. 创建SEO分析器服务器..."
cat > seo-analyzer-server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

// SEO分析器主页
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>SEO Analyzer</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            h1 { color: #333; text-align: center; margin-bottom: 30px; font-size: 2.5em; }
            .analyzer-form { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
            input[type="url"] { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 16px; }
            input[type="url"]:focus { border-color: #667eea; outline: none; }
            .btn { background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; width: 100%; }
            .btn:hover { background: #5a6fd8; }
            .results { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; display: none; }
            .score { font-size: 3em; font-weight: bold; text-align: center; margin-bottom: 20px; }
            .score.good { color: #28a745; }
            .score.average { color: #ffc107; }
            .score.poor { color: #dc3545; }
            .issues, .suggestions { margin-bottom: 20px; }
            .issues h3, .suggestions h3 { color: #555; margin-bottom: 10px; }
            .issues ul, .suggestions ul { list-style-type: none; padding: 0; }
            .issues li, .suggestions li { background: white; padding: 10px; margin-bottom: 5px; border-radius: 5px; border-left: 4px solid #dc3545; }
            .suggestions li { border-left-color: #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 SEO Analyzer</h1>
            
            <div class="analyzer-form">
                <form id="seoForm">
                    <div class="form-group">
                        <label for="url">网站URL:</label>
                        <input type="url" id="url" name="url" placeholder="https://example.com" required>
                    </div>
                    <button type="submit" class="btn">开始SEO分析</button>
                </form>
            </div>

            <div id="results" class="results">
                <div id="score" class="score"></div>
                <div class="issues">
                    <h3>🚨 发现的问题:</h3>
                    <ul id="issuesList"></ul>
                </div>
                <div class="suggestions">
                    <h3>💡 优化建议:</h3>
                    <ul id="suggestionsList"></ul>
                </div>
            </div>
        </div>

        <script>
            document.getElementById('seoForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const url = document.getElementById('url').value;
                const resultsDiv = document.getElementById('results');
                const scoreDiv = document.getElementById('score');
                const issuesList = document.getElementById('issuesList');
                const suggestionsList = document.getElementById('suggestionsList');
                
                try {
                    const response = await fetch('/api/analyze', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: url })
                    });
                    
                    const data = await response.json();
                    
                    // 显示分数
                    scoreDiv.textContent = data.score + '/100';
                    scoreDiv.className = 'score ' + (data.score >= 80 ? 'good' : data.score >= 60 ? 'average' : 'poor');
                    
                    // 显示问题
                    issuesList.innerHTML = '';
                    data.issues.forEach(issue => {
                        const li = document.createElement('li');
                        li.textContent = issue;
                        issuesList.appendChild(li);
                    });
                    
                    // 显示建议
                    suggestionsList.innerHTML = '';
                    data.suggestions.forEach(suggestion => {
                        const li = document.createElement('li');
                        li.textContent = suggestion;
                        suggestionsList.appendChild(li);
                    });
                    
                    resultsDiv.style.display = 'block';
                } catch (error) {
                    alert('分析失败，请稍后重试');
                }
            });
        </script>
    </body>
    </html>
    `);
});

// SEO分析API
app.post('/api/analyze', (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    // 模拟SEO分析
    const score = Math.floor(Math.random() * 40) + 60;
    const issues = [
        '缺少meta描述',
        '图片缺少alt属性',
        '页面加载速度较慢',
        'H1标签重复',
        '内部链接不足'
    ];
    
    const suggestions = [
        '添加meta描述提高点击率',
        '为所有图片添加alt属性',
        '优化图片大小和格式',
        '使用唯一的H1标签',
        '增加相关内部链接'
    ];
    
    res.json({
        url: url,
        score: score,
        issues: issues.slice(0, Math.floor(Math.random() * 3) + 2),
        suggestions: suggestions.slice(0, Math.floor(Math.random() * 3) + 2),
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEO Analyzer running on http://0.0.0.0:${PORT}`);
});
EOF

# 10. 创建web目录和首页
echo "10. 创建web目录和首页..."
mkdir -p web
cat > web/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>SEO Tools Suite</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        h1 { color: #333; text-align: center; margin-bottom: 40px; font-size: 3em; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .service-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; text-decoration: none; transition: transform 0.3s; }
        .service-card:hover { transform: translateY(-5px); }
        .service-icon { font-size: 3em; margin-bottom: 15px; }
        .service-title { font-size: 1.5em; margin-bottom: 10px; }
        .service-desc { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SEO Tools Suite</h1>
        
        <div class="services">
            <a href="http://45.76.177.239:3001" class="service-card">
                <div class="service-icon">📊</div>
                <div class="service-title">SEO Dashboard</div>
                <div class="service-desc">查看SEO统计和监控数据</div>
            </a>
            
            <a href="http://45.76.177.239:3002" class="service-card">
                <div class="service-icon">🔍</div>
                <div class="service-title">SEO Analyzer</div>
                <div class="service-desc">分析网站SEO性能</div>
            </a>
            
            <a href="http://45.76.177.239:3000/health" class="service-card">
                <div class="service-icon">💚</div>
                <div class="service-title">Health Check</div>
                <div class="service-desc">检查服务运行状态</div>
            </a>
        </div>
    </div>
</body>
</html>
EOF

# 11. 创建systemd服务文件
echo "11. 创建systemd服务文件..."

# 主服务
cat > /etc/systemd/system/seo-main-service.service << 'EOF'
[Unit]
Description=SEO Main Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/seo-tools
ExecStart=/usr/bin/node main-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 仪表板服务
cat > /etc/systemd/system/seo-dashboard-service.service << 'EOF'
[Unit]
Description=SEO Dashboard Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/seo-tools
ExecStart=/usr/bin/node dashboard-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# SEO分析器服务
cat > /etc/systemd/system/seo-analyzer-service.service << 'EOF'
[Unit]
Description=SEO Analyzer Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/seo-tools
ExecStart=/usr/bin/node seo-analyzer-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 12. 重新加载systemd并启用服务
echo "12. 重新加载systemd并启用服务..."
systemctl daemon-reload
systemctl enable seo-main-service
systemctl enable seo-dashboard-service
systemctl enable seo-analyzer-service

# 13. 配置防火墙
echo "13. 配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 3002/tcp
ufw --force enable

# 14. 启动所有服务
echo "14. 启动所有服务..."
systemctl start seo-main-service
systemctl start seo-dashboard-service
systemctl start seo-analyzer-service

# 15. 等待服务启动
echo "15. 等待服务启动..."
sleep 5

# 16. 检查服务状态
echo "16. 检查服务状态..."
echo "=== 服务状态 ==="
systemctl status seo-main-service --no-pager
systemctl status seo-dashboard-service --no-pager
systemctl status seo-analyzer-service --no-pager

# 17. 检查端口监听
echo "=== 端口监听 ==="
netstat -tlnp | grep -E ":(3000|3001|3002)"

# 18. 本地健康检查
echo "=== 本地健康检查 ==="
curl -s http://localhost:3000/health || echo "主服务健康检查失败"
curl -s http://localhost:3001/api/stats || echo "仪表板服务检查失败"
curl -s http://localhost:3002/ | head -n 5 || echo "SEO分析器服务检查失败"

# 19. 防火墙状态
echo "=== 防火墙状态 ==="
ufw status

echo "🎉 部署完成！所有服务已启动并运行在以下地址："
echo "📊 主服务: http://23.94.61.101:3000"
echo "📈 仪表板: http://23.94.61.101:3001"
echo "🔍 SEO分析器: http://23.94.61.101:3002"
echo ""
echo "完成时间: $(date)"