/**
 * Image SEO Optimizer
 * 图片SEO优化工具类
 */

const fs = require('fs');
const path = require('path');

class ImageSEOOptimizer {
    constructor() {
        this.supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        this.maxFileSize = 1024 * 1024; // 1MB
        this.recommendedSizes = {
            thumbnail: { width: 150, height: 150 },
            small: { width: 300, height: 300 },
            medium: { width: 600, height: 400 },
            large: { width: 1200, height: 800 },
            hero: { width: 1920, height: 1080 }
        };
    }

    /**
     * 分析图片SEO状况
     * @param {string} imagePath - 图片路径或URL
     * @param {string} altText - Alt文本
     * @param {Object} metadata - 图片元数据
     * @returns {Object} 分析结果
     */
    analyzeImageSEO(imagePath, altText = '', metadata = {}) {
        const analysis = {
            score: 0,
            issues: [],
            recommendations: [],
            optimizations: []
        };

        // 检查文件扩展名
        const ext = path.extname(imagePath).toLowerCase().replace('.', '');
        if (!this.supportedFormats.includes(ext)) {
            analysis.issues.push(`不支持的图片格式: ${ext}`);
        } else {
            analysis.score += 10;
        }

        // 检查Alt文本
        if (!altText || altText.trim() === '') {
            analysis.issues.push('缺少Alt文本');
        } else if (altText.length < 5) {
            analysis.issues.push('Alt文本过短');
        } else if (altText.length > 125) {
            analysis.issues.push('Alt文本过长（建议125字符以内）');
        } else {
            analysis.score += 25;
        }

        // 检查文件名
        const filename = path.basename(imagePath, path.extname(imagePath));
        if (this.isDescriptiveFilename(filename)) {
            analysis.score += 15;
        } else {
            analysis.recommendations.push('使用描述性文件名');
        }

        // 检查文件大小（如果提供）
        if (metadata.fileSize) {
            if (metadata.fileSize > this.maxFileSize) {
                analysis.issues.push('文件大小过大，影响加载速度');
            } else {
                analysis.score += 15;
            }
        }

        // 检查图片尺寸
        if (metadata.width && metadata.height) {
            const aspectRatio = metadata.width / metadata.height;
            if (aspectRatio < 0.5 || aspectRatio > 3) {
                analysis.recommendations.push('考虑调整图片宽高比');
            } else {
                analysis.score += 10;
            }
        }

        // 检查是否为现代格式
        if (['webp', 'avif'].includes(ext)) {
            analysis.score += 15;
        } else {
            analysis.optimizations.push('考虑转换为WebP格式以提高性能');
        }

        // 检查是否有结构化数据
        if (metadata.structuredData) {
            analysis.score += 10;
        } else {
            analysis.recommendations.push('添加图片结构化数据');
        }

        return {
            ...analysis,
            score: Math.min(analysis.score, 100)
        };
    }

    /**
     * 生成图片Alt文本建议
     * @param {string} imagePath - 图片路径
     * @param {string} context - 上下文信息
     * @param {Array} keywords - 相关关键词
     * @returns {Array} Alt文本建议
     */
    generateAltTextSuggestions(imagePath, context = '', keywords = []) {
        const suggestions = [];
        const filename = path.basename(imagePath, path.extname(imagePath));
        
        // 基于文件名的建议
        const cleanFilename = filename.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
        if (cleanFilename) {
            suggestions.push(cleanFilename);
        }

        // 基于上下文的建议
        if (context) {
            suggestions.push(context);
            
            // 结合关键词
            if (keywords.length > 0) {
                const primaryKeyword = keywords[0];
                suggestions.push(`${context} - ${primaryKeyword}`);
                suggestions.push(`${primaryKeyword} ${context}`);
            }
        }

        // 基于图片类型的通用建议
        const imageType = this.detectImageType(imagePath);
        switch (imageType) {
            case 'logo':
                suggestions.push('公司标志', '品牌Logo', '企业标识');
                break;
            case 'product':
                suggestions.push('产品图片', '商品展示', '产品特写');
                break;
            case 'person':
                suggestions.push('人物照片', '团队成员', '专业头像');
                break;
            case 'screenshot':
                suggestions.push('屏幕截图', '界面展示', '功能演示');
                break;
            default:
                suggestions.push('相关图片', '说明图片');
        }

        return [...new Set(suggestions)].slice(0, 5);
    }

