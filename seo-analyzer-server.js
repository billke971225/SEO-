/**
 * SEO分析器服务器
 * 提供专业的SEO分析和优化建议
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入SEO工具模块
const KeywordAnalysis = require('./keyword-analysis');
const MetaOptimizer = require('./meta-optimizer');
const StructuredDataGenerator = require('./structured-data-generator');
const SocialMediaOptimizer = require('./social-media-optimizer');
const SitemapManager = require('./sitemap-manager');
const RobotsManager = require('./robots-manager');
const ImageSEOOptimizer = require('./image-seo-optimizer');

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, 'web')));

// 初始化SEO工具实例
const keywordAnalysis = new KeywordAnalysis();
const metaOptimizer = new MetaOptimizer();
const structuredDataGenerator = new StructuredDataGenerator();
const socialMediaOptimizer = new SocialMediaOptimizer();
const sitemapManager = new SitemapManager();
const robotsManager = new RobotsManager();
const imageSEOOptimizer = new ImageSEOOptimizer();

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'SEO Analyzer Server',
        timestamp: new Date().toISOString(),
        port: PORT,
        uptime: process.uptime()
    });
});

// API状态端点
app.get('/api/status', (req, res) => {
    res.json({
        service: 'SEO Analyzer API',
        version: '1.0.0',
        status: 'active',
        endpoints: {
            keyword_analysis: '/api/analyze/keywords',
            meta_optimization: '/api/optimize/meta',
            structured_data: '/api/generate/structured-data',
            social_media: '/api/optimize/social-media',
            sitemap: '/api/generate/sitemap',
            robots: '/api/generate/robots',
            image_seo: '/api/optimize/images'
        }
    });
});

// 关键词分析API
app.post('/api/analyze/keywords', async (req, res) => {
    try {
        const { content, targetKeywords, url } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: '内容不能为空' });
        }

        const analysis = await keywordAnalysis.analyzeContent(content, targetKeywords);
        const suggestions = await keywordAnalysis.generateSuggestions(content, targetKeywords);
        
        res.json({
            success: true,
            data: {
                analysis,
                suggestions,
                url: url || null,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Meta标签优化API
app.post('/api/optimize/meta', async (req, res) => {
    try {
        const { title, description, keywords, url } = req.body;
        
        const optimization = metaOptimizer.optimizeMeta({
            title: title || '',
            description: description || '',
            keywords: keywords || []
        });
        
        res.json({
            success: true,
            data: {
                optimization,
                url: url || null,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 结构化数据生成API
app.post('/api/generate/structured-data', async (req, res) => {
    try {
        const { type, data } = req.body;
        
        if (!type || !data) {
            return res.status(400).json({ error: '类型和数据不能为空' });
        }

        let structuredData;
        
        switch (type) {
            case 'organization':
                structuredData = structuredDataGenerator.generateOrganization(data);
                break;
            case 'service':
                structuredData = structuredDataGenerator.generateService(data);
                break;
            case 'product':
                structuredData = structuredDataGenerator.generateProduct(data);
                break;
            case 'video-greeting':
                structuredData = structuredDataGenerator.generateVideoGreetingService(data);
                break;
            default:
                return res.status(400).json({ error: '不支持的结构化数据类型' });
        }
        
        res.json({
            success: true,
            data: {
                structuredData,
                type,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 社交媒体优化API
app.post('/api/optimize/social-media', async (req, res) => {
    try {
        const { title, description, image, url, type } = req.body;
        
        const optimization = socialMediaOptimizer.generateOptimizedTags({
            title: title || '',
            description: description || '',
            image: image || '',
            url: url || '',
            type: type || 'website'
        });
        
        res.json({
            success: true,
            data: {
                optimization,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 网站地图生成API
app.post('/api/generate/sitemap', async (req, res) => {
    try {
        const { urls, domain } = req.body;
        
        if (!urls || !Array.isArray(urls)) {
            return res.status(400).json({ error: 'URLs必须是数组格式' });
        }

        const sitemap = sitemapManager.generateSitemap(urls);
        
        res.json({
            success: true,
            data: {
                sitemap,
                domain: domain || null,
                urlCount: urls.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Robots.txt生成API
app.post('/api/generate/robots', async (req, res) => {
    try {
        const { domain, sitemapUrls, customRules } = req.body;
        
        const robots = robotsManager.generateRobotsTxt({
            domain: domain || '',
            sitemapUrls: sitemapUrls || [],
            customRules: customRules || []
        });
        
        res.json({
            success: true,
            data: {
                robots,
                domain: domain || null,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 图片SEO优化API
app.post('/api/optimize/images', async (req, res) => {
    try {
        const { images, context } = req.body;
        
        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ error: '图片数据必须是数组格式' });
        }

        const optimization = imageSEOOptimizer.optimizeImagesSEO(images, context);
        
        res.json({
            success: true,
            data: {
                optimization,
                imageCount: images.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 综合SEO分析API
app.post('/api/analyze/comprehensive', async (req, res) => {
    try {
        const { url, content, meta, images } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: '内容不能为空' });
        }

        // 执行综合分析
        const keywordAnalysisResult = await keywordAnalysis.analyzeContent(content);
        const metaOptimization = metaOptimizer.optimizeMeta(meta || {});
        const socialMediaOptimization = socialMediaOptimizer.generateOptimizedTags(meta || {});
        const imageOptimization = images ? imageSEOOptimizer.optimizeImagesSEO(images) : null;
        
        // 计算SEO得分
        const seoScore = calculateSEOScore({
            keywordAnalysis: keywordAnalysisResult,
            metaOptimization,
            socialMediaOptimization,
            imageOptimization
        });
        
        res.json({
            success: true,
            data: {
                url: url || null,
                seoScore,
                analysis: {
                    keywords: keywordAnalysisResult,
                    meta: metaOptimization,
                    socialMedia: socialMediaOptimization,
                    images: imageOptimization
                },
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// SEO得分计算函数
function calculateSEOScore(analysis) {
    let score = 0;
    let maxScore = 100;
    
    // 关键词分析得分 (30分)
    if (analysis.keywordAnalysis) {
        score += Math.min(30, analysis.keywordAnalysis.density * 300);
    }
    
    // Meta优化得分 (25分)
    if (analysis.metaOptimization && analysis.metaOptimization.score) {
        score += (analysis.metaOptimization.score / 100) * 25;
    }
    
    // 社交媒体优化得分 (20分)
    if (analysis.socialMediaOptimization) {
        score += 20; // 基础分
    }
    
    // 图片优化得分 (25分)
    if (analysis.imageOptimization) {
        score += 25; // 基础分
    }
    
    return Math.round(Math.min(score, maxScore));
}

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: error.message
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: '接口不存在',
        path: req.path
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`SEO Analyzer Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Status: http://localhost:${PORT}/api/status`);
    console.log(`Comprehensive Analysis: http://localhost:${PORT}/api/analyze/comprehensive`);
});