/**
 * SEO工具集成管理器
 * 统一管理和协调所有SEO功能模块
 */

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

// 导入各个SEO工具模块
const MetaOptimizer = require('./modules/meta-optimizer');
const StructuredDataGenerator = require('./modules/structured-data-generator');
const SocialMediaOptimizer = require('./modules/social-media-optimizer');
const SitemapManager = require('./modules/sitemap-manager');
const RobotsManager = require('./modules/robots-manager');
const ImageSEOOptimizer = require('./modules/image-seo-optimizer');

class IntegrationManager {
    constructor() {
        this.metaOptimizer = null;
        this.structuredDataGenerator = null;
        this.socialMediaOptimizer = null;
        this.sitemapManager = null;
        this.robotsManager = null;
        this.imageSEOOptimizer = null;
        this.initialized = false;
    }

    /**
     * 初始化所有SEO工具模块
     */
    async initialize() {
        try {
            console.log('🚀 初始化SEO工具集成管理器...');
            
            // 初始化各个模块
            this.metaOptimizer = new MetaOptimizer();
            await this.metaOptimizer.initialize();
            
            this.structuredDataGenerator = new StructuredDataGenerator();
            await this.structuredDataGenerator.initialize();
            
            this.socialMediaOptimizer = new SocialMediaOptimizer();
            await this.socialMediaOptimizer.initialize();
            
            this.sitemapManager = new SitemapManager();
            await this.sitemapManager.initialize();
            
            this.robotsManager = new RobotsManager();
            await this.robotsManager.initialize();
            
            this.imageSEOOptimizer = new ImageSEOOptimizer();
            await this.imageSEOOptimizer.initialize();
            
            this.initialized = true;
            console.log('✅ SEO工具集成管理器初始化完成');
            
            return {
                success: true,
                message: 'SEO工具集成管理器初始化成功',
                modules: {
                    metaOptimizer: true,
                    structuredDataGenerator: true,
                    socialMediaOptimizer: true,
                    sitemapManager: true,
                    robotsManager: true,
                    imageSEOOptimizer: true
                }
            };
        } catch (error) {
            console.error('❌ SEO工具集成管理器初始化失败:', error);
            return {
                success: false,
                message: '初始化失败',
                error: error.message
            };
        }
    }

    /**
     * 检查初始化状态
     */
    checkInitialization() {
        if (!this.initialized) {
            throw new Error('SEO工具集成管理器未初始化，请先调用initialize()方法');
        }
    }