    /**
     * 优化图片文件名
     * @param {string} originalName - 原始文件名
     * @param {Array} keywords - 关键词
     * @param {string} context - 上下文
     * @returns {string} 优化后的文件名
     */
    optimizeFilename(originalName, keywords = [], context = '') {
        let optimizedName = originalName.toLowerCase();
        
        // 移除特殊字符
        optimizedName = optimizedName.replace(/[^a-z0-9\-_.]/g, '-');
        
        // 移除多余的连字符
        optimizedName = optimizedName.replace(/-+/g, '-');
        
        // 移除开头和结尾的连字符
        optimizedName = optimizedName.replace(/^-+|-+$/g, '');

        // 如果文件名不够描述性，添加关键词
        if (!this.isDescriptiveFilename(optimizedName) && keywords.length > 0) {
            const keyword = keywords[0].toLowerCase().replace(/\s+/g, '-');
            optimizedName = `${keyword}-${optimizedName}`;
        }

        // 添加上下文
        if (context && !optimizedName.includes(context.toLowerCase())) {
            const contextSlug = context.toLowerCase().replace(/\s+/g, '-');
            optimizedName = `${contextSlug}-${optimizedName}`;
        }

        return optimizedName;
    }

    /**
     * 生成图片结构化数据
     * @param {Object} imageInfo - 图片信息
     * @returns {Object} 结构化数据
     */
    generateImageStructuredData(imageInfo) {
        const {
            url,
            caption,
            description,
            width,
            height,
            author,
            datePublished,
            license,
            acquireLicensePage
        } = imageInfo;

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "url": url,
            "width": width,
            "height": height
        };

        if (caption) {
            structuredData.caption = caption;
        }

        if (description) {
            structuredData.description = description;
        }

        if (author) {
            structuredData.author = {
                "@type": "Person",
                "name": author
            };
        }

        if (datePublished) {
            structuredData.datePublished = datePublished;
        }

        if (license) {
            structuredData.license = license;
        }

        if (acquireLicensePage) {
            structuredData.acquireLicensePage = acquireLicensePage;
        }

