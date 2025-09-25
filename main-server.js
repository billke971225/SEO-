const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'web')));

// 健康检查接口
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'seo-tools-main',
        port: PORT,
        uptime: process.uptime()
    });
});

// API状态接口
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        service: 'SEO Tools Main Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// 主页路由
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'web', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send(`
            <h1>SEO Tools Main Server</h1>
            <p>Server is running on port ${PORT}</p>
            <p>Status: <a href="/health">Health Check</a></p>
            <p>Dashboard: <a href="http://localhost:3001">Dashboard</a></p>
        `);
    }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEO Tools Main Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API status: http://localhost:${PORT}/api/status`);
});

module.exports = app;