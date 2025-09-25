/**
 * 社交媒体优化器
 * 生成和优化社交媒体Meta标签
 */

class SocialMediaOptimizer {
    constructor() {
        this.platforms = {
            facebook: {
                titleLimit: 100,
                descriptionLimit: 300,
                imageSize: { width: 1200, height: 630 }
            },
            twitter: {
                titleLimit: 70,
                descriptionLimit: 200,
                imageSize: { width: 1200, height: 600 }
            },
            linkedin: {
                titleLimit: 120,
                descriptionLimit: 300,
                imageSize: { width: 1200, height: 627 }
            }
        };
    }

    // 生成Open Graph标签
    generateOpenGraphTags(data) {
        const tags = {
            'og:title': data.title,
            'og:description': data.description,
            'og:image': data.image,
            'og:url': data.url,
            'og:type': data.type || 'website',
            'og:site_name': data.siteName,
            'og:locale': data.locale || 'en_US'
        };

        // 添加视频特定标签
        if (data.type === 'video') {
            tags['og:video'] = data.videoUrl;
            tags['og:video:type'] = data.videoType || 'video/mp4';
            tags['og:video:width'] = data.videoWidth || '1280';
            tags['og:video:height'] = data.videoHeight || '720';
        }

        // 添加文章特定标签
        if (data.type === 'article') {
            tags['article:author'] = data.author;
            tags['article:published_time'] = data.publishedTime;
            tags['article:modified_time'] = data.modifiedTime;
            tags['article:section'] = data.section;
            tags['article:tag'] = data.tags;
        }

        return this.formatMetaTags(tags, 'property');
    }

    // 生成Twitter Card标签
    generateTwitterCardTags(data) {
        const tags = {
            'twitter:card': data.cardType || 'summary_large_image',
            'twitter:title': data.title,
            'twitter:description': data.description,
            'twitter:image': data.image,
            'twitter:site': data.twitterSite,
            'twitter:creator': data.twitterCreator
        };

        // 视频卡片
        if (data.cardType === 'player') {
            tags['twitter:player'] = data.playerUrl;
            tags['twitter:player:width'] = data.playerWidth || '1280';
            tags['twitter:player:height'] = data.playerHeight || '720';
        }

        return this.formatMetaTags(tags, 'name');
    }

    // 生成LinkedIn特定标签
    generateLinkedInTags(data) {
        return this.generateOpenGraphTags({
            ...data,
            title: this.truncateText(data.title, this.platforms.linkedin.titleLimit),
            description: this.truncateText(data.description, this.platforms.linkedin.descriptionLimit)
        });
    }

    // 优化社交媒体内容
    optimizeForPlatform(content, platform) {
        const config = this.platforms[platform];
        if (!config) {
            throw new Error(`Unsupported platform: ${platform}`);
        }

        return {
            title: this.truncateText(content.title, config.titleLimit),
            description: this.truncateText(content.description, config.descriptionLimit),
            image: content.image,
            recommendedImageSize: config.imageSize,
            platform: platform
        };
    }

    // 生成完整的社交媒体Meta标签集合
    generateAllSocialTags(data) {
        const allTags = [];

        // Open Graph标签
        allTags.push(...this.generateOpenGraphTags(data));

        // Twitter Card标签
        allTags.push(...this.generateTwitterCardTags(data));

        // 额外的社交媒体标签
        const additionalTags = {
            'description': data.description,
            'keywords': data.keywords,
            'author': data.author,
            'robots': 'index, follow',
            'canonical': data.url
        };

        allTags.push(...this.formatMetaTags(additionalTags, 'name'));

        return allTags;
    }

    // 为视频问候服务生成专门的社交媒体标签
    generateVideoGreetingTags(videoData) {
        const baseData = {
            title: `${videoData.occasion} Video Message from ${videoData.creator}`,
            description: `Get a personalized ${videoData.occasion.toLowerCase()} video message from ${videoData.creator}. Custom greetings for any special occasion.`,
            image: videoData.thumbnail,
            url: videoData.pageUrl,
            type: 'video',
            siteName: 'WishesVideo',
            videoUrl: videoData.videoUrl,
            author: videoData.creator,
            keywords: `video message, ${videoData.occasion}, personalized greeting, custom video`,
            twitterSite: '@wishesvideo',
            locale: 'en_US'
        };

        return this.generateAllSocialTags(baseData);
    }

    // 分析现有社交媒体标签
    analyzeSocialTags(html) {
        const analysis = {
            openGraph: {},
            twitter: {},
            missing: [],
            recommendations: []
        };

        // 解析现有标签
        const ogRegex = /<meta\s+property="og:([^"]+)"\s+content="([^"]+)"/gi;
        const twitterRegex = /<meta\s+name="twitter:([^"]+)"\s+content="([^"]+)"/gi;

        let match;
        while ((match = ogRegex.exec(html)) !== null) {
            analysis.openGraph[match[1]] = match[2];
        }

        while ((match = twitterRegex.exec(html)) !== null) {
            analysis.twitter[match[1]] = match[2];
        }

        // 检查必需的标签
        const requiredOG = ['title', 'description', 'image', 'url'];
        const requiredTwitter = ['card', 'title', 'description', 'image'];

        requiredOG.forEach(tag => {
            if (!analysis.openGraph[tag]) {
                analysis.missing.push(`og:${tag}`);
            }
        });

        requiredTwitter.forEach(tag => {
            if (!analysis.twitter[tag]) {
                analysis.missing.push(`twitter:${tag}`);
            }
        });

        // 生成建议
        if (analysis.missing.length > 0) {
            analysis.recommendations.push('添加缺失的社交媒体Meta标签');
        }

        if (analysis.openGraph.title && analysis.openGraph.title.length > 100) {
            analysis.recommendations.push('缩短Open Graph标题长度');
        }

        if (analysis.twitter.description && analysis.twitter.description.length > 200) {
            analysis.recommendations.push('缩短Twitter描述长度');
        }

        return analysis;
    }

    // 格式化Meta标签
    formatMetaTags(tags, attributeType) {
        return Object.entries(tags)
            .filter(([key, value]) => value !== undefined && value !== null)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.map(v => `<meta ${attributeType}="${key}" content="${this.escapeHtml(v)}">`).join('\n');
                }
                return `<meta ${attributeType}="${key}" content="${this.escapeHtml(value)}">`;
            });
    }

    // 截断文本
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + '...';
    }

    // HTML转义
    escapeHtml(text) {
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

    // 验证图片尺寸
    validateImageSize(imageUrl, platform) {
        const config = this.platforms[platform];
        if (!config) {
            return { valid: false, message: 'Unknown platform' };
        }

        // 这里应该实际检查图片尺寸，简化版本
        return {
            valid: true,
            recommended: config.imageSize,
            message: `推荐尺寸: ${config.imageSize.width}x${config.imageSize.height}px`
        };
    }
}

module.exports = SocialMediaOptimizer;