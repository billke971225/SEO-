/**
 * Robots.txt Manager
 * 管理和生成robots.txt文件的工具类
 */

class RobotsManager {
    constructor() {
        this.rules = [];
        this.sitemaps = [];
        this.crawlDelay = null;
        this.host = null;
    }

    /**
     * 添加用户代理规则
     * @param {string} userAgent - 用户代理（如 '*', 'Googlebot'）
     * @param {Array} allowPaths - 允许访问的路径
     * @param {Array} disallowPaths - 禁止访问的路径
     * @param {number} crawlDelay - 爬取延迟（秒）
     */
    addUserAgentRule(userAgent, allowPaths = [], disallowPaths = [], crawlDelay = null) {
        this.rules.push({
            userAgent,
            allow: allowPaths,
            disallow: disallowPaths,
            crawlDelay
        });
    }

    /**
     * 添加网站地图URL
     * @param {string} sitemapUrl - 网站地图URL
     */
    addSitemap(sitemapUrl) {
        if (!this.sitemaps.includes(sitemapUrl)) {
            this.sitemaps.push(sitemapUrl);
        }
    }

    /**
     * 设置全局爬取延迟
     * @param {number} delay - 延迟时间（秒）
     */
    setCrawlDelay(delay) {
        this.crawlDelay = delay;
    }

    /**
     * 设置首选主机
     * @param {string} hostUrl - 主机URL
     */
    setHost(hostUrl) {
        this.host = hostUrl;
    }

    /**
     * 生成基础的robots.txt内容
     * @param {string} domain - 网站域名
     * @returns {string} robots.txt内容
     */
    generateBasicRobots(domain) {
        let content = '';
        
        // 基础规则
        content += 'User-agent: *\n';
        content += 'Allow: /\n';
        content += 'Disallow: /admin/\n';
        content += 'Disallow: /private/\n';
        content += 'Disallow: /temp/\n';
        content += 'Disallow: /*.json$\n';
        content += 'Disallow: /*.xml$\n';
        content += '\n';

        // 搜索引擎特定规则
        content += 'User-agent: Googlebot\n';
        content += 'Allow: /\n';
        content += 'Crawl-delay: 1\n';
        content += '\n';

        content += 'User-agent: Bingbot\n';
        content += 'Allow: /\n';
        content += 'Crawl-delay: 2\n';
        content += '\n';

        // 网站地图
        content += `Sitemap: https://${domain}/sitemap.xml\n`;
        content += `Sitemap: https://${domain}/sitemap-index.xml\n`;

        return content;
    }

    /**
     * 为视频问候服务生成专用robots.txt
     * @param {string} domain - 网站域名
     * @returns {string} robots.txt内容
     */
    generateVideoGreetingRobots(domain) {
        let content = '';
        
        // 通用规则
        content += 'User-agent: *\n';
        content += 'Allow: /\n';
        content += 'Allow: /videos/\n';
        content += 'Allow: /api/public/\n';
        content += 'Disallow: /admin/\n';
        content += 'Disallow: /api/private/\n';
        content += 'Disallow: /user-data/\n';
        content += 'Disallow: /temp/\n';
        content += 'Disallow: /uploads/private/\n';
        content += '\n';

        // Google特定规则
        content += 'User-agent: Googlebot\n';
        content += 'Allow: /\n';
        content += 'Allow: /videos/\n';
        content += 'Allow: /api/public/\n';
        content += 'Crawl-delay: 1\n';
        content += '\n';

        // 视频爬虫规则
        content += 'User-agent: Googlebot-Video\n';
        content += 'Allow: /videos/\n';
        content += 'Allow: /thumbnails/\n';
        content += 'Disallow: /videos/private/\n';
        content += '\n';

        // 图片爬虫规则
        content += 'User-agent: Googlebot-Image\n';
        content += 'Allow: /images/\n';
        content += 'Allow: /thumbnails/\n';
        content += 'Allow: /assets/images/\n';
        content += '\n';

        // 社交媒体爬虫
        content += 'User-agent: facebookexternalhit\n';
        content += 'Allow: /\n';
        content += 'Allow: /videos/\n';
        content += '\n';

        content += 'User-agent: Twitterbot\n';
        content += 'Allow: /\n';
        content += 'Allow: /videos/\n';
        content += '\n';

        // 恶意爬虫阻止
        content += 'User-agent: AhrefsBot\n';
        content += 'Disallow: /\n';
        content += '\n';

        content += 'User-agent: MJ12bot\n';
        content += 'Disallow: /\n';
        content += '\n';

        // 网站地图
        content += `Sitemap: https://${domain}/sitemap.xml\n`;
        content += `Sitemap: https://${domain}/video-sitemap.xml\n`;
        content += `Sitemap: https://${domain}/image-sitemap.xml\n`;

        return content;
    }

    /**
     * 生成自定义robots.txt
     * @returns {string} robots.txt内容
     */
    generateCustomRobots() {
        let content = '';

        // 添加用户代理规则
        this.rules.forEach(rule => {
            content += `User-agent: ${rule.userAgent}\n`;
            
            rule.allow.forEach(path => {
                content += `Allow: ${path}\n`;
            });
            
            rule.disallow.forEach(path => {
                content += `Disallow: ${path}\n`;
            });
            
            if (rule.crawlDelay) {
                content += `Crawl-delay: ${rule.crawlDelay}\n`;
            }
            
            content += '\n';
        });

        // 添加全局爬取延迟
        if (this.crawlDelay) {
            content += `Crawl-delay: ${this.crawlDelay}\n\n`;
        }

        // 添加主机信息
        if (this.host) {
            content += `Host: ${this.host}\n\n`;
        }

        // 添加网站地图
        this.sitemaps.forEach(sitemap => {
            content += `Sitemap: ${sitemap}\n`;
        });

        return content;
    }