        return structuredData;
    }

    /**
     * 为视频问候服务生成图片SEO优化
     * @param {Object} videoInfo - 视频信息
     * @returns {Object} 图片SEO配置
     */
    generateVideoGreetingImageSEO(videoInfo) {
        const { videoId, title, description, thumbnailUrl, duration } = videoInfo;
        
        return {
            thumbnail: {
                alt: `${title} - 个性化视频问候缩略图`,
                filename: `video-greeting-${videoId}-thumbnail.webp`,
                structuredData: {
                    "@context": "https://schema.org",
                    "@type": "ImageObject",
                    "url": thumbnailUrl,
                    "caption": `${title}的视频缩略图`,
                    "description": description,
                    "representativeOfPage": true,
                    "contentUrl": thumbnailUrl
                }
            },
            poster: {
                alt: `${title} - 视频海报图`,
                filename: `video-greeting-${videoId}-poster.webp`,
                structuredData: {
                    "@context": "https://schema.org",
                    "@type": "ImageObject",
                    "url": thumbnailUrl.replace('thumbnail', 'poster'),
                    "caption": `${title}的视频海报`,
                    "description": `时长${duration}秒的个性化视频问候`,
                    "associatedMedia": {
                        "@type": "VideoObject",
                        "name": title,
                        "description": description,
                        "duration": `PT${duration}S`
                    }
                }
            }
        };
    }

    /**
     * 生成响应式图片配置
     * @param {string} baseUrl - 基础URL
     * @param {string} filename - 文件名
     * @returns {Object} 响应式图片配置
     */
    generateResponsiveImageConfig(baseUrl, filename) {
        const name = path.parse(filename).name;
        const ext = path.parse(filename).ext;
        
        return {
            srcset: [
                `${baseUrl}/${name}-300w${ext} 300w`,
                `${baseUrl}/${name}-600w${ext} 600w`,
                `${baseUrl}/${name}-900w${ext} 900w`,
                `${baseUrl}/${name}-1200w${ext} 1200w`
            ].join(', '),
            sizes: [
                '(max-width: 300px) 300px',
                '(max-width: 600px) 600px',
                '(max-width: 900px) 900px',
                '1200px'
            ].join(', '),
            src: `${baseUrl}/${name}-600w${ext}`,
            loading: 'lazy',
            decoding: 'async'
        };
    }

    /**
     * 检查文件名是否具有描述性
     * @param {string} filename - 文件名
     * @returns {boolean} 是否具有描述性
     */
    isDescriptiveFilename(filename) {
        // 检查是否包含常见的无意义模式
        const meaninglessPatterns = [
            /^img\d+$/i,
            /^image\d+$/i,
            /^photo\d+$/i,
            /^pic\d+$/i,
            /^screenshot\d+$/i,
            /^untitled/i,
            /^dsc\d+$/i,
            /^\d+$/
        ];

        return !meaninglessPatterns.some(pattern => pattern.test(filename)) && 
               filename.length > 3;
    }

    /**
     * 检测图片类型
     * @param {string} imagePath - 图片路径
     * @returns {string} 图片类型
     */
    detectImageType(imagePath) {
        const filename = path.basename(imagePath).toLowerCase();
        
        if (filename.includes('logo')) return 'logo';
        if (filename.includes('product') || filename.includes('item')) return 'product';
        if (filename.includes('person') || filename.includes('avatar') || filename.includes('profile')) return 'person';
        if (filename.includes('screenshot') || filename.includes('screen')) return 'screenshot';
        if (filename.includes('icon')) return 'icon';
        if (filename.includes('banner') || filename.includes('hero')) return 'banner';
        
        return 'general';
    }

    /**
     * 生成图片SEO检查清单
     * @returns {Array} 检查清单
     */
    generateSEOChecklist() {
        return [
            {
                category: '基础优化',
                items: [
                    '使用描述性文件名',
                    '添加有意义的Alt文本',
                    '控制文件大小（建议<1MB）',
                    '选择合适的图片格式'
                ]
            },
            {
                category: '技术优化',
                items: [
                    '使用现代图片格式（WebP/AVIF）',
                    '实现响应式图片',
                    '添加lazy loading',
                    '设置适当的图片尺寸'
                ]
            },
            {
                category: '结构化数据',
                items: [
                    '添加图片结构化数据',
                    '设置图片标题和描述',
                    '添加版权信息',
                    '关联相关内容'
                ]
            },
            {
                category: '用户体验',
                items: [
                    '提供图片说明文字',
                    '确保图片与内容相关',
                    '优化加载性能',
                    '提供备用文本'
                ]
            }
        ];
    }

    /**
     * 批量优化图片SEO
     * @param {Array} images - 图片列表
     * @param {Object} options - 优化选项
     * @returns {Object} 批量优化结果
     */
    batchOptimizeImages(images, options = {}) {
        const results = {
            optimized: [],
            failed: [],
            summary: {
                total: images.length,
                success: 0,
                failed: 0,
                avgScore: 0
            }
        };

        let totalScore = 0;

        images.forEach((image, index) => {
            try {
                const analysis = this.analyzeImageSEO(
                    image.path,
                    image.alt,
                    image.metadata
                );

                const optimizations = {
                    originalAlt: image.alt,
                    suggestedAlt: this.generateAltTextSuggestions(
                        image.path,
                        image.context,
                        image.keywords
                    ),
                    optimizedFilename: this.optimizeFilename(
                        path.basename(image.path),
                        image.keywords,
                        image.context
                    ),
                    structuredData: this.generateImageStructuredData({
                        url: image.url || image.path,
                        caption: image.caption,
                        description: image.description,
                        width: image.metadata?.width,
                        height: image.metadata?.height
                    })
                };

                results.optimized.push({
                    index,
                    path: image.path,
                    analysis,
                    optimizations
                });

                results.summary.success++;
                totalScore += analysis.score;

            } catch (error) {
                results.failed.push({
                    index,
                    path: image.path,
                    error: error.message
                });
                results.summary.failed++;
            }
        });

        results.summary.avgScore = results.summary.success > 0 
            ? Math.round(totalScore / results.summary.success)
            : 0;

        return results;
    }
}

module.exports = ImageSEOOptimizer;