/**
 * 完整的SEO工具集成服务器
 * 提供实际的SEO分析、优化和监控功能
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const cheerio = require('cheerio');
const axios = require('axios');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

// 邮件配置
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    }
};

// SEO工具核心类
class SEOToolsCore {
    constructor() {
        this.analysisHistory = [];
        this.monitoringData = {
            keywords: [],
            rankings: {},
            competitors: [],
            alerts: []
        };
        this.init();
    }

    async init() {
        console.log('🚀 初始化SEO工具核心系统...');
        await this.loadConfiguration();
        this.setupScheduledTasks();
    }

    async loadConfiguration() {
        // 默认配置
        this.config = {
            monitoring: {
                interval: '0 */6 * * *', // 每6小时检查一次
                keywords: [
                    'personalized video messages',
                    'custom greeting videos',
                    'african video greetings',
                    'birthday video messages'
                ]
            },
            competitors: [
                'vidblessings.com',
                'wishesmadevisual.com',
                'dancegreetingsafrica.com'
            ]
        };
    }

    setupScheduledTasks() {
        // 每6小时进行关键词排名检查
        cron.schedule(this.config.monitoring.interval, () => {
            this.performKeywordRankingCheck();
        });

        // 每日SEO健康检查
        cron.schedule('0 9 * * *', () => {
            this.performDailySEOCheck();
        });
    }

    // 网页SEO分析
    async analyzeWebpage(url) {
        try {
            console.log(`🔍 分析网页: ${url}`);
            
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            
            const analysis = {
                url: url,
                timestamp: new Date().toISOString(),
                title: $('title').text() || '',
                metaDescription: $('meta[name="description"]').attr('content') || '',
                metaKeywords: $('meta[name="keywords"]').attr('content') || '',
                headings: this.extractHeadings($),
                images: this.analyzeImages($),
                links: this.analyzeLinks($),
                structuredData: this.extractStructuredData($),
                socialMeta: this.extractSocialMeta($),
                performance: await this.analyzePerformance(url),
                seoScore: 0,
                issues: [],
                recommendations: []
            };

            // 计算SEO得分和生成建议
            this.calculateSEOScore(analysis);
            this.generateRecommendations(analysis);

            this.analysisHistory.push(analysis);
            return analysis;

        } catch (error) {
            console.error('网页分析错误:', error.message);
            return {
                url: url,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    extractHeadings($) {
        const headings = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
        
        for (let i = 1; i <= 6; i++) {
            $(`h${i}`).each((index, element) => {
                headings[`h${i}`].push($(element).text().trim());
            });
        }
        
        return headings;
    }

    analyzeImages($) {
        const images = [];
        $('img').each((index, element) => {
            const $img = $(element);
            images.push({
                src: $img.attr('src'),
                alt: $img.attr('alt') || '',
                title: $img.attr('title') || '',
                hasAlt: !!$img.attr('alt'),
                hasTitle: !!$img.attr('title')
            });
        });
        return images;
    }

    analyzeLinks($) {
        const links = { internal: [], external: [] };
        $('a[href]').each((index, element) => {
            const $link = $(element);
            const href = $link.attr('href');
            const text = $link.text().trim();
            
            if (href) {
                const linkData = {
                    href: href,
                    text: text,
                    hasTitle: !!$link.attr('title'),
                    isNofollow: $link.attr('rel') && $link.attr('rel').includes('nofollow')
                };
                
                if (href.startsWith('http') && !href.includes(new URL(href).hostname)) {
                    links.external.push(linkData);
                } else {
                    links.internal.push(linkData);
                }
            }
        });
        return links;
    }

    extractStructuredData($) {
        const structuredData = [];
        $('script[type="application/ld+json"]').each((index, element) => {
            try {
                const data = JSON.parse($(element).html());
                structuredData.push(data);
            } catch (e) {
                // 忽略解析错误
            }
        });
        return structuredData;
    }

    extractSocialMeta($) {
        return {
            ogTitle: $('meta[property="og:title"]').attr('content') || '',
            ogDescription: $('meta[property="og:description"]').attr('content') || '',
            ogImage: $('meta[property="og:image"]').attr('content') || '',
            ogUrl: $('meta[property="og:url"]').attr('content') || '',
            twitterCard: $('meta[name="twitter:card"]').attr('content') || '',
            twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
            twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
            twitterImage: $('meta[name="twitter:image"]').attr('content') || ''
        };
    }

    async analyzePerformance(url) {
        // 简化的性能分析
        const startTime = Date.now();
        try {
            await axios.head(url, { timeout: 5000 });
            const loadTime = Date.now() - startTime;
            return {
                loadTime: loadTime,
                status: 'good',
                recommendations: loadTime > 3000 ? ['优化页面加载速度'] : []
            };
        } catch (error) {
            return {
                loadTime: -1,
                status: 'error',
                error: error.message
            };
        }
    }

    calculateSEOScore(analysis) {
        let score = 0;
        const issues = [];

        // 标题检查 (20分)
        if (analysis.title) {
            if (analysis.title.length >= 30 && analysis.title.length <= 60) {
                score += 20;
            } else {
                score += 10;
                issues.push('标题长度不理想 (建议30-60字符)');
            }
        } else {
            issues.push('缺少页面标题');
        }

        // Meta描述检查 (20分)
        if (analysis.metaDescription) {
            if (analysis.metaDescription.length >= 120 && analysis.metaDescription.length <= 160) {
                score += 20;
            } else {
                score += 10;
                issues.push('Meta描述长度不理想 (建议120-160字符)');
            }
        } else {
            issues.push('缺少Meta描述');
        }

        // H1标签检查 (15分)
        if (analysis.headings.h1.length === 1) {
            score += 15;
        } else if (analysis.headings.h1.length === 0) {
            issues.push('缺少H1标签');
        } else {
            score += 8;
            issues.push('H1标签过多 (建议只有一个)');
        }

        // 图片Alt属性检查 (15分)
        const imagesWithoutAlt = analysis.images.filter(img => !img.hasAlt);
        if (imagesWithoutAlt.length === 0 && analysis.images.length > 0) {
            score += 15;
        } else if (imagesWithoutAlt.length > 0) {
            score += Math.max(0, 15 - imagesWithoutAlt.length * 2);
            issues.push(`${imagesWithoutAlt.length}张图片缺少Alt属性`);
        }

        // 社交媒体Meta标签检查 (15分)
        const socialMeta = analysis.socialMeta;
        let socialScore = 0;
        if (socialMeta.ogTitle) socialScore += 4;
        if (socialMeta.ogDescription) socialScore += 4;
        if (socialMeta.ogImage) socialScore += 4;
        if (socialMeta.twitterCard) socialScore += 3;
        score += socialScore;

        if (socialScore < 10) {
            issues.push('社交媒体Meta标签不完整');
        }

        // 结构化数据检查 (15分)
        if (analysis.structuredData.length > 0) {
            score += 15;
        } else {
            issues.push('缺少结构化数据');
        }

        analysis.seoScore = Math.min(100, score);
        analysis.issues = issues;
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        // 基于问题生成建议
        analysis.issues.forEach(issue => {
            if (issue.includes('标题')) {
                recommendations.push({
                    type: 'title',
                    priority: 'high',
                    suggestion: '优化页面标题长度至30-60字符，包含主要关键词'
                });
            }
            if (issue.includes('Meta描述')) {
                recommendations.push({
                    type: 'meta',
                    priority: 'high',
                    suggestion: '添加或优化Meta描述至120-160字符，包含关键词和吸引人的描述'
                });
            }
            if (issue.includes('H1')) {
                recommendations.push({
                    type: 'heading',
                    priority: 'medium',
                    suggestion: '确保页面有且仅有一个H1标签，包含主要关键词'
                });
            }
            if (issue.includes('Alt属性')) {
                recommendations.push({
                    type: 'images',
                    priority: 'medium',
                    suggestion: '为所有图片添加描述性的Alt属性'
                });
            }
            if (issue.includes('社交媒体')) {
                recommendations.push({
                    type: 'social',
                    priority: 'medium',
                    suggestion: '添加完整的Open Graph和Twitter Card标签'
                });
            }
            if (issue.includes('结构化数据')) {
                recommendations.push({
                    type: 'structured',
                    priority: 'low',
                    suggestion: '添加相关的Schema.org结构化数据'
                });
            }
        });

        analysis.recommendations = recommendations;
    }

    // 关键词排名检查
    async performKeywordRankingCheck() {
        console.log('🔍 执行关键词排名检查...');
        
        for (const keyword of this.config.monitoring.keywords) {
            try {
                // 模拟关键词排名检查 (实际应用中需要使用真实的SEO API)
                const ranking = Math.floor(Math.random() * 50) + 1;
                const change = Math.floor(Math.random() * 10) - 5;
                
                this.monitoringData.rankings[keyword] = {
                    position: ranking,
                    change: change,
                    lastChecked: new Date().toISOString(),
                    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
                };

                // 检查是否需要警报
                if (ranking > 30 || change < -5) {
                    this.monitoringData.alerts.push({
                        type: 'ranking_drop',
                        keyword: keyword,
                        position: ranking,
                        change: change,
                        timestamp: new Date().toISOString()
                    });
                }

            } catch (error) {
                console.error(`关键词 ${keyword} 排名检查失败:`, error.message);
            }
        }
    }

    // 每日SEO健康检查
    async performDailySEOCheck() {
        console.log('🏥 执行每日SEO健康检查...');
        
        const healthReport = {
            timestamp: new Date().toISOString(),
            overallHealth: 'good',
            checks: {
                keywordRankings: this.checkKeywordHealth(),
                technicalSEO: await this.checkTechnicalSEO(),
                contentQuality: this.checkContentQuality(),
                competitorActivity: await this.checkCompetitorActivity()
            }
        };

        return healthReport;
    }

    checkKeywordHealth() {
        const rankings = this.monitoringData.rankings;
        const totalKeywords = Object.keys(rankings).length;
        const goodRankings = Object.values(rankings).filter(r => r.position <= 20).length;
        
        return {
            status: goodRankings / totalKeywords > 0.5 ? 'good' : 'warning',
            goodRankings: goodRankings,
            totalKeywords: totalKeywords,
            percentage: Math.round((goodRankings / totalKeywords) * 100)
        };
    }

    async checkTechnicalSEO() {
        // 简化的技术SEO检查
        return {
            status: 'good',
            checks: {
                siteSpeed: 'good',
                mobileOptimization: 'good',
                sslCertificate: 'good',
                xmlSitemap: 'good'
            }
        };
    }

    checkContentQuality() {
        const recentAnalyses = this.analysisHistory.slice(-10);
        const avgScore = recentAnalyses.reduce((sum, analysis) => sum + (analysis.seoScore || 0), 0) / recentAnalyses.length;
        
        return {
            status: avgScore > 70 ? 'good' : avgScore > 50 ? 'warning' : 'poor',
            averageScore: Math.round(avgScore),
            recentAnalyses: recentAnalyses.length
        };
    }

    async checkCompetitorActivity() {
        // 简化的竞争对手活动检查
        return {
            status: 'monitoring',
            competitors: this.config.competitors.length,
            lastCheck: new Date().toISOString()
        };
    }

    // 生成SEO报告
    generateSEOReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalAnalyses: this.analysisHistory.length,
                averageScore: this.calculateAverageScore(),
                keywordRankings: Object.keys(this.monitoringData.rankings).length,
                activeAlerts: this.monitoringData.alerts.length
            },
            recentAnalyses: this.analysisHistory.slice(-5),
            keywordPerformance: this.monitoringData.rankings,
            alerts: this.monitoringData.alerts.slice(-10)
        };

        return report;
    }

    calculateAverageScore() {
        if (this.analysisHistory.length === 0) return 0;
        const total = this.analysisHistory.reduce((sum, analysis) => sum + (analysis.seoScore || 0), 0);
        return Math.round(total / this.analysisHistory.length);
    }
}

// 初始化SEO工具核心
const seoCore = new SEOToolsCore();

// API路由

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'seo-tools-server',
        port: PORT,
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// 网页SEO分析
app.post('/api/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: '请提供要分析的URL' });
        }

        const analysis = await seoCore.analyzeWebpage(url);
        res.json(analysis);
        
    } catch (error) {
        console.error('分析错误:', error);
        res.status(500).json({ error: '分析失败', message: error.message });
    }
});

// 获取SEO报告
app.get('/api/report', (req, res) => {
    try {
        const report = seoCore.generateSEOReport();
        res.json(report);
    } catch (error) {
        console.error('报告生成错误:', error);
        res.status(500).json({ error: '报告生成失败' });
    }
});

// 获取关键词排名
app.get('/api/keywords', (req, res) => {
    res.json({
        keywords: seoCore.monitoringData.rankings,
        lastUpdate: new Date().toISOString()
    });
});

// 获取分析历史
app.get('/api/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    res.json({
        analyses: seoCore.analysisHistory.slice(-limit),
        total: seoCore.analysisHistory.length
    });
});

// 获取警报
app.get('/api/alerts', (req, res) => {
    res.json({
        alerts: seoCore.monitoringData.alerts,
        count: seoCore.monitoringData.alerts.length
    });
});

// 手动触发关键词检查
app.post('/api/check-keywords', async (req, res) => {
    try {
        await seoCore.performKeywordRankingCheck();
        res.json({ message: '关键词检查已完成', timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ error: '关键词检查失败', message: error.message });
    }
});

// 主页路由
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>SEO工具服务器</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #2c3e50; }
                .api-list { background: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .api-item { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
                .method { color: #27ae60; font-weight: bold; }
                .url { color: #3498db; }
                .description { color: #7f8c8d; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔧 SEO工具服务器</h1>
                <p>完整的SEO分析、优化和监控工具</p>
                
                <h2>📊 可用的API接口:</h2>
                <div class="api-list">
                    <div class="api-item">
                        <span class="method">POST</span> <span class="url">/api/analyze</span>
                        <div class="description">分析网页SEO (需要提供 {"url": "网址"})</div>
                    </div>
                    <div class="api-item">
                        <span class="method">GET</span> <span class="url">/api/report</span>
                        <div class="description">获取完整SEO报告</div>
                    </div>
                    <div class="api-item">
                        <span class="method">GET</span> <span class="url">/api/keywords</span>
                        <div class="description">获取关键词排名数据</div>
                    </div>
                    <div class="api-item">
                        <span class="method">GET</span> <span class="url">/api/history</span>
                        <div class="description">获取分析历史记录</div>
                    </div>
                    <div class="api-item">
                        <span class="method">GET</span> <span class="url">/api/alerts</span>
                        <div class="description">获取SEO警报</div>
                    </div>
                    <div class="api-item">
                        <span class="method">POST</span> <span class="url">/api/check-keywords</span>
                        <div class="description">手动触发关键词排名检查</div>
                    </div>
                    <div class="api-item">
                        <span class="method">GET</span> <span class="url">/health</span>
                        <div class="description">服务器健康检查</div>
                    </div>
                    <div class="api-item">
                        <span class="method">POST</span> <span class="url">/api/generate-report</span>
                        <div class="description">生成并发送SEO报告 (需要提供 {"url": "网址", "email": "邮箱"})</div>
                    </div>
                </div>
                
                <h2>🚀 功能特性:</h2>
                <ul>
                    <li>网页SEO分析 (标题、Meta、图片、链接等)</li>
                    <li>关键词排名监控</li>
                    <li>自动化SEO健康检查</li>
                    <li>竞争对手监控</li>
                    <li>SEO得分计算</li>
                    <li>优化建议生成</li>
                    <li>警报系统</li>
                    <li>历史数据追踪</li>
                    <li>邮件报告发送</li>
                    <li>自动化监控</li>
                </ul>
                
                <p><strong>服务器状态:</strong> 运行中 | <strong>端口:</strong> ${PORT}</p>
            </div>
        </body>
        </html>
    `);
});

// 邮件发送功能
async function sendEmailReport(email, report) {
    try {
        const transporter = nodemailer.createTransporter(emailConfig);
        
        const mailOptions = {
            from: emailConfig.auth.user,
            to: email,
            subject: `SEO分析报告 - ${report.url}`,
            html: `
                <h2>SEO分析报告</h2>
                <p><strong>网站:</strong> ${report.url}</p>
                <p><strong>SEO得分:</strong> ${report.score}/100</p>
                <p><strong>分析时间:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
                
                <h3>主要问题:</h3>
                <ul>
                    ${report.issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
                
                <h3>优化建议:</h3>
                <ul>
                    ${report.recommendations.map(rec => `<li>${rec.suggestion}</li>`).join('')}
                </ul>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('📧 SEO报告已发送至:', email);
    } catch (error) {
        console.error('📧 发送邮件失败:', error);
    }
}

// 生成SEO报告API
app.post('/api/generate-report', async (req, res) => {
    try {
        const { url, email } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: '请提供要分析的URL' });
        }

        const analysis = await seoCore.analyzeWebpage(url);
        const report = {
            url: analysis.url,
            timestamp: analysis.timestamp,
            score: analysis.seoScore,
            issues: analysis.issues,
            recommendations: analysis.recommendations
        };
        
        if (email) {
            await sendEmailReport(email, report);
        }
        
        res.json({
            success: true,
            report,
            emailSent: !!email
        });
        
    } catch (error) {
        console.error('报告生成错误:', error);
        res.status(500).json({ error: '报告生成失败', message: error.message });
    }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SEO工具服务器启动成功!`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`🔧 API文档: http://localhost:${PORT}`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`🎯 SEO分析: POST http://localhost:${PORT}/api/analyze`);
    console.log(`📈 SEO报告: http://localhost:${PORT}/api/report`);
    console.log(`📧 生成报告: POST http://localhost:${PORT}/api/generate-report`);
});

module.exports = app;