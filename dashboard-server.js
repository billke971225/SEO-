const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 静态文件服务
app.use(express.static(__dirname));

// 健康检查接口
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'seo-tools-dashboard',
        port: PORT,
        uptime: process.uptime()
    });
});

// API状态接口
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        service: 'SEO Tools Dashboard Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        port: PORT,
        mainServer: 'http://localhost:3000'
    });
});

// 仪表板路由
app.get('/', (req, res) => {
    const dashboardPath = path.join(__dirname, 'seo-dashboard.html');
    if (fs.existsSync(dashboardPath)) {
        res.sendFile(dashboardPath);
    } else {
        res.send(`
            <h1>SEO Tools Dashboard</h1>
            <p>Dashboard server is running on port ${PORT}</p>
            <p>Status: <a href="/health">Health Check</a></p>
            <p>Main Server: <a href="http://localhost:3000">Main Server</a></p>
        `);
    }
});

// 仪表板页面路由
app.get('/dashboard', (req, res) => {
    const dashboardPath = path.join(__dirname, 'seo-dashboard.html');
    if (fs.existsSync(dashboardPath)) {
        res.sendFile(dashboardPath);
    } else {
        res.redirect('/');
    }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEO Tools Dashboard Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
});

module.exports = app;