    /**
     * 验证robots.txt内容
     * @param {string} robotsContent - robots.txt内容
     * @returns {Object} 验证结果
     */
    validateRobots(robotsContent) {
        const issues = [];
        const warnings = [];
        const lines = robotsContent.split('\n');

        let hasUserAgent = false;
        let hasSitemap = false;
        let currentUserAgent = null;

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine === '' || trimmedLine.startsWith('#')) {
                return; // 跳过空行和注释
            }

            const lineNumber = index + 1;

            // 检查User-agent
            if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
                hasUserAgent = true;
                currentUserAgent = trimmedLine.split(':')[1].trim();
                
                if (!currentUserAgent) {
                    issues.push(`第${lineNumber}行: User-agent值为空`);
                }
            }
            // 检查Allow/Disallow
            else if (trimmedLine.toLowerCase().startsWith('allow:') || 
                     trimmedLine.toLowerCase().startsWith('disallow:')) {
                if (!currentUserAgent) {
                    issues.push(`第${lineNumber}行: Allow/Disallow指令必须在User-agent之后`);
                }
                
                const path = trimmedLine.split(':')[1];
                if (!path || path.trim() === '') {
                    warnings.push(`第${lineNumber}行: 路径为空`);
                }
            }
            // 检查Sitemap
            else if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
                hasSitemap = true;
                const url = trimmedLine.split(':').slice(1).join(':').trim();
                
                if (!url.startsWith('http')) {
                    issues.push(`第${lineNumber}行: Sitemap必须是完整的URL`);
                }
            }
            // 检查Crawl-delay
            else if (trimmedLine.toLowerCase().startsWith('crawl-delay:')) {
                const delay = trimmedLine.split(':')[1].trim();
                
                if (isNaN(delay) || delay < 0) {
                    issues.push(`第${lineNumber}行: Crawl-delay必须是非负数字`);
                }
            }
            // 未知指令
            else {
                warnings.push(`第${lineNumber}行: 未知指令 "${trimmedLine}"`);
            }
        });

        if (!hasUserAgent) {
            issues.push('缺少User-agent指令');
        }

        if (!hasSitemap) {
            warnings.push('建议添加Sitemap指令');
        }

        return {
            isValid: issues.length === 0,
            issues,
            warnings,
            summary: {
                hasUserAgent,
                hasSitemap,
                lineCount: lines.length,
                issueCount: issues.length,
                warningCount: warnings.length
            }
        };
    }

    /**
     * 分析现有robots.txt文件
     * @param {string} robotsContent - robots.txt内容
     * @returns {Object} 分析结果
     */
    analyzeRobots(robotsContent) {
        const analysis = {
            userAgents: [],
            sitemaps: [],
            globalRules: [],
            crawlDelays: {},
            host: null,
            totalLines: 0,
            commentLines: 0,
            emptyLines: 0
        };

        const lines = robotsContent.split('\n');
        analysis.totalLines = lines.length;

        let currentUserAgent = null;
        let currentRules = [];

        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine === '') {
                analysis.emptyLines++;
                return;
            }
            
            if (trimmedLine.startsWith('#')) {
                analysis.commentLines++;
                return;
            }

            const [directive, ...valueParts] = trimmedLine.split(':');
            const value = valueParts.join(':').trim();

            switch (directive.toLowerCase()) {
                case 'user-agent':
                    if (currentUserAgent) {
                        analysis.userAgents.push({
                            userAgent: currentUserAgent,
                            rules: currentRules
                        });
                    }
                    currentUserAgent = value;
                    currentRules = [];
                    break;

                case 'allow':
                case 'disallow':
                    if (currentUserAgent) {
                        currentRules.push({
                            type: directive.toLowerCase(),
                            path: value
                        });
                    }
                    break;

                case 'crawl-delay':
                    if (currentUserAgent) {
                        analysis.crawlDelays[currentUserAgent] = parseInt(value);
                    }
                    break;

                case 'sitemap':
                    analysis.sitemaps.push(value);
                    break;

                case 'host':
                    analysis.host = value;
                    break;
            }
        });

        // 添加最后一个用户代理
        if (currentUserAgent) {
            analysis.userAgents.push({
                userAgent: currentUserAgent,
                rules: currentRules
            });
        }

        return analysis;
    }

    /**
     * 生成robots.txt优化建议
     * @param {string} domain - 网站域名
     * @param {string} siteType - 网站类型
     * @returns {Object} 优化建议
     */
    generateOptimizationSuggestions(domain, siteType = 'general') {
        const suggestions = {
            essential: [],
            recommended: [],
            advanced: [],
            sampleRobots: ''
        };

        // 基础建议
        suggestions.essential.push('确保包含User-agent: *规则');
        suggestions.essential.push('添加主要的Sitemap URL');
        suggestions.essential.push('阻止敏感目录（如/admin/, /private/）');

        // 推荐建议
        suggestions.recommended.push('为主要搜索引擎设置适当的Crawl-delay');
        suggestions.recommended.push('允许重要的静态资源（CSS, JS, 图片）');
        suggestions.recommended.push('阻止临时文件和备份文件');

        // 高级建议
        suggestions.advanced.push('为不同类型的爬虫设置专门规则');
        suggestions.advanced.push('使用正则表达式模式优化路径规则');
        suggestions.advanced.push('定期更新和维护robots.txt');

        // 根据网站类型生成示例
        switch (siteType) {
            case 'video-greeting':
                suggestions.sampleRobots = this.generateVideoGreetingRobots(domain);
                break;
            default:
                suggestions.sampleRobots = this.generateBasicRobots(domain);
        }

        return suggestions;
    }
}

module.exports = RobotsManager;