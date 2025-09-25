/**
 * 网站地图管理器
 * 生成和管理XML网站地图
 */

class SitemapManager {
    constructor() {
        this.defaultPriority = 0.5;
        this.defaultChangeFreq = 'weekly';
        this.maxUrlsPerSitemap = 50000;
    }

    // 生成XML网站地图
    generateSitemap(urls, options = {}) {
        const {
            baseUrl = '',
            includeImages = false,
            includeVideos = false
        } = options;

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        
        if (includeImages) {
            xml += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
        }
        
        if (includeVideos) {
            xml += ' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
        }
        
        xml += '>\n';

        urls.forEach(urlData => {
            xml += this.generateUrlEntry(urlData, { includeImages, includeVideos });
        });

        xml += '</urlset>';
        return xml;
    }

    // 生成单个URL条目
    generateUrlEntry(urlData, options = {}) {
        const {
            url,
            lastmod = new Date().toISOString().split('T')[0],
            changefreq = this.defaultChangeFreq,
            priority = this.defaultPriority,
            images = [],
            videos = []
        } = urlData;

        let entry = '  <url>\n';
        entry += `    <loc>${this.escapeXml(url)}</loc>\n`;
        entry += `    <lastmod>${lastmod}</lastmod>\n`;
        entry += `    <changefreq>${changefreq}</changefreq>\n`;
        entry += `    <priority>${priority}</priority>\n`;

        // 添加图片信息
        if (options.includeImages && images.length > 0) {
            images.forEach(image => {
                entry += '    <image:image>\n';
                entry += `      <image:loc>${this.escapeXml(image.url)}</image:loc>\n`;
                if (image.caption) {
                    entry += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
                }
                if (image.title) {
                    entry += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
                }
                entry += '    </image:image>\n';
            });
        }

        // 添加视频信息
        if (options.includeVideos && videos.length > 0) {
            videos.forEach(video => {
                entry += '    <video:video>\n';
                entry += `      <video:thumbnail_loc>${this.escapeXml(video.thumbnail)}</video:thumbnail_loc>\n`;
                entry += `      <video:title>${this.escapeXml(video.title)}</video:title>\n`;
                entry += `      <video:description>${this.escapeXml(video.description)}</video:description>\n`;
                if (video.contentLoc) {
                    entry += `      <video:content_loc>${this.escapeXml(video.contentLoc)}</video:content_loc>\n`;
                }
                if (video.playerLoc) {
                    entry += `      <video:player_loc>${this.escapeXml(video.playerLoc)}</video:player_loc>\n`;
                }
                if (video.duration) {
                    entry += `      <video:duration>${video.duration}</video:duration>\n`;
                }
                if (video.publicationDate) {
                    entry += `      <video:publication_date>${video.publicationDate}</video:publication_date>\n`;
                }
                entry += '    </video:video>\n';
            });
        }

        entry += '  </url>\n';
        return entry;
    }

    // 生成网站地图索引文件
    generateSitemapIndex(sitemaps) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        sitemaps.forEach(sitemap => {
            xml += '  <sitemap>\n';
            xml += `    <loc>${this.escapeXml(sitemap.url)}</loc>\n`;
            if (sitemap.lastmod) {
                xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
            }
            xml += '  </sitemap>\n';
        });

        xml += '</sitemapindex>';
        return xml;
    }

    // 为视频问候网站生成专门的网站地图
    generateVideoGreetingSitemap(baseUrl) {
        const urls = [
            {
                url: baseUrl,
                priority: 1.0,
                changefreq: 'daily'
            },
            {
                url: `${baseUrl}/categories`,
                priority: 0.9,
                changefreq: 'weekly'
            },
            {
                url: `${baseUrl}/creators`,
                priority: 0.9,
                changefreq: 'daily'
            },
            {
                url: `${baseUrl}/how-it-works`,
                priority: 0.8,
                changefreq: 'monthly'
            },
            {
                url: `${baseUrl}/pricing`,
                priority: 0.8,
                changefreq: 'weekly'
            },
            {
                url: `${baseUrl}/about`,
                priority: 0.6,
                changefreq: 'monthly'
            },
            {
                url: `${baseUrl}/contact`,
                priority: 0.6,
                changefreq: 'monthly'
            },
            {
                url: `${baseUrl}/privacy`,
                priority: 0.3,
                changefreq: 'yearly'
            },
            {
                url: `${baseUrl}/terms`,
                priority: 0.3,
                changefreq: 'yearly'
            }
        ];

        // 添加分类页面
        const categories = [
            'birthday', 'anniversary', 'wedding', 'graduation', 
            'holiday', 'congratulations', 'thank-you', 'apology'
        ];

        categories.forEach(category => {
            urls.push({
                url: `${baseUrl}/category/${category}`,
                priority: 0.7,
                changefreq: 'weekly'
            });
        });

        return this.generateSitemap(urls);
    }

    // 验证网站地图
    validateSitemap(xml) {
        const errors = [];
        const warnings = [];

        // 检查XML格式
        if (!xml.includes('<?xml version="1.0"')) {
            errors.push('缺少XML声明');
        }

        if (!xml.includes('<urlset')) {
            errors.push('缺少urlset根元素');
        }

        // 检查URL数量
        const urlCount = (xml.match(/<url>/g) || []).length;
        if (urlCount > this.maxUrlsPerSitemap) {
            warnings.push(`URL数量(${urlCount})超过建议上限(${this.maxUrlsPerSitemap})`);
        }

        // 检查必需元素
        const urls = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
        urls.forEach((urlBlock, index) => {
            if (!urlBlock.includes('<loc>')) {
                errors.push(`URL ${index + 1}: 缺少loc元素`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            urlCount
        };
    }

    // 从网站抓取URL生成网站地图
    async generateFromCrawl(baseUrl, options = {}) {
        const {
            maxDepth = 3,
            excludePatterns = [],
            includePatterns = []
        } = options;

        // 这里应该实现网站爬虫逻辑
        // 简化版本，返回基本URL结构
        const urls = [
            {
                url: baseUrl,
                priority: 1.0,
                changefreq: 'daily'
            }
        ];

        return this.generateSitemap(urls);
    }

    // 分割大型网站地图
    splitLargeSitemap(urls) {
        const sitemaps = [];
        const chunks = this.chunkArray(urls, this.maxUrlsPerSitemap);

        chunks.forEach((chunk, index) => {
            const sitemapXml = this.generateSitemap(chunk);
            sitemaps.push({
                filename: `sitemap-${index + 1}.xml`,
                content: sitemapXml,
                urlCount: chunk.length
            });
        });

        return sitemaps;
    }

    // 生成robots.txt中的网站地图引用
    generateRobotsSitemapEntry(sitemapUrl) {
        return `Sitemap: ${sitemapUrl}`;
    }

    // 工具方法：数组分块
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    // XML转义
    escapeXml(text) {
        if (typeof text !== 'string') {
            return text;
        }
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // 获取URL的优先级建议
    suggestPriority(url, urlType) {
        const priorities = {
            'homepage': 1.0,
            'category': 0.8,
            'product': 0.6,
            'blog': 0.5,
            'static': 0.4
        };

        return priorities[urlType] || this.defaultPriority;
    }

    // 获取更新频率建议
    suggestChangeFreq(urlType) {
        const frequencies = {
            'homepage': 'daily',
            'category': 'weekly',
            'product': 'weekly',
            'blog': 'monthly',
            'static': 'yearly'
        };

        return frequencies[urlType] || this.defaultChangeFreq;
    }
}

module.exports = SitemapManager;