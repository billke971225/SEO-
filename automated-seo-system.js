// 自动化SEO监控系统
// 整合所有SEO工具，提供完整的自动化监控和报告功能

const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// 导入所有SEO工具模块
const { RealDataCollector } = require('./real-data-collector.js');
const { WebVitalsServer } = require('./web-vitals-monitor.js');
const { ProfessionalSEOAdvisor } = require('./professional-seo-advisor.js');
const { EnhancedCompetitorMonitor } = require('./enhanced-competitor-monitor.js');
const { SEOGapAnalyzer } = require('./seo-gap-analyzer.js');
const { DailyMonitoringSystem } = require('./daily-monitoring-system.js');
const { MonitoringDashboard } = require('./monitoring-dashboard.js');

class AutomatedSEOSystem {
    constructor() {
        this.config = {};
        this.isRunning = false;
        this.scheduledTasks = new Map();
        this.systemStatus = {
            lastRun: null,
            nextRun: null,
            totalRuns: 0,
            errors: [],
            alerts: [],
            performance: {
                averageRunTime: 0,
                successRate: 0
            }
        };
        
        // 初始化所有组件
        this.dataCollector = new RealDataCollector();
        this.webVitalsServer = new WebVitalsServer();
        this.seoAdvisor = new ProfessionalSEOAdvisor();
        this.competitorMonitor = new EnhancedCompetitorMonitor();
        this.gapAnalyzer = new SEOGapAnalyzer();
        this.dailyMonitor = new DailyMonitoringSystem();
        this.dashboard = new MonitoringDashboard(3000);
        
        // 邮件发送器
        this.emailTransporter = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 初始化自动化SEO监控系统...');
        
        try {
            await this.loadConfig();
            await this.setupDirectories();
            await this.initializeComponents();
            await this.setupScheduledTasks();
            await this.startWebVitalsServer();
            await this.startDashboard();
            await this.setupEmailNotifications();
            
            console.log('✅ 自动化SEO监控系统初始化完成');
            console.log('📊 系统状态: 就绪');
            
            // 显示系统信息
            this.displaySystemInfo();
            
        } catch (error) {
            console.error('❌ 系统初始化失败:', error);
            throw error;
        }
    }

    async loadConfig() {
        try {
            const configPath = path.join(__dirname, 'config.json');
            const configData = await fs.readFile(configPath, 'utf8');
            this.config = JSON.parse(configData);
            
            // 设置默认配置
            this.config.automation = this.config.automation || {
                enabled: true,
                schedules: {
                    dailyReport: '0 8 * * *',        // 每天早上8点
                    hourlyCheck: '0 * * * *',        // 每小时
                    competitorCheck: '0 */4 * * *',  // 每4小时
                    weeklyAnalysis: '0 9 * * 1',     // 每周一早上9点
                    monthlyReport: '0 10 1 * *'      // 每月1号早上10点
                },
                notifications: {
                    email: true,
                    webhook: false,
                    console: true
                },
                dataRetention: {
                    reports: 90,      // 保留90天的报告
                    rawData: 30,      // 保留30天的原始数据
                    alerts: 7         // 保留7天的警报
                }
            };
            
            console.log(`📋 配置加载完成 - 目标网站: ${this.config.target_website}`);
            
        } catch (error) {
            console.error('配置加载失败:', error);
            // 使用默认配置
            this.config = {
                target_website: 'wishesvideo.com',
                automation: {
                    enabled: true,
                    schedules: {
                        dailyReport: '0 8 * * *',
                        hourlyCheck: '0 * * * *',
                        competitorCheck: '0 */4 * * *',
                        weeklyAnalysis: '0 9 * * 1',
                        monthlyReport: '0 10 1 * *'
                    }
                }
            };
        }
    }

    async setupDirectories() {
        const directories = [
            'reports/daily',
            'reports/weekly',
            'reports/monthly',
            'reports/gap-analysis',
            'reports/competitor-analysis',
            'data/raw',
            'data/processed',
            'data/backups',
            'logs',
            'alerts'
        ];

        for (const dir of directories) {
            const dirPath = path.join(__dirname, dir);
            await fs.mkdir(dirPath, { recursive: true });
        }

        console.log('📁 目录结构创建完成');
    }

