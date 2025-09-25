/**
 * 结构化数据生成器
 * 生成JSON-LD格式的结构化数据
 */

class StructuredDataGenerator {
    constructor() {
        this.context = 'https://schema.org';
    }

    // 生成组织结构化数据
    generateOrganization(data) {
        return {
            '@context': this.context,
            '@type': 'Organization',
            name: data.name,
            url: data.url,
            logo: data.logo,
            description: data.description,
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: data.phone,
                contactType: 'customer service',
                email: data.email
            },
            sameAs: data.socialMedia || []
        };
    }

    // 生成服务结构化数据
    generateService(data) {
        return {
            '@context': this.context,
            '@type': 'Service',
            name: data.name,
            description: data.description,
            provider: {
                '@type': 'Organization',
                name: data.providerName,
                url: data.providerUrl
            },
            areaServed: data.areaServed || 'Worldwide',
            serviceType: data.serviceType,
            offers: {
                '@type': 'Offer',
                price: data.price,
                priceCurrency: data.currency || 'USD',
                availability: 'https://schema.org/InStock'
            }
        };
    }

    // 生成产品结构化数据
    generateProduct(data) {
        return {
            '@context': this.context,
            '@type': 'Product',
            name: data.name,
            description: data.description,
            image: data.images || [],
            brand: {
                '@type': 'Brand',
                name: data.brandName
            },
            offers: {
                '@type': 'Offer',
                price: data.price,
                priceCurrency: data.currency || 'USD',
                availability: 'https://schema.org/InStock',
                seller: {
                    '@type': 'Organization',
                    name: data.sellerName
                }
            },
            aggregateRating: data.rating ? {
                '@type': 'AggregateRating',
                ratingValue: data.rating.value,
                reviewCount: data.rating.count
            } : undefined
        };
    }

    // 生成本地商业结构化数据
    generateLocalBusiness(data) {
        return {
            '@context': this.context,
            '@type': 'LocalBusiness',
            name: data.name,
            description: data.description,
            url: data.url,
            telephone: data.phone,
            email: data.email,
            address: {
                '@type': 'PostalAddress',
                streetAddress: data.address.street,
                addressLocality: data.address.city,
                addressRegion: data.address.state,
                postalCode: data.address.zip,
                addressCountry: data.address.country
            },
            geo: data.coordinates ? {
                '@type': 'GeoCoordinates',
                latitude: data.coordinates.lat,
                longitude: data.coordinates.lng
            } : undefined,
            openingHours: data.hours || [],
            priceRange: data.priceRange
        };
    }

    // 生成文章结构化数据
    generateArticle(data) {
        return {
            '@context': this.context,
            '@type': 'Article',
            headline: data.title,
            description: data.description,
            image: data.image,
            author: {
                '@type': 'Person',
                name: data.author.name,
                url: data.author.url
            },
            publisher: {
                '@type': 'Organization',
                name: data.publisher.name,
                logo: {
                    '@type': 'ImageObject',
                    url: data.publisher.logo
                }
            },
            datePublished: data.publishDate,
            dateModified: data.modifyDate || data.publishDate,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': data.url
            }
        };
    }

    // 生成FAQ结构化数据
    generateFAQ(questions) {
        return {
            '@context': this.context,
            '@type': 'FAQPage',
            mainEntity: questions.map(q => ({
                '@type': 'Question',
                name: q.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: q.answer
                }
            }))
        };
    }

    // 生成面包屑导航结构化数据
    generateBreadcrumb(items) {
        return {
            '@context': this.context,
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.url
            }))
        };
    }

    // 生成视频结构化数据
    generateVideo(data) {
        return {
            '@context': this.context,
            '@type': 'VideoObject',
            name: data.title,
            description: data.description,
            thumbnailUrl: data.thumbnail,
            uploadDate: data.uploadDate,
            duration: data.duration,
            contentUrl: data.videoUrl,
            embedUrl: data.embedUrl,
            publisher: {
                '@type': 'Organization',
                name: data.publisher.name,
                logo: {
                    '@type': 'ImageObject',
                    url: data.publisher.logo
                }
            }
        };
    }

    // 为视频问候服务生成专门的结构化数据
    generateVideoGreetingService() {
        return {
            '@context': this.context,
            '@type': 'Service',
            name: 'Custom Video Greeting Messages',
            description: 'Personalized video messages and greetings created by professional performers from around the world for any occasion.',
            provider: {
                '@type': 'Organization',
                name: 'WishesVideo',
                url: 'https://wishesvideo.com'
            },
            serviceType: 'Video Production Service',
            areaServed: 'Worldwide',
            category: 'Entertainment',
            offers: {
                '@type': 'Offer',
                priceRange: '$5-$100',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
            },
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Video Greeting Categories',
                itemListElement: [
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Birthday Video Messages'
                        }
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Anniversary Greetings'
                        }
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Holiday Wishes'
                        }
                    }
                ]
            }
        };
    }

    // 验证结构化数据
    validateStructuredData(data) {
        const errors = [];
        
        if (!data['@context']) {
            errors.push('Missing @context');
        }
        
        if (!data['@type']) {
            errors.push('Missing @type');
        }
        
        if (!data.name && !data.headline) {
            errors.push('Missing name or headline');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = StructuredDataGenerator;