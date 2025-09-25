/**
 * Meta标签优化器
 * 自动生成和优化网页Meta标签
 */

class MetaOptimizer {
    constructor() {
        this.titleLimits = { min: 30, max: 60 };
        this.descriptionLimits = { min: 120, max: 160 };
    }

    // 优化页面标题
    optimizeTitle(content, keywords = []) {
        const suggestions = [];
        
        if (!content || content.length < this.titleLimits.min) {
            suggestions.push({
                type: 'title_too_short',
                message: `标题太短，建议至少${this.titleLimits.min}个字符`,
                priority: 'high'
            });
        }
        
        if (content && content.length > this.titleLimits.max) {
            suggestions.push({
                type: 'title_too_long',
                message: `标题太长，建议不超过${this.titleLimits.max}个字符`,
                priority: 'high'
            });
        }

        // 检查关键词包含
        const keywordIncluded = keywords.some(keyword => 
            content && content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (!keywordIncluded && keywords.length > 0) {
            suggestions.push({
                type: 'missing_keywords',
                message: '标题中未包含主要关键词',
                priority: 'medium'
            });
        }

        return {
            current: content,
            length: content ? content.length : 0,
            suggestions,
            score: this.calculateTitleScore(content, keywords)
        };
    }

    // 优化Meta描述
    optimizeDescription(content, keywords = []) {
        const suggestions = [];
        
        if (!content || content.length < this.descriptionLimits.min) {
            suggestions.push({
                type: 'description_too_short',
                message: `描述太短，建议至少${this.descriptionLimits.min}个字符`,
                priority: 'high'
            });
        }
        
        if (content && content.length > this.descriptionLimits.max) {
            suggestions.push({
                type: 'description_too_long',
                message: `描述太长，建议不超过${this.descriptionLimits.max}个字符`,
                priority: 'high'
            });
        }

        return {
            current: content,
            length: content ? content.length : 0,
            suggestions,
            score: this.calculateDescriptionScore(content, keywords)
        };
    }

    // 生成优化建议
    generateMetaSuggestions(url, industry = 'general') {
        const templates = {
            'video-greeting': {
                title: 'Custom Video Messages & Personalized Greetings | {brand}',
                description: 'Create personalized video messages and custom greetings for any occasion. Professional video creators from around the world ready to make your special moments unforgettable.'
            },
            'general': {
                title: '{keyword} | Professional Services | {brand}',
                description: 'Discover professional {keyword} services. Get expert solutions tailored to your needs with guaranteed quality and customer satisfaction.'
            }
        };

        return templates[industry] || templates.general;
    }

    calculateTitleScore(title, keywords) {
        let score = 0;
        
        if (title) {
            // 长度评分
            if (title.length >= this.titleLimits.min && title.length <= this.titleLimits.max) {
                score += 40;
            }
            
            // 关键词评分
            keywords.forEach(keyword => {
                if (title.toLowerCase().includes(keyword.toLowerCase())) {
                    score += 30;
                }
            });
            
            // 品牌词评分
            if (title.includes('|') || title.includes('-')) {
                score += 15;
            }
            
            // 独特性评分
            if (!title.toLowerCase().includes('untitled') && !title.toLowerCase().includes('home')) {
                score += 15;
            }
        }
        
        return Math.min(score, 100);
    }

    calculateDescriptionScore(description, keywords) {
        let score = 0;
        
        if (description) {
            // 长度评分
            if (description.length >= this.descriptionLimits.min && description.length <= this.descriptionLimits.max) {
                score += 50;
            }
            
            // 关键词评分
            keywords.forEach(keyword => {
                if (description.toLowerCase().includes(keyword.toLowerCase())) {
                    score += 25;
                }
            });
            
            // 行动号召评分
            const cta = ['contact', 'get', 'discover', 'learn', 'start', 'try', 'book', 'order'];
            if (cta.some(word => description.toLowerCase().includes(word))) {
                score += 25;
            }
        }
        
        return Math.min(score, 100);
    }
}

module.exports = MetaOptimizer;