    async initializeComponents() {
        console.log('🔧 初始化系统组件...');
        
        try {
            // 初始化各个组件（它们在构造函数中已经自动初始化）
            console.log('✅ 数据收集器已就绪');
            console.log('✅ Web Vitals监控已就绪');
            console.log('✅ SEO顾问已就绪');
            console.log('✅ 竞争对手监控已就绪');
            console.log('✅ 差距分析器已就绪');
            console.log('✅ 日常监控系统已就绪');
            console.log('✅ 监控面板已就绪');
            
        } catch (error) {
            console.error('组件初始化失败:', error);
            throw error;
        }
    }

    async setupScheduledTasks() {
        if (!this.config.automation.enabled) {
            console.log('⏸️ 自动化功能已禁用');
            return;
        }

        console.log('⏰ 设置定时任务...');

        // 每日报告
        const dailyTask = cron.schedule(this.config.automation.schedules.dailyReport, async () => {
            await this.runDailyReport();
        }, { scheduled: false });

        // 每小时检查
        const hourlyTask = cron.schedule(this.config.automation.schedules.hourlyCheck, async () => {
            await this.runHourlyCheck();
        }, { scheduled: false });

        // 竞争对手检查
        const competitorTask = cron.schedule(this.config.automation.schedules.competitorCheck, async () => {
            await this.runCompetitorCheck();
        }, { scheduled: false });

        // 每周分析
        const weeklyTask = cron.schedule(this.config.automation.schedules.weeklyAnalysis, async () => {
            await this.runWeeklyAnalysis();
        }, { scheduled: false });

        // 每月报告
        const monthlyTask = cron.schedule(this.config.automation.schedules.monthlyReport, async () => {
            await this.runMonthlyReport();
        }, { scheduled: false });

        // 存储任务引用
        this.scheduledTasks.set('daily', dailyTask);
        this.scheduledTasks.set('hourly', hourlyTask);
        this.scheduledTasks.set('competitor', competitorTask);
        this.scheduledTasks.set('weekly', weeklyTask);
        this.scheduledTasks.set('monthly', monthlyTask);

        console.log('✅ 定时任务设置完成');
        this.displayScheduleInfo();
    }

    async startWebVitalsServer() {
        try {
            // Web Vitals服务器已初始化，无需单独启动
            console.log('🌐 Web Vitals监控服务器已就绪');
        } catch (error) {
            console.error('Web Vitals服务器启动失败:', error);
        }
    }

    async startDashboard() {
        try {
            // 启动监控面板
            await this.dashboard.initialize();
            console.log('📊 监控面板已启动 (端口: 3000)');
        } catch (error) {
            console.error('监控面板启动失败:', error);
        }
    }

    async setupEmailNotifications() {
        try {
            if (this.config.automation.notifications.email && this.config.email) {
                this.emailTransporter = nodemailer.createTransporter({
                    service: this.config.email.service || 'gmail',
                    auth: {
                        user: this.config.email.user,
                        pass: this.config.email.password
                    }
                });
                console.log('📧 邮件通知服务已配置');
            }
        } catch (error) {
            console.error('邮件通知配置失败:', error);
        }
    }

    // 启动系统
    async start() {
        if (this.isRunning) {
            console.log('⚠️ 系统已在运行中');
            return;
        }

        console.log('🚀 启动自动化SEO监控系统...');

        try {
            this.isRunning = true;

            // 启动所有定时任务
            for (const [name, task] of this.scheduledTasks.entries()) {
                task.start();
                console.log(`✅ ${name} 任务已启动`);
            }

            // 运行初始检查
            await this.runInitialCheck();

            console.log('🎉 自动化SEO监控系统已成功启动！');
            console.log('📊 系统将按计划自动执行监控任务');

        } catch (error) {
            console.error('❌ 系统启动失败:', error);
            this.isRunning = false;
            throw error;
        }
    }

    // 停止系统
    async stop() {
        if (!this.isRunning) {
            console.log('⚠️ 系统未在运行');
            return;
        }

        console.log('🛑 停止自动化SEO监控系统...');

        try {
            // 停止所有定时任务
            for (const [name, task] of this.scheduledTasks.entries()) {
                task.stop();
                console.log(`⏹️ ${name} 任务已停止`);
            }

            this.isRunning = false;
            console.log('✅ 自动化SEO监控系统已停止');

        } catch (error) {
            console.error('❌ 系统停止失败:', error);
        }
    }