    /**
     * 分析页面SEO
     * @param {string} url - 页面URL
     * @param {string} html - 页面HTML内容（可选）
     * @returns {Object} 分析结果
     */
    async analyzePage(url, html = null) {
        this.checkInitialization();
        
        try {
            console.log(`🔍 开始分析页面: ${url}`);
            
            // 获取页面HTML
            if (!html) {
                const response = await axios.get(url, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                html = response.data;
            }
            
            // 解析HTML
            const $ = cheerio.load(html);
            
            // 并行分析各个方面
            const [
                metaAnalysis,
                structuredDataAnalysis,
                socialMediaAnalysis,
                imageAnalysis
            ] = await Promise.all([
                this.metaOptimizer.analyzePage(html, url),
                this.structuredDataGenerator.analyzeStructuredData(html),
                this.socialMediaOptimizer.analyzePage(html, url),
                this.imageSEOOptimizer.analyzeImages(html, url)
            ]);
            
            // 计算总体SEO评分
            const overallScore = this.calculateOverallScore({
                metaAnalysis,
                structuredDataAnalysis,
                socialMediaAnalysis,
                imageAnalysis
            });
            
            const analysis = {
                url,
                timestamp: new Date().toISOString(),
                overallScore,
                meta: metaAnalysis,
                structuredData: structuredDataAnalysis,
                socialMedia: socialMediaAnalysis,
                images: imageAnalysis,
                summary: {
                    totalIssues: this.countTotalIssues({
                        metaAnalysis,
                        structuredDataAnalysis,
                        socialMediaAnalysis,
                        imageAnalysis
                    }),
                    criticalIssues: this.countCriticalIssues({
                        metaAnalysis,
                        structuredDataAnalysis,
                        socialMediaAnalysis,
                        imageAnalysis
                    })
                }
            };
            
            console.log(`✅ 页面分析完成，总体评分: ${overallScore}/100`);
            return analysis;
            
        } catch (error) {
            console.error('❌ 页面分析失败:', error);
            throw error;
        }
    }

    /**
     * 生成优化建议
     * @param {Object} analysis - 分析结果
     * @returns {Object} 优化建议
     */
    async generateOptimizationSuggestions(analysis) {
        this.checkInitialization();
        
        try {
            console.log('💡 生成优化建议...');
            
            const suggestions = {
                priority: {
                    high: [],
                    medium: [],
                    low: []
                },
                meta: await this.metaOptimizer.generateOptimizationSuggestions(analysis.meta),
                structuredData: await this.structuredDataGenerator.generateOptimizationSuggestions(analysis.structuredData),
                socialMedia: await this.socialMediaOptimizer.generateOptimizationSuggestions(analysis.socialMedia),
                images: await this.imageSEOOptimizer.generateOptimizationSuggestions(analysis.images),
                technical: this.generateTechnicalSuggestions(analysis)
            };
            
            // 按优先级分类建议
            this.categorizeSuggestionsByPriority(suggestions);
            
            console.log('✅ 优化建议生成完成');
            return suggestions;
            
        } catch (error) {
            console.error('❌ 生成优化建议失败:', error);
            throw error;
        }
    }

    /**
     * 批量处理网站
     * @param {string} domain - 网站域名
     * @param {Array} urls - URL列表（可选）
     * @returns {Object} 批量处理结果
     */
    async batchProcessWebsite(domain, urls = null) {
        this.checkInitialization();
        
        try {
            console.log(`🔄 开始批量处理网站: ${domain}`);
            
            // 如果没有提供URL列表，尝试从网站地图获取
            if (!urls) {
                urls = await this.discoverUrls(domain);
            }
            
            const results = {
                domain,
                timestamp: new Date().toISOString(),
                totalUrls: urls.length,
                processed: 0,
                failed: 0,
                pages: [],
                summary: {
                    averageScore: 0,
                    totalIssues: 0,
                    commonIssues: {}
                }
            };
            
            // 批量处理页面（限制并发数）
            const batchSize = 5;
            for (let i = 0; i < urls.length; i += batchSize) {
                const batch = urls.slice(i, i + batchSize);
                const batchPromises = batch.map(async (url) => {
                    try {
                        const analysis = await this.analyzePage(url);
                        const suggestions = await this.generateOptimizationSuggestions(analysis);
                        
                        results.processed++;
                        results.pages.push({
                            url,
                            analysis,
                            suggestions,
                            status: 'success'
                        });
                        
                        console.log(`✅ 处理完成 (${results.processed}/${urls.length}): ${url}`);
                        
                    } catch (error) {
                        results.failed++;
                        results.pages.push({
                            url,
                            status: 'failed',
                            error: error.message
                        });
                        
                        console.error(`❌ 处理失败: ${url} - ${error.message}`);
                    }
                });
                
                await Promise.all(batchPromises);
                
                // 添加延迟避免过于频繁的请求
                if (i + batchSize < urls.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // 计算汇总统计
            this.calculateBatchSummary(results);
            
            console.log(`✅ 批量处理完成: ${results.processed}成功, ${results.failed}失败`);
            return results;
            
        } catch (error) {
            console.error('❌ 批量处理失败:', error);
            throw error;
        }
    }

    /**
     * 发现网站URL
     * @param {string} domain - 域名
     * @returns {Array} URL列表
     */
    async discoverUrls(domain) {
        const urls = [];
        
        try {
            // 尝试获取网站地图
            const sitemapUrls = [`https://${domain}/sitemap.xml`, `https://${domain}/sitemap_index.xml`];
            
            for (const sitemapUrl of sitemapUrls) {
                try {
                    const response = await axios.get(sitemapUrl, { timeout: 5000 });
                    const $ = cheerio.load(response.data, { xmlMode: true });
                    
                    $('url > loc').each((i, elem) => {
                        const url = $(elem).text().trim();
                        if (url && !urls.includes(url)) {
                            urls.push(url);
                        }
                    });
                    
                    break; // 成功获取网站地图后退出循环
                } catch (error) {
                    // 继续尝试下一个网站地图URL
                }
            }
            
            // 如果没有找到网站地图，添加一些常见页面
            if (urls.length === 0) {
                urls.push(
                    `https://${domain}`,
                    `https://${domain}/about`,
                    `https://${domain}/contact`,
                    `https://${domain}/products`,
                    `https://${domain}/services`
                );
            }
            
        } catch (error) {
            console.warn('发现URL时出错:', error.message);
            // 返回基本URL
            urls.push(`https://${domain}`);
        }
        
        return urls.slice(0, 50); // 限制最多50个URL
    }

    /**
     * 计算总体SEO评分
     */
    calculateOverallScore(analyses) {
        const weights = {
            meta: 0.3,
            structuredData: 0.2,
            socialMedia: 0.2,
            images: 0.3
        };
        
        let totalScore = 0;
        let totalWeight = 0;
        
        Object.keys(weights).forEach(key => {
            const analysis = analyses[key + 'Analysis'];
            if (analysis && analysis.score !== undefined) {
                totalScore += analysis.score * weights[key];
                totalWeight += weights[key];
            }
        });
        
        return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    }

    /**
     * 统计总问题数
     */
    countTotalIssues(analyses) {
        let total = 0;
        Object.values(analyses).forEach(analysis => {
            if (analysis && analysis.issues) {
                total += analysis.issues.length;
            }
        });
        return total;
    }

    /**
     * 统计严重问题数
     */
    countCriticalIssues(analyses) {
        let critical = 0;
        Object.values(analyses).forEach(analysis => {
            if (analysis && analysis.issues) {
                critical += analysis.issues.filter(issue => issue.severity === 'high').length;
            }
        });
        return critical;
    }

    /**
     * 生成技术SEO建议
     */
    generateTechnicalSuggestions(analysis) {
        const suggestions = [];
        
        // 基于分析结果生成技术建议
        if (analysis.overallScore < 70) {
            suggestions.push({
                type: 'technical',
                priority: 'high',
                title: '整体SEO优化',
                description: '网站SEO评分较低，建议进行全面优化',
                action: '按优先级逐步解决发现的问题'
            });
        }
        
        return suggestions;
    }

    /**
     * 按优先级分类建议
     */
    categorizeSuggestionsByPriority(suggestions) {
        // 将各模块的建议按优先级分类
        Object.values(suggestions).forEach(moduleSuggestions => {
            if (Array.isArray(moduleSuggestions)) {
                moduleSuggestions.forEach(suggestion => {
                    if (suggestion.priority && suggestions.priority[suggestion.priority]) {
                        suggestions.priority[suggestion.priority].push(suggestion);
                    }
                });
            }
        });
    }

    /**
     * 计算批量处理汇总
     */
    calculateBatchSummary(results) {
        const successfulPages = results.pages.filter(page => page.status === 'success');
        
        if (successfulPages.length > 0) {
            // 计算平均评分
            const totalScore = successfulPages.reduce((sum, page) => sum + page.analysis.overallScore, 0);
            results.summary.averageScore = Math.round(totalScore / successfulPages.length);
            
            // 统计总问题数
            results.summary.totalIssues = successfulPages.reduce((sum, page) => sum + page.analysis.summary.totalIssues, 0);
            
            // 统计常见问题
            const issueTypes = {};
            successfulPages.forEach(page => {
                Object.values(page.analysis).forEach(analysis => {
                    if (analysis && analysis.issues) {
                        analysis.issues.forEach(issue => {
                            issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
                        });
                    }
                });
            });
            
            results.summary.commonIssues = Object.entries(issueTypes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .reduce((obj, [type, count]) => {
                    obj[type] = count;
                    return obj;
                }, {});
        }
    }

    /**
     * 生成网站地图
     * @param {string} domain - 域名
     * @param {Array} urls - URL列表
     * @returns {string} XML网站地图
     */
    async generateSitemap(domain, urls) {
        this.checkInitialization();
        return await this.sitemapManager.generateSitemap(urls);
    }

    /**
     * 生成robots.txt
     * @param {string} domain - 域名
     * @param {Object} options - 配置选项
     * @returns {string} robots.txt内容
     */
    async generateRobotsTxt(domain, options = {}) {
        this.checkInitialization();
        return await this.robotsManager.generateRobotsTxt(domain, options);
    }

    /**
     * 保存分析报告
     * @param {Object} analysis - 分析结果
     * @param {string} format - 格式 (json|html|csv)
     * @returns {string} 保存的文件路径
     */
    async saveAnalysisReport(analysis, format = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `seo-analysis-${timestamp}.${format}`;
        const filepath = path.join(__dirname, 'reports', filename);
        
        try {
            // 确保reports目录存在
            await fs.mkdir(path.dirname(filepath), { recursive: true });
            
            let content;
            switch (format) {
                case 'json':
                    content = JSON.stringify(analysis, null, 2);
                    break;
                case 'html':
                    content = this.generateHTMLReport(analysis);
                    break;
                case 'csv':
                    content = this.generateCSVReport(analysis);
                    break;
                default:
                    throw new Error(`不支持的格式: ${format}`);
            }
            
            await fs.writeFile(filepath, content, 'utf8');
            console.log(`📄 报告已保存: ${filepath}`);
            return filepath;
            
        } catch (error) {
            console.error('❌ 保存报告失败:', error);
            throw error;
        }
    }

    /**
     * 生成HTML报告
     */
    generateHTMLReport(analysis) {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO分析报告 - ${analysis.url}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
        .score { font-size: 2em; color: ${analysis.overallScore >= 80 ? '#28a745' : analysis.overallScore >= 60 ? '#ffc107' : '#dc3545'}; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .issue { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
        .high { border-left-color: #dc3545; }
        .medium { border-left-color: #ffc107; }
        .low { border-left-color: #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SEO分析报告</h1>
        <p><strong>URL:</strong> ${analysis.url}</p>
        <p><strong>分析时间:</strong> ${new Date(analysis.timestamp).toLocaleString('zh-CN')}</p>
        <p><strong>总体评分:</strong> <span class="score">${analysis.overallScore}/100</span></p>
    </div>
    
    <div class="section">
        <h2>问题汇总</h2>
        <p>总问题数: ${analysis.summary.totalIssues}</p>
        <p>严重问题数: ${analysis.summary.criticalIssues}</p>
    </div>
    
    ${Object.entries(analysis).map(([key, value]) => {
        if (key === 'url' || key === 'timestamp' || key === 'overallScore' || key === 'summary') return '';
        if (!value || !value.issues) return '';
        
        return `
        <div class="section">
            <h2>${this.getSectionTitle(key)}</h2>
            <p>评分: ${value.score || 'N/A'}/100</p>
            ${value.issues.map(issue => `
                <div class="issue ${issue.severity}">
                    <strong>${issue.type}:</strong> ${issue.message}
                    ${issue.suggestion ? `<br><em>建议: ${issue.suggestion}</em>` : ''}
                </div>
            `).join('')}
        </div>
        `;
    }).join('')}
</body>
</html>
        `;
    }

    /**
     * 生成CSV报告
     */
    generateCSVReport(analysis) {
        const rows = [
            ['URL', 'Section', 'Issue Type', 'Severity', 'Message', 'Suggestion']
        ];
        
        Object.entries(analysis).forEach(([section, data]) => {
            if (data && data.issues) {
                data.issues.forEach(issue => {
                    rows.push([
                        analysis.url,
                        section,
                        issue.type,
                        issue.severity,
                        issue.message,
                        issue.suggestion || ''
                    ]);
                });
            }
        });
        
        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    /**
     * 获取章节标题
     */
    getSectionTitle(key) {
        const titles = {
            meta: 'Meta标签分析',
            structuredData: '结构化数据分析',
            socialMedia: '社交媒体分析',
            images: '图片SEO分析'
        };
        return titles[key] || key;
    }

    /**
     * 获取系统状态
     */
    getStatus() {
        return {
            initialized: this.initialized,
            modules: {
                metaOptimizer: !!this.metaOptimizer,
                structuredDataGenerator: !!this.structuredDataGenerator,
                socialMediaOptimizer: !!this.socialMediaOptimizer,
                sitemapManager: !!this.sitemapManager,
                robotsManager: !!this.robotsManager,
                imageSEOOptimizer: !!this.imageSEOOptimizer
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = IntegrationManager;