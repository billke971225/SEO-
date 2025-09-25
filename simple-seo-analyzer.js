const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'SEO Analyzer',
        port: PORT,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API状态端点
app.get('/api/status', (req, res) => {
    res.json({
        service: 'SayWishes SEO Tools Analyzer',
        version: '1.0.0',
        status: 'running',
        port: PORT,
        endpoints: [
            '/health',
            '/api/status',
            '/api/analyze',
            '/api/keywords',
            '/api/meta',
            '/api/sitemap'
        ]
    });
});

// 基础SEO分析端点
app.post('/api/analyze', (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
            message: 'Please provide a URL to analyze'
        });
    }

    // 模拟SEO分析结果
    const analysis = {
        url: url,
        timestamp: new Date().toISOString(),
        score: Math.floor(Math.random() * 40) + 60, // 60-100分
        issues: [
            'Missing meta description',
            'Image alt tags needed',
            'H1 tag optimization required'
        ],
        recommendations: [
            'Add meta description (150-160 characters)',
            'Optimize images with alt text',
            'Improve heading structure',
            'Add structured data markup'
        ],
        metrics: {
            loadTime: Math.random() * 3 + 1, // 1-4秒
            mobileScore: Math.floor(Math.random() * 30) + 70,
            desktopScore: Math.floor(Math.random() * 20) + 80
        }
    };

    res.json({
        success: true,
        data: analysis
    });
});

// 关键词分析端点
app.post('/api/keywords', (req, res) => {
    const { keywords, url } = req.body;
    
    res.json({
        success: true,
        data: {
            url: url || 'example.com',
            keywords: keywords || ['seo', 'optimization', 'website'],
            analysis: {
                density: '2.5%',
                placement: 'Good',
                suggestions: [
                    'Use keywords in title tag',
                    'Include in meta description',
                    'Add to heading tags'
                ]
            }
        }
    });
});

// Meta标签优化端点
app.post('/api/meta', (req, res) => {
    const { url, title, description } = req.body;
    
    res.json({
        success: true,
        data: {
            url: url || 'example.com',
            optimized: {
                title: title || 'Optimized Page Title - Brand Name',
                description: description || 'Optimized meta description that includes target keywords and compelling call-to-action within 160 characters.',
                keywords: 'seo, optimization, website, digital marketing'
            },
            recommendations: [
                'Keep title under 60 characters',
                'Meta description should be 150-160 characters',
                'Include target keywords naturally'
            ]
        }
    });
});

// 网站地图管理端点
app.get('/api/sitemap', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'Generated',
            lastUpdated: new Date().toISOString(),
            pages: 25,
            url: '/sitemap.xml',
            recommendations: [
                'Submit to Google Search Console',
                'Update monthly',
                'Include all important pages'
            ]
        }
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong with the SEO analyzer'
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'API endpoint not found',
        availableEndpoints: [
            'GET /health',
            'GET /api/status',
            'POST /api/analyze',
            'POST /api/keywords',
            'POST /api/meta',
            'GET /api/sitemap'
        ]
    });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SEO Analyzer Service started successfully!`);
    console.log(`📍 Server running on: http://0.0.0.0:${PORT}`);
    console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📊 API status: http://0.0.0.0:${PORT}/api/status`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    process.exit(0);
});