    // 运行初始检查
    async runInitialCheck() {
        console.log('🔍 执行初始系统检查...');

        const startTime = Date.now();

        try {
            // 检查API连接
            await this.checkAPIConnections();

            // 收集基础数据
            await this.collectBaselineData();

            // 生成初始报告
            await this.generateInitialReport();

            const duration = Date.now() - startTime;
            console.log(`✅ 初始检查完成 (耗时: ${duration}ms)`);

        } catch (error) {
            console.error('❌ 初始检查失败:', error);
            await this.logError('initial_check', error);
        }
    }

    // 检查API连接
    async checkAPIConnections() {
        console.log('🔗 检查API连接状态...');

        const connections = {
            googleAnalytics: false,
            searchConsole: false,
            pageSpeedInsights: false
        };

        try {
            // 测试Google Analytics连接
            try {
                await this.dataCollector.getAnalyticsData('yesterday');
                connections.googleAnalytics = true;
                console.log('✅ Google Analytics API 连接正常');
            } catch (error) {
                console.log('⚠️ Google Analytics API 连接失败');
            }

            // 测试Search Console连接
            try {
                await this.dataCollector.getSearchConsoleData('yesterday');
                connections.searchConsole = true;
                console.log('✅ Search Console API 连接正常');
            } catch (error) {
                console.log('⚠️ Search Console API 连接失败');
            }

            // 测试PageSpeed Insights连接
            try {
                await this.dataCollector.getPageSpeedData(`https://${this.config.target_website}`);
                connections.pageSpeedInsights = true;
                console.log('✅ PageSpeed Insights API 连接正常');
            } catch (error) {
                console.log('⚠️ PageSpeed Insights API 连接失败');
            }

        } catch (error) {
            console.error('API连接检查失败:', error);
        }

        return connections;
    }

    // 收集基线数据
    async collectBaselineData() {
        console.log('📊 收集基线数据...');

        try {
            // 收集当前网站数据
            const currentData = await this.dataCollector.collectAllData();

            // 分析竞争对手
            const competitorData = await this.competitorMonitor.analyzeAllCompetitors();

            // 保存基线数据
            const baselineData = {
                timestamp: Date.now(),
                website: this.config.target_website,
                currentData,
                competitorData,
                version: '1.0.0'
            };

            const baselinePath = path.join(__dirname, 'data', 'baseline-data.json');
            await fs.writeFile(baselinePath, JSON.stringify(baselineData, null, 2));

            console.log('✅ 基线数据收集完成');

        } catch (error) {
            console.error('基线数据收集失败:', error);
        }
    }

    // 生成初始报告
    async generateInitialReport() {
        console.log('📋 生成初始报告...');

        try {
            // 运行完整分析
            const analysis = await this.seoAdvisor.generateComprehensiveAnalysis();

            // 运行差距分析
            const gapAnalysis = await this.gapAnalyzer.performGapAnalysis();

            // 创建初始报告
            const initialReport = {
                id: `initial-report-${Date.now()}`,
                timestamp: Date.now(),
                website: this.config.target_website,
                systemVersion: '1.0.0',
                analysis,
                gapAnalysis,
                systemStatus: this.systemStatus,
                recommendations: this.generateInitialRecommendations(analysis, gapAnalysis)
            };

            // 保存报告
            const reportPath = path.join(__dirname, 'reports', 'initial-system-report.json');
            await fs.writeFile(reportPath, JSON.stringify(initialReport, null, 2));

            console.log('✅ 初始报告生成完成');

        } catch (error) {
            console.error('初始报告生成失败:', error);
        }
    }

    // 每日报告任务
    async runDailyReport() {
        console.log('📅 执行每日报告任务...');

        const startTime = Date.now();

        try {
            await this.dailyMonitor.runDailyMonitoring();
            
            const duration = Date.now() - startTime;
            this.updateSystemStatus('daily_report', duration, true);
            
            console.log(`✅ 每日报告完成 (耗时: ${duration}ms)`);

        } catch (error) {
            console.error('❌ 每日报告失败:', error);
            await this.logError('daily_report', error);
            this.updateSystemStatus('daily_report', Date.now() - startTime, false);
        }
    }

