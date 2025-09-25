/**
 * SEO分析器服务器
 * 提供专业的SEO分析和优化建议
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

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



// 网页抓取和分析API
app.post('/api/analyze/comprehensive', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL不能为空' });
        }

        console.log(`🔍 开始分析网页: ${url}`);
        
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        
        // 提取页面信息
        const title = $('title').text().trim() || '';
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
        const h1Tags = $('h1').map((i, el) => $(el).text().trim()).get();
        const h2Tags = $('h2').map((i, el) => $(el).text().trim()).get();
        const images = $('img').map((i, el) => ({
            src: $(el).attr('src'),
            alt: $(el).attr('alt') || ''
        })).get();
        
        // 分析内容
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        const wordCount = bodyText.split(' ').length;
        
        // SEO分析
        const issues = [];
        const suggestions = [];
        let seoScore = 100;
        
        // 标题分析
        if (!title) {
            issues.push('缺少页面标题');
            seoScore -= 15;
        } else if (title.length > 60) {
            issues.push('页面标题过长（超过60字符）');
            seoScore -= 5;
        } else if (title.length < 30) {
            issues.push('页面标题过短（少于30字符）');
            seoScore -= 5;
        }
        
        // Meta描述分析
        if (!metaDescription) {
            issues.push('缺少Meta描述');
            seoScore -= 10;
        } else if (metaDescription.length > 160) {
            issues.push('Meta描述过长（超过160字符）');
            seoScore -= 5;
        } else if (metaDescription.length < 120) {
            issues.push('Meta描述过短（少于120字符）');
            seoScore -= 3;
        }
        
        // H1标签分析
        if (h1Tags.length === 0) {
            issues.push('缺少H1标签');
            seoScore -= 10;
        } else if (h1Tags.length > 1) {
            issues.push('存在多个H1标签');
            seoScore -= 5;
        }
        
        // 图片分析
        const imagesWithoutAlt = images.filter(img => !img.alt);
        if (imagesWithoutAlt.length > 0) {
            issues.push(`有${imagesWithoutAlt.length}张图片缺少Alt属性`);
            seoScore -= Math.min(imagesWithoutAlt.length * 2, 10);
        }
        
        // 内容长度分析
        if (wordCount < 300) {
            issues.push('页面内容过少（少于300词）');
            seoScore -= 8;
        }
        
        // 生成优化建议
        if (title && title.length > 60) {
            suggestions.push('将页面标题缩短至60字符以内');
        }
        if (!metaDescription) {
            suggestions.push('添加120-160字符的Meta描述');
        }
        if (h1Tags.length === 0) {
            suggestions.push('添加一个包含主要关键词的H1标签');
        }
        if (imagesWithoutAlt.length > 0) {
            suggestions.push('为所有图片添加描述性的Alt属性');
        }
        if (wordCount < 300) {
            suggestions.push('增加页面内容，建议至少300词');
        }
        
        // 添加通用建议
        suggestions.push('确保页面加载速度快');
        suggestions.push('优化移动端体验');
        suggestions.push('添加内部链接');
        suggestions.push('使用结构化数据标记');
        
        const analysisResult = {
            url: url,
            title: title,
            description: metaDescription,
            keywords: metaKeywords,
            h1Tags: h1Tags,
            h2Tags: h2Tags.slice(0, 5), // 只显示前5个H2
            imageCount: images.length,
            imagesWithoutAlt: imagesWithoutAlt.length,
            wordCount: wordCount,
            seoScore: Math.max(seoScore, 0),
            issues: issues,
            suggestions: suggestions,
            timestamp: new Date().toISOString()
        };
        
        console.log(`✅ 分析完成: ${url}, SEO得分: ${analysisResult.seoScore}`);
        
        res.json({
            success: true,
            data: analysisResult
        });
        
    } catch (error) {
        console.error('网页分析错误:', error.message);
        res.status(500).json({
            success: false,
            error: `分析失败: ${error.message}`
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

// 主页面路由
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO分析器 - 专业网站SEO分析工具</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .main-content {
            padding: 40px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 1.1em;
        }
        
        .form-group input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 1.1em;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .loading {
            display: none;
            text-align: center;
            padding: 40px;
            color: #667eea;
        }
        
        .loading.show {
            display: block;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .results {
            display: none;
            margin-top: 30px;
        }
        
        .results.show {
            display: block;
        }
        
        .score-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .score-number {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .score-label {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .analysis-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
        }
        
        .analysis-section h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        
        .issue-item, .suggestion-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            border-left: 4px solid #dc3545;
        }
        
        .suggestion-item {
            border-left-color: #28a745;
        }
        
        .page-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .info-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e1e5e9;
        }
        
        .info-card h4 {
            color: #667eea;
            margin-bottom: 8px;
            font-size: 0.9em;
            text-transform: uppercase;
            font-weight: 600;
        }
        
        .info-card p {
            color: #333;
            font-size: 1.1em;
            word-break: break-word;
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .quick-actions {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .quick-btn {
            background: #f8f9fa;
            border: 2px solid #e1e5e9;
            padding: 8px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.3s ease;
        }
        
        .quick-btn:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 SEO分析器</h1>
            <p>专业的网站SEO分析与优化建议工具</p>
        </div>
        
        <div class="main-content">
            <form id="seoForm">
                <div class="form-group">
                    <label for="url">请输入要分析的网站URL:</label>
                    <input type="url" id="url" name="url" placeholder="https://example.com" required>
                </div>
                
                <div class="quick-actions">
                    <div class="quick-btn" onclick="setQuickUrl('https://wishesvideo.com/')">分析 WishesVideo</div>
                    <div class="quick-btn" onclick="setQuickUrl('https://saywishes.com')">分析 SayWishes</div>
                    <div class="quick-btn" onclick="setQuickUrl('https://vidblessings.com')">分析 VidBlessings</div>
                </div>
                
                <button type="submit" class="btn" id="analyzeBtn">开始SEO分析</button>
            </form>
            
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <h3>🔄 正在分析网站...</h3>
                <p>请稍候，这可能需要几秒钟时间</p>
            </div>
            
            <div class="results" id="results">
                <div class="score-card" id="scoreCard">
                    <div class="score-number" id="scoreNumber">0</div>
                    <div class="score-label">SEO得分</div>
                </div>
                
                <div class="page-info" id="pageInfo">
                    <!-- 页面信息将在这里显示 -->
                </div>
                
                <div class="analysis-section">
                    <h3>🚨 发现的问题</h3>
                    <div id="issuesList">
                        <!-- 问题列表将在这里显示 -->
                    </div>
                </div>
                
                <div class="analysis-section">
                    <h3>💡 优化建议</h3>
                    <div id="suggestionsList">
                        <!-- 建议列表将在这里显示 -->
                    </div>
                </div>
            </div>
            
            <div class="error-message" id="errorMessage" style="display: none;">
                <!-- 错误信息将在这里显示 -->
            </div>
        </div>
    </div>

    <script>
        function setQuickUrl(url) {
            document.getElementById('url').value = url;
        }
        
        document.getElementById('seoForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const url = document.getElementById('url').value;
            const loadingDiv = document.getElementById('loading');
            const resultsDiv = document.getElementById('results');
            const errorDiv = document.getElementById('errorMessage');
            const analyzeBtn = document.getElementById('analyzeBtn');
            
            // 重置显示状态
            loadingDiv.classList.add('show');
            resultsDiv.classList.remove('show');
            errorDiv.style.display = 'none';
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = '分析中...';
            
            try {
                // 调用分析API
                const response = await fetch('/api/analyze/comprehensive', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: url,
                        content: '', // 将由服务器获取
                        meta: {},
                        images: []
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    displayResults(data.data);
                } else {
                    throw new Error(data.error || '分析失败');
                }
                
            } catch (error) {
                console.error('分析错误:', error);
                showError('分析失败: ' + error.message);
            } finally {
                loadingDiv.classList.remove('show');
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = '开始SEO分析';
            }
        });
        
        function displayResults(data) {
            const resultsDiv = document.getElementById('results');
            const scoreNumber = document.getElementById('scoreNumber');
            const pageInfo = document.getElementById('pageInfo');
            const issuesList = document.getElementById('issuesList');
            const suggestionsList = document.getElementById('suggestionsList');
            
            // 显示SEO得分
            scoreNumber.textContent = data.seoScore || 0;
            
            // 显示页面信息
            pageInfo.innerHTML = `
                <div class="info-card">
                    <h4>页面标题</h4>
                    <p>${data.title || '未找到标题'}</p>
                </div>
                <div class="info-card">
                    <h4>Meta描述</h4>
                    <p>${data.description || '未找到描述'}</p>
                </div>
                <div class="info-card">
                    <h4>分析时间</h4>
                    <p>${new Date(data.timestamp).toLocaleString()}</p>
                </div>
                <div class="info-card">
                    <h4>页面URL</h4>
                    <p>${data.url || ''}</p>
                </div>
            `;
            
            // 显示问题列表
            const issues = data.issues || ['暂无发现问题'];
            issuesList.innerHTML = issues.map(issue => 
                `<div class="issue-item">${issue}</div>`
            ).join('');
            
            // 显示建议列表
            const suggestions = data.suggestions || ['继续保持良好的SEO实践'];
            suggestionsList.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item">${suggestion}</div>`
            ).join('');
            
            resultsDiv.classList.add('show');
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    </script>
</body>
</html>
    `);
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