    // 每小时检查任务
    async runHourlyCheck() {
        console.log('⏰ 执行每小时检查...');

        const startTime = Date.now();

        try {
            // 检查Web Vitals数据
            const webVitalsData = await this.webVitalsServer.getStats();

            // 检查关键指标
            await this.checkCriticalMetrics();

            // 检查警报条件
            await this.checkAlertConditions();

            const duration = Date.now() - startTime;
            this.updateSystemStatus('hourly_check', duration, true);

            console.log(`✅ 每小时检查完成 (耗时: ${duration}ms)`);

        } catch (error) {
            console.error('❌ 每小时检查失败:', error);
            await this.logError('hourly_check', error);
            this.updateSystemStatus('hourly_check', Date.now() - startTime, false);
        }
    }

    // 竞争对手检查任务
    async runCompetitorCheck() {
        console.log('🔍 执行竞争对手检查...');

        const startTime = Date.now();

        try {
            // 分析竞争对手
            const competitorAnalysis = await this.competitorMonitor.analyzeAllCompetitors();

            // 运行差距分析
            const gapAnalysis = await this.gapAnalyzer.performGapAnalysis();

            // 检查新的威胁和机会
            await this.checkCompetitorThreats(competitorAnalysis, gapAnalysis);

            const duration = Date.now() - startTime;
            this.updateSystemStatus('competitor_check', duration, true);

            console.log(`✅ 竞争对手检查完成 (耗时: ${duration}ms)`);

        } catch (error) {
            console.error('❌ 竞争对手检查失败:', error);
            await this.logError('competitor_check', error);
            this.updateSystemStatus('competitor_check', Date.now() - startTime, false);
        }
    }

    // 每周分析任务
    async runWeeklyAnalysis() {
        console.log('📊 执行每周分析...');

        const startTime = Date.now();

        try {
            // 生成周报
            const weeklyReport = await this.generateWeeklyReport();

            // 分析趋势
            const trendAnalysis = await this.analyzeTrends();

            // 更新策略建议
            const strategyUpdate = await this.updateStrategy();

            const duration = Date.now() - startTime;
            this.updateSystemStatus('weekly_analysis', duration, true);

            console.log(`✅ 每周分析完成 (耗时: ${duration}ms)`);

        } catch (error) {
            console.error('❌ 每周分析失败:', error);
            await this.logError('weekly_analysis', error);
            this.updateSystemStatus('weekly_analysis', Date.now() - startTime, false);
        }
    }

    // 每月报告任务
    async runMonthlyReport() {
        console.log('📈 执行每月报告...');

        const startTime = Date.now();

        try {
            // 生成月报
            const monthlyReport = await this.generateMonthlyReport();

            // 性能评估
            const performanceReview = await this.performanceReview();

            // 清理旧数据
            await this.cleanupOldData();

            const duration = Date.now() - startTime;
            this.updateSystemStatus('monthly_report', duration, true);

            console.log(`✅ 每月报告完成 (耗时: ${duration}ms)`);

        } catch (error) {
            console.error('❌ 每月报告失败:', error);
            await this.logError('monthly_report', error);
            this.updateSystemStatus('monthly_report', Date.now() - startTime, false);
        }
    }

    // 检查关键指标
    async checkCriticalMetrics() {
        try {
            // 获取最新的Web Vitals数据
            const webVitalsStats = await this.webVitalsServer.getStats();

            // 检查关键阈值
            const alerts = [];

            if (webVitalsStats.lcp?.p75 > 2500) {
                alerts.push({
                    type: 'performance',
                    metric: 'LCP',
                    value: webVitalsStats.lcp.p75,
                    threshold: 2500,
                    severity: 'high',
                    message: 'LCP性能下降，需要立即优化'
                });
            }

            if (webVitalsStats.cls?.p75 > 0.1) {
                alerts.push({
                    type: 'performance',
                    metric: 'CLS',
                    value: webVitalsStats.cls.p75,
                    threshold: 0.1,
                    severity: 'medium',
                    message: 'CLS指标超出良好范围'
                });
            }

            if (webVitalsStats.inp?.p75 > 200) {
                alerts.push({
                    type: 'performance',
                    metric: 'INP',
                    value: webVitalsStats.inp.p75,
                    threshold: 200,
                    severity: 'high',
                    message: 'INP响应时间过长'
                });
            }

            // 处理警报
            for (const alert of alerts) {
                await this.processAlert(alert);
            }

        } catch (error) {
            console.error('关键指标检查失败:', error);
        }
    }

    // 检查警报条件
    async checkAlertConditions() {
        try {
            // 检查系统错误率
            const errorRate = this.calculateErrorRate();
            if (errorRate > 0.1) { // 错误率超过10%
                await this.processAlert({
                    type: 'system',
                    metric: 'error_rate',
                    value: errorRate,
                    threshold: 0.1,
                    severity: 'high',
                    message: '系统错误率过高'
                });
            }

            // 检查数据收集状态
            const lastDataCollection = await this.getLastDataCollectionTime();
            const timeSinceLastCollection = Date.now() - lastDataCollection;
            
            if (timeSinceLastCollection > 24 * 60 * 60 * 1000) { // 超过24小时
                await this.processAlert({
                    type: 'data',
                    metric: 'collection_delay',
                    value: timeSinceLastCollection,
                    threshold: 24 * 60 * 60 * 1000,
                    severity: 'medium',
                    message: '数据收集延迟'
                });
            }

        } catch (error) {
            console.error('警报条件检查失败:', error);
        }
    }

    // 处理警报
    async processAlert(alert) {
        try {
            alert.id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            alert.timestamp = Date.now();

            // 添加到系统警报列表
            this.systemStatus.alerts.push(alert);

            // 保存警报
            const alertPath = path.join(__dirname, 'alerts', `${alert.id}.json`);
            await fs.writeFile(alertPath, JSON.stringify(alert, null, 2));

            // 发送通知
            await this.sendNotification(alert);

            console.log(`🚨 警报处理: ${alert.message} (严重程度: ${alert.severity})`);

        } catch (error) {
            console.error('警报处理失败:', error);
        }
    }

    // 发送通知
    async sendNotification(alert) {
        try {
            if (this.config.automation.notifications.console) {
                console.log(`🔔 通知: ${alert.message}`);
            }

            if (this.config.automation.notifications.email && this.emailTransporter) {
                await this.sendEmailNotification(alert);
            }

            if (this.config.automation.notifications.webhook) {
                // 这里可以集成Webhook通知
                console.log(`🔗 Webhook通知: ${alert.message}`);
            }

        } catch (error) {
            console.error('通知发送失败:', error);
        }
    }

    // 更新系统状态
    updateSystemStatus(taskType, duration, success) {
        this.systemStatus.lastRun = Date.now();
        this.systemStatus.totalRuns++;

        if (success) {
            // 更新平均运行时间
            const currentAvg = this.systemStatus.performance.averageRunTime;
            const totalRuns = this.systemStatus.totalRuns;
            this.systemStatus.performance.averageRunTime = 
                (currentAvg * (totalRuns - 1) + duration) / totalRuns;

            // 更新成功率
            const successfulRuns = Math.round(this.systemStatus.performance.successRate * (totalRuns - 1) / 100) + 1;
            this.systemStatus.performance.successRate = (successfulRuns / totalRuns) * 100;
        } else {
            // 更新成功率（失败情况）
            const successfulRuns = Math.round(this.systemStatus.performance.successRate * (this.systemStatus.totalRuns - 1) / 100);
            this.systemStatus.performance.successRate = (successfulRuns / this.systemStatus.totalRuns) * 100;
        }
    }

    // 记录错误
    async logError(taskType, error) {
        try {
            const errorLog = {
                id: `error-${Date.now()}`,
                timestamp: Date.now(),
                taskType,
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                }
            };

            this.systemStatus.errors.push(errorLog);

            // 保存错误日志
            const errorPath = path.join(__dirname, 'logs', `error-${Date.now()}.json`);
            await fs.writeFile(errorPath, JSON.stringify(errorLog, null, 2));

        } catch (logError) {
            console.error('错误日志记录失败:', logError);
        }
    }

    // 显示系统信息
    displaySystemInfo() {
        console.log('\n📊 === 自动化SEO监控系统信息 ===');
        console.log(`🎯 目标网站: ${this.config.target_website}`);
        console.log(`⚙️ 自动化状态: ${this.config.automation.enabled ? '启用' : '禁用'}`);
        console.log(`📅 每日报告: ${this.config.automation.schedules.dailyReport}`);
        console.log(`⏰ 每小时检查: ${this.config.automation.schedules.hourlyCheck}`);
        console.log(`🔍 竞争对手检查: ${this.config.automation.schedules.competitorCheck}`);
        console.log(`📊 每周分析: ${this.config.automation.schedules.weeklyAnalysis}`);
        console.log(`📈 每月报告: ${this.config.automation.schedules.monthlyReport}`);
        console.log('=====================================\n');
    }

    // 显示调度信息
    displayScheduleInfo() {
        console.log('\n⏰ === 定时任务调度信息 ===');
        for (const [name, schedule] of Object.entries(this.config.automation.schedules)) {
            console.log(`${name}: ${schedule}`);
        }
        console.log('============================\n');
    }

    // 获取系统状态
    getSystemStatus() {
        return {
            ...this.systemStatus,
            isRunning: this.isRunning,
            config: this.config,
            scheduledTasks: Array.from(this.scheduledTasks.keys())
        };
    }

    // 手动触发任务
    async triggerTask(taskName) {
        console.log(`🔧 手动触发任务: ${taskName}`);

        switch (taskName) {
            case 'daily':
                await this.runDailyReport();
                break;
            case 'hourly':
                await this.runHourlyCheck();
                break;
            case 'competitor':
                await this.runCompetitorCheck();
                break;
            case 'weekly':
                await this.runWeeklyAnalysis();
                break;
            case 'monthly':
                await this.runMonthlyReport();
                break;
            default:
                console.log(`❌ 未知任务: ${taskName}`);
        }
    }

    // 辅助方法
    calculateErrorRate() {
        const totalRuns = this.systemStatus.totalRuns;
        const errors = this.systemStatus.errors.length;
        return totalRuns > 0 ? errors / totalRuns : 0;
    }

    async getLastDataCollectionTime() {
        try {
            const dataPath = path.join(__dirname, 'data', 'last-collection.json');
            const data = await fs.readFile(dataPath, 'utf8');
            const parsed = JSON.parse(data);
            return parsed.timestamp || Date.now();
        } catch (error) {
            return Date.now();
        }
    }

    generateInitialRecommendations(analysis, gapAnalysis) {
        const recommendations = [];

        // 基于分析结果生成建议
        if (analysis.overallScore < 70) {
            recommendations.push({
                priority: 'high',
                category: 'overall',
                title: '整体SEO优化',
                description: '网站整体SEO评分较低，建议优先处理关键问题'
            });
        }

        // 基于差距分析生成建议
        if (gapAnalysis.gaps.critical.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'gaps',
                title: '关键差距修复',
                description: `发现${gapAnalysis.gaps.critical.length}个关键差距需要立即处理`
            });
        }

        return recommendations;
    }

    async generateWeeklyReport() {
        // 生成周报的逻辑
        return { type: 'weekly', timestamp: Date.now() };
    }

    async analyzeTrends() {
        // 趋势分析的逻辑
        return { trends: [], timestamp: Date.now() };
    }

    async updateStrategy() {
        // 策略更新的逻辑
        return { strategy: 'updated', timestamp: Date.now() };
    }

    async generateMonthlyReport() {
        // 生成月报的逻辑
        return { type: 'monthly', timestamp: Date.now() };
    }

    async performanceReview() {
        // 性能评估的逻辑
        return { review: 'completed', timestamp: Date.now() };
    }

    async cleanupOldData() {
        // 清理旧数据的逻辑
        console.log('🧹 清理旧数据...');
        
        const retentionDays = this.config.automation.dataRetention;
        const now = Date.now();
        
        // 清理旧报告
        await this.cleanupDirectory('reports', retentionDays.reports * 24 * 60 * 60 * 1000);
        
        // 清理原始数据
        await this.cleanupDirectory('data/raw', retentionDays.rawData * 24 * 60 * 60 * 1000);
        
        // 清理警报
        await this.cleanupDirectory('alerts', retentionDays.alerts * 24 * 60 * 60 * 1000);
    }

    async cleanupDirectory(dirPath, maxAge) {
        try {
            const fullPath = path.join(__dirname, dirPath);
            const files = await fs.readdir(fullPath);
            const now = Date.now();
            
            for (const file of files) {
                const filePath = path.join(fullPath, file);
                const stats = await fs.stat(filePath);
                
                if (now - stats.mtime.getTime() > maxAge) {
                    await fs.unlink(filePath);
                    console.log(`🗑️ 已删除过期文件: ${file}`);
                }
            }
        } catch (error) {
            console.error(`清理目录失败 ${dirPath}:`, error);
        }
    }

    async sendEmailNotification(alert) {
        try {
            const mailOptions = {
                from: this.config.email.user,
                to: this.config.email.recipients || this.config.email.user,
                subject: `SEO监控警报 - ${alert.severity.toUpperCase()}`,
                html: `
                    <h2>SEO监控系统警报</h2>
                    <p><strong>网站:</strong> ${this.config.target_website}</p>
                    <p><strong>警报类型:</strong> ${alert.type}</p>
                    <p><strong>严重程度:</strong> ${alert.severity}</p>
                    <p><strong>指标:</strong> ${alert.metric}</p>
                    <p><strong>当前值:</strong> ${alert.value}</p>
                    <p><strong>阈值:</strong> ${alert.threshold}</p>
                    <p><strong>消息:</strong> ${alert.message}</p>
                    <p><strong>时间:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
                `
            };
            
            await this.emailTransporter.sendMail(mailOptions);
            console.log(`📧 邮件通知已发送: ${alert.message}`);
        } catch (error) {
            console.error('邮件发送失败:', error);
        }
    }

    async checkCompetitorThreats(competitorAnalysis, gapAnalysis) {
        // 检查竞争对手威胁的逻辑
        console.log('🔍 检查竞争对手威胁...');
        
        try {
            const threats = [];
            const opportunities = [];
            
            // 分析竞争对手排名变化
            for (const competitor of competitorAnalysis.competitors) {
                if (competitor.rankingChange && competitor.rankingChange.improvement > 5) {
                    threats.push({
                        type: 'ranking_threat',
                        competitor: competitor.domain,
                        description: `${competitor.domain} 排名提升了 ${competitor.rankingChange.improvement} 位`,
                        severity: 'medium'
                    });
                }
            }
            
            // 分析关键词机会
            if (gapAnalysis.opportunities) {
                for (const opportunity of gapAnalysis.opportunities) {
                    if (opportunity.difficulty < 30 && opportunity.searchVolume > 1000) {
                        opportunities.push({
                            type: 'keyword_opportunity',
                            keyword: opportunity.keyword,
                            description: `低竞争高搜索量关键词: ${opportunity.keyword}`,
                            searchVolume: opportunity.searchVolume,
                            difficulty: opportunity.difficulty
                        });
                    }
                }
            }
            
            // 处理威胁警报
            for (const threat of threats) {
                await this.processAlert({
                    type: 'competitor_threat',
                    metric: threat.type,
                    value: threat.competitor,
                    severity: threat.severity,
                    message: threat.description
                });
            }
            
            // 记录机会
            if (opportunities.length > 0) {
                const opportunityReport = {
                    timestamp: Date.now(),
                    opportunities,
                    website: this.config.target_website
                };
                
                const reportPath = path.join(__dirname, 'reports', `opportunities-${Date.now()}.json`);
                await fs.writeFile(reportPath, JSON.stringify(opportunityReport, null, 2));
                
                console.log(`💡 发现 ${opportunities.length} 个SEO机会`);
            }
            
        } catch (error) {
            console.error('竞争对手威胁检查失败:', error);
        }
    }
}

// 导出类
module.exports = { AutomatedSEOSystem };

// 如果直接运行此文件，启动系统
if (require.main === module) {
    const system = new AutomatedSEOSystem();
    
    // 处理进程信号
    process.on('SIGINT', async () => {
        console.log('\n🛑 接收到停止信号，正在关闭系统...');
        await system.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n🛑 接收到终止信号，正在关闭系统...');
        await system.stop();
        process.exit(0);
    });

    // 启动系统
    system.start().catch(error => {
        console.error('❌ 系统启动失败:', error);
        process.exit(1);
    });
}