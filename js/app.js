// Marketing SuperAgent v4 - Complete Two-Panel Interface
class MarketingSuperAgentV4 {
    constructor() {
        this.currentView = 'home';
        this.messageHistory = [];
        this.currentAgents = [];
        this.outputHistory = [];
        this.currentSuiteTitle = 'Creative AI Suite'; // Store current AI suite title - default to Creative
        this.currentRoute = 'home';
        this.init();
        this.loadHistoryFromStorage();
        this.initRouting();
    }

    init() {
        console.log('Marketing SuperAgent v4 initialized');
        this.setupEventListeners();
        this.initializeInterface();
    }

    setupEventListeners() {
        // Main input handling
        const mainInput = document.getElementById('main-input');
        const mainSend = document.getElementById('main-send');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        // Main chat input
        if (mainInput && mainSend) {
            const sendMainMessage = () => {
                const message = mainInput.value.trim();
                if (message) {
                    this.handleMainInput(message);
                    mainInput.value = '';
                }
            };

            mainSend.addEventListener('click', sendMainMessage);
            mainInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMainMessage();
                }
            });
        }

        // Working interface chat input
        if (chatInput && chatSend) {
            const sendChatMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.handleChatInput(message);
                    chatInput.value = '';
                }
            };

            chatSend.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
        }

        // Back to home button
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showHomeScreen();
            });
        }


        // History panel
        const historyBtn = document.getElementById('history-btn');
        const closeHistory = document.getElementById('close-history');

        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                this.toggleHistoryPanel();
            });
        }

        // Sidebar history button
        const sidebarHistoryBtn = document.getElementById('sidebar-history-btn');
        if (sidebarHistoryBtn) {
            sidebarHistoryBtn.addEventListener('click', () => {
                this.toggleHistoryPanel();
            });
        }

        // Home page sidebar history button
        const sidebarHistoryBtnHome = document.getElementById('sidebar-history-btn-home');
        if (sidebarHistoryBtnHome) {
            sidebarHistoryBtnHome.addEventListener('click', () => {
                this.toggleHistoryPanel();
            });
        }

        // Knowledge Base buttons
        const sidebarKnowledgeBtn = document.getElementById('sidebar-knowledge-btn');
        if (sidebarKnowledgeBtn) {
            console.log('Found Knowledge Base button, adding event listener');
            sidebarKnowledgeBtn.addEventListener('click', (e) => {
                console.log('Knowledge Base button clicked');
                this.openKnowledgeBase();
            });
        } else {
            console.log('Knowledge Base button not found');
        }

        const sidebarKnowledgeBtnWorking = document.getElementById('sidebar-knowledge-btn-working');
        if (sidebarKnowledgeBtnWorking) {
            console.log('Found Knowledge Base working button, adding event listener');
            sidebarKnowledgeBtnWorking.addEventListener('click', (e) => {
                console.log('Knowledge Base working button clicked');
                this.openKnowledgeBase();
            });
        } else {
            console.log('Knowledge Base working button not found');
        }

        if (closeHistory) {
            closeHistory.addEventListener('click', () => {
                this.closeHistoryPanel();
            });
        }

        // Knowledge Base navigation
        const kbBackToHome = document.getElementById('kb-back-to-home');
        if (kbBackToHome) {
            kbBackToHome.addEventListener('click', () => {
                console.log('KB back to home clicked');
                this.showHomeScreen();
                window.location.hash = '';
            });
        }

        const kbSidebarHistoryBtn = document.getElementById('kb-sidebar-history-btn');
        if (kbSidebarHistoryBtn) {
            kbSidebarHistoryBtn.addEventListener('click', () => {
                this.toggleHistoryPanel();
            });
        }

        // Knowledge Base interactions
        this.setupKnowledgeBaseInteractions();

        // Fallback event delegation for Knowledge Base buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#sidebar-knowledge-btn') || e.target.closest('#sidebar-knowledge-btn-working')) {
                console.log('Knowledge Base button clicked via event delegation');
                this.openKnowledgeBase();
            }
        });

        // Example cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.example-card')) {
                const card = e.target.closest('.example-card');
                const prompt = card.dataset.prompt;
                if (prompt) {
                    this.handleExamplePrompt(prompt);
                }
            }
        });

        // Area cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.area-card')) {
                const card = e.target.closest('.area-card');
                const area = card.dataset.area;
                if (area) {
                    this.handleAreaClick(area);
                }
            }
        });

        // Task buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.task-btn')) {
                const btn = e.target.closest('.task-btn');
                const task = btn.dataset.task;
                if (task) {
                    this.handleTaskClick(task);
                }
            }
        });

        // Output actions - using event delegation since export button is dynamically added
        document.addEventListener('click', (e) => {
            if (e.target.closest('#export-output')) {
                this.exportOutput();
            }
        });
    }

    initializeInterface() {
        // Start with home screen visible
        this.showHomeScreen();
    }

    handleExamplePrompt(prompt) {
        // Map example prompts to specific agents and output types
        const examplePromptConfig = this.getExamplePromptConfig(prompt);

        // Set context for this specific example
        this.currentTask = examplePromptConfig.task;
        this.currentTaskAgents = examplePromptConfig.agents;
        this.currentSuiteTitle = examplePromptConfig.suiteTitle;

        // Transition to working interface
        this.showWorkingInterface();

        // Add initial message to chat
        this.addMessage(prompt, 'user');

        // Show processing indicator
        this.showProcessingIndicator();

        // Show specific agents for this example
        setTimeout(() => {
            this.showAgentProgress(examplePromptConfig.messageType, prompt);
        }, 500);

        // Generate response with specific agents
        setTimeout(() => {
            this.generateResponse(prompt, examplePromptConfig.messageType);
        }, 3000);

        // Update output panel with specific content
        setTimeout(() => {
            this.updateOutputPanel(examplePromptConfig.messageType, prompt);
        }, 2000);

        // Clear task context after processing completes
        setTimeout(() => {
            this.clearTaskContext();
        }, 8000);
    }

    getExamplePromptConfig(prompt) {
        const lowerPrompt = prompt.toLowerCase();

        // Creative & Asset Generation prompts
        if (lowerPrompt.includes('creative assets') || lowerPrompt.includes('instagram ads') ||
            lowerPrompt.includes('video ad scripts') || lowerPrompt.includes('creative')) {
            return {
                task: 'generate-creative',
                agents: ['Creative Agent', 'Research Agent', 'Audience Agent'],
                suiteTitle: 'Creative AI Suite',
                messageType: 'creative'
            };
        }

        // Campaign Strategy prompts
        if (lowerPrompt.includes('campaign brief') || lowerPrompt.includes('holiday promotion') ||
            lowerPrompt.includes('brand positioning') || lowerPrompt.includes('tiktok advertising strategy')) {
            return {
                task: 'campaign-brief',
                agents: ['Research Agent', 'Audience Agent', 'Performance Agent'],
                suiteTitle: 'Strategic Planning Suite',
                messageType: 'brief'
            };
        }

        // Journey & Automation prompts
        if (lowerPrompt.includes('cart abandonment') || lowerPrompt.includes('email campaign') ||
            lowerPrompt.includes('welcome email') || lowerPrompt.includes('customer onboarding') ||
            lowerPrompt.includes('win-back email')) {
            return {
                task: 'setup-journey',
                agents: ['Journey Agent', 'Audience Agent', 'Performance Agent'],
                suiteTitle: 'Engage AI Suite',
                messageType: 'journey'
            };
        }

        // Performance & Optimization prompts
        if (lowerPrompt.includes('optimize') || lowerPrompt.includes('performance') ||
            lowerPrompt.includes('budget allocation') || lowerPrompt.includes('landing pages') ||
            lowerPrompt.includes('conversion')) {
            return {
                task: 'optimize-campaign',
                agents: ['Performance Agent', 'Analytics Agent', 'Research Agent'],
                suiteTitle: 'Performance AI Suite',
                messageType: 'performance'
            };
        }

        // Audience & Segmentation prompts
        if (lowerPrompt.includes('audience segments') || lowerPrompt.includes('gen z') ||
            lowerPrompt.includes('customer personas') || lowerPrompt.includes('targeting') ||
            lowerPrompt.includes('behavioral')) {
            return {
                task: 'audience-segments',
                agents: ['Audience Agent', 'Research Agent', 'Analytics Agent'],
                suiteTitle: 'Audience Intelligence Suite',
                messageType: 'audience'
            };
        }

        // Research & Analysis prompts
        if (lowerPrompt.includes('competitor') || lowerPrompt.includes('market') ||
            lowerPrompt.includes('pricing strategies') || lowerPrompt.includes('analyze')) {
            return {
                task: 'competitor-analysis',
                agents: ['Research Agent', 'Performance Agent', 'Historical Agent'],
                suiteTitle: 'Market Research Suite',
                messageType: 'research'
            };
        }

        // Paid Media prompts
        if (lowerPrompt.includes('google') || lowerPrompt.includes('meta') || lowerPrompt.includes('linkedin') ||
            lowerPrompt.includes('shopping campaigns') || lowerPrompt.includes('retargeting') ||
            lowerPrompt.includes('budget allocation')) {
            return {
                task: 'budget-allocation',
                agents: ['Paid Media Agent', 'Performance Agent', 'Analytics Agent'],
                suiteTitle: 'Paid Media AI Suite',
                messageType: 'paid-media'
            };
        }

        // Content & Planning prompts
        if (lowerPrompt.includes('content calendar') || lowerPrompt.includes('social media') ||
            lowerPrompt.includes('webinar') || lowerPrompt.includes('podcast')) {
            return {
                task: 'content-calendar',
                agents: ['Creative Agent', 'Research Agent', 'Journey Agent'],
                suiteTitle: 'Content Strategy Suite',
                messageType: 'content'
            };
        }

        // Default fallback
        return {
            task: 'campaign-brief',
            agents: ['Research Agent', 'Performance Agent', 'Creative Agent'],
            suiteTitle: 'Marketing AI Suite',
            messageType: 'general'
        };
    }

    handleMainInput(message) {
        // Clear any previous task-specific context for new general inputs
        // (Task buttons set their own context)
        if (!this.currentTask) {
            this.currentTaskAgents = null;
            this.currentTask = null;
        }

        // Detect relevant AI suite based on the input
        const relevantSuite = this.detectRelevantAISuite(message);
        if (relevantSuite) {
            const areaTitles = {
                'engage': 'Engage AI Suite',
                'paid-media': 'Paid Media AI Suite',
                'personalization': 'Personalization AI Suite',
                'service': 'Service AI Suite',
                'creative': 'Creative AI Suite'
            };
            this.currentSuiteTitle = areaTitles[relevantSuite];
        } else {
            // Fallback: map message type to appropriate AI suite
            const messageType = this.analyzeMessage(message);
            this.currentSuiteTitle = this.getAISuiteFromMessageType(messageType);
        }

        // Transition to working interface
        this.showWorkingInterface();

        // Add initial message to chat
        this.addMessage(message, 'user');

        // Show processing indicator
        this.showProcessingIndicator();

        // Route to agents and generate response
        setTimeout(() => {
            this.routeToAgents(message);
        }, 1000);

        // Clear task context after processing completes
        setTimeout(() => {
            this.clearTaskContext();
        }, 8000); // Clear after all processing is done (increased to ensure completion)
    }

    handleChatInput(message) {
        this.addMessage(message, 'user');

        // Generate follow-up response
        setTimeout(() => {
            this.generateFollowUpResponse(message);
        }, 500);
    }

    getAISuiteFromMessageType(messageType) {
        // Map message types to AI suites to ensure we never show "Task Output"
        const messageTypeToSuite = {
            'brief': 'Paid Media AI Suite',
            'creative': 'Creative AI Suite',
            'journey': 'Engage AI Suite',
            'performance': 'Paid Media AI Suite',
            'audience': 'Engage AI Suite',
            'paid-media': 'Paid Media AI Suite',
            'general': 'Creative AI Suite' // Default to Creative for general tasks
        };

        return messageTypeToSuite[messageType] || 'Creative AI Suite';
    }

    detectRelevantAISuite(prompt) {
        const suiteKeywords = {
            'engage': [
                'engagement', 'customer journey', 'journey', 'email campaign', 'sms', 'push notification',
                'segmentation', 'segments', 'personalization', 'automated', 'flow', 'touchpoint',
                'nurture', 'retention', 'lifecycle', 'onboarding', 'welcome', 'cart abandonment',
                'win-back', 're-engagement', 'loyalty', 'subscription'
            ],
            'paid-media': [
                'paid', 'ads', 'advertising', 'campaign', 'budget', 'spend', 'roi', 'roas',
                'google', 'meta', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube',
                'ppc', 'cpc', 'cpm', 'bidding', 'targeting', 'optimization', 'performance',
                'media plan', 'channel', 'allocation', 'shopping', 'search ads', 'display'
            ],
            'personalization': [
                'personalization', 'personalized', 'recommendation', 'dynamic content',
                'ai recommendation', 'product recommendation', 'content recommendation',
                'behavioral', 'individual', 'tailored', 'custom', 'adaptive', 'smart',
                'machine learning', 'predictive', 'algorithm', 'user preference'
            ],
            'service': [
                'service', 'support', 'customer service', 'help', 'assistance', 'chatbot',
                'conversation flow', 'customer support', 'proactive', 'reactive',
                'ticket', 'resolution', 'satisfaction', 'feedback', 'survey', 'nps',
                'live chat', 'self-service', 'knowledge base', 'faq'
            ],
            'creative': [
                'creative', 'asset', 'content', 'copy', 'design', 'visual', 'image',
                'video', 'ad creative', 'banner', 'social media content', 'post',
                'script', 'headline', 'description', 'creative brief', 'brand',
                'artwork', 'graphic', 'template', 'variant', 'a/b test', 'testing'
            ]
        };

        const lowercasePrompt = prompt.toLowerCase();
        const scores = {};

        // Calculate relevance scores for each suite
        Object.keys(suiteKeywords).forEach(suite => {
            scores[suite] = 0;
            suiteKeywords[suite].forEach(keyword => {
                if (lowercasePrompt.includes(keyword)) {
                    // Give higher weight to exact matches and longer keywords
                    scores[suite] += keyword.length;
                }
            });
        });

        // Find the suite with the highest score
        let maxScore = 0;
        let relevantSuite = null;

        Object.keys(scores).forEach(suite => {
            if (scores[suite] > maxScore) {
                maxScore = scores[suite];
                relevantSuite = suite;
            }
        });

        return relevantSuite;
    }

    handleAreaClick(area) {
        // Set output title based on selected AI suite
        const areaTitles = {
            'engage': 'Engage AI Suite',
            'paid-media': 'Paid Media AI Suite',
            'personalization': 'Personalization AI Suite',
            'service': 'Service AI Suite',
            'creative': 'Creative AI Suite'
        };

        // Store and set the current suite title
        this.currentSuiteTitle = areaTitles[area] || 'Creative AI Suite';

        // Special handling for Paid Media AI Suite
        if (area === 'paid-media') {
            this.showPaidMediaInterface();
            return;
        }

        // Default behavior for other suites
        const areaPrompts = {
            'engage': 'Help me create a customer engagement strategy with personalized journeys and segmentation',
            'personalization': 'Set up AI-powered personalization for my website and email campaigns',
            'service': 'Design proactive customer service flows and support automation',
            'creative': 'Generate creative assets and copy for my upcoming campaign with A/B testing variants'
        };

        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        const prompt = areaPrompts[area] || `Help me with ${area} tasks`;
        this.handleMainInput(prompt);
    }

    showPaidMediaInterface() {
        // Transition to working interface
        this.showWorkingInterface();

        // Set the output title
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        // Show specialized Paid Media AI Assistant message
        this.addMessage("Hi! I'm your Paid Media AI Assistant. I can help you with comprehensive paid media management across all platforms. What would you like to focus on today?", 'agent', 'Paid Media AI Assistant');

        // Show the three main options
        setTimeout(() => {
            const optionsHTML = `
                <div style="margin-top: 1rem; padding: 1.5rem; background: var(--card-bg); border: var(--border); border-radius: 12px;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--text-primary); font-weight: 600;">Choose your focus area:</h4>
                    <div style="display: grid; gap: 1rem;">
                        <button class="paid-media-option" data-option="creation"
                            style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border: 1px solid var(--border-color); border-radius: 8px; text-align: left; cursor: pointer; transition: all var(--transition-fast);">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-primary), #2563eb); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Campaign Creation</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Build new campaigns from strategy to launch</div>
                            </div>
                        </button>

                        <button class="paid-media-option" data-option="optimization"
                            style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border: 1px solid var(--border-color); border-radius: 8px; text-align: left; cursor: pointer; transition: all var(--transition-fast);">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-green), #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Campaign Optimization</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Improve performance and maximize ROAS</div>
                            </div>
                        </button>

                        <button class="paid-media-option" data-option="reporting"
                            style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border: 1px solid var(--border-color); border-radius: 8px; text-align: left; cursor: pointer; transition: all var(--transition-fast);">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-purple), #7c3aed); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Campaign Reporting</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Analyze performance and generate insights</div>
                            </div>
                        </button>
                    </div>
                </div>
            `;

            this.addMessage(optionsHTML, 'agent', 'Paid Media AI Assistant');

            // Add event listeners for the options
            this.setupPaidMediaOptionListeners();
        }, 800);
    }

    setupPaidMediaOptionListeners() {
        // Add hover effects and click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.paid-media-option')) {
                const option = e.target.closest('.paid-media-option').dataset.option;
                this.handlePaidMediaOption(option);
            }
        });

        // Add hover effects
        const style = document.createElement('style');
        style.textContent = `
            .paid-media-option:hover {
                border-color: var(--accent-primary) !important;
                box-shadow: 0 4px 12px rgba(25, 87, 219, 0.15) !important;
                transform: translateY(-2px) !important;
            }
        `;
        document.head.appendChild(style);
    }

    handlePaidMediaOption(option) {
        const optionNames = {
            'creation': 'Campaign Creation',
            'optimization': 'Campaign Optimization',
            'reporting': 'Campaign Reporting'
        };

        // Add user selection message
        this.addMessage(`I'd like help with ${optionNames[option]}`, 'user');

        // Handle Campaign Creation with special prompt
        if (option === 'creation') {
            setTimeout(() => {
                const campaignPromptHTML = `
                    <div style="padding: 1.5rem; background: var(--card-bg); border: var(--border); border-radius: 12px; margin: 1rem 0;">
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="margin: 0 0 1rem 0; color: var(--accent-primary); font-size: 1.1rem; font-weight: 600;">Great! Let's create your campaign</h4>
                            <p style="margin: 0 0 1.5rem 0; color: var(--text-secondary); line-height: 1.6;">
                                Tell me about your campaign goals, budget, target audience, and timeline - just like you're briefing a team member.
                            </p>
                        </div>

                        <div style="background: var(--gray-50); border-left: 4px solid var(--accent-primary); padding: 1.25rem; border-radius: 8px;">
                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-lightbulb" style="color: var(--accent-primary);"></i>
                                For example:
                            </div>
                            <div style="color: var(--text-secondary); line-height: 1.6; font-style: italic;">
                                "I need to launch a holiday campaign for our new smartwatch. We're targeting tech-savvy millennials aged 25-40 who are interested in fitness and productivity. Our budget is $75K over 6 weeks, starting Black Friday through New Year's. Main goal is driving online sales with a target ROAS of 4x. We want to focus on Google Ads and Meta platforms, with video creative showcasing the health tracking features."
                            </div>
                        </div>

                        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                                💡 <strong>Pro tip:</strong> The more details you provide, the more tailored and actionable your campaign strategy will be!
                            </p>
                        </div>
                    </div>
                `;

                this.addMessage(campaignPromptHTML, 'agent', 'Paid Media AI Assistant');
            }, 800);
            return;
        }

        // Handle other options with standard prompts
        const optionPrompts = {
            'optimization': 'I want to optimize my existing paid media campaigns. Analyze performance, identify opportunities, and provide actionable recommendations to improve ROAS.',
            'reporting': 'I need comprehensive reporting and analysis of my paid media campaigns. Generate insights, performance metrics, and strategic recommendations based on current data.'
        };

        // Show processing indicator
        this.showProcessingIndicator();

        // Route to agents with specialized prompt
        setTimeout(() => {
            this.routeToAgents(optionPrompts[option]);
        }, 1000);
    }

    handleTaskClick(task) {
        console.log('Task clicked:', task);
        const taskPrompts = {
            'campaign-brief': 'Create a comprehensive campaign brief with objectives, target audience, and strategy',
            'optimize-campaign': 'Analyze my current campaign performance and provide optimization recommendations',
            'campaign-insights': 'Generate detailed insights and analytics for my running campaigns',
            'setup-journey': 'Design an automated customer journey with email, SMS, and push notifications',
            'generate-creative': 'Create multiple creative asset variants for A/B testing across platforms',
            'audience-segments': 'Build detailed audience segments based on demographics, behavior, and preferences',
            'budget-allocation': 'Optimize my marketing budget allocation across channels for maximum ROI',
            'ab-test': 'Set up A/B testing framework for campaigns with statistical significance tracking',
            'competitor-analysis': 'Analyze competitor marketing strategies, positioning, and performance benchmarks',
            'content-calendar': 'Create a strategic content calendar with scheduling and theme planning'
        };

        // Task-to-agents mapping - specify which agents are most relevant for each task
        const taskToAgents = {
            'campaign-brief': ['Research Agent', 'Audience Agent', 'Performance Agent'],
            'optimize-campaign': ['Performance Agent', 'Analytics Agent', 'Historical Agent'],
            'campaign-insights': ['Analytics Agent', 'Performance Agent', 'Historical Agent'],
            'setup-journey': ['Journey Agent', 'Audience Agent', 'Personalization Agent'],
            'generate-creative': ['Creative Agent', 'Research Agent', 'Audience Agent'],
            'audience-segments': ['Audience Agent', 'Analytics Agent', 'Research Agent'],
            'budget-allocation': ['Performance Agent', 'Analytics Agent', 'Historical Agent'],
            'ab-test': ['Creative Agent', 'Performance Agent', 'Analytics Agent'],
            'competitor-analysis': ['Research Agent', 'Performance Agent', 'Historical Agent'],
            'content-calendar': ['Creative Agent', 'Research Agent', 'Journey Agent']
        };

        // Direct task-to-suite mapping for higher accuracy
        const taskToSuite = {
            'campaign-brief': 'paid-media',
            'optimize-campaign': 'paid-media',
            'campaign-insights': 'paid-media',
            'setup-journey': 'engage',
            'generate-creative': 'creative',
            'audience-segments': 'engage',
            'budget-allocation': 'paid-media',
            'ab-test': 'creative',
            'competitor-analysis': null, // Let AI detection handle this
            'content-calendar': 'creative'
        };

        // Set AI suite title if we have a direct mapping
        const directSuite = taskToSuite[task];
        if (directSuite) {
            const areaTitles = {
                'engage': 'Engage AI Suite',
                'paid-media': 'Paid Media AI Suite',
                'personalization': 'Personalization AI Suite',
                'service': 'Service AI Suite',
                'creative': 'Creative AI Suite'
            };
            this.currentSuiteTitle = areaTitles[directSuite];
        }

        // Set the specific agents for this task
        this.currentTaskAgents = taskToAgents[task] || [];
        this.currentTask = task;

        const prompt = taskPrompts[task] || `Help me ${task.replace(/-/g, ' ')}`;
        this.handleMainInput(prompt);
    }

    showHomeScreen() {
        const homeScreen = document.getElementById('home-screen');
        const workingInterface = document.getElementById('working-interface');
        const appHeader = document.querySelector('.app-header');
        const mainContent = document.querySelector('.main-content');

        if (homeScreen) homeScreen.style.display = 'grid';
        if (workingInterface) workingInterface.style.display = 'none';
        if (appHeader) appHeader.style.display = 'none';
        if (mainContent) mainContent.classList.remove('working-mode');

        this.currentView = 'home';
    }

    showWorkingInterface() {
        const homeScreen = document.getElementById('home-screen');
        const workingInterface = document.getElementById('working-interface');
        const appHeader = document.querySelector('.app-header');
        const mainContent = document.querySelector('.main-content');

        if (homeScreen) homeScreen.style.display = 'none';
        if (workingInterface) workingInterface.style.display = 'grid';
        if (appHeader) appHeader.style.display = 'none';
        if (mainContent) mainContent.classList.add('working-mode');

        this.currentView = 'working';
        // Initialize thought processes for new task
        this.currentThoughtProcesses = [];
        this.initializeOutputPanel();
    }

    initializeOutputPanel() {
        const outputContent = document.getElementById('output-content');
        if (outputContent) {
            outputContent.innerHTML = `
                <div class="output-placeholder">
                    <div class="placeholder-content">
                        <div class="placeholder-icon">
                            <i class="fas fa-cog fa-spin"></i>
                        </div>
                        <h4>Activating specialist agents...</h4>
                        <p>AI agents are analyzing your request and preparing detailed outputs.</p>
                    </div>
                </div>
            `;
        }
    }

    addMessage(content, sender = 'agent', agentName = 'SuperAgent') {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${content}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${content}</div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        this.messageHistory.push({
            content,
            sender,
            agentName,
            timestamp: new Date()
        });
    }

    showProcessingIndicator() {
        this.addMessage('🔍 Analyzing your request and activating specialist agents...', 'agent');
    }

    routeToAgents(message) {
        const messageType = this.analyzeMessage(message);

        // Show agent progress
        setTimeout(() => {
            this.showAgentProgress(messageType, message);
        }, 500);

        // Generate response
        setTimeout(() => {
            this.generateResponse(message, messageType);
        }, 3000);

        // Update output panel with user message context
        setTimeout(() => {
            this.updateOutputPanel(messageType, message);
        }, 2000);
    }

    analyzeMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Campaign brief and strategy
        if (lowerMessage.includes('brief') || lowerMessage.includes('campaign plan') || lowerMessage.includes('strategy') ||
            lowerMessage.includes('positioning') || lowerMessage.includes('launch')) {
            return 'brief';
        }

        // Creative and assets
        if (lowerMessage.includes('creative') || lowerMessage.includes('asset') || lowerMessage.includes('visual') ||
            lowerMessage.includes('ad') || lowerMessage.includes('video') || lowerMessage.includes('instagram') ||
            lowerMessage.includes('tiktok') || lowerMessage.includes('youtube') || lowerMessage.includes('script')) {
            return 'creative';
        }

        // Customer journeys, flows, and automation
        if (lowerMessage.includes('journey') || lowerMessage.includes('flow') || lowerMessage.includes('email') ||
            lowerMessage.includes('automation') || lowerMessage.includes('welcome') || lowerMessage.includes('abandonment') ||
            lowerMessage.includes('onboarding') || lowerMessage.includes('sequence') || lowerMessage.includes('series') ||
            lowerMessage.includes('notification') || lowerMessage.includes('chatbot') || lowerMessage.includes('win-back')) {
            return 'journey';
        }

        // Performance, analytics, and optimization
        if (lowerMessage.includes('performance') || lowerMessage.includes('analytics') || lowerMessage.includes('optimize') ||
            lowerMessage.includes('insights') || lowerMessage.includes('conversion') || lowerMessage.includes('landing') ||
            lowerMessage.includes('a/b test') || lowerMessage.includes('retention') || lowerMessage.includes('lifetime value') ||
            lowerMessage.includes('scoring') || lowerMessage.includes('feedback') || lowerMessage.includes('survey')) {
            return 'performance';
        }

        // Audience, segmentation, and personalization
        if (lowerMessage.includes('audience') || lowerMessage.includes('segment') || lowerMessage.includes('target') ||
            lowerMessage.includes('persona') || lowerMessage.includes('gen z') || lowerMessage.includes('millennial') ||
            lowerMessage.includes('personalized') || lowerMessage.includes('recommendation') || lowerMessage.includes('behavioral')) {
            return 'audience';
        }

        // Paid media, budget, and advertising
        if (lowerMessage.includes('budget') || lowerMessage.includes('spend') || lowerMessage.includes('media') ||
            lowerMessage.includes('roas') || lowerMessage.includes('google') || lowerMessage.includes('meta') ||
            lowerMessage.includes('linkedin') || lowerMessage.includes('advertising') || lowerMessage.includes('retargeting') ||
            lowerMessage.includes('shopping') || lowerMessage.includes('podcast') || lowerMessage.includes('influencer') ||
            lowerMessage.includes('affiliate') || lowerMessage.includes('webinar')) {
            return 'paid-media';
        }

        // Programs and partnerships
        if (lowerMessage.includes('loyalty') || lowerMessage.includes('referral') || lowerMessage.includes('program') ||
            lowerMessage.includes('partnership') || lowerMessage.includes('seasonal') || lowerMessage.includes('calendar') ||
            lowerMessage.includes('content') || lowerMessage.includes('cross-sell') || lowerMessage.includes('upsell')) {
            return 'brief';
        }

        return 'general';
    }

    showAgentProgress(messageType, userMessage = '') {
        const agentConfigs = {
            brief: ['Deep Research', 'Performance', 'Audience'],
            creative: ['Creative', 'Research Agent', 'Audience'],
            journey: ['Journey', 'Audience', 'Performance'],
            performance: ['Performance', 'Analytics', 'Research Agent'],
            audience: ['Audience', 'Research Agent', 'Analytics'],
            'paid-media': ['Paid Media', 'Performance', 'Analytics'],
            research: ['Research Agent', 'Performance', 'Historical'],
            content: ['Creative', 'Research Agent', 'Journey'],
            general: ['Deep Research', 'Performance']
        };

        // Use task-specific agents if available, otherwise fall back to message type
        const activeAgents = this.currentTaskAgents && this.currentTaskAgents.length > 0
            ? this.currentTaskAgents
            : (agentConfigs[messageType] || agentConfigs.general);

        const agentDetails = {
            'Deep Research': { icon: 'fas fa-search', color: '#8b5cf6', task: 'Analyzing market trends and competitor data' },
            'Research Agent': { icon: 'fas fa-search', color: '#8b5cf6', task: 'Analyzing market trends and competitor data' },
            'Creative': { icon: 'fas fa-palette', color: '#ec4899', task: 'Generating creative concepts and assets' },
            'Creative Agent': { icon: 'fas fa-palette', color: '#ec4899', task: 'Generating creative concepts and assets' },
            'Journey': { icon: 'fas fa-route', color: '#f59e0b', task: 'Mapping customer touchpoints and flows' },
            'Journey Agent': { icon: 'fas fa-route', color: '#f59e0b', task: 'Mapping customer touchpoints and flows' },
            'Performance': { icon: 'fas fa-chart-bar', color: '#3b82f6', task: 'Reviewing campaign performance data' },
            'Performance Agent': { icon: 'fas fa-chart-bar', color: '#3b82f6', task: 'Reviewing campaign performance data' },
            'Audience': { icon: 'fas fa-users', color: '#10b981', task: 'Identifying target segments' },
            'Audience Agent': { icon: 'fas fa-users', color: '#10b981', task: 'Identifying target segments' },
            'Paid Media': { icon: 'fas fa-dollar-sign', color: '#14b8a6', task: 'Optimizing budget allocation' },
            'Historical': { icon: 'fas fa-history', color: '#6366f1', task: 'Analyzing past campaign learnings' },
            'Historical Agent': { icon: 'fas fa-history', color: '#6366f1', task: 'Analyzing past campaign learnings' },
            'AI Decisioning': { icon: 'fas fa-brain', color: '#ef4444', task: 'Processing strategic recommendations' },
            'Analytics Agent': { icon: 'fas fa-chart-pie', color: '#2563eb', task: 'Analyzing data and metrics' },
            'Personalization Agent': { icon: 'fas fa-user-cog', color: '#9256d9', task: 'Optimizing personalized experiences' }
        };

        // Generate a unique timestamp for this progress session
        const timestamp = Date.now();

        const progressHTML = `
            <div class="agent-progress-display">
                <div class="progress-header" id="progress-header-${timestamp}">
                    <i class="fas fa-cog fa-spin" id="progress-icon-${timestamp}"></i>
                    <span id="progress-text-${timestamp}">Activating ${activeAgents.length} specialist agents</span>
                </div>
                <div class="agent-progress-list">
                    ${activeAgents.map((agentName, index) => {
                        const agent = agentDetails[agentName];
                        const itemId = `agent-${agentName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
                        return `
                            <div class="agent-progress-item" id="${itemId}">
                                <div class="agent-progress-icon" style="background: ${agent.color}">
                                    <i class="${agent.icon}"></i>
                                </div>
                                <div class="agent-progress-content">
                                    <div class="agent-progress-name">${agentName} Agent</div>
                                    <div class="agent-progress-task">${agent.task}</div>
                                </div>
                                <div class="agent-status-indicator pending">
                                    <span>•</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        this.addMessage(progressHTML, 'agent', 'Agent Coordinator');

        // Store current agents for this session
        this.currentAgents = activeAgents;

        // Simulate agent progress with v3 style
        this.simulateAgentProgressV3(activeAgents, timestamp, userMessage);
    }

    simulateAgentProgressV3(agents, timestamp, userMessage = '') {
        agents.forEach((agentName, index) => {
            const itemId = `agent-${agentName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;

            // Start working
            setTimeout(() => {
                const item = document.getElementById(itemId);
                if (item) {
                    item.classList.add('working');
                    const indicator = item.querySelector('.agent-status-indicator');
                    if (indicator) {
                        indicator.className = 'agent-status-indicator working';
                        indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    }

                    // Show thought process
                    this.showAgentThoughtProcess(agentName, itemId, index, userMessage);
                }
            }, (index + 1) * 300);

            // Complete work
            setTimeout(() => {
                const item = document.getElementById(itemId);
                if (item) {
                    item.classList.remove('working');
                    item.classList.add('completed');
                    const indicator = item.querySelector('.agent-status-indicator');
                    if (indicator) {
                        indicator.className = 'agent-status-indicator completed';
                        indicator.innerHTML = '<i class="fas fa-check"></i>';
                    }

                    const taskDiv = item.querySelector('.agent-progress-task');
                    if (taskDiv) {
                        taskDiv.textContent = 'Analysis completed successfully';
                    }
                }
            }, (index + 1) * 500 + 1000);
        });

        // Check if all agents are complete and update header
        const maxCompletionTime = (agents.length) * 500 + 1500; // A bit after the last agent completes
        setTimeout(() => {
            this.updateProgressHeaderOnCompletion(timestamp, agents.length);
        }, maxCompletionTime);
    }

    showAgentThoughtProcess(agentName, itemId, index, userMessage = '') {
        const baseThoughtProcesses = {
            'Deep Research': [
                'Initializing comprehensive market analysis engine...',
                'Scanning industry trends and market data across 50+ sources...',
                'Analyzing competitor strategies and positioning matrices...',
                'Identifying emerging consumer behaviors and sentiment shifts...',
                'Cross-referencing with historical performance data patterns...',
                'Processing macro and micro economic indicators...',
                'Evaluating regulatory and compliance considerations...',
                'Synthesizing market opportunities and threats...',
                'Validating insights against predictive models...',
                'Generating actionable intelligence recommendations...'
            ],
            'Creative': [
                'Activating creative intelligence framework...',
                'Evaluating brand voice and visual identity guidelines...',
                'Analyzing successful creative patterns in the industry...',
                'Processing color psychology and visual hierarchy principles...',
                'Generating concept variations based on target audience personas...',
                'Testing copy variations against engagement patterns...',
                'Optimizing creative assets for platform-specific requirements...',
                'Applying neuromarketing principles to design decisions...',
                'Running creative performance prediction models...',
                'Finalizing multi-variant creative recommendations...'
            ],
            'Journey': [
                'Initializing customer journey mapping algorithms...',
                'Mapping customer touchpoint interactions across channels...',
                'Analyzing conversion funnel bottlenecks and drop-off points...',
                'Identifying optimal timing for message delivery windows...',
                'Processing behavioral triggers and decision catalysts...',
                'Sequencing touchpoints for maximum engagement impact...',
                'Designing personalization triggers and decision points...',
                'Modeling journey abandonment and recovery scenarios...',
                'Optimizing cross-channel message orchestration...',
                'Validating journey effectiveness with predictive analytics...'
            ],
            'Performance': [
                'Booting advanced analytics processing engine...',
                'Processing campaign performance metrics and KPIs...',
                'Identifying statistical significance in A/B tests...',
                'Correlating external factors with performance changes...',
                'Calculating incremental lift and attribution models...',
                'Running multitouch attribution analysis...',
                'Processing cohort analysis and lifetime value calculations...',
                'Identifying optimization opportunities with confidence intervals...',
                'Modeling performance scenarios and projections...',
                'Generating data-driven optimization recommendations...'
            ],
            'Audience': [
                'Activating audience intelligence and segmentation engine...',
                'Segmenting customer base by behavioral patterns and preferences...',
                'Analyzing purchase intent signals and lifecycle stages...',
                'Building lookalike models from high-value customers...',
                'Processing demographic and psychographic data points...',
                'Identifying cross-sell and upsell opportunities...',
                'Analyzing customer journey stage progressions...',
                'Modeling audience expansion and acquisition potential...',
                'Optimizing audience targeting for maximum relevance...',
                'Validating segments with predictive lifetime value models...'
            ],
            'Paid Media': [
                'Initializing media optimization and budget allocation engine...',
                'Evaluating channel performance and saturation points...',
                'Analyzing bid landscape and competition density patterns...',
                'Processing cost-per-acquisition trends across platforms...',
                'Calculating optimal budget allocation across channels...',
                'Identifying scaling opportunities and efficiency gains...',
                'Modeling incremental reach and frequency optimization...',
                'Analyzing creative fatigue and refresh requirements...',
                'Processing audience overlap and cannibalization risks...',
                'Generating strategic media mix recommendations...'
            ],
            'Historical': [
                'Accessing historical campaign database and learnings repository...',
                'Reviewing past campaign learnings and performance patterns...',
                'Identifying seasonal trends and cyclical behaviors...',
                'Analyzing what worked and what didn\'t in similar campaigns...',
                'Processing success factors and failure indicators...',
                'Extracting key success factors from historical data...',
                'Correlating past strategies with current market conditions...',
                'Identifying repeatable patterns and scalable tactics...',
                'Applying proven strategies to current context...',
                'Validating recommendations against historical benchmarks...'
            ],
            'AI Decisioning': [
                'Initializing multi-agent decision synthesis framework...',
                'Processing multi-variate optimization scenarios...',
                'Running predictive models on campaign outcomes...',
                'Balancing competing objectives and resource constraints...',
                'Calculating risk-adjusted ROI projections and scenarios...',
                'Synthesizing recommendations from all specialist agents...',
                'Resolving conflicts between agent recommendations...',
                'Optimizing for multiple success metrics simultaneously...',
                'Generating confidence scores for strategic decisions...',
                'Finalizing integrated strategic action plan...'
            ]
        };

        // Get context-specific thoughts based on user message
        const contextualThoughts = this.getContextualThoughts(agentName, userMessage);

        // Combine base thoughts with contextual ones
        const thoughts = contextualThoughts.length > 0
            ? [...baseThoughtProcesses[agentName].slice(0, 6), ...contextualThoughts, ...baseThoughtProcesses[agentName].slice(-2)]
            : baseThoughtProcesses[agentName] || [
                'Analyzing data patterns and trends...',
                'Processing contextual information and requirements...',
                'Generating strategic recommendations...',
                'Validating approach against best practices...',
                'Preparing detailed analysis and outputs...'
            ];

        thoughts.forEach((thought, thoughtIndex) => {
            setTimeout(() => {
                const item = document.getElementById(itemId);
                if (item) {
                    const taskDiv = item.querySelector('.agent-progress-task');
                    if (taskDiv) {
                        // Create shorter status messages for better display
                        const shortStatus = this.getShortStatusMessage(thought, thoughtIndex);
                        taskDiv.innerHTML = `<i class="fas fa-brain" style="margin-right: 6px; color: var(--accent-purple);"></i>${shortStatus}`;
                    }
                }

                // Update agent status with current thinking process instead of chat spam
                this.updateAgentStatusWithThought(agentName, thought, thoughtIndex);
            }, (thoughtIndex * 350) + 200);
        });

        // Show final reasoning summary after all thoughts
        setTimeout(() => {
            this.showAgentReasoningSummary(agentName, itemId, userMessage);
        }, (thoughts.length * 350) + 500);
    }

    getContextualThoughts(agentName, userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const contextualThoughts = {
            'Deep Research': {
                'holiday': ['Analyzing seasonal shopping patterns and holiday consumer behavior...', 'Processing Black Friday and holiday promotion historical data...'],
                'competitor': ['Deep-diving into competitor pricing strategies and market positioning...', 'Analyzing competitor campaign timings and promotional patterns...'],
                'gen z': ['Researching Gen Z social media consumption and platform preferences...', 'Analyzing Gen Z purchasing behaviors and brand loyalty patterns...'],
                'b2b': ['Processing B2B buyer journey research and decision-making frameworks...', 'Analyzing enterprise sales cycles and stakeholder influence patterns...'],
                'email': ['Researching email deliverability trends and engagement patterns...', 'Analyzing email design trends and subject line performance data...'],
                'social': ['Processing social media algorithm changes and content performance trends...', 'Analyzing influencer marketing effectiveness and engagement metrics...']
            },
            'Creative': {
                'holiday': ['Generating festive color palettes and seasonal design themes...', 'Creating holiday-specific copy variations and emotional triggers...'],
                'instagram': ['Optimizing for Instagram feed algorithms and story engagement...', 'Creating platform-specific visual formats and aspect ratios...'],
                'video': ['Developing video script frameworks and engagement hooks...', 'Optimizing for short-form video platforms and attention spans...'],
                'tiktok': ['Adapting creative concepts for TikTok\'s unique content style...', 'Generating trending hashtag strategies and viral content patterns...'],
                'email': ['Designing email templates with mobile-first responsive layouts...', 'Creating compelling subject lines and preview text combinations...'],
                'ad': ['Generating multiple ad creative variants for A/B testing...', 'Optimizing creative elements for different campaign objectives...']
            },
            'Journey': {
                'welcome': ['Mapping optimal welcome sequence timing and touchpoint frequency...', 'Designing progressive value delivery and engagement escalation...'],
                'cart': ['Analyzing cart abandonment patterns and recovery timing strategies...', 'Creating urgency and incentive sequences for conversion recovery...'],
                'email': ['Sequencing email touchpoints for maximum lifecycle engagement...', 'Optimizing send times and frequency based on user behavior...'],
                'onboarding': ['Designing progressive onboarding steps and milestone celebrations...', 'Creating educational content sequences and feature discovery paths...'],
                'automation': ['Building trigger-based automation rules and decision trees...', 'Optimizing automation timing based on user engagement signals...']
            },
            'Performance': {
                'conversion': ['Analyzing conversion funnel performance and drop-off analysis...', 'Calculating statistical significance and confidence intervals...'],
                'landing': ['Processing landing page heat maps and user behavior analytics...', 'Analyzing page load speeds and mobile optimization metrics...'],
                'roas': ['Calculating return on ad spend across channels and campaigns...', 'Analyzing incremental lift and cannibalization effects...'],
                'budget': ['Modeling budget allocation scenarios and performance projections...', 'Analyzing cost-per-acquisition trends and scaling opportunities...'],
                'test': ['Designing A/B test frameworks and sample size calculations...', 'Processing test results and statistical significance validation...']
            },
            'Audience': {
                'gen z': ['Analyzing Gen Z social behavior patterns and platform preferences...', 'Building Gen Z-specific persona frameworks and messaging strategies...'],
                'millennial': ['Processing millennial purchasing behaviors and lifestyle preferences...', 'Creating millennial-targeted segmentation and engagement strategies...'],
                'segment': ['Building behavioral segmentation models and propensity scores...', 'Analyzing customer lifecycle stages and value-based segments...'],
                'persona': ['Creating detailed buyer personas with psychographic insights...', 'Mapping persona-specific messaging and channel preferences...'],
                'targeting': ['Optimizing audience targeting parameters and lookalike models...', 'Analyzing audience overlap and cannibalization risks...']
            },
            'Paid Media': {
                'google': ['Optimizing Google Ads bidding strategies and keyword targeting...', 'Analyzing Google Shopping campaign performance and product feed optimization...'],
                'meta': ['Processing Meta advertising algorithm updates and targeting options...', 'Optimizing Facebook and Instagram campaign structures and creative rotation...'],
                'budget': ['Calculating optimal budget distribution across platforms and campaigns...', 'Modeling scaling scenarios and efficiency frontier analysis...'],
                'retargeting': ['Building retargeting audience segments and frequency optimization...', 'Creating dynamic retargeting campaigns with personalized messaging...'],
                'linkedin': ['Optimizing LinkedIn B2B targeting and professional audience segments...', 'Analyzing LinkedIn ad format performance and bidding strategies...']
            },
            'Historical': {
                'holiday': ['Reviewing historical holiday campaign performance and seasonal trends...', 'Analyzing past Black Friday and Cyber Monday campaign learnings...'],
                'similar': ['Identifying similar past campaigns and extracting success patterns...', 'Analyzing what messaging and creative elements drove best results...'],
                'seasonal': ['Processing seasonal performance data and cyclical behavior patterns...', 'Identifying optimal timing and promotional strategies from past campaigns...'],
                'benchmark': ['Comparing current performance against historical benchmarks...', 'Analyzing year-over-year growth patterns and performance trends...']
            },
            'AI Decisioning': {
                'optimize': ['Balancing multiple optimization objectives and trade-offs...', 'Processing agent recommendations and resolving strategic conflicts...'],
                'budget': ['Synthesizing budget allocation recommendations from all agents...', 'Optimizing for maximum ROI while maintaining strategic objectives...'],
                'strategy': ['Integrating strategic recommendations into cohesive action plan...', 'Prioritizing initiatives based on impact and resource requirements...'],
                'campaign': ['Orchestrating campaign elements for maximum synergy and effectiveness...', 'Balancing short-term performance with long-term brand building...']
            }
        };

        const agentContexts = contextualThoughts[agentName] || {};
        for (const [keyword, thoughts] of Object.entries(agentContexts)) {
            if (lowerMessage.includes(keyword)) {
                return thoughts;
            }
        }
        return [];
    }

    showAgentReasoningSummary(agentName, itemId, userMessage) {
        const item = document.getElementById(itemId);
        if (!item) return;

        const summaries = {
            'Deep Research': 'Research complete: Comprehensive market analysis generated with actionable insights and competitive intelligence.',
            'Research Agent': 'Research complete: Comprehensive market analysis generated with actionable insights and competitive intelligence.',
            'Creative': 'Creative analysis complete: Multi-variant creative concepts generated with performance predictions and A/B testing framework.',
            'Creative Agent': 'Creative analysis complete: Multi-variant creative concepts generated with performance predictions and A/B testing framework.',
            'Journey': 'Journey mapping complete: Optimized customer touchpoint sequence designed with personalization triggers and timing optimization.',
            'Journey Agent': 'Journey mapping complete: Optimized customer touchpoint sequence designed with personalization triggers and timing optimization.',
            'Performance': 'Performance analysis complete: Statistical models processed with optimization recommendations and confidence intervals.',
            'Performance Agent': 'Performance analysis complete: Statistical models processed with optimization recommendations and confidence intervals.',
            'Audience': 'Audience analysis complete: Behavioral segments identified with targeting strategies and lifetime value projections.',
            'Audience Agent': 'Audience analysis complete: Behavioral segments identified with targeting strategies and lifetime value projections.',
            'Paid Media': 'Media optimization complete: Budget allocation strategy finalized with scaling opportunities and efficiency gains.',
            'Historical': 'Historical analysis complete: Past campaign learnings synthesized with proven strategies adapted for current context.',
            'Historical Agent': 'Historical analysis complete: Past campaign learnings synthesized with proven strategies adapted for current context.',
            'Analytics Agent': 'Analytics processing complete: Data patterns identified with statistical insights and trend projections.',
            'Personalization Agent': 'Personalization complete: Dynamic content strategies designed with behavioral triggers and customer preference mapping.',
            'AI Decisioning': 'Strategic synthesis complete: Multi-agent recommendations integrated into cohesive action plan with risk-adjusted projections.'
        };

        const taskDiv = item.querySelector('.agent-progress-task');
        const completionMessage = summaries[agentName] || 'Analysis completed successfully';

        if (taskDiv) {
            taskDiv.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 6px; color: var(--success-green);"></i>${completionMessage}`;
        }

        // Completion message is shown in the agent status box only

        // Check if all agents are complete and update header
        setTimeout(() => {
            this.checkAndUpdateProgressHeader();
        }, 100);

        // Add reasoning thought process to main agent responses after completion
        setTimeout(() => {
            this.addAgentReasoningToResponse(agentName, userMessage);
        }, 1000);
    }

    addAgentReasoningToResponse(agentName, userMessage) {
        const reasoningInsights = {
            'Deep Research': {
                'holiday': 'My analysis shows holiday shopping behavior peaks 3 days before major holidays, with mobile traffic increasing 65%. Consumer sentiment data indicates emotional triggers outperform rational messaging by 40% during seasonal campaigns.',
                'competitor': 'Competitive analysis reveals 3 key market gaps: pricing strategy opportunities, underserved demographic segments, and timing advantages for promotional campaigns.',
                'default': 'Market research indicates strong growth opportunities in emerging consumer segments, with data supporting a multi-channel approach for maximum reach and engagement.'
            },
            'Creative': {
                'instagram': 'Creative analysis shows Instagram posts with carousel formats achieve 42% higher engagement. Visual hierarchy testing suggests bold typography with 3-color palettes perform optimally.',
                'video': 'Video creative research indicates 6-second hooks capture 73% more attention, with emotional storytelling frameworks outperforming product-focused content by 35%.',
                'default': 'Creative performance modeling suggests multi-variant testing across 3-5 concept directions will optimize campaign effectiveness and reduce creative fatigue.'
            },
            'Journey': {
                'email': 'Journey optimization reveals optimal email sequence timing: welcome at day 0, educational content at day 3, social proof at day 7, with 23% higher conversion rates.',
                'cart': 'Cart abandonment analysis shows 3-touch recovery sequences with urgency messaging achieve 28% recovery rates when triggered within 2 hours of abandonment.',
                'default': 'Customer journey mapping identifies 7 key touchpoints with personalization opportunities that can increase conversion rates by an average of 31%.'
            },
            'Performance': {
                'conversion': 'Performance analysis shows conversion rate optimization opportunities across 4 funnel stages, with landing page improvements projected to increase conversions by 23%.',
                'budget': 'Budget modeling indicates reallocating 20% spend from display to video ads could improve overall ROAS by 15% while maintaining current reach levels.',
                'default': 'Performance data analysis reveals optimization opportunities that could improve campaign efficiency by 18-25% through strategic budget reallocation and targeting refinements.'
            },
            'Audience': {
                'gen z': 'Gen Z audience analysis reveals strong preference for authentic, user-generated content with 67% higher engagement on platforms featuring peer recommendations and social proof.',
                'segment': 'Audience segmentation identifies 4 high-value behavioral segments representing 73% of revenue potential, with personalized messaging increasing relevance scores by 45%.',
                'default': 'Audience analysis reveals untapped segments with 40% higher lifetime value potential and specific messaging preferences that align with our brand positioning.'
            },
            'Paid Media': {
                'google': 'Google Ads analysis shows Smart Bidding optimization could improve CPA by 22% while Shopping campaigns have 35% expansion opportunity in long-tail keywords.',
                'meta': 'Meta advertising analysis indicates creative rotation every 5-7 days reduces ad fatigue, with video ads showing 28% better cost-efficiency than static formats.',
                'default': 'Media analysis suggests optimal budget distribution: 40% search, 35% social, 25% display, with programmatic buys offering 15% efficiency improvements.'
            },
            'Historical': {
                'holiday': 'Historical holiday data shows campaigns launched 2 weeks before major holidays achieve 43% higher ROI, with inventory messaging becoming crucial in final 72 hours.',
                'similar': 'Analysis of similar past campaigns reveals 3 success factors: early audience warming, progressive promotion intensity, and post-campaign retention strategies.',
                'default': 'Historical performance patterns indicate seasonal trends and messaging strategies that have consistently delivered 25-40% above-benchmark results.'
            },
            'AI Decisioning': {
                'strategy': 'Strategic synthesis recommends a phased approach prioritizing high-impact, low-risk initiatives first, with projected 32% improvement in overall marketing efficiency.',
                'optimize': 'Optimization framework balances short-term performance gains with long-term brand building, projecting 28% improvement in customer lifetime value.',
                'default': 'Strategic analysis recommends integrated approach across all channels with predictive modeling showing 35% improvement in campaign effectiveness and ROI.'
            }
        };

        const agentInsights = reasoningInsights[agentName] || {};
        const lowerMessage = userMessage.toLowerCase();

        let insight = agentInsights.default || 'Analysis complete with strategic recommendations and actionable insights.';

        // Find context-specific insight
        for (const [keyword, contextInsight] of Object.entries(agentInsights)) {
            if (keyword !== 'default' && lowerMessage.includes(keyword)) {
                insight = contextInsight;
                break;
            }
        }

        // Add reasoning insight to output area thought process section
        setTimeout(() => {
            this.addThoughtProcessToOutput(agentName, insight, userMessage);
        }, Math.random() * 2000 + 500); // Stagger insights naturally
    }

    addThoughtProcessSection(agentName, insight, userMessage) {
        const thoughtProcessId = `thought-process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const thoughtProcessHTML = `
            <div class="thought-process-container" style="margin: var(--space-sm) 0; border: var(--border); border-radius: var(--radius-md); background: var(--gray-50);">
                <div class="thought-process-header" onclick="app.toggleThoughtProcess('${thoughtProcessId}')" style="padding: var(--space-sm) var(--space-md); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border);">
                    <div style="display: flex; align-items: center; gap: var(--space-xs);">
                        <i class="fas fa-brain" style="color: var(--accent-purple);"></i>
                        <span style="font-weight: 600; color: var(--text-primary); font-size: var(--label);">${agentName} Agent - Thought Process</span>
                    </div>
                    <i class="fas fa-chevron-down thought-process-chevron" id="chevron-${thoughtProcessId}" style="color: var(--text-secondary); font-size: 10px; transition: transform var(--transition-fast); transform: rotate(180deg);"></i>
                </div>
                <div class="thought-process-content" id="${thoughtProcessId}" style="display: block; padding: var(--space-md); background: white; border-radius: 0 0 var(--radius-md) var(--radius-md);">
                    <div class="thought-process-insight" style="margin-bottom: var(--space-sm);">
                        <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: var(--space-xs);">
                            <i class="fas fa-lightbulb" style="color: var(--accent-orange); font-size: 12px;"></i>
                            <span style="font-weight: 600; color: var(--text-primary); font-size: var(--label);">Key Insight</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: var(--label); line-height: var(--lh-base); margin: 0;">${insight}</p>
                    </div>

                    <div class="thought-process-details">
                        <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: var(--space-xs);">
                            <i class="fas fa-cogs" style="color: var(--accent-primary); font-size: 12px;"></i>
                            <span style="font-weight: 600; color: var(--text-primary); font-size: var(--label);">Analysis Framework</span>
                        </div>
                        <div class="analysis-framework" style="color: var(--text-secondary); font-size: var(--label); line-height: var(--lh-base);">
                            ${this.getAnalysisFramework(agentName, userMessage)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addMessage(thoughtProcessHTML, 'agent', `${agentName} Agent`);
    }

    toggleThoughtProcess(thoughtProcessId) {
        const content = document.getElementById(thoughtProcessId);
        const chevron = document.getElementById(`chevron-${thoughtProcessId}`);

        if (content && chevron) {
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                chevron.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }

    getAnalysisFramework(agentName, userMessage) {
        const frameworks = {
            'Deep Research': {
                'holiday': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Seasonal trend analysis across 3-year historical dataset</li>
                        <li>Consumer sentiment tracking during holiday periods</li>
                        <li>Mobile vs desktop shopping behavior patterns</li>
                        <li>Promotional timing optimization based on purchase cycles</li>
                    </ul>
                `,
                'competitor': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Competitive pricing matrix analysis across 15+ competitors</li>
                        <li>Market positioning gap analysis and opportunity mapping</li>
                        <li>Campaign timing correlation with market share changes</li>
                        <li>Brand messaging differentiation assessment</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Multi-source data aggregation and trend identification</li>
                        <li>Consumer behavior analysis and demographic segmentation</li>
                        <li>Market opportunity assessment and growth potential</li>
                        <li>Competitive landscape mapping and positioning analysis</li>
                    </ul>
                `
            },
            'Creative': {
                'instagram': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Instagram algorithm optimization for feed and story placement</li>
                        <li>Visual hierarchy testing with eye-tracking simulation</li>
                        <li>Color psychology analysis for brand alignment</li>
                        <li>Engagement prediction modeling based on creative elements</li>
                    </ul>
                `,
                'video': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Video hook effectiveness analysis for 6-second retention</li>
                        <li>Emotional storytelling framework optimization</li>
                        <li>Platform-specific aspect ratio and duration testing</li>
                        <li>Attention span modeling and engagement prediction</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Multi-variant creative concept development and testing</li>
                        <li>Brand consistency analysis across all creative elements</li>
                        <li>Performance prediction modeling for creative assets</li>
                        <li>A/B testing framework design for optimal learning</li>
                    </ul>
                `
            },
            'Journey': {
                'email': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Email sequence timing optimization based on engagement patterns</li>
                        <li>Progressive value delivery framework design</li>
                        <li>Behavioral trigger identification and automation rules</li>
                        <li>Cross-channel touchpoint orchestration planning</li>
                    </ul>
                `,
                'cart': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Cart abandonment pattern analysis and recovery timing</li>
                        <li>Urgency and incentive sequence optimization</li>
                        <li>Multi-channel recovery touchpoint coordination</li>
                        <li>Conversion probability modeling for abandoned carts</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Customer touchpoint mapping and sequence optimization</li>
                        <li>Behavioral trigger identification and automation design</li>
                        <li>Personalization opportunity assessment and implementation</li>
                        <li>Conversion funnel analysis and optimization planning</li>
                    </ul>
                `
            },
            'Performance': {
                'conversion': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Conversion funnel analysis with statistical significance testing</li>
                        <li>Multi-touch attribution modeling and optimization</li>
                        <li>Landing page performance analysis and improvement recommendations</li>
                        <li>A/B testing framework with confidence interval calculations</li>
                    </ul>
                `,
                'budget': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Budget allocation modeling across channels and campaigns</li>
                        <li>ROI optimization with diminishing returns analysis</li>
                        <li>Cost-per-acquisition trend analysis and forecasting</li>
                        <li>Scaling opportunity identification and risk assessment</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Performance metrics analysis with statistical modeling</li>
                        <li>Optimization opportunity identification and prioritization</li>
                        <li>Campaign efficiency assessment and improvement planning</li>
                        <li>Predictive analytics for performance forecasting</li>
                    </ul>
                `
            },
            'Audience': {
                'gen z': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Gen Z behavioral pattern analysis across social platforms</li>
                        <li>Authenticity preference mapping and content strategy</li>
                        <li>Platform-specific engagement optimization for Gen Z</li>
                        <li>Peer influence and social proof effectiveness modeling</li>
                    </ul>
                `,
                'segment': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Behavioral segmentation modeling with propensity scoring</li>
                        <li>Customer lifecycle stage analysis and progression mapping</li>
                        <li>Value-based segmentation with lifetime value predictions</li>
                        <li>Personalization strategy development for each segment</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Audience segmentation analysis with behavioral insights</li>
                        <li>Targeting optimization and lookalike model development</li>
                        <li>Customer lifetime value prediction and segment prioritization</li>
                        <li>Personalization strategy framework for audience engagement</li>
                    </ul>
                `
            },
            'Paid Media': {
                'google': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Google Ads bidding strategy optimization and Smart Bidding analysis</li>
                        <li>Keyword expansion and long-tail opportunity identification</li>
                        <li>Shopping campaign feed optimization and product visibility</li>
                        <li>Quality Score improvement and cost-per-click optimization</li>
                    </ul>
                `,
                'meta': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Meta advertising algorithm adaptation and targeting optimization</li>
                        <li>Creative rotation strategy to prevent ad fatigue</li>
                        <li>Audience overlap analysis and campaign structure optimization</li>
                        <li>Video vs static ad performance analysis and budget allocation</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Cross-channel budget optimization and efficiency analysis</li>
                        <li>Media mix modeling for maximum reach and conversion</li>
                        <li>Scaling opportunity identification and risk assessment</li>
                        <li>Performance forecasting and budget allocation recommendations</li>
                    </ul>
                `
            },
            'Historical': {
                'holiday': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>3-year holiday campaign performance trend analysis</li>
                        <li>Seasonal timing optimization based on historical conversion data</li>
                        <li>Holiday promotion strategy effectiveness assessment</li>
                        <li>Year-over-year growth pattern identification and forecasting</li>
                    </ul>
                `,
                'similar': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Similar campaign pattern recognition and success factor extraction</li>
                        <li>Creative and messaging element performance correlation analysis</li>
                        <li>Timing and audience strategy effectiveness assessment</li>
                        <li>Scalability factor identification from historical successes</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Historical performance pattern analysis and trend identification</li>
                        <li>Success factor extraction and strategy adaptation</li>
                        <li>Seasonal and cyclical behavior pattern recognition</li>
                        <li>Benchmark comparison and performance forecasting</li>
                    </ul>
                `
            },
            'AI Decisioning': {
                'strategy': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Multi-objective optimization with trade-off analysis</li>
                        <li>Strategic initiative prioritization based on impact and feasibility</li>
                        <li>Resource allocation optimization across competing priorities</li>
                        <li>Risk-adjusted ROI projections with confidence intervals</li>
                    </ul>
                `,
                'optimize': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Multi-agent recommendation synthesis and conflict resolution</li>
                        <li>Optimization objective balancing and performance trade-offs</li>
                        <li>Implementation feasibility assessment and timeline planning</li>
                        <li>Success metrics definition and monitoring framework design</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Strategic decision synthesis from multiple specialist agents</li>
                        <li>Integrated action plan development with priority sequencing</li>
                        <li>Risk assessment and mitigation strategy planning</li>
                        <li>Performance forecasting and success probability modeling</li>
                    </ul>
                `
            },
            'Strategy Coordinator': {
                'optimize': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Integration of previous analysis with new requirements</li>
                        <li>Strategic alignment assessment across all campaign elements</li>
                        <li>Implementation feasibility and resource optimization</li>
                        <li>Performance impact modeling for proposed enhancements</li>
                    </ul>
                `,
                'budget': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Budget reallocation impact analysis on existing campaigns</li>
                        <li>ROI optimization across enhanced and existing strategies</li>
                        <li>Risk assessment for budget changes and scaling decisions</li>
                        <li>Performance forecasting with enhanced budget allocation</li>
                    </ul>
                `,
                'default': `
                    <ul style="margin: 0; padding-left: var(--space-md);">
                        <li>Strategic enhancement integration with existing analysis</li>
                        <li>Cross-functional impact assessment and optimization</li>
                        <li>Implementation priority sequencing and resource planning</li>
                        <li>Synergy identification and multiplicative value creation</li>
                    </ul>
                `
            }
        };

        const agentFrameworks = frameworks[agentName] || frameworks['Deep Research'];
        const lowerMessage = userMessage.toLowerCase();

        // Find context-specific framework
        for (const [keyword, framework] of Object.entries(agentFrameworks)) {
            if (keyword !== 'default' && lowerMessage.includes(keyword)) {
                return framework;
            }
        }

        return agentFrameworks.default || agentFrameworks['default'];
    }

    addThoughtProcessToOutput(agentName, insight, userMessage) {
        // Store the thought process data for the output area
        if (!this.currentThoughtProcesses) {
            this.currentThoughtProcesses = [];
        }

        this.currentThoughtProcesses.push({
            agentName,
            insight,
            userMessage,
            framework: this.getAnalysisFramework(agentName, userMessage)
        });

        // Update the output area with thought processes
        this.updateOutputThoughtProcesses();
    }

    updateOutputThoughtProcesses() {
        const outputContent = document.getElementById('output-content');
        if (!outputContent || !this.currentThoughtProcesses || this.currentThoughtProcesses.length === 0) {
            return;
        }

        // Check if thought processes section already exists
        let thoughtProcessSection = outputContent.querySelector('.output-thought-processes');

        if (!thoughtProcessSection) {
            // Create the thought processes section
            thoughtProcessSection = document.createElement('div');
            thoughtProcessSection.className = 'output-thought-processes';
            thoughtProcessSection.style.cssText = `
                margin-top: var(--space-xl);
                padding-top: var(--space-xl);
                border-top: var(--border);
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--space-lg);
                font-weight: 600;
                color: var(--text-primary);
                font-size: var(--h3);
            `;
            header.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--space-xs);">
                    <i class="fas fa-brain" style="color: var(--accent-purple);"></i>
                    <span>Agent Thought Processes</span>
                </div>
                <button id="toggle-all-thought-processes" onclick="app.toggleAllThoughtProcesses()" style="
                    display: flex;
                    align-items: center;
                    gap: var(--space-xs);
                    padding: var(--space-xs) var(--space-sm);
                    background: var(--card-bg);
                    border: var(--border);
                    border-radius: var(--radius-sm);
                    color: var(--text-secondary);
                    font-size: var(--label);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    font-family: inherit;
                ">
                    <i class="fas fa-compress-alt" id="toggle-all-icon"></i>
                    <span id="toggle-all-text">Collapse All</span>
                </button>
            `;

            thoughtProcessSection.appendChild(header);
            outputContent.appendChild(thoughtProcessSection);
        }

        // Add or update thought processes
        this.currentThoughtProcesses.forEach((process, index) => {
            const existingProcess = thoughtProcessSection.querySelector(`[data-agent="${process.agentName}"]`);

            if (!existingProcess) {
                const thoughtProcessId = `output-thought-process-${Date.now()}-${index}`;

                const processElement = document.createElement('div');
                processElement.setAttribute('data-agent', process.agentName);
                processElement.style.cssText = `
                    margin-bottom: var(--space-md);
                    border: var(--border);
                    border-radius: var(--radius-md);
                    background: var(--gray-50);
                `;

                processElement.innerHTML = `
                    <div class="thought-process-header" onclick="app.toggleOutputThoughtProcess('${thoughtProcessId}')" style="padding: var(--space-sm) var(--space-md); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border);">
                        <div style="display: flex; align-items: center; gap: var(--space-xs);">
                            <i class="fas fa-brain" style="color: var(--accent-purple); font-size: 14px;"></i>
                            <span style="font-weight: 600; color: var(--text-primary); font-size: var(--font-base);">${process.agentName} Agent</span>
                        </div>
                        <i class="fas fa-chevron-down thought-process-chevron" id="chevron-${thoughtProcessId}" style="color: var(--text-secondary); font-size: 10px; transition: transform var(--transition-fast); transform: rotate(180deg);"></i>
                    </div>
                    <div class="thought-process-content" id="${thoughtProcessId}" style="display: block; padding: var(--space-lg); background: white; border-radius: 0 0 var(--radius-md) var(--radius-md);">
                        <div class="thought-process-insight" style="margin-bottom: var(--space-lg);">
                            <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: var(--space-sm);">
                                <i class="fas fa-lightbulb" style="color: var(--accent-orange); font-size: 14px;"></i>
                                <span style="font-weight: 600; color: var(--text-primary); font-size: var(--font-base);">Key Insight</span>
                            </div>
                            <p style="color: var(--text-secondary); font-size: var(--font-base); line-height: var(--lh-base); margin: 0;">${process.insight}</p>
                        </div>

                        <div class="thought-process-details">
                            <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: var(--space-sm);">
                                <i class="fas fa-cogs" style="color: var(--accent-primary); font-size: 14px;"></i>
                                <span style="font-weight: 600; color: var(--text-primary); font-size: var(--font-base);">Analysis Framework</span>
                            </div>
                            <div class="analysis-framework" style="color: var(--text-secondary); font-size: var(--font-base); line-height: var(--lh-base);">
                                ${process.framework}
                            </div>
                        </div>
                    </div>
                `;

                thoughtProcessSection.appendChild(processElement);
            }
        });
    }

    toggleOutputThoughtProcess(thoughtProcessId) {
        const content = document.getElementById(thoughtProcessId);
        const chevron = document.getElementById(`chevron-${thoughtProcessId}`);

        if (content && chevron) {
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                chevron.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }

    toggleAllThoughtProcesses() {
        const thoughtProcessSection = document.querySelector('.output-thought-processes');
        if (!thoughtProcessSection) return;

        const toggleButton = document.getElementById('toggle-all-thought-processes');
        const toggleIcon = document.getElementById('toggle-all-icon');
        const toggleText = document.getElementById('toggle-all-text');

        if (!toggleButton || !toggleIcon || !toggleText) return;

        // Get all thought process content divs
        const allContents = thoughtProcessSection.querySelectorAll('.thought-process-content');
        const allChevrons = thoughtProcessSection.querySelectorAll('.thought-process-chevron');

        if (allContents.length === 0) return;

        // Check current state based on first item
        // Since we auto-expand by default, check if display is not 'none'
        const isCurrentlyExpanded = allContents[0].style.display !== 'none';

        // Toggle all items
        allContents.forEach(content => {
            content.style.display = isCurrentlyExpanded ? 'none' : 'block';
        });

        allChevrons.forEach(chevron => {
            chevron.style.transform = isCurrentlyExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });

        // Update button text and icon
        if (isCurrentlyExpanded) {
            toggleIcon.className = 'fas fa-expand-alt';
            toggleText.textContent = 'Expand All';
        } else {
            toggleIcon.className = 'fas fa-compress-alt';
            toggleText.textContent = 'Collapse All';
        }
    }

    generateResponse(message, messageType) {
        const lowerMessage = message.toLowerCase();

        // Check if this is a task-specific request
        if (this.currentTask && this.currentTaskAgents) {
            console.log('Generating task-specific response for:', this.currentTask, 'with agents:', this.currentTaskAgents);
            const response = this.generateTaskSpecificResponse(this.currentTask, message);
            this.addMessage(response.content, 'agent', response.agent);

            // Add follow-up suggestions for the specific task
            setTimeout(() => {
                this.addTaskSpecificSuggestions(this.currentTask);
            }, 1000);
            return;
        }

        // Generate more specific responses based on actual content
        const responses = {
            brief: {
                agent: 'Campaign Strategist',
                content: this.generateBriefResponse(lowerMessage)
            },
            creative: {
                agent: 'Creative Director',
                content: this.generateCreativeResponse(lowerMessage)
            },
            journey: {
                agent: 'Journey Architect',
                content: this.generateJourneyResponse(lowerMessage)
            },
            performance: {
                agent: 'Performance Analyst',
                content: this.generatePerformanceResponse(lowerMessage)
            },
            audience: {
                agent: 'Audience Specialist',
                content: this.generateAudienceResponse(lowerMessage)
            },
            'paid-media': {
                agent: 'Media Optimizer',
                content: this.generatePaidMediaResponse(lowerMessage)
            },
            general: {
                agent: 'SuperAgent',
                content: `I'm ready to help with your marketing needs. I can assist with campaign strategy, creative generation, performance optimization, audience targeting, and more. What would you like to focus on?`
            }
        };

        const response = responses[messageType] || responses.general;
        this.addMessage(response.content, 'agent', response.agent);

        // Add follow-up suggestions
        setTimeout(() => {
            this.addFollowUpSuggestions(messageType);
        }, 1000);
    }

    updateOutputPanel(messageType, userMessage = '') {
        console.log('updateOutputPanel called with:', messageType, 'currentTask:', this.currentTask, 'currentTaskAgents:', this.currentTaskAgents);
        const outputTitle = document.getElementById('output-title');
        const outputContent = document.getElementById('output-content');
        const workspaceTitle = document.getElementById('workspace-title');
        const currentTask = document.getElementById('current-task');
        const lastUpdated = document.getElementById('last-updated');
        const agentsUsed = document.getElementById('agents-used');

        if (!outputContent) return;

        const titles = {
            brief: 'Campaign Brief & Strategy',
            creative: 'Creative Assets & Concepts',
            journey: 'Customer Journey Map',
            performance: 'Performance Analysis',
            audience: 'Audience Insights',
            'paid-media': 'Media Plan & Budget',
            general: 'Creative Strategy & Output'
        };

        const taskNames = {
            brief: 'Campaign Strategy',
            creative: 'Creative Generation',
            journey: 'Journey Design',
            performance: 'Performance Analysis',
            audience: 'Audience Targeting',
            'paid-media': 'Media Planning',
            general: 'Marketing Task'
        };

        // Update various title elements - ensure we always have an AI suite title
        if (outputTitle) {
            // If no current suite title is set, determine one from message type
            if (!this.currentSuiteTitle || this.currentSuiteTitle === 'Task Output') {
                this.currentSuiteTitle = this.getAISuiteFromMessageType(messageType);
            }
            outputTitle.textContent = this.currentSuiteTitle;
        }
        if (workspaceTitle) {
            workspaceTitle.textContent = titles[messageType] || titles.general;
        }
        if (currentTask) {
            currentTask.textContent = taskNames[messageType] || taskNames.general;
        }
        if (lastUpdated) {
            lastUpdated.textContent = 'Just now';
        }
        if (agentsUsed) {
            const agentCounts = this.getActiveAgentCount(messageType);
            agentsUsed.textContent = `${agentCounts} agents`;
        }

        // Generate comprehensive collective output
        const content = this.generateCollectiveAgentOutput(messageType, userMessage);

        // Add export button to the output content
        outputContent.innerHTML = content;

        // Add Export and Share buttons to output header
        this.addOutputActionButtons();

        // Save to output history
        const displayTitle = this.currentSuiteTitle || titles[messageType] || titles.general;
        this.saveToHistory(messageType, displayTitle, content);
    }

    getActiveAgentCount(messageType) {
        // Return dynamic agent count based on message type and complexity
        const agentCounts = {
            brief: 4,
            creative: 3,
            journey: 4,
            performance: 3,
            audience: 3,
            'paid-media': 4,
            general: 2
        };
        return agentCounts[messageType] || agentCounts.general;
    }

    generateCollectiveAgentOutput(messageType, userMessage = '') {
        // Extract key elements from user message for context
        const context = this.extractContextFromMessage(userMessage);

        // Check if this is a task-specific request
        if (this.currentTask && this.currentTaskAgents) {
            console.log('Generating task-specific output for task:', this.currentTask);
            return this.generateTaskSpecificOutput(this.currentTask, context, userMessage);
        }

        // For journey type, show visual journey flow
        if (messageType === 'journey') {
            console.log('Journey messageType detected, generating journey flow output');
            return this.generateJourneyFlowOutput(context, userMessage);
        }

        // Generate agent-specific insights
        const insights = this.generateAgentInsights(messageType, context);

        // Create comprehensive output structure
        return `
            <div class="collective-output">
                ${this.generateExecutiveSummary(messageType, context)}
                ${this.generateDetailedInsights(insights, messageType)}
                ${this.generateRecommendations(messageType, context)}
                ${this.generateNextSteps(messageType, context)}
            </div>
        `;
    }

    extractContextFromMessage(message) {
        const lowerMessage = message.toLowerCase();
        const context = {
            platform: [],
            objective: '',
            audience: '',
            budget: '',
            timeline: '',
            industry: '',
            keywords: []
        };

        // Extract platforms
        const platforms = ['google', 'meta', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'twitter', 'snapchat'];
        platforms.forEach(platform => {
            if (lowerMessage.includes(platform)) {
                context.platform.push(platform.charAt(0).toUpperCase() + platform.slice(1));
            }
        });

        // Extract objectives
        if (lowerMessage.includes('awareness') || lowerMessage.includes('brand')) context.objective = 'Brand Awareness';
        else if (lowerMessage.includes('conversion') || lowerMessage.includes('sales')) context.objective = 'Conversions';
        else if (lowerMessage.includes('traffic') || lowerMessage.includes('visits')) context.objective = 'Traffic';
        else if (lowerMessage.includes('leads') || lowerMessage.includes('lead generation')) context.objective = 'Lead Generation';
        else if (lowerMessage.includes('engagement')) context.objective = 'Engagement';

        // Extract audience
        if (lowerMessage.includes('millennials')) context.audience = 'Millennials (25-40)';
        else if (lowerMessage.includes('gen z')) context.audience = 'Gen Z (18-28)';
        else if (lowerMessage.includes('gen x')) context.audience = 'Gen X (35-50)';
        else if (lowerMessage.includes('b2b') || lowerMessage.includes('business')) context.audience = 'B2B Decision Makers';

        // Extract budget indicators
        if (lowerMessage.match(/\$[\d,]+k/)) context.budget = lowerMessage.match(/\$[\d,]+k/)[0];
        else if (lowerMessage.includes('budget')) context.budget = 'Budget optimization';

        return context;
    }

    generateTaskSpecificOutput(task, context, userMessage) {
        console.log('generateTaskSpecificOutput called for task:', task);
        const taskOutputGenerators = {
            'campaign-brief': () => this.generateCampaignBriefOutput(context, userMessage),
            'optimize-campaign': () => this.generateOptimizationOutput(context, userMessage),
            'campaign-insights': () => this.generateInsightsOutput(context, userMessage),
            'setup-journey': () => this.generateJourneySetupOutput(context, userMessage),
            'generate-creative': () => this.generateCreativeOutput(context, userMessage),
            'audience-segments': () => this.generateAudienceSegmentsOutput(context, userMessage),
            'budget-allocation': () => this.generateBudgetAllocationOutput(context, userMessage),
            'ab-test': () => this.generateABTestOutput(context, userMessage),
            'competitor-analysis': () => this.generateCompetitorAnalysisOutput(context, userMessage),
            'content-calendar': () => this.generateContentCalendarOutput(context, userMessage)
        };

        const generator = taskOutputGenerators[task];
        return generator ? generator() : this.generateDefaultTaskOutput(task, context, userMessage);
    }

    generateCampaignBriefOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-rocket" style="color: var(--accent-primary);"></i> Campaign Brief & Strategy</h2>
                        <p class="output-subtitle">Comprehensive campaign strategy developed by our specialist agents</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">3.2x</div>
                            <div class="stat-label">Projected ROI</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">25%</div>
                            <div class="stat-label">Awareness Lift</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">1,000+</div>
                            <div class="stat-label">Qualified Leads</div>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-search"></i></div>
                            <h4>Research Agent Analysis</h4>
                        </div>
                        <div class="analysis-content">
                            <div class="insight-highlight">
                                <i class="fas fa-lightbulb"></i>
                                <span>Market Opportunity Identified</span>
                            </div>
                            <p>Comprehensive market analysis reveals strong potential with ${context.audience || 'target demographic'} showing ${context.engagement || '34% higher engagement'} during ${context.timeframe || 'Q4 2024'}.</p>
                            <div class="key-metrics">
                                <div class="metric-item">
                                    <span class="metric-value">+18%</span>
                                    <span class="metric-desc">Market growth YoY</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-value">67%</span>
                                    <span class="metric-desc">Competitive advantage</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-users"></i></div>
                            <h4>Audience Agent Insights</h4>
                        </div>
                        <div class="analysis-content">
                            <div class="audience-breakdown">
                                <h5>Primary Audience Segments</h5>
                                <div class="segment-bars">
                                    <div class="segment-bar">
                                        <div class="segment-info">
                                            <span class="segment-name">${context.demographic || 'Millennials (25-34)'}</span>
                                            <span class="segment-percentage">42%</span>
                                        </div>
                                        <div class="segment-progress">
                                            <div class="segment-fill" style="width: 42%; background: var(--accent-green);"></div>
                                        </div>
                                    </div>
                                    <div class="segment-bar">
                                        <div class="segment-info">
                                            <span class="segment-name">Gen Z (18-28)</span>
                                            <span class="segment-percentage">35%</span>
                                        </div>
                                        <div class="segment-progress">
                                            <div class="segment-fill" style="width: 35%; background: var(--accent-primary);"></div>
                                        </div>
                                    </div>
                                    <div class="segment-bar">
                                        <div class="segment-info">
                                            <span class="segment-name">Gen X (35-50)</span>
                                            <span class="segment-percentage">23%</span>
                                        </div>
                                        <div class="segment-progress">
                                            <div class="segment-fill" style="width: 23%; background: var(--accent-orange);"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="platform-preferences">
                                <h5>Platform Engagement</h5>
                                <div class="platform-chips">
                                    <span class="platform-chip high">Instagram <span class="engagement">89%</span></span>
                                    <span class="platform-chip high">TikTok <span class="engagement">76%</span></span>
                                    <span class="platform-chip medium">YouTube <span class="engagement">64%</span></span>
                                    <span class="platform-chip medium">Facebook <span class="engagement">52%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Performance Agent Projections</h4>
                        </div>
                        <div class="analysis-content">
                            <div class="performance-forecast">
                                <h5>Campaign Performance Forecast</h5>
                                <div class="forecast-grid">
                                    <div class="forecast-item">
                                        <div class="forecast-icon awareness"><i class="fas fa-eye"></i></div>
                                        <div class="forecast-details">
                                            <span class="forecast-metric">Brand Awareness</span>
                                            <span class="forecast-value">+25% lift</span>
                                            <div class="forecast-bar">
                                                <div class="forecast-progress" style="width: 75%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="forecast-item">
                                        <div class="forecast-icon conversions"><i class="fas fa-shopping-cart"></i></div>
                                        <div class="forecast-details">
                                            <span class="forecast-metric">Conversion Rate</span>
                                            <span class="forecast-value">${context.goal || '15% improvement'}</span>
                                            <div class="forecast-bar">
                                                <div class="forecast-progress" style="width: 60%; background: linear-gradient(90deg, var(--accent-green), #059669);"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="forecast-item">
                                        <div class="forecast-icon roi"><i class="fas fa-dollar-sign"></i></div>
                                        <div class="forecast-details">
                                            <span class="forecast-metric">ROI Potential</span>
                                            <span class="forecast-value">${context.roi || '3.2x return'}</span>
                                            <div class="forecast-bar">
                                                <div class="forecast-progress" style="width: 85%; background: linear-gradient(90deg, var(--accent-orange), #d97706);"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="strategic-recommendations">
                    <h3><i class="fas fa-compass" style="color: var(--accent-purple);"></i> Strategic Recommendations</h3>
                    <div class="recommendations-grid">
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Multi-Platform Creative Strategy</h5>
                            <p>Develop platform-specific creative assets with ${context.creative_focus || 'video-first approach'} for maximum engagement across Instagram and TikTok.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Audience Segmentation</h5>
                            <p>Implement advanced audience segmentation to deliver personalized messaging based on platform behavior and engagement patterns.</p>
                        </div>
                        <div class="recommendation-card priority-low">
                            <div class="rec-priority">Low Priority</div>
                            <h5>Budget Optimization</h5>
                            <p>Allocate ${context.budget_split || '60% to high-performing platforms'} with 20% reserved for testing and optimization.</p>
                        </div>
                    </div>
                </div>

                <div class="timeline-section">
                    <h3><i class="fas fa-calendar-alt" style="color: var(--accent-green);"></i> Implementation Timeline</h3>
                    <div class="timeline-track">
                        <div class="timeline-item active">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 1-2: Campaign Setup</h5>
                                <p>Creative development, audience configuration, and platform setup</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 3-4: Launch & Optimization</h5>
                                <p>Campaign launch with daily monitoring and initial optimizations</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 5-8: Scale & Iterate</h5>
                                <p>Performance analysis, budget scaling, and creative iteration</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="knowledge-base-section">
                    <h3><i class="fas fa-database" style="color: var(--accent-primary);"></i> Knowledge Sources Used</h3>
                    <div class="knowledge-sources">
                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon brand"><i class="fas fa-palette"></i></div>
                                <div class="source-info">
                                    <h4>Brand Voice Guidelines</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Brand tone, messaging framework, and visual identity standards for consistent creative output.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>12</strong> documents</div>
                                <div class="source-metric"><strong>Updated:</strong> 2 days ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon customer"><i class="fas fa-users"></i></div>
                                <div class="source-info">
                                    <h4>Customer Research Data</h4>
                                    <div class="source-status synced">Synced</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Audience insights, behavioral patterns, and preference data to optimize creative resonance.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>8</strong> segments</div>
                                <div class="source-metric"><strong>Updated:</strong> 1 week ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon performance"><i class="fas fa-chart-bar"></i></div>
                                <div class="source-info">
                                    <h4>Performance Benchmarks</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Historical campaign performance data and industry benchmarks for creative optimization.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>24</strong> campaigns</div>
                                <div class="source-metric"><strong>Updated:</strong> 3 days ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon compliance"><i class="fas fa-shield-alt"></i></div>
                                <div class="source-info">
                                    <h4>Compliance Guidelines</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Legal requirements, platform policies, and industry regulations for compliant creative content.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>6</strong> policies</div>
                                <div class="source-metric"><strong>Updated:</strong> 1 week ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateOptimizationOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-chart-line" style="color: var(--accent-primary);"></i> Campaign Optimization Report</h2>
                        <p class="output-subtitle">AI-driven performance analysis and strategic recommendations</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">+32%</div>
                            <div class="stat-label">Potential Uplift</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">$12.5K</div>
                            <div class="stat-label">Est. Monthly Savings</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">85%</div>
                            <div class="stat-label">Confidence Score</div>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Performance Analysis</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Performance gaps identified across 3 key areas requiring immediate attention</span>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value" style="color: var(--accent-orange);">${context.ctr || '2.4%'}</span>
                                <span class="metric-desc">Current CTR</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value" style="color: var(--accent-red);">$${context.cpa || '4.20'}</span>
                                <span class="metric-desc">Cost per Acquisition</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value" style="color: var(--accent-orange);">${context.cvr || '1.8%'}</span>
                                <span class="metric-desc">Conversion Rate</span>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-pie"></i></div>
                            <h4>Analytics Agent Insights</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-clock"></i>
                            <span>Peak engagement windows identified with 60% higher conversion rates</span>
                        </div>
                        <div class="platform-preferences">
                            <h5>Audience Behavior Analysis</h5>
                            <div class="platform-chips">
                                <div class="platform-chip high">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>Mobile: ${context.mobile_traffic || '73%'}</span>
                                    <div class="engagement">High Conversion</div>
                                </div>
                                <div class="platform-chip medium">
                                    <i class="fas fa-clock"></i>
                                    <span>Peak: ${context.optimal_times || '6-8 PM weekdays'}</span>
                                    <div class="engagement">Best Times</div>
                                </div>
                                <div class="platform-chip high">
                                    <i class="fas fa-calendar-week"></i>
                                    <span>Days: ${context.peak_days || 'Tue-Thu'}</span>
                                    <div class="engagement">Peak Days</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-history"></i></div>
                            <h4>Historical Agent Insights</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-trending-up"></i>
                            <span>Similar campaigns achieved ${context.historical_lift || '40% performance lift'} with strategic optimizations</span>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value">40%</span>
                                <span class="metric-desc">Historical Lift</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">85%</span>
                                <span class="metric-desc">Success Rate</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">3.2x</span>
                                <span class="metric-desc">ROI Improvement</span>
                            </div>
                        </div>
                        <div class="historical-learnings">
                            <h5>Key Learnings from Similar Campaigns</h5>
                            <ul>
                                <li><strong>Creative Refresh Impact:</strong> ${context.top_creative || 'Video carousel format'} outperformed static by 65%</li>
                                <li><strong>Budget Reallocation:</strong> Shifting to ${context.recommended_channels || 'high-performing channels'} improved ROAS</li>
                                <li><strong>Testing Opportunities:</strong> ${context.test_element || 'Headline variations'} showed significant impact on CTR</li>
                                <li><strong>Seasonal Patterns:</strong> Q4 campaigns benefit from 30% budget increase in winning segments</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="strategic-recommendations">
                    <h3><i class="fas fa-rocket"></i> Strategic Recommendations</h3>
                    <div class="recommendations-grid">
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Budget Reallocation</h5>
                            <p>Shift 30% of Facebook budget to Google Ads and LinkedIn. These channels showing 45% better ROAS for your target audience.</p>
                        </div>
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Creative Optimization</h5>
                            <p>Launch video creative tests against current static ads. Historical data shows 65% higher engagement for video formats.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Audience Refinement</h5>
                            <p>Narrow targeting to high-intent segments identified by AI analysis. Projected 35% CTR improvement.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Bid Strategy Update</h5>
                            <p>Switch to Target CPA bidding at $25. AI optimization will reduce acquisition costs by estimated 25%.</p>
                        </div>
                    </div>
                </div>

                <div class="timeline-section">
                    <h3><i class="fas fa-calendar-check"></i> Implementation Timeline</h3>
                    <div class="timeline-track">
                        <div class="timeline-item active">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 1: Foundation & Testing</h5>
                                <p>Implement audience refinements and launch creative A/B tests to establish baseline performance improvements.</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 2: Budget Optimization</h5>
                                <p>Adjust budget allocation based on initial test results and implement Target CPA bidding strategy.</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 3: Scale Winning Elements</h5>
                                <p>Scale successful variations, optimize underperforming segments, and implement advanced targeting.</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Week 4: Performance Review</h5>
                                <p>Comprehensive analysis of optimization results and planning for next iteration cycle.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="output-section">
                    <h3>Campaign Optimization Recommendations</h3>

                    <h4>Performance Agent Analysis</h4>
                    <ul>
                        <li>Current CTR: ${context.ctr || '2.4%'} - Opportunity to improve by 35%</li>
                        <li>Cost per acquisition trending ${context.cpa_trend || '15% lower'} than industry average</li>
                        <li>Top performing ad creative: ${context.top_creative || 'Video carousel format'}</li>
                    </ul>

                    <h4>Analytics Agent Insights</h4>
                    <ul>
                        <li>Optimal posting times: ${context.optimal_times || '6-8 PM weekdays'}</li>
                        <li>Audience engagement peaks during ${context.peak_days || 'Tuesday-Thursday'}</li>
                        <li>Mobile traffic accounts for ${context.mobile_traffic || '73%'} of conversions</li>
                    </ul>

                    <h4>Historical Agent Recommendations</h4>
                    <ul>
                        <li>Similar campaigns saw ${context.historical_lift || '40% performance lift'} with creative refresh</li>
                        <li>Budget reallocation to ${context.recommended_channels || 'high-performing channels'} recommended</li>
                    </ul>
                </div>

                <div class="knowledge-base-section">
                    <h3><i class="fas fa-database" style="color: var(--accent-primary);"></i> Knowledge Sources Used</h3>
                    <div class="knowledge-sources">
                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon performance"><i class="fas fa-chart-bar"></i></div>
                                <div class="source-info">
                                    <h4>Campaign Performance Data</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Historical campaign metrics, conversion tracking, and performance benchmarks for optimization insights.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>156</strong> campaigns</div>
                                <div class="source-metric"><strong>Updated:</strong> 1 hour ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon customer"><i class="fas fa-users"></i></div>
                                <div class="source-info">
                                    <h4>Audience Analytics</h4>
                                    <div class="source-status synced">Synced</div>
                                </div>
                            </div>
                            <div class="source-details">
                                User behavior data, demographic insights, and engagement patterns for targeted optimization.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>24</strong> segments</div>
                                <div class="source-metric"><strong>Updated:</strong> 30 mins ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon research"><i class="fas fa-search"></i></div>
                                <div class="source-info">
                                    <h4>Industry Benchmarks</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Market research, competitor analysis, and industry performance standards for strategic comparisons.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>48</strong> reports</div>
                                <div class="source-metric"><strong>Updated:</strong> 2 days ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCreativeOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-palette" style="color: var(--accent-red);"></i> Creative Asset Generation</h2>
                        <p class="output-subtitle">AI-generated creative assets optimized for your brand and audience</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">12</div>
                            <div class="stat-label">Assets Generated</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">4</div>
                            <div class="stat-label">Formats</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">92%</div>
                            <div class="stat-label">Brand Alignment</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">85%</div>
                            <div class="stat-label">Predicted CTR</div>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card creative">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-palette"></i></div>
                            <h4>Creative Strategy Analysis</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Brand voice analysis reveals opportunity for more conversational, benefit-focused messaging</span>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value">65%</span>
                                <span class="metric-desc">Video Performance Lift</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">23%</span>
                                <span class="metric-desc">CTR Boost</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">31%</span>
                                <span class="metric-desc">Social Proof Impact</span>
                            </div>
                        </div>
                        <div class="creative-insights">
                            <h5>Creative Elements Analysis</h5>
                            <ul>
                                <li><strong>Visual Style:</strong> ${context.visual_style || 'Modern, minimalist with bold accent colors'}</li>
                                <li><strong>Messaging Tone:</strong> ${context.messaging_tone || 'Conversational and benefit-focused'}</li>
                                <li><strong>CTA Strategy:</strong> ${context.cta_strategy || 'Action-oriented with urgency elements'}</li>
                                <li><strong>Format Optimization:</strong> Video content shows 65% higher engagement rates</li>
                            </ul>
                        </div>
                    </div>

                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-search"></i></div>
                            <h4>Market Research Intelligence</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-trending-up"></i>
                            <span>Trending formats and competitor analysis identify creative opportunities</span>
                        </div>
                        <div class="research-findings">
                            <h5>Platform Trends & Insights</h5>
                            <div class="platform-chips">
                                <div class="platform-chip high">
                                    <i class="fab fa-instagram"></i>
                                    <span>Instagram</span>
                                    <span class="engagement">High engagement</span>
                                </div>
                                <div class="platform-chip medium">
                                    <i class="fab fa-facebook"></i>
                                    <span>Facebook</span>
                                    <span class="engagement">Medium engagement</span>
                                </div>
                                <div class="platform-chip high">
                                    <i class="fab fa-tiktok"></i>
                                    <span>TikTok</span>
                                    <span class="engagement">High engagement</span>
                                </div>
                            </div>
                            <ul style="margin-top: var(--space-md);">
                                <li><strong>Trending Formats:</strong> ${context.trending_formats || 'Short-form video, carousel posts, UGC-style content'}</li>
                                <li><strong>Competitor Gap:</strong> ${context.content_gap || 'Educational content and behind-the-scenes storytelling'}</li>
                                <li><strong>Audience Preference:</strong> ${context.content_preference || '75% prefer authentic, relatable content over polished ads'}</li>
                            </ul>
                        </div>
                    </div>

                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-users"></i></div>
                            <h4>Audience Targeting Optimization</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-bullseye"></i>
                            <span>Multi-segment targeting strategy with personalized creative variations</span>
                        </div>
                        <div class="audience-breakdown">
                            <h5>Target Segment Analysis</h5>
                            <div class="segment-bars">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Primary (Ages 25-34)</span>
                                        <span class="segment-percentage">45%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 45%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Secondary (Ages 35-44)</span>
                                        <span class="segment-percentage">30%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 30%; background: var(--accent-green);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Growth (Ages 18-24)</span>
                                        <span class="segment-percentage">25%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 25%; background: var(--accent-orange);"></div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: var(--space-md);">
                                <h5>Creative Personalization Strategy</h5>
                                <ul>
                                    <li><strong>Primary Segment:</strong> ${context.primary_messaging || 'Professional achievement and lifestyle enhancement focus'}</li>
                                    <li><strong>Secondary Segment:</strong> ${context.secondary_messaging || 'Family-oriented benefits and time-saving solutions'}</li>
                                    <li><strong>Growth Segment:</strong> ${context.growth_messaging || 'Social validation and trend-forward positioning'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="creative-concepts-section">
                    <h3><i class="fas fa-magic"></i> Generated Creative Concepts</h3>
                    <div class="concepts-grid">
                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Concept A: ${context.concept_a || 'Lifestyle Integration'}</h4>
                                <span class="concept-type">Emotional Approach</span>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
                                     alt="Lifestyle Integration Concept"
                                     class="concept-image">
                            </div>
                            <div class="concept-details">
                                <p><strong>Strategy:</strong> Emotional storytelling targeting ${context.primary_emotion || 'aspiration and success'}. Features ${context.visual_style || 'bright, energetic visuals'} with ${context.cta || 'strong call-to-action'}.</p>
                                <div class="concept-metrics">
                                    <span class="metric">Predicted CTR: <strong>3.2%</strong></span>
                                    <span class="metric">Engagement Score: <strong>87</strong></span>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Concept B: ${context.concept_b || 'Problem-Solution Focus'}</h4>
                                <span class="concept-type">Direct Response</span>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
                                     alt="Problem-Solution Focus Concept"
                                     class="concept-image">
                            </div>
                            <div class="concept-details">
                                <p><strong>Strategy:</strong> Direct response approach highlighting ${context.pain_point || 'key pain points'} and positioning ${context.solution || 'product as the solution'}.</p>
                                <div class="concept-metrics">
                                    <span class="metric">Predicted CTR: <strong>2.8%</strong></span>
                                    <span class="metric">Conversion Score: <strong>92</strong></span>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Concept C: Social Proof Focus</h4>
                                <span class="concept-type">Trust Building</span>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
                                     alt="Social Proof Focus Concept"
                                     class="concept-image">
                            </div>
                            <div class="concept-details">
                                <p><strong>Strategy:</strong> Customer testimonials and user-generated content showcasing real results and community validation.</p>
                                <div class="concept-metrics">
                                    <span class="metric">Predicted CTR: <strong>2.5%</strong></span>
                                    <span class="metric">Trust Score: <strong>94</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="strategic-recommendations">
                    <h3><i class="fas fa-lightbulb"></i> Creative Optimization Recommendations</h3>
                    <div class="recommendations-grid">
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>A/B Test Creative Concepts</h5>
                            <p>Test all three concepts with equal traffic split to identify top performer. Focus on CTR and conversion metrics for statistical significance.</p>
                        </div>
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Platform-Specific Optimization</h5>
                            <p>Adapt each concept for platform-specific requirements: Instagram Stories, Facebook Feed, TikTok native format variations.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Dynamic Creative Elements</h5>
                            <p>Implement dynamic headlines and CTAs based on audience segment for increased personalization and performance.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Creative Refresh Strategy</h5>
                            <p>Plan 3-week creative rotation cycle to prevent ad fatigue. Monitor frequency caps and performance decay indicators.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAudienceSegmentsOutput(context, userMessage) {
        return `
            <div class="task-specific-output">
                <div class="output-section">
                    <h3>Audience Segmentation Analysis</h3>

                    <h4>Audience Agent Segmentation</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                        <div style="padding: 1rem; background: var(--content-bg); border-radius: 8px; border-left: 4px solid #10b981;">
                            <strong>High-Value Segment</strong>
                            <p>Size: ${context.segment_1_size || '24%'}<br>
                            LTV: ${context.segment_1_ltv || '$2,400'}<br>
                            Behavior: ${context.segment_1_behavior || 'Frequent buyers, brand advocates'}</p>
                        </div>
                        <div style="padding: 1rem; background: var(--content-bg); border-radius: 8px; border-left: 4px solid #3b82f6;">
                            <strong>Growth Potential</strong>
                            <p>Size: ${context.segment_2_size || '35%'}<br>
                            LTV: ${context.segment_2_ltv || '$1,200'}<br>
                            Behavior: ${context.segment_2_behavior || 'Occasional buyers, price-sensitive'}</p>
                        </div>
                        <div style="padding: 1rem; background: var(--content-bg); border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <strong>Nurture Segment</strong>
                            <p>Size: ${context.segment_3_size || '41%'}<br>
                            LTV: ${context.segment_3_ltv || '$400'}<br>
                            Behavior: ${context.segment_3_behavior || 'Browsers, need education'}</p>
                        </div>
                    </div>

                    <h4>Analytics Agent Behavioral Insights</h4>
                    <ul>
                        <li>Primary engagement hours: ${context.engagement_hours || '7-9 PM EST'}</li>
                        <li>Preferred content types: ${context.content_types || 'Video tutorials, product demos'}</li>
                        <li>Channel preferences: ${context.channel_prefs || 'Email (67%), Social Media (45%), SMS (23%)'}</li>
                    </ul>

                    <h4>Research Agent Market Context</h4>
                    <ul>
                        <li>Market penetration opportunity: ${context.market_opportunity || '15% untapped in target demo'}</li>
                        <li>Competitive positioning: ${context.competitive_pos || 'Strong differentiation in quality segment'}</li>
                        <li>Growth trends: ${context.growth_trends || 'Segment expanding 12% annually'}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateJourneySetupOutput(context, userMessage) {
        // Use the full journey flow output for journey tasks
        return this.generateJourneyFlowOutput(context, userMessage);
    }

    generateABTestOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-flask" style="color: var(--accent-green);"></i> A/B Testing Framework</h2>
                        <p class="output-subtitle">Statistical testing framework designed for reliable, actionable insights</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">95%</div>
                            <div class="stat-label">Confidence Level</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">14</div>
                            <div class="stat-label">Days Runtime</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">2,500+</div>
                            <div class="stat-label">Sample Size</div>
                        </div>
                    </div>
                </div>

                <div class="test-hypothesis-section">
                    <div class="hypothesis-card">
                        <div class="hypothesis-header">
                            <i class="fas fa-lightbulb" style="color: var(--accent-orange);"></i>
                            <h3>Test Hypothesis</h3>
                        </div>
                        <div class="hypothesis-content">
                            <p class="hypothesis-statement">Testing ${context.test_element || 'creative variations'} will improve ${context.metric || 'conversion rates'} by <strong>15-25%</strong></p>
                            <div class="hypothesis-metrics">
                                <div class="hypothesis-metric">
                                    <span class="metric-label">Expected Lift</span>
                                    <span class="metric-value positive">+20%</span>
                                </div>
                                <div class="hypothesis-metric">
                                    <span class="metric-label">Significance Level</span>
                                    <span class="metric-value">α = 0.05</span>
                                </div>
                                <div class="hypothesis-metric">
                                    <span class="metric-label">Statistical Power</span>
                                    <span class="metric-value">80%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="test-variations-section">
                    <h3><i class="fas fa-code-branch" style="color: var(--accent-primary);"></i> Test Variations</h3>
                    <div class="variations-grid">
                        <div class="variation-card control">
                            <div class="variation-header">
                                <span class="variation-badge control">Control</span>
                                <h4>Variation A (Current)</h4>
                            </div>
                            <div class="variation-preview">
                                <div class="preview-placeholder">
                                    <i class="fas fa-image"></i>
                                    <span>Current Creative</span>
                                </div>
                            </div>
                            <div class="variation-metrics">
                                <div class="traffic-allocation">
                                    <span class="allocation-label">Traffic:</span>
                                    <span class="allocation-value">50%</span>
                                    <div class="allocation-bar">
                                        <div class="allocation-fill control" style="width: 50%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="variation-card test">
                            <div class="variation-header">
                                <span class="variation-badge test">Test</span>
                                <h4>Variation B (New)</h4>
                            </div>
                            <div class="variation-preview">
                                <div class="preview-placeholder">
                                    <i class="fas fa-magic"></i>
                                    <span>Test Creative</span>
                                </div>
                            </div>
                            <div class="variation-metrics">
                                <div class="traffic-allocation">
                                    <span class="allocation-label">Traffic:</span>
                                    <span class="allocation-value">50%</span>
                                    <div class="allocation-bar">
                                        <div class="allocation-fill test" style="width: 50%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card creative">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-palette"></i></div>
                            <h4>Creative Agent Analysis</h4>
                        </div>
                        <div class="analysis-content">
                            <div class="insight-highlight">
                                <i class="fas fa-chart-line"></i>
                                <span>Test Variation Concepts Generated</span>
                            </div>
                            <p>Multiple test variations developed with performance potential analysis across formats and platforms.</p>
                            <div class="creative-variations">
                                <h5>Variation Elements</h5>
                                <div class="element-tags">
                                    <span class="element-tag">Headlines</span>
                                    <span class="element-tag">CTA Buttons</span>
                                    <span class="element-tag">Color Schemes</span>
                                    <span class="element-tag">Images</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Performance Agent Framework</h4>
                        </div>
                        <div class="analysis-content">
                            <div class="statistical-framework">
                                <h5>Statistical Configuration</h5>
                                <div class="framework-grid">
                                    <div class="framework-item">
                                        <span class="framework-label">Sample Size</span>
                                        <span class="framework-value">${context.sample_size || '2,500 per variation'}</span>
                                    </div>
                                    <div class="framework-item">
                                        <span class="framework-label">Confidence Level</span>
                                        <span class="framework-value">95%</span>
                                    </div>
                                    <div class="framework-item">
                                        <span class="framework-label">Minimum Detectable Effect</span>
                                        <span class="framework-value">5%</span>
                                    </div>
                                    <div class="framework-item">
                                        <span class="framework-label">Test Duration</span>
                                        <span class="framework-value">${context.duration || '14 days'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card analytics">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-pie"></i></div>
                            <h4>Analytics Agent Monitoring</h4>
                        </div>
                        <div class="analysis-content">
                            <div class="monitoring-setup">
                                <h5>Real-time Monitoring</h5>
                                <div class="monitoring-features">
                                    <div class="feature-item">
                                        <i class="fas fa-tachometer-alt"></i>
                                        <span>Live performance dashboard</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-bell"></i>
                                        <span>Automated significance alerts</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-stop-circle"></i>
                                        <span>Early stopping protocols</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-users"></i>
                                        <span>Audience segment analysis</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="success-metrics-section">
                    <h3><i class="fas fa-target" style="color: var(--accent-red);"></i> Success Metrics</h3>
                    <div class="metrics-breakdown">
                        <div class="primary-metrics">
                            <h4>Primary Metrics</h4>
                            <div class="metric-cards">
                                <div class="metric-card primary">
                                    <div class="metric-icon"><i class="fas fa-shopping-cart"></i></div>
                                    <div class="metric-info">
                                        <span class="metric-name">${context.primary_metric || 'Conversion Rate'}</span>
                                        <span class="metric-description">Main success indicator</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="secondary-metrics">
                            <h4>Secondary Metrics</h4>
                            <div class="metric-cards">
                                <div class="metric-card secondary">
                                    <div class="metric-icon"><i class="fas fa-mouse-pointer"></i></div>
                                    <div class="metric-info">
                                        <span class="metric-name">Click-through Rate</span>
                                        <span class="metric-description">Engagement quality</span>
                                    </div>
                                </div>
                                <div class="metric-card secondary">
                                    <div class="metric-icon"><i class="fas fa-dollar-sign"></i></div>
                                    <div class="metric-info">
                                        <span class="metric-name">Cost per Acquisition</span>
                                        <span class="metric-description">Efficiency measure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="timeline-section">
                    <h3><i class="fas fa-calendar-check" style="color: var(--accent-green);"></i> Testing Timeline</h3>
                    <div class="timeline-track">
                        <div class="timeline-item active">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Day 1-3: Test Setup & Launch</h5>
                                <p>Configure variations, implement tracking, and launch test with traffic allocation</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Day 4-10: Data Collection</h5>
                                <p>Monitor performance metrics and statistical significance progress</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5>Day 11-14: Analysis & Decision</h5>
                                <p>Evaluate results, determine winning variation, and plan implementation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateInsightsOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-chart-pie" style="color: var(--accent-purple);"></i> Campaign Insights & Analytics</h2>
                        <p class="output-subtitle">Comprehensive data analysis and performance intelligence</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">15</div>
                            <div class="stat-label">Data Sources</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">2.8M</div>
                            <div class="stat-label">Data Points</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">94%</div>
                            <div class="stat-label">Accuracy Score</div>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-pie"></i></div>
                            <h4>Analytics Intelligence</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-trending-up"></i>
                            <span>Performance analysis reveals 34% higher engagement in key demographic segments</span>
                        </div>
                        <div class="audience-breakdown">
                            <h5>Top Performing Segments</h5>
                            <div class="segment-bars">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">${context.top_segment || 'Millennials 25-34'}</span>
                                        <span class="segment-percentage">${context.performance || '34% higher engagement'}</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 90%; background: var(--accent-green);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Gen Z 18-24</span>
                                        <span class="segment-percentage">28% engagement rate</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 85%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Gen X 35-50</span>
                                        <span class="segment-percentage">21% engagement rate</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 70%; background: var(--accent-orange);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value">3.2x</span>
                                <span class="metric-desc">ROI on Instagram</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">42%</span>
                                <span class="metric-desc">Peak Time Lift</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">28%</span>
                                <span class="metric-desc">Video vs Static</span>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Performance Trends</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-clock"></i>
                            <span>Optimal timing analysis shows ${context.best_time || 'Tuesday-Thursday 7-9 PM'} generating peak performance</span>
                        </div>
                        <div class="platform-preferences">
                            <h5>Channel Performance Analysis</h5>
                            <div class="platform-chips">
                                <div class="platform-chip high">
                                    <i class="fab fa-instagram"></i>
                                    <span>${context.best_channel || 'Instagram'}: ${context.channel_roi || '3.2x ROI'}</span>
                                    <div class="engagement">Top Performer</div>
                                </div>
                                <div class="platform-chip medium">
                                    <i class="fab fa-facebook"></i>
                                    <span>Facebook: 2.1x ROI</span>
                                    <div class="engagement">Strong</div>
                                </div>
                                <div class="platform-chip medium">
                                    <i class="fab fa-linkedin"></i>
                                    <span>LinkedIn: 1.8x ROI</span>
                                    <div class="engagement">B2B Focus</div>
                                </div>
                                <div class="platform-chip low">
                                    <i class="fab fa-twitter"></i>
                                    <span>Twitter: 1.2x ROI</span>
                                    <div class="engagement">Opportunity</div>
                                </div>
                            </div>
                        </div>
                        <div class="performance-forecast">
                            <h5>Performance Trend Analysis</h5>
                            <div class="forecast-grid">
                                <div class="forecast-item">
                                    <div class="forecast-icon awareness"><i class="fas fa-arrow-up"></i></div>
                                    <div class="forecast-details">
                                        <div class="forecast-metric">Growth Trajectory</div>
                                        <div class="forecast-value">${context.trend || 'Upward trend'} - 15% MoM</div>
                                    </div>
                                    <div class="forecast-bar">
                                        <div class="forecast-progress" style="width: 85%; background: var(--accent-green);"></div>
                                    </div>
                                </div>
                                <div class="forecast-item">
                                    <div class="forecast-icon conversions"><i class="fas fa-target"></i></div>
                                    <div class="forecast-details">
                                        <div class="forecast-metric">Conversion Optimization</div>
                                        <div class="forecast-value">${context.recommendation || 'Budget reallocation'} opportunity</div>
                                    </div>
                                    <div class="forecast-bar">
                                        <div class="forecast-progress" style="width: 78%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-history"></i></div>
                            <h4>Historical Intelligence</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-database"></i>
                            <span>Historical pattern analysis reveals seasonal trends and optimization opportunities</span>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value">15%</span>
                                <span class="metric-desc">Q4 Seasonal Lift</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">89%</span>
                                <span class="metric-desc">Pattern Accuracy</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">6Mo</span>
                                <span class="metric-desc">Trend Window</span>
                            </div>
                        </div>
                        <div class="historical-learnings">
                            <h5>Key Historical Insights</h5>
                            <ul>
                                <li><strong>Seasonal Patterns:</strong> Q4 campaigns show 15% performance lift with urgency messaging</li>
                                <li><strong>Audience Evolution:</strong> Mobile engagement increased 45% over past 6 months</li>
                                <li><strong>Creative Lifecycle:</strong> Creative fatigue occurs after 3-4 weeks of continuous exposure</li>
                                <li><strong>Channel Migration:</strong> Audience gradually shifting from Facebook to Instagram and TikTok</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="strategic-recommendations">
                    <h3><i class="fas fa-lightbulb"></i> Data-Driven Recommendations</h3>
                    <div class="recommendations-grid">
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Channel Reallocation</h5>
                            <p>Shift more budget to Instagram based on 3.2x ROI performance. Reduce Twitter spend and reallocate to high-performing channels.</p>
                        </div>
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Timing Optimization</h5>
                            <p>Focus ad delivery during Tuesday-Thursday 7-9 PM window for 42% better performance based on engagement data.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Creative Refresh Strategy</h5>
                            <p>Implement 3-week creative rotation cycle to prevent fatigue. Video content showing 28% better performance than static.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Audience Segmentation</h5>
                            <p>Create separate campaigns for Millennials and Gen Z with tailored messaging for each demographic's preferences.</p>
                        </div>
                    </div>
                </div>

                <div class="insights-deep-dive">
                    <h3><i class="fas fa-microscope"></i> Deep Dive Analysis</h3>
                    <div class="output-section">
                    <h3>Campaign Insights & Analytics</h3>

                    <h4>Analytics Agent Analysis</h4>
                    <p>Comprehensive data analysis revealing key performance trends and optimization opportunities across your campaigns.</p>

                    <h4>Performance Insights</h4>
                    <ul>
                        <li><strong>Top Performing Segments:</strong> ${context.top_segment || 'Millennials 25-34'} showing ${context.performance || '34% higher engagement'}</li>
                        <li><strong>Optimal Timing:</strong> ${context.best_time || 'Tuesday-Thursday 7-9 PM'} generates ${context.timing_lift || '42% better performance'}</li>
                        <li><strong>Channel Efficiency:</strong> ${context.best_channel || 'Instagram'} delivering ${context.channel_roi || '3.2x ROI'}</li>
                        <li><strong>Creative Performance:</strong> ${context.creative_insight || 'Video content'} outperforming static by ${context.creative_lift || '28%'}</li>
                    </ul>

                    <h4>Performance Agent Analysis</h4>
                    <p>Historical performance patterns indicate ${context.trend || 'upward trajectory'} with ${context.recommendation || 'budget reallocation opportunities'}.</p>

                    <h4>Historical Agent Analysis</h4>
                    <ul>
                        <li>Seasonal trends showing ${context.seasonal || '15% lift during Q4'}</li>
                        <li>Audience behavior evolution patterns identified</li>
                        <li>Competitive landscape shifts and opportunities</li>
                        <li>Budget allocation efficiency improvements</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateBudgetAllocationOutput(context, userMessage) {
        return `
            <div class="task-specific-output">
                <div class="output-section">
                    <h3>Budget Allocation Optimization</h3>

                    <h4>Performance Agent Analysis</h4>
                    <p>Channel performance analysis reveals optimal budget distribution for maximum ROI across your marketing mix.</p>

                    <h4>Recommended Budget Allocation</h4>
                    <ul>
                        <li><strong>Google Ads:</strong> ${context.google_budget || '35%'} - High-intent search traffic</li>
                        <li><strong>Meta Platforms:</strong> ${context.meta_budget || '30%'} - Social engagement and retargeting</li>
                        <li><strong>LinkedIn:</strong> ${context.linkedin_budget || '20%'} - B2B targeting and lead generation</li>
                        <li><strong>Other Channels:</strong> ${context.other_budget || '15%'} - Testing and diversification</li>
                    </ul>

                    <h4>Analytics Agent Analysis</h4>
                    <p>ROI modeling suggests ${context.roi_improvement || '23% performance increase'} with optimized allocation strategy.</p>

                    <h4>Historical Agent Analysis</h4>
                    <ul>
                        <li>Historical performance data supports reallocation strategy</li>
                        <li>Seasonal budget adjustment recommendations</li>
                        <li>Competitive spending insights and opportunities</li>
                        <li>Long-term budget scaling projections</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateCompetitorAnalysisOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-search" style="color: var(--accent-purple);"></i> Deep Market Research & Intelligence</h2>
                        <p class="output-subtitle">Comprehensive competitive analysis and market insights to guide strategic decisions</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">47</div>
                            <div class="stat-label">Competitors Analyzed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">12</div>
                            <div class="stat-label">Market Segments</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">8.3</div>
                            <div class="stat-label">Research Score</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">15</div>
                            <div class="stat-label">Opportunities</div>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-search"></i></div>
                            <h4>Deep Research Intelligence</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Market leaders are underinvesting in Gen Z engagement, creating a 40% opportunity gap in social commerce channels</span>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value">73%</span>
                                <span class="metric-desc">Market Share Gap</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">$2.8M</span>
                                <span class="metric-desc">Revenue Opportunity</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">15</span>
                                <span class="metric-desc">Competitor Weaknesses</span>
                            </div>
                        </div>
                        <div class="competitive-landscape">
                            <h5>Competitive Positioning Analysis</h5>
                            <div class="competitive-breakdown">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Premium Leaders</span>
                                        <span class="segment-percentage">34%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 34%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Mid-Market Players</span>
                                        <span class="segment-percentage">41%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 41%; background: linear-gradient(135deg, var(--accent-orange), #d97706);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Budget Options</span>
                                        <span class="segment-percentage">25%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 25%; background: linear-gradient(135deg, var(--accent-green), #059669);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Performance Benchmarking</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-trophy"></i>
                            <span>Top performers achieve 3.2x industry average ROAS through advanced personalization strategies</span>
                        </div>
                        <div class="performance-benchmarks">
                            <h5>Industry Benchmarks vs. Top Performers</h5>
                            <div class="forecast-grid">
                                <div class="forecast-item">
                                    <div class="forecast-icon awareness">
                                        <i class="fas fa-eye"></i>
                                    </div>
                                    <div class="forecast-details">
                                        <div class="forecast-metric">Click-Through Rate</div>
                                        <div class="forecast-value">Industry: 2.1% | Top: 4.8%</div>
                                        <div class="forecast-bar">
                                            <div class="forecast-progress" style="width: 85%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="forecast-item">
                                    <div class="forecast-icon conversions">
                                        <i class="fas fa-shopping-cart"></i>
                                    </div>
                                    <div class="forecast-details">
                                        <div class="forecast-metric">Conversion Rate</div>
                                        <div class="forecast-value">Industry: 3.2% | Top: 7.1%</div>
                                        <div class="forecast-bar">
                                            <div class="forecast-progress" style="width: 75%; background: linear-gradient(135deg, var(--accent-green), #059669);"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="forecast-item">
                                    <div class="forecast-icon roi">
                                        <i class="fas fa-dollar-sign"></i>
                                    </div>
                                    <div class="forecast-details">
                                        <div class="forecast-metric">Return on Ad Spend</div>
                                        <div class="forecast-value">Industry: 2.1x | Top: 4.8x</div>
                                        <div class="forecast-bar">
                                            <div class="forecast-progress" style="width: 90%; background: linear-gradient(135deg, var(--accent-orange), #d97706);"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-history"></i></div>
                            <h4>Historical Trend Analysis</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-chart-line"></i>
                            <span>Seasonal patterns reveal 65% higher engagement during micro-moments vs. traditional holiday periods</span>
                        </div>
                        <div class="historical-analysis">
                            <h5>Market Evolution & Trends</h5>
                            <div class="trend-insights">
                                <div class="trend-item">
                                    <div class="trend-icon" style="background: var(--accent-green);">
                                        <i class="fas fa-arrow-up"></i>
                                    </div>
                                    <div class="trend-content">
                                        <div class="trend-title">Rising: Social Commerce</div>
                                        <div class="trend-description">340% growth in social shopping features adoption</div>
                                    </div>
                                </div>
                                <div class="trend-item">
                                    <div class="trend-icon" style="background: var(--accent-orange);">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div class="trend-content">
                                        <div class="trend-title">Stable: Video Content</div>
                                        <div class="trend-description">Consistent 60% engagement rate across platforms</div>
                                    </div>
                                </div>
                                <div class="trend-item">
                                    <div class="trend-icon" style="background: var(--accent-red);">
                                        <i class="fas fa-arrow-down"></i>
                                    </div>
                                    <div class="trend-content">
                                        <div class="trend-title">Declining: Static Ads</div>
                                        <div class="trend-description">25% decrease in effectiveness year-over-year</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="strategic-recommendations">
                    <h3><i class="fas fa-lightbulb"></i> Strategic Market Opportunities</h3>
                    <div class="recommendations-grid">
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Social Commerce Investment</h5>
                            <p>Competitors are slow to adopt social shopping features. Immediate investment could capture 40% of emerging market share before Q4.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <div class="rec-priority">Medium Priority</div>
                            <h5>Pricing Strategy Gap</h5>
                            <p>$50-75 price range is underserved by quality options. Premium-positioned product could dominate this segment.</p>
                        </div>
                        <div class="recommendation-card priority-high">
                            <div class="rec-priority">High Priority</div>
                            <h5>Gen Z Engagement Channel</h5>
                            <p>TikTok and Instagram Reels show minimal competitor presence in educational content vertical.</p>
                        </div>
                        <div class="recommendation-card priority-low">
                            <div class="rec-priority">Low Priority</div>
                            <h5>Content Personalization</h5>
                            <p>Advanced personalization could differentiate from competitors using basic demographic targeting.</p>
                        </div>
                    </div>
                </div>

                <div class="competitive-intelligence-section">
                    <h3><i class="fas fa-shield-alt"></i> Competitive Intelligence Summary</h3>
                    <div class="intelligence-grid">
                        <div class="intelligence-card">
                            <div class="intelligence-header">
                                <h4>Market Leadership</h4>
                                <div class="leadership-badge">Premium Tier</div>
                            </div>
                            <div class="intelligence-details">
                                <p><strong>Brand A & Brand B</strong> control 34% market share through premium positioning and exclusive partnerships.</p>
                                <div class="competitive-metrics">
                                    <div class="metric"><strong>$180M</strong> Combined Revenue</div>
                                    <div class="metric"><strong>2.1x</strong> Premium Pricing</div>
                                    <div class="metric"><strong>87%</strong> Brand Recognition</div>
                                </div>
                            </div>
                        </div>
                        <div class="intelligence-card">
                            <div class="intelligence-header">
                                <h4>Emerging Threats</h4>
                                <div class="threat-badge">Monitor</div>
                            </div>
                            <div class="intelligence-details">
                                <p><strong>3 New Entrants</strong> focusing on direct-to-consumer models with aggressive pricing strategies.</p>
                                <div class="competitive-metrics">
                                    <div class="metric"><strong>45%</strong> Price Undercut</div>
                                    <div class="metric"><strong>$12M</strong> Funding Raised</div>
                                    <div class="metric"><strong>2.4x</strong> Growth Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="knowledge-base-section">
                    <h3><i class="fas fa-database" style="color: var(--accent-primary);"></i> Knowledge Sources Used</h3>
                    <div class="knowledge-sources">
                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon research"><i class="fas fa-search"></i></div>
                                <div class="source-info">
                                    <h4>Competitive Intelligence Database</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Real-time competitor monitoring, pricing analysis, and strategic positioning data across multiple channels.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>47</strong> competitors tracked</div>
                                <div class="source-metric"><strong>Updated:</strong> 2 hours ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon performance"><i class="fas fa-chart-bar"></i></div>
                                <div class="source-info">
                                    <h4>Market Performance Data</h4>
                                    <div class="source-status synced">Synced</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Industry benchmarks, market share analytics, and performance metrics from leading market research platforms.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>12</strong> market segments</div>
                                <div class="source-metric"><strong>Updated:</strong> 4 hours ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon customer"><i class="fas fa-users"></i></div>
                                <div class="source-info">
                                    <h4>Consumer Behavior Insights</h4>
                                    <div class="source-status active">Active</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Trend analysis, consumer preferences, and behavioral patterns from social listening and survey data.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>8</strong> trend reports</div>
                                <div class="source-metric"><strong>Updated:</strong> 1 day ago</div>
                            </div>
                        </div>

                        <div class="knowledge-source-card">
                            <div class="source-header">
                                <div class="source-icon product"><i class="fas fa-box"></i></div>
                                <div class="source-info">
                                    <h4>Product & Pricing Intelligence</h4>
                                    <div class="source-status synced">Synced</div>
                                </div>
                            </div>
                            <div class="source-details">
                                Product feature comparisons, pricing strategies, and competitive landscape mapping for strategic positioning.
                            </div>
                            <div class="source-metrics">
                                <div class="source-metric"><strong>156</strong> products analyzed</div>
                                <div class="source-metric"><strong>Updated:</strong> 6 hours ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateContentCalendarOutput(context, userMessage) {
        return `
            <div class="task-specific-output">
                <div class="output-section">
                    <h3>Strategic Content Calendar</h3>

                    <h4>Creative Agent Analysis</h4>
                    <p>Content strategy framework designed to maximize engagement and align with customer journey touchpoints.</p>

                    <h4>Content Themes & Schedule</h4>
                    <ul>
                        <li><strong>Week 1:</strong> ${context.week1 || 'Brand awareness + Educational content'}</li>
                        <li><strong>Week 2:</strong> ${context.week2 || 'Product features + Customer testimonials'}</li>
                        <li><strong>Week 3:</strong> ${context.week3 || 'Social proof + Behind-the-scenes'}</li>
                        <li><strong>Week 4:</strong> ${context.week4 || 'Promotional + Call-to-action content'}</li>
                    </ul>

                    <h4>Research Agent Analysis</h4>
                    <p>Trending topics and optimal posting times identified for maximum reach and engagement across platforms.</p>

                    <h4>Journey Agent Analysis</h4>
                    <ul>
                        <li>Content mapped to customer journey stages</li>
                        <li>Cross-platform content adaptation strategy</li>
                        <li>Engagement-driven posting schedule optimization</li>
                        <li>Performance tracking and adjustment protocols</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateDefaultTaskOutput(task, context, userMessage) {
        const taskName = task.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const agents = this.currentTaskAgents || [];

        return `
            <div class="task-specific-output">
                <div class="output-section">
                    <h3>${taskName} Analysis</h3>
                    <p>Our specialist agents have collaborated to deliver comprehensive insights for your ${task.replace(/-/g, ' ')} request.</p>

                    ${agents.map(agent => `
                        <h4>${agent} Insights</h4>
                        <ul>
                            <li>Analysis completed with focus on ${context.goal || 'optimization and performance'}</li>
                            <li>Recommendations aligned with ${context.objectives || 'your business objectives'}</li>
                            <li>Strategic insights generated for ${context.scope || 'immediate implementation'}</li>
                        </ul>
                    `).join('')}

                    <h4>Next Steps</h4>
                    <ul>
                        <li>Review and validate the generated recommendations</li>
                        <li>Implement priority optimizations</li>
                        <li>Monitor performance and iterate based on results</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateAgentInsights(messageType, context) {
        const insights = {};

        // Research Agent insights
        insights.research = this.generateResearchInsights(messageType, context);

        // Performance Agent insights
        insights.performance = this.generatePerformanceInsights(messageType, context);

        // Creative Agent insights
        insights.creative = this.generateCreativeInsights(messageType, context);

        // Audience Agent insights
        insights.audience = this.generateAudienceInsights(messageType, context);

        return insights;
    }

    generateResearchInsights(messageType, context) {
        const platformData = context.platform.length > 0 ? context.platform.join(', ') : 'Multi-platform';
        return {
            title: 'Market Research & Analysis',
            findings: [
                `${platformData} shows strong performance for ${context.audience || 'target demographics'}`,
                `Current market trends favor ${context.objective || 'conversion-focused'} strategies`,
                `Competitive analysis reveals opportunities in ${context.timeline || 'Q4'} campaigns`,
                'Industry benchmarks indicate 25-40% improvement potential'
            ]
        };
    }

    generatePerformanceInsights(messageType, context) {
        return {
            title: 'Performance Analysis & Optimization',
            metrics: [
                { label: 'Expected ROAS', value: '3.2x', trend: '+15%' },
                { label: 'Conversion Rate', value: '4.8%', trend: '+22%' },
                { label: 'Cost per Acquisition', value: '$28', trend: '-18%' },
                { label: 'Click-through Rate', value: '2.1%', trend: '+12%' }
            ],
            recommendations: [
                'Optimize bid strategies for peak performance hours',
                'Implement audience exclusions to reduce wasted spend',
                'Scale successful ad groups by 25-30%'
            ]
        };
    }

    generateCreativeInsights(messageType, context) {
        const platforms = context.platform.length > 0 ? context.platform : ['Multi-platform'];
        return {
            title: 'Creative Strategy & Assets',
            concepts: platforms.map(platform => ({
                platform: platform,
                concepts: ['Video testimonials', 'Product demos', 'Behind-the-scenes'],
                variants: 3
            })),
            testing: 'A/B testing framework for creative optimization',
            performance: 'Top-performing creative themes: authenticity, problem-solving, social proof'
        };
    }

    generateAudienceInsights(messageType, context) {
        return {
            title: 'Audience Targeting & Segmentation',
            segments: [
                { name: 'High-Intent Prospects', size: '2.3M', potential: 'High' },
                { name: 'Lookalike Audiences', size: '5.1M', potential: 'Medium' },
                { name: 'Retargeting Pool', size: '890K', potential: 'Very High' }
            ],
            targeting: 'Behavioral, demographic, and interest-based targeting optimization',
            expansion: 'Identified 3 new audience segments for testing'
        };
    }

    generateExecutiveSummary(messageType, context) {
        const objective = context.objective || 'marketing objectives';
        const platforms = context.platform.length > 0 ? context.platform.join(' & ') : 'key platforms';

        return `
            <div class="executive-summary" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-primary);">
                <h3 style="margin: 0 0 1rem 0; color: var(--text-primary); font-size: 1.25rem;">Executive Summary</h3>
                <p style="margin: 0; color: var(--text-secondary); line-height: 1.6;">
                    Our specialist agents have analyzed your request and developed a comprehensive strategy for ${objective.toLowerCase()} across ${platforms}.
                    The analysis reveals significant opportunities for optimization with projected improvements of 25-40% across key metrics.
                    ${context.audience ? `Targeting ${context.audience} shows particularly strong potential.` : ''}
                </p>
            </div>
        `;
    }

    generateDetailedInsights(insights, messageType) {
        return `
            <div class="detailed-insights">
                <h3 style="margin: 1.5rem 0 1rem 0; color: var(--text-primary);">Agent Analysis</h3>

                <div class="insights-grid" style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
                    ${this.renderInsightCard(insights.research)}
                    ${this.renderPerformanceCard(insights.performance)}
                    ${this.renderCreativeCard(insights.creative)}
                    ${this.renderAudienceCard(insights.audience)}
                </div>
            </div>
        `;
    }

    renderInsightCard(insight) {
        return `
            <div class="insight-card" style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <h4 style="margin: 0 0 0.75rem 0; color: var(--accent-primary); font-size: 1rem;">${insight.title}</h4>
                <ul style="margin: 0; padding-left: 1rem;">
                    ${insight.findings.map(finding => `<li style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.875rem;">${finding}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    renderPerformanceCard(insight) {
        return `
            <div class="insight-card" style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <h4 style="margin: 0 0 0.75rem 0; color: var(--accent-primary); font-size: 1rem;">${insight.title}</h4>
                <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 0.75rem;">
                    ${insight.metrics.map(metric => `
                        <div style="background: var(--gray-50); padding: 0.5rem; border-radius: 4px; text-align: center;">
                            <div style="font-weight: 600; color: var(--text-primary);">${metric.value}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${metric.label}</div>
                            <div style="font-size: 0.75rem; color: var(--success-green);">${metric.trend}</div>
                        </div>
                    `).join('')}
                </div>
                <ul style="margin: 0; padding-left: 1rem;">
                    ${insight.recommendations.map(rec => `<li style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.875rem;">${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    renderCreativeCard(insight) {
        return `
            <div class="insight-card" style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <h4 style="margin: 0 0 0.75rem 0; color: var(--accent-primary); font-size: 1rem;">${insight.title}</h4>
                <div style="margin-bottom: 0.75rem;">
                    ${insight.concepts.map(concept => `
                        <div style="margin: 0.5rem 0; padding: 0.5rem; background: var(--gray-50); border-radius: 4px;">
                            <strong style="color: var(--text-primary);">${concept.platform}:</strong>
                            <span style="color: var(--text-secondary); font-size: 0.875rem;"> ${concept.concepts.join(', ')} (${concept.variants} variants)</span>
                        </div>
                    `).join('')}
                </div>
                <p style="margin: 0.5rem 0; color: var(--text-secondary); font-size: 0.875rem;"><strong>Testing:</strong> ${insight.testing}</p>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;"><strong>Performance:</strong> ${insight.performance}</p>
            </div>
        `;
    }

    renderAudienceCard(insight) {
        return `
            <div class="insight-card" style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <h4 style="margin: 0 0 0.75rem 0; color: var(--accent-primary); font-size: 1rem;">${insight.title}</h4>
                <div style="margin-bottom: 0.75rem;">
                    ${insight.segments.map(segment => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0; padding: 0.5rem; background: var(--gray-50); border-radius: 4px;">
                            <span style="color: var(--text-primary); font-weight: 500;">${segment.name}</span>
                            <span style="color: var(--text-secondary); font-size: 0.875rem;">${segment.size} users</span>
                            <span style="color: var(--success-green); font-size: 0.75rem; font-weight: 500;">${segment.potential}</span>
                        </div>
                    `).join('')}
                </div>
                <p style="margin: 0.5rem 0; color: var(--text-secondary); font-size: 0.875rem;"><strong>Strategy:</strong> ${insight.targeting}</p>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;"><strong>Opportunities:</strong> ${insight.expansion}</p>
            </div>
        `;
    }

    generateRecommendations(messageType, context) {
        const recommendations = this.getContextualRecommendations(messageType, context);

        return `
            <div class="recommendations-section">
                <h3 style="margin: 1.5rem 0 1rem 0; color: var(--text-primary);">Strategic Recommendations</h3>
                <div class="recommendations-grid" style="display: grid; gap: 0.75rem;">
                    ${recommendations.map((rec, index) => `
                        <div class="recommendation-item" style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; background: white; border: 1px solid var(--border-color); border-radius: 8px;">
                            <div style="background: var(--accent-primary); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; flex-shrink: 0;">
                                ${index + 1}
                            </div>
                            <div>
                                <h4 style="margin: 0 0 0.25rem 0; color: var(--text-primary); font-size: 0.9rem;">${rec.title}</h4>
                                <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.4;">${rec.description}</p>
                                <span style="color: var(--accent-primary); font-size: 0.75rem; font-weight: 500;">Impact: ${rec.impact}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getContextualRecommendations(messageType, context) {
        const baseRecommendations = [
            {
                title: 'Optimize Budget Allocation',
                description: 'Reallocate 15% of budget to top-performing channels and audiences based on performance data.',
                impact: 'High (+25% ROAS)'
            },
            {
                title: 'Implement Dynamic Creative Testing',
                description: 'Deploy 3-5 creative variants per platform with automated optimization based on performance metrics.',
                impact: 'Medium (+18% CTR)'
            },
            {
                title: 'Expand High-Performing Audiences',
                description: 'Scale successful audience segments and create lookalike audiences for broader reach.',
                impact: 'High (+30% reach)'
            },
            {
                title: 'Set Up Advanced Tracking',
                description: 'Implement comprehensive conversion tracking and attribution modeling for better insights.',
                impact: 'Medium (Better ROI visibility)'
            }
        ];

        // Customize recommendations based on context
        if (context.platform.includes('TikTok')) {
            baseRecommendations.unshift({
                title: 'TikTok Creative Strategy',
                description: 'Develop native TikTok content with trending audio, effects, and authentic storytelling formats.',
                impact: 'High (+40% engagement)'
            });
        }

        if (context.objective === 'Conversions') {
            baseRecommendations.unshift({
                title: 'Conversion Rate Optimization',
                description: 'Implement landing page A/B tests and streamline the conversion funnel for maximum efficiency.',
                impact: 'Very High (+35% conversions)'
            });
        }

        return baseRecommendations.slice(0, 4); // Return top 4 recommendations
    }

    generateNextSteps(messageType, context) {
        const nextSteps = this.getContextualNextSteps(messageType, context);

        return `
            <div class="next-steps-section">
                <h3 style="margin: 1.5rem 0 1rem 0; color: var(--text-primary);">Implementation Roadmap</h3>
                <div class="timeline" style="position: relative; padding-left: 2rem;">
                    <div style="position: absolute; left: 9px; top: 0; bottom: 0; width: 2px; background: var(--border-color);"></div>
                    ${nextSteps.map((step, index) => `
                        <div class="timeline-item" style="position: relative; margin-bottom: 1.5rem;">
                            <div style="position: absolute; left: -2rem; top: 0.25rem; width: 20px; height: 20px; background: var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">
                                ${index + 1}
                            </div>
                            <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                                <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 0.5rem;">
                                    <h4 style="margin: 0; color: var(--text-primary); font-size: 0.9rem;">${step.title}</h4>
                                    <span style="background: var(--gray-100); color: var(--text-secondary); padding: 0.125rem 0.5rem; border-radius: 12px; font-size: 0.75rem; margin-left: 1rem;">${step.timeline}</span>
                                </div>
                                <p style="margin: 0 0 0.5rem 0; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.4;">${step.description}</p>
                                <div style="color: var(--accent-primary); font-size: 0.75rem; font-weight: 500;">Owner: ${step.owner}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getContextualNextSteps(messageType, context) {
        const baseSteps = [
            {
                title: 'Campaign Setup & Launch',
                description: 'Configure campaigns, audiences, and creative assets across selected platforms.',
                timeline: 'Week 1',
                owner: 'Paid Media Team'
            },
            {
                title: 'Performance Monitoring',
                description: 'Track key metrics, gather initial performance data, and identify optimization opportunities.',
                timeline: 'Week 2',
                owner: 'Analytics Team'
            },
            {
                title: 'Optimization Phase',
                description: 'Implement performance-based optimizations, budget reallocations, and creative refreshes.',
                timeline: 'Week 3-4',
                owner: 'Performance Team'
            },
            {
                title: 'Scale & Expand',
                description: 'Scale successful elements, expand to new audiences, and prepare for next campaign iteration.',
                timeline: 'Week 5+',
                owner: 'Growth Team'
            }
        ];

        // Customize based on context
        if (context.platform.includes('TikTok')) {
            baseSteps.splice(1, 0, {
                title: 'TikTok Content Creation',
                description: 'Produce platform-native video content leveraging trending formats and sound.',
                timeline: 'Week 1-2',
                owner: 'Creative Team'
            });
        }

        return baseSteps;
    }

    generateOutputContent(messageType) {
        switch (messageType) {
            case 'brief':
                return `
                    <div class="output-section">
                        <h3>Campaign Overview</h3>
                        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);">$100K</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Total Budget</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success-green);">2.8x</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Target ROAS</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning-orange);">45 Days</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Duration</div>
                            </div>
                        </div>
                        <h4>Target Audience</h4>
                        <ul>
                            <li>Primary: Millennials (25-40) - 65% of budget</li>
                            <li>Secondary: Gen Z (18-28) - 25% of budget</li>
                            <li>Tertiary: Gen X (35-50) - 10% of budget</li>
                        </ul>
                        <h4>Channel Strategy</h4>
                        <ul>
                            <li>Google Ads: $40K (40%) - Conversion focused</li>
                            <li>Meta (FB/IG): $35K (35%) - Awareness & engagement</li>
                            <li>TikTok: $15K (15%) - Gen Z engagement</li>
                            <li>LinkedIn: $10K (10%) - B2B leads</li>
                        </ul>
                    </div>
                `;

            case 'creative':
                return `
                    <div class="output-section">
                        <h3>Creative Concepts</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0;">
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>🎄 Holiday Magic</h4>
                                <p>Festive emotional appeal with 40% off offer</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600); margin-top: 0.5rem;">
                                    Predicted CTR: <strong>3.2%</strong><br>
                                    Engagement Score: <strong>92</strong>
                                </div>
                            </div>
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>⏰ Limited Time</h4>
                                <p>Urgency-driven messaging with countdown</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600); margin-top: 0.5rem;">
                                    Predicted CTR: <strong>2.8%</strong><br>
                                    Engagement Score: <strong>87</strong>
                                </div>
                            </div>
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>💝 Customer Love</h4>
                                <p>Social proof and testimonial focus</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600); margin-top: 0.5rem;">
                                    Predicted CTR: <strong>2.5%</strong><br>
                                    Engagement Score: <strong>84</strong>
                                </div>
                            </div>
                        </div>
                        <h4>Recommended A/B Tests</h4>
                        <ul>
                            <li>Test Holiday Magic vs Limited Time for holiday campaigns</li>
                            <li>Compare carousel vs video formats for each concept</li>
                            <li>Test CTA variations: "Shop Now" vs "Get Offer"</li>
                        </ul>
                    </div>
                `;

            case 'journey':
                return `
                    <div class="output-section">
                        <h3>Customer Journey Flow</h3>
                        <div style="margin: 1rem 0;">
                            <div style="display: flex; flex-direction: column; gap: 1rem;">
                                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                                    <div style="background: var(--primary-blue); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                                    <div>
                                        <strong>Awareness (Days 1-3)</strong><br>
                                        <span style="color: var(--gray-600);">Email welcome series + social media ads</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                                    <div style="background: var(--primary-purple); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
                                    <div>
                                        <strong>Consideration (Days 4-7)</strong><br>
                                        <span style="color: var(--gray-600);">Retargeting ads + educational content</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                                    <div style="background: var(--warning-orange); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
                                    <div>
                                        <strong>Intent (Days 8-10)</strong><br>
                                        <span style="color: var(--gray-600);">SMS offers + push notifications</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                                    <div style="background: var(--success-green); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">4</div>
                                    <div>
                                        <strong>Conversion (Days 11-14)</strong><br>
                                        <span style="color: var(--gray-600);">Cart recovery + final incentives</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4>Key Metrics</h4>
                        <ul>
                            <li>Predicted conversion rate: <strong>8.2%</strong></li>
                            <li>Average journey length: <strong>12 days</strong></li>
                            <li>Optimal touchpoint frequency: <strong>3-4 per week</strong></li>
                        </ul>
                    </div>
                `;

            case 'performance':
                return `
                    <div class="output-section">
                        <h3>Performance Analysis</h3>
                        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success-green);">2.3x</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Current ROAS</div>
                                <div style="font-size: 0.75rem; color: var(--success-green);">↑ 15% vs target</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);">3.2%</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Avg CTR</div>
                                <div style="font-size: 0.75rem; color: var(--success-green);">↑ 0.8% vs benchmark</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning-orange);">12.5%</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Conv Rate</div>
                                <div style="font-size: 0.75rem; color: var(--error-red);">↓ 2.1% vs target</div>
                            </div>
                        </div>
                        <h4>Top Performing Segments</h4>
                        <ul>
                            <li>Millennials Mobile: <strong>4.2x ROAS</strong> - Scale up 40%</li>
                            <li>Retargeting Cart: <strong>3.8x ROAS</strong> - Increase budget</li>
                            <li>Lookalike Top 1%: <strong>2.1x ROAS</strong> - Optimize creative</li>
                        </ul>
                        <h4>Optimization Recommendations</h4>
                        <ul>
                            <li>Reallocate 20% budget from Display to TikTok</li>
                            <li>Pause underperforming cold audiences</li>
                            <li>Increase bid caps for top performing segments</li>
                        </ul>
                    </div>
                `;

            case 'audience':
                return `
                    <div class="output-section">
                        <h3>Audience Segments</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0;">
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>👑 VIP Customers</h4>
                                <p><strong>125K people</strong></p>
                                <p>High LTV, frequent purchasers, brand advocates</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">
                                    Avg. Order Value: $180<br>
                                    Purchase Frequency: 3.2x/year
                                </div>
                            </div>
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>🛒 Cart Abandoners</h4>
                                <p><strong>89K people</strong></p>
                                <p>Added items but didn't complete purchase</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">
                                    Avg. Cart Value: $95<br>
                                    Recovery Rate: 23%
                                </div>
                            </div>
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>👀 Browsers</h4>
                                <p><strong>200K people</strong></p>
                                <p>Visited product pages, need nurturing</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">
                                    Avg. Session Time: 4.2min<br>
                                    Pages per Visit: 3.8
                                </div>
                            </div>
                            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 1rem;">
                                <h4>🎯 New Prospects</h4>
                                <p><strong>156K people</strong></p>
                                <p>Competitor customers, expansion opportunity</p>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">
                                    Similar Brands: 67% match<br>
                                    Predicted LTV: $145
                                </div>
                            </div>
                        </div>
                        <h4>Targeting Recommendations</h4>
                        <ul>
                            <li>Focus 60% budget on VIP lookalikes</li>
                            <li>Create specific cart recovery campaigns</li>
                            <li>Test competitor targeting expansion</li>
                        </ul>
                    </div>
                `;

            case 'paid-media':
                return `
                    <div class="output-section">
                        <h3>Optimized Budget Allocation</h3>
                        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-blue);">$40K</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Google Ads (40%)</div>
                                <div style="font-size: 0.75rem; color: var(--success-green);">Strong search performance</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-purple);">$33K</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Meta (33%)</div>
                                <div style="font-size: 0.75rem; color: var(--success-green);">High engagement rates</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--warning-orange);">$20K</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">TikTok (20%)</div>
                                <div style="font-size: 0.75rem; color: var(--success-green);">Growing younger demo</div>
                            </div>
                            <div class="metric-card" style="background: var(--gray-50); padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--gray-600);">$7K</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Testing (7%)</div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">New channel exploration</div>
                            </div>
                        </div>
                        <h4>Channel Performance</h4>
                        <ul>
                            <li>Google Ads: 3.2x ROAS - Maintain current spend</li>
                            <li>Meta: 2.8x ROAS - Increase creative testing</li>
                            <li>TikTok: 2.4x ROAS - Scale successful campaigns</li>
                            <li>LinkedIn: 2.6x ROAS - Expand B2B targeting</li>
                        </ul>
                        <h4>Scaling Opportunities</h4>
                        <ul>
                            <li>Increase TikTok budget by $5K for Gen Z campaigns</li>
                            <li>Test Pinterest for lifestyle product categories</li>
                            <li>Expand Google Shopping campaigns</li>
                        </ul>
                    </div>
                `;

            default:
                return `
                    <div class="output-section">
                        <h3>Ready to Generate Results</h3>
                        <p>I'm ready to help you with any marketing task. The output panel will show detailed results, analytics, and actionable insights once we start working together.</p>
                        <h4>I can help you with:</h4>
                        <ul>
                            <li>Campaign strategy and briefs</li>
                            <li>Creative asset generation</li>
                            <li>Performance analysis and optimization</li>
                            <li>Audience targeting and segmentation</li>
                            <li>Customer journey design</li>
                            <li>Budget allocation and media planning</li>
                        </ul>
                    </div>
                `;
        }
    }

    addFollowUpSuggestions(messageType) {
        const suggestions = {
            brief: ['Generate creative assets for this campaign', 'Design customer journey flows', 'Set up audience targeting'],
            creative: ['Create campaign brief for these assets', 'Set up A/B testing', 'Design customer journey'],
            journey: ['Generate creative assets for touchpoints', 'Analyze performance metrics', 'Optimize budget allocation'],
            performance: ['Apply recommended optimizations', 'Generate new creative variants', 'Reallocate budget'],
            audience: ['Create campaign brief for segments', 'Generate targeted creative assets', 'Set up journey flows'],
            'paid-media': ['Generate creative assets for channels', 'Create audience segments', 'Design conversion journeys']
        };

        const messageSuggestions = suggestions[messageType];
        if (messageSuggestions && messageSuggestions.length > 0) {
            const suggestionsHTML = `
                <div style="margin-top: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--gray-700);">Suggested next steps:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${messageSuggestions.map(suggestion => `
                            <button class="suggestion-btn" onclick="app.handleSuggestion('${suggestion}')"
                                style="background: white; border: 1px solid var(--gray-200); border-radius: 20px;
                                       padding: 0.25rem 0.75rem; font-size: 0.75rem; cursor: pointer;
                                       transition: all 150ms ease;">
                                ${suggestion}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            this.addMessage(suggestionsHTML, 'agent', 'SuperAgent');
        }
    }

    handleSuggestion(suggestion) {
        // Detect relevant AI suite based on the suggestion
        const relevantSuite = this.detectRelevantAISuite(suggestion);
        if (relevantSuite) {
            const areaTitles = {
                'engage': 'Engage AI Suite',
                'paid-media': 'Paid Media AI Suite',
                'personalization': 'Personalization AI Suite',
                'service': 'Service AI Suite',
                'creative': 'Creative AI Suite'
            };
            this.currentSuiteTitle = areaTitles[relevantSuite];
        } else {
            // Fallback: map message type to appropriate AI suite
            const messageType = this.analyzeMessage(suggestion);
            this.currentSuiteTitle = this.getAISuiteFromMessageType(messageType);
        }

        // Update output title immediately
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        // Add suggestion message to chat
        this.addMessage(suggestion, 'user');

        // Show processing indicator and trigger agent workflow
        this.showProcessingIndicator();

        // Route to agents like a main input
        setTimeout(() => {
            this.routeToAgents(suggestion);
        }, 1000);
    }

    generateFollowUpResponse(message) {
        // Show thinking process for follow-up
        this.addMessage('🧠 **Analyzing your follow-up request...**', 'agent');

        const thinkingProcess = [
            'Processing your request parameters...',
            'Evaluating context from previous conversation...',
            'Identifying optimal specialist agents for this task...',
            'Synthesizing recommendations with existing analysis...',
            'Preparing targeted insights and next steps...'
        ];

        thinkingProcess.forEach((thought, index) => {
            setTimeout(() => {
                this.addMessage(`🔍 ${thought}`, 'agent');
            }, (index + 1) * 600);
        });

        const responses = [
            "I'll help you with that. Let me analyze the requirements and provide recommendations.",
            "Great idea! I'm processing your request and will have detailed results shortly.",
            "I understand what you're looking for. Let me gather the relevant data and insights.",
            "Perfect! I'm working on that now and will show you the results in the output panel.",
            "I can definitely help with that. Let me activate the relevant specialist agents."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
            this.addMessage(randomResponse, 'agent');
        }, thinkingProcess.length * 600 + 500);

        // Add contextual reasoning insight to output area
        setTimeout(() => {
            const messageType = this.analyzeMessage(message);
            const contextualInsight = this.getFollowUpInsight(message, messageType);
            this.addThoughtProcessToOutput('Strategy Coordinator', contextualInsight, message);
        }, thinkingProcess.length * 600 + 1200);

        // Simulate updating output panel
        setTimeout(() => {
            const messageType = this.analyzeMessage(message);
            this.updateOutputPanel(messageType, message);
        }, thinkingProcess.length * 600 + 2000);
    }

    getFollowUpInsight(message, messageType) {
        const lowerMessage = message.toLowerCase();

        const insights = {
            'brief': {
                'optimize': 'Building on previous analysis, I recommend A/B testing messaging approaches while maintaining consistent brand voice across all touchpoints.',
                'budget': 'Based on current campaign analysis, reallocating 15% budget to top-performing segments could improve overall ROAS by 20%.',
                'default': 'Strategic analysis suggests this builds perfectly on our previous recommendations, creating synergy across campaign elements.'
            },
            'creative': {
                'test': 'Creative testing framework will leverage insights from previous asset analysis to focus on highest-impact variables.',
                'platform': 'Cross-platform creative optimization will maintain brand consistency while adapting to each channel\'s unique engagement patterns.',
                'default': 'Creative strategy aligns with established brand guidelines while introducing fresh elements to combat ad fatigue.'
            },
            'journey': {
                'email': 'Email sequence optimization will integrate with existing touchpoint mapping to create seamless customer experience.',
                'automation': 'Automation rules will build on current journey analysis to create more sophisticated trigger-based experiences.',
                'default': 'Journey enhancements will amplify existing conversion opportunities while addressing identified drop-off points.'
            },
            'performance': {
                'conversion': 'Conversion optimization will focus on bottlenecks identified in previous analysis, with projected 18-25% improvement.',
                'tracking': 'Enhanced tracking will provide deeper insights into attribution patterns and customer lifetime value optimization.',
                'default': 'Performance improvements will compound existing optimization efforts, creating multiplicative rather than additive gains.'
            },
            'audience': {
                'expand': 'Audience expansion strategy will leverage proven segments while testing adjacent demographics with similar behavioral patterns.',
                'personalization': 'Personalization enhancements will deepen engagement within established segments while improving conversion rates.',
                'default': 'Audience strategy builds on current segmentation insights to unlock additional value and growth opportunities.'
            }
        };

        const typeInsights = insights[messageType] || insights['brief'];

        for (const [keyword, insight] of Object.entries(typeInsights)) {
            if (keyword !== 'default' && lowerMessage.includes(keyword)) {
                return insight;
            }
        }

        return typeInsights.default || 'This enhancement integrates seamlessly with our previous analysis, creating additional value and optimization opportunities.';
    }

    generateTaskSpecificResponse(task, message) {
        const taskResponses = {
            'campaign-brief': {
                agent: 'Campaign Strategy Team',
                content: `Perfect! I've activated our Research, Audience, and Performance agents to create a comprehensive campaign brief. They're analyzing market opportunities, target audience insights, and performance benchmarks to deliver a strategic foundation for your campaign.`
            },
            'optimize-campaign': {
                agent: 'Performance Optimization Team',
                content: `Excellent! Our Performance, Analytics, and Historical agents are now analyzing your campaign data. They're identifying optimization opportunities, performance gaps, and applying learnings from similar successful campaigns to boost your results.`
            },
            'campaign-insights': {
                agent: 'Analytics Intelligence Team',
                content: `Great! I've deployed our Analytics, Performance, and Historical agents to dive deep into your campaign data. They're generating comprehensive insights, identifying trends, and providing actionable recommendations based on your performance metrics.`
            },
            'setup-journey': {
                agent: 'Journey Design Team',
                content: `Fantastic! Our Journey, Audience, and Personalization agents are collaborating to design your automated customer journey. They're mapping optimal touchpoints, timing, and personalized experiences across email, SMS, and push notifications.`
            },
            'generate-creative': {
                agent: 'Creative Production Team',
                content: `Amazing! I've activated our Creative, Research, and Audience agents to generate compelling creative assets. They're developing multiple variants for A/B testing, ensuring each creative resonates with your target audience across all platforms.`
            },
            'audience-segments': {
                agent: 'Audience Intelligence Team',
                content: `Perfect! Our Audience, Analytics, and Research agents are building detailed audience segments. They're analyzing demographics, behaviors, preferences, and market data to create highly targeted segments for maximum campaign effectiveness.`
            },
            'budget-allocation': {
                agent: 'Budget Optimization Team',
                content: `Excellent! I've deployed our Performance, Analytics, and Historical agents to optimize your budget allocation. They're analyzing channel performance, ROI metrics, and historical data to recommend the most effective budget distribution across your marketing channels.`
            },
            'ab-test': {
                agent: 'Testing & Optimization Team',
                content: `Great! Our Creative, Performance, and Analytics agents are setting up your A/B testing framework. They're designing test variations, establishing statistical significance parameters, and creating measurement protocols to ensure reliable, actionable results.`
            },
            'competitor-analysis': {
                agent: 'Market Intelligence Team',
                content: `Perfect! I've activated our Research, Performance, and Historical agents to conduct comprehensive competitor analysis. They're analyzing competitor strategies, positioning, performance benchmarks, and market opportunities to give you a competitive edge.`
            },
            'content-calendar': {
                agent: 'Content Strategy Team',
                content: `Fantastic! Our Creative, Research, and Journey agents are collaborating to create your strategic content calendar. They're planning themes, scheduling optimal posting times, and ensuring content aligns with your customer journey and business objectives.`
            }
        };

        return taskResponses[task] || {
            agent: 'Task Specialist',
            content: `I've activated the most relevant specialist agents for your ${task.replace(/-/g, ' ')} request. They're working together to deliver comprehensive, actionable results.`
        };
    }

    addTaskSpecificSuggestions(task) {
        const taskSuggestions = {
            'campaign-brief': [
                'Add specific KPIs and success metrics',
                'Define budget parameters and constraints',
                'Include competitor positioning analysis',
                'Set campaign timeline and milestones'
            ],
            'optimize-campaign': [
                'Review ad creative performance',
                'Analyze audience segment effectiveness',
                'Adjust budget allocation by channel',
                'Test new bidding strategies'
            ],
            'campaign-insights': [
                'Export performance report',
                'Set up automated monitoring',
                'Create custom dashboard',
                'Schedule weekly insights review'
            ],
            'setup-journey': [
                'Define entry and exit criteria',
                'Set up conversion tracking',
                'Create journey analytics dashboard',
                'Test journey with sample audience'
            ],
            'generate-creative': [
                'Create additional creative variations',
                'Develop mobile-optimized versions',
                'Generate copy variations',
                'Design seasonal adaptations'
            ],
            'audience-segments': [
                'Create lookalike audiences',
                'Set up dynamic segmentation',
                'Export segments to ad platforms',
                'Create audience overlap analysis'
            ],
            'budget-allocation': [
                'Set up budget alerts',
                'Create scenario planning',
                'Implement auto-bidding rules',
                'Schedule budget reviews'
            ],
            'ab-test': [
                'Set up additional test variations',
                'Create test monitoring dashboard',
                'Plan follow-up experiments',
                'Document testing methodology'
            ],
            'competitor-analysis': [
                'Set up competitor monitoring',
                'Create competitive positioning map',
                'Analyze competitor ad creative',
                'Track competitor pricing changes'
            ],
            'content-calendar': [
                'Add seasonal content themes',
                'Set up content approval workflow',
                'Create content performance tracking',
                'Plan cross-platform adaptations'
            ]
        };

        const suggestions = taskSuggestions[task] || [
            'Refine the strategy further',
            'Add more specific requirements',
            'Create implementation timeline',
            'Set up performance monitoring'
        ];

        const suggestionsHTML = `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--content-bg); border: var(--border); border-radius: 8px; border-left: 4px solid var(--accent-primary);">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; font-size: 13px;">💡 Next Steps & Suggestions</div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${suggestions.map(suggestion =>
                        `<button class="suggestion-btn" onclick="app.handleSuggestion('${suggestion}')" style="background: var(--card-bg); border: var(--border); border-radius: 20px; padding: 4px 12px; font-size: 11px; cursor: pointer; transition: all var(--transition-fast); color: var(--text-secondary);">
                            ${suggestion}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;

        this.addMessage(suggestionsHTML, 'agent', 'SuperAgent');
    }

    updateAgentStatusWithThought(agentName, thought, thoughtIndex) {
        // Agent status is already updated in the showAgentThoughtProcess method
        // This method is called to replace the chat spam with status updates
        // The actual status update happens in lines 988-992 of showAgentThoughtProcess
    }

    getShortStatusMessage(thought, thoughtIndex) {
        // Create concise status messages for agent progress display
        const shortMessages = [
            'Analyzing data patterns...',
            'Processing requirements...',
            'Generating recommendations...',
            'Finalizing insights...',
            'Validating results...'
        ];

        // Use a consistent short message based on thought index
        return shortMessages[thoughtIndex % shortMessages.length] || 'Processing...';
    }


    clearTaskContext() {
        // Reset task-specific context to allow normal processing for subsequent messages
        this.currentTask = null;
        this.currentTaskAgents = null;
    }

    updateProgressHeaderOnCompletion(timestamp, totalAgents) {
        const progressIcon = document.getElementById(`progress-icon-${timestamp}`);
        const progressText = document.getElementById(`progress-text-${timestamp}`);

        if (progressIcon && progressText) {
            progressIcon.className = 'fas fa-check-circle';
            progressIcon.style.color = 'var(--accent-green)';
            progressText.textContent = `${totalAgents} specialist agents completed`;
        }
    }

    checkAndUpdateProgressHeader() {
        // Find all progress displays and check if their agents are complete
        const progressDisplays = document.querySelectorAll('.agent-progress-display');

        progressDisplays.forEach(display => {
            const progressHeader = display.querySelector('.progress-header');
            const allAgentItems = display.querySelectorAll('.agent-progress-item');
            const completedItems = display.querySelectorAll('.agent-progress-item.completed');

            // If all agents in this display are completed, update the header
            if (allAgentItems.length > 0 && completedItems.length === allAgentItems.length) {
                const progressIcon = progressHeader.querySelector('i');
                const progressText = progressHeader.querySelector('span');

                if (progressIcon && progressText && !progressIcon.classList.contains('fa-check-circle')) {
                    progressIcon.className = 'fas fa-check-circle';
                    progressIcon.style.color = 'var(--accent-green)';
                    progressText.textContent = `${allAgentItems.length} specialist agents completed`;
                }
            }
        });
    }

    generateBriefResponse(message) {
        if (message.includes('holiday') || message.includes('seasonal')) {
            return `I've created a comprehensive holiday campaign brief targeting millennials. The strategy includes festive messaging, 40% promotional offers, and multi-channel approach across social, email, and paid media with projected 25% lift in conversions.`;
        }
        if (message.includes('loyalty') || message.includes('referral')) {
            return `I've designed a customer loyalty program with tiered rewards, referral incentives, and personalized offers. The program includes point accumulation, exclusive perks, and gamification elements to increase customer lifetime value by 35%.`;
        }
        if (message.includes('positioning') || message.includes('market entry')) {
            return `I've developed a brand positioning strategy for new market entry. The approach includes competitive differentiation, value proposition definition, and go-to-market tactics with phased launch plan and success metrics.`;
        }
        return `I've created a comprehensive campaign brief with strategic objectives, target audience analysis, budget allocation recommendations, and channel strategy with projected KPIs and success metrics.`;
    }

    generateCreativeResponse(message) {
        if (message.includes('instagram') || message.includes('social')) {
            return `I've generated Instagram-optimized creative assets including 5 carousel concepts, 3 video ad variants, and story templates. Each asset includes copy variations, hashtag strategies, and engagement predictions based on platform best practices.`;
        }
        if (message.includes('video') || message.includes('youtube')) {
            return `I've created video ad scripts for YouTube pre-roll campaigns with 15, 30, and 60-second variants. Each script includes hook strategies, call-to-action placement, and engagement tactics optimized for different audience segments.`;
        }
        if (message.includes('tiktok')) {
            return `I've developed TikTok advertising creative concepts including trending format adaptations, user-generated content templates, and influencer collaboration frameworks optimized for Q4 product launch engagement.`;
        }
        return `I've generated multiple creative concepts with A/B testing variants. Each concept includes copy variations, visual themes, and performance predictions based on historical data and platform optimization.`;
    }

    generateJourneyResponse(message) {
        if (message.includes('welcome') || message.includes('onboarding')) {
            return `I've designed a welcome email series for new subscribers with 5 touchpoints over 14 days. The sequence includes product education, social proof, and progressive value delivery with 32% average open rates and 12% conversion.`;
        }
        if (message.includes('abandonment') || message.includes('cart')) {
            return `I've set up a cart abandonment journey with email and SMS recovery sequence. The 3-step flow includes reminder, incentive, and urgency messaging with 28% recovery rate and automated trigger optimization.`;
        }
        if (message.includes('win-back') || message.includes('retention')) {
            return `I've built a customer win-back email automation sequence targeting inactive subscribers. The 4-touch campaign includes re-engagement offers, feedback requests, and preference updates with 18% reactivation rate.`;
        }
        if (message.includes('notification') || message.includes('push')) {
            return `I've designed a mobile app push notification campaign with behavioral triggers, personalized messaging, and optimal timing algorithms. The strategy includes segmented messaging and A/B tested content variations.`;
        }
        return `I've designed an optimized customer journey with 5 key touchpoints. The flow includes email, SMS, and push notification sequences with timing optimization for maximum conversion and engagement.`;
    }

    generatePerformanceResponse(message) {
        if (message.includes('landing') || message.includes('conversion')) {
            return `I've analyzed your landing pages and identified 6 optimization opportunities. Recommendations include headline testing, CTA placement, form simplification, and trust signals with projected 23% conversion rate improvement.`;
        }
        if (message.includes('a/b test') || message.includes('testing')) {
            return `I've created an A/B testing framework for landing page optimization with statistical significance tracking. The plan includes test design, sample size calculations, and 4-week testing timeline with automated winner selection.`;
        }
        if (message.includes('feedback') || message.includes('survey')) {
            return `I've developed a customer feedback survey and analysis framework with NPS scoring, sentiment analysis, and actionable insights dashboard. The system includes automated follow-up workflows and response categorization.`;
        }
        return `I've analyzed your campaign performance and identified key optimization opportunities. Current metrics show strong potential for improvement with specific recommendations for budget reallocation and targeting refinement.`;
    }

    generateAudienceResponse(message) {
        if (message.includes('gen z') || message.includes('millennial')) {
            return `I've built detailed audience segments for Gen Z customers based on social behavior patterns. The analysis includes platform preferences, content consumption habits, and purchasing triggers with 94% accuracy in behavioral prediction.`;
        }
        if (message.includes('persona') || message.includes('behavioral')) {
            return `I've developed comprehensive customer personas based on analytics data including demographics, psychographics, pain points, and journey mapping. The personas include actionable messaging and channel recommendations.`;
        }
        if (message.includes('personalized') || message.includes('recommendation')) {
            return `I've created a personalized product recommendation engine for e-commerce with collaborative filtering, behavioral tracking, and real-time adaptation. The system shows 35% increase in average order value and cross-sell success.`;
        }
        return `I've identified 4 high-value audience segments with detailed behavioral profiles. The analysis includes lookalike opportunities, targeting recommendations, and personalization strategies for each segment.`;
    }

    generatePaidMediaResponse(message) {
        if (message.includes('google') || message.includes('shopping')) {
            return `I've optimized your Google Shopping campaigns with product feed enhancements, bid strategy improvements, and negative keyword refinements. Projected 28% increase in ROAS with expanded product visibility and click-through rates.`;
        }
        if (message.includes('budget') || message.includes('allocation')) {
            return `I've optimized budget allocation across Google, Meta, and LinkedIn with data-driven recommendations. The new distribution maximizes ROAS while maintaining reach, with 22% efficiency improvement and scaling opportunities.`;
        }
        if (message.includes('retargeting') || message.includes('remarketing')) {
            return `I've set up comprehensive retargeting campaigns for website visitors with segmented audiences, dynamic creative, and frequency optimization. The strategy includes cross-platform coordination and conversion attribution modeling.`;
        }
        if (message.includes('influencer') || message.includes('partnership')) {
            return `I've built an influencer outreach strategy for brand partnerships including creator identification, campaign frameworks, and performance tracking. The approach focuses on authentic alignment and measurable ROI with content amplification.`;
        }
        return `I've optimized your media budget allocation across channels. The new strategy redistributes spend to maximize ROAS with recommendations for scaling, testing new channels, and performance monitoring.`;
    }

    toggleHistoryPanel() {
        const historyPanel = document.getElementById('history-panel');
        if (historyPanel) {
            if (historyPanel.style.display === 'none') {
                historyPanel.style.display = 'block';
                // Force reflow to ensure display change is applied before animation
                historyPanel.offsetHeight;
                // Add open class on next frame to trigger slide-in animation
                requestAnimationFrame(() => {
                    historyPanel.classList.add('open');
                });
            } else {
                this.closeHistoryPanel();
            }
        }
    }

    openKnowledgeBase() {
        console.log('openKnowledgeBase method called');
        try {
            console.log('About to navigate to knowledge-base route');
            this.navigateToRoute('knowledge-base');
            console.log('Navigation completed successfully');
        } catch (error) {
            console.error('Error in openKnowledgeBase:', error);
        }
    }

    showKnowledgeBasePage() {
        console.log('showKnowledgeBasePage called');
        // Hide all other pages
        this.hideAllPages();

        // Show knowledge base page
        const kbPage = document.getElementById('knowledge-base-page');
        if (kbPage) {
            console.log('Found KB page element, setting display to grid');
            kbPage.style.display = 'grid';
            console.log('KB page display set to:', kbPage.style.display);

            // Force a reflow to ensure the change takes effect
            kbPage.offsetHeight;

            // Check if sidebar is visible within the knowledge base page
            const kbSidebar = kbPage.querySelector('.sidebar-nav');
            if (kbSidebar) {
                console.log('Found KB sidebar element');
                console.log('KB sidebar computed style:', window.getComputedStyle(kbSidebar).display);
            } else {
                console.error('KB sidebar not found within Knowledge Base page');
            }
        } else {
            console.error('Knowledge Base page element not found');
            // Let's check if it exists at all
            const allKbElements = document.querySelectorAll('[id*="knowledge"]');
            console.log('All elements with "knowledge" in ID:', allKbElements);
        }

        // Update main content class
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            console.log('Updating main content class to home-mode');
            mainContent.className = 'main-content home-mode';
        } else {
            console.error('Main content element not found');
        }

        // Hide header
        const header = document.querySelector('.app-header');
        if (header) {
            console.log('Hiding app header');
            header.style.display = 'none';
        }

        // Update current view
        this.currentView = 'knowledge-base';
    }

    navigateToRoute(route) {
        console.log('Navigating to route:', route);

        // Update current route
        this.currentRoute = route;

        // Show the appropriate page immediately
        this.showPage(route);

        // Update URL with hash-based routing
        const url = route === 'home' ? '#' : `#${route}`;
        window.location.hash = url;
    }

    showPage(route) {
        console.log('showPage called with route:', route);
        // Hide all other pages
        this.hideAllPages();

        switch(route) {
            case 'knowledge-base':
                console.log('Switching to Knowledge Base page');
                // Show knowledge base page
                const kbPage = document.getElementById('knowledge-base-page');
                if (kbPage) {
                    console.log('Found KB page element, setting display to grid');
                    kbPage.style.display = 'grid';
                    console.log('KB page display set to:', kbPage.style.display);
                } else {
                    console.error('Knowledge Base page element not found');
                    // Let's check if it exists at all
                    const allKbElements = document.querySelectorAll('[id*="knowledge"]');
                    console.log('All elements with "knowledge" in ID:', allKbElements);
                }

                // Update main content class
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    console.log('Updating main content class to home-mode');
                    mainContent.className = 'main-content home-mode';
                } else {
                    console.error('Main content element not found');
                }

                // Hide header
                const header = document.querySelector('.app-header');
                if (header) {
                    console.log('Hiding app header');
                    header.style.display = 'none';
                }
                break;

            case 'home':
            default:
                console.log('Displaying Home page');
                this.showHomePage();
                break;
        }
    }

    hideAllPages() {
        const homeScreen = document.getElementById('home-screen');
        const workingInterface = document.getElementById('working-interface');
        const kbPage = document.getElementById('knowledge-base-page');

        if (homeScreen) homeScreen.style.display = 'none';
        if (workingInterface) workingInterface.style.display = 'none';
        if (kbPage) kbPage.style.display = 'none';
    }

    showHomePage() {
        // If not already on home, navigate there
        if (this.currentRoute !== 'home') {
            this.navigateToRoute('home');
            return;
        }

        this.hideAllPages();

        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            homeScreen.style.display = 'grid';
        }

        // Hide header (home page should not show top nav)
        const header = document.querySelector('.app-header');
        if (header) {
            header.style.display = 'none';
        }

        // Update main content class
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.className = 'main-content home-mode';
        }
    }

    setupKnowledgeBaseInteractions() {
        // Toggle pinned context items
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pinned-toggle')) {
                const toggle = e.target.closest('.pinned-toggle');
                const pinnedItem = toggle.closest('.pinned-item');
                const icon = toggle.querySelector('i');

                if (toggle.classList.contains('active')) {
                    // Deactivate
                    toggle.classList.remove('active');
                    pinnedItem.classList.remove('active');
                    icon.className = 'fas fa-toggle-off';
                    pinnedItem.querySelector('.pinned-status').textContent = 'Inactive';
                } else {
                    // Activate
                    toggle.classList.add('active');
                    pinnedItem.classList.add('active');
                    icon.className = 'fas fa-toggle-on';
                    pinnedItem.querySelector('.pinned-status').textContent = 'Active';
                }
            }
        });

        // Toggle context packs
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pack-toggle')) {
                const toggle = e.target.closest('.pack-toggle');
                const icon = toggle.querySelector('i');

                if (toggle.classList.contains('active')) {
                    // Deactivate
                    toggle.classList.remove('active');
                    icon.className = 'fas fa-toggle-off';
                } else {
                    // Activate
                    toggle.classList.add('active');
                    icon.className = 'fas fa-toggle-on';
                }
            }
        });

        // Knowledge Base search
        const kbSearch = document.getElementById('kb-search');
        if (kbSearch) {
            kbSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchKnowledgeBase(kbSearch.value);
                }
            });
        }

        const kbSearchBtn = document.querySelector('.kb-search-btn');
        if (kbSearchBtn) {
            kbSearchBtn.addEventListener('click', () => {
                const searchValue = document.getElementById('kb-search').value;
                this.searchKnowledgeBase(searchValue);
            });
        }

        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.kb-action-btn')) {
                const btn = e.target.closest('.kb-action-btn');
                const actionText = btn.querySelector('span').textContent;

                switch(actionText) {
                    case 'Upload Documents':
                        this.uploadDocuments();
                        break;
                    case 'Connect Source':
                        this.connectSource();
                        break;
                    case 'Manage Settings':
                        this.manageSettings();
                        break;
                }
            }
        });
    }

    searchKnowledgeBase(query) {
        console.log('Searching knowledge base for:', query);
        // Implement semantic search functionality
        // This would integrate with your RAG system
    }

    uploadDocuments() {
        console.log('Opening document upload dialog');
        // Implement file upload functionality
    }

    connectSource() {
        console.log('Opening source connection wizard');
        // Implement OAuth connector setup
    }

    manageSettings() {
        console.log('Opening knowledge base settings');
        // Implement settings management
    }

    initRouting() {
        // Handle hash changes (browser back/forward buttons and direct URL access)
        window.addEventListener('hashchange', () => {
            const route = this.getRouteFromURL();
            console.log('Hash changed to route:', route);
            this.currentRoute = route;
            this.showPage(route);
        });

        // Handle initial page load
        const initialRoute = this.getRouteFromURL();
        console.log('Initial route:', initialRoute);
        if (initialRoute !== 'home') {
            this.currentRoute = initialRoute;
            this.showPage(initialRoute);
        }
    }

    getRouteFromURL() {
        // Check for hash-based routing first
        const hash = window.location.hash;
        if (hash) {
            const route = hash.substring(1); // Remove the # symbol
            switch(route) {
                case 'knowledge-base':
                    return 'knowledge-base';
                default:
                    return 'home';
            }
        }

        // Fallback to path-based routing
        const path = window.location.pathname;
        switch(path) {
            case '/knowledge-base':
                return 'knowledge-base';
            case '/':
            default:
                return 'home';
        }
    }

    closeHistoryPanel() {
        const historyPanel = document.getElementById('history-panel');
        if (historyPanel) {
            historyPanel.classList.remove('open');
            setTimeout(() => {
                historyPanel.style.display = 'none';
            }, 300);
        }
    }

    saveOutput() {
        this.addMessage("💾 Output saved to your workspace. You can access it anytime from the History panel.", 'agent');

        // Add to history
        const timestamp = new Date().toLocaleDateString();
        const historyContent = document.querySelector('.history-content');
        if (historyContent) {
            const emptyState = historyContent.querySelector('.history-empty');
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-title">Marketing Task - ${timestamp}</div>
                <div class="history-item-desc">Campaign analysis and recommendations</div>
                <div class="history-item-date">${timestamp}</div>
            `;
            historyContent.appendChild(historyItem);
        }
    }

    exportOutput() {
        this.addMessage("📥 Preparing PDF export with all outputs, data, and recommendations. Download will start shortly.", 'agent');

        // Get the current output content
        const outputContent = document.getElementById('output-content');
        const outputTitle = document.getElementById('output-title');

        if (!outputContent || !outputTitle) {
            this.addMessage("❌ No content available to export.", 'agent');
            return;
        }

        // Create PDF using browser's print functionality
        setTimeout(() => {
            this.generatePDF();
        }, 1000);
    }

    generatePDF() {
        try {
            // Get current output data
            const outputTitle = document.getElementById('output-title')?.textContent || 'Marketing SuperAgent Output';
            const outputContent = document.getElementById('output-content');

            if (!outputContent) {
                this.addMessage("❌ No content available to export.", 'agent');
                return;
            }

            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                this.addMessage("❌ Please allow popups to enable PDF export.", 'agent');
                return;
            }

            // Generate clean HTML for PDF
            const cleanContent = this.preparePDFContent(outputContent.innerHTML, outputTitle);

            // Write HTML to the new window
            printWindow.document.write(cleanContent);
            printWindow.document.close();

            // Wait for content to load, then trigger print dialog
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            };

            this.addMessage("✅ PDF export ready! Use the print dialog to save as PDF or print the document.", 'agent');

        } catch (error) {
            console.error('PDF generation error:', error);
            this.addMessage("❌ Error generating PDF. Please try again.", 'agent');
        }
    }

    preparePDFContent(content, title) {
        const timestamp = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title} - Marketing SuperAgent</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                        line-height: 1.6;
                        color: #2c2c2c;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px 20px;
                        background: white;
                    }

                    .pdf-header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #1957db;
                    }

                    .pdf-title {
                        font-size: 28px;
                        font-weight: 600;
                        color: #1957db;
                        margin-bottom: 10px;
                    }

                    .pdf-subtitle {
                        font-size: 16px;
                        color: #6e6e6e;
                        margin-bottom: 5px;
                    }

                    .pdf-timestamp {
                        font-size: 14px;
                        color: #9e9e9e;
                    }

                    .pdf-content {
                        margin-top: 30px;
                    }

                    h3 {
                        color: #1957db;
                        font-size: 20px;
                        font-weight: 600;
                        margin: 30px 0 15px 0;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #e1e5e9;
                    }

                    h4 {
                        color: #2c2c2c;
                        font-size: 16px;
                        font-weight: 600;
                        margin: 20px 0 10px 0;
                    }

                    p {
                        margin-bottom: 12px;
                        color: #6e6e6e;
                    }

                    ul {
                        margin: 10px 0 20px 20px;
                    }

                    li {
                        margin-bottom: 6px;
                        color: #6e6e6e;
                    }

                    .insight-card, .recommendation-item, .timeline-item > div {
                        background: #fafafa;
                        border: 1px solid #e1e5e9;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 15px 0;
                        page-break-inside: avoid;
                    }

                    .metrics-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 15px;
                        margin: 20px 0;
                    }

                    .metrics-grid > div {
                        background: #f8fafc;
                        border: 1px solid #e1e5e9;
                        border-radius: 6px;
                        padding: 15px;
                        text-align: center;
                    }

                    .executive-summary {
                        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                        border: 1px solid #e1e5e9;
                        border-left: 4px solid #1957db;
                        border-radius: 8px;
                        padding: 25px;
                        margin: 25px 0;
                        page-break-inside: avoid;
                    }

                    .insights-grid {
                        display: grid;
                        gap: 20px;
                        margin: 20px 0;
                    }

                    .recommendations-grid {
                        display: grid;
                        gap: 15px;
                        margin: 20px 0;
                    }

                    .timeline {
                        position: relative;
                        padding-left: 30px;
                        margin: 20px 0;
                    }

                    .timeline::before {
                        content: '';
                        position: absolute;
                        left: 15px;
                        top: 0;
                        bottom: 0;
                        width: 2px;
                        background: #e1e5e9;
                    }

                    .timeline-item {
                        position: relative;
                        margin-bottom: 25px;
                    }

                    .timeline-item::before {
                        content: '';
                        position: absolute;
                        left: -23px;
                        top: 12px;
                        width: 12px;
                        height: 12px;
                        background: #1957db;
                        border-radius: 50%;
                    }

                    @media print {
                        body {
                            padding: 20px;
                        }

                        .pdf-header {
                            margin-bottom: 30px;
                        }

                        h3 {
                            page-break-after: avoid;
                        }

                        .insight-card, .recommendation-item, .executive-summary {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="pdf-header">
                    <div class="pdf-title">${title}</div>
                    <div class="pdf-subtitle">Marketing SuperAgent Output Report</div>
                    <div class="pdf-timestamp">Generated on ${timestamp}</div>
                </div>

                <div class="pdf-content">
                    ${content}
                </div>

                <div style="margin-top: 50px; text-align: center; padding-top: 20px; border-top: 1px solid #e1e5e9; font-size: 12px; color: #9e9e9e;">
                    Generated by Marketing SuperAgent - AI-Native Marketing Platform
                </div>
            </body>
            </html>
        `;
    }

    saveToHistory(messageType, title, content) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date(),
            type: messageType,
            title: title,
            content: content,
            messages: [...this.messageHistory],
            thoughtProcesses: this.currentThoughtProcesses ? [...this.currentThoughtProcesses] : []
        };

        this.outputHistory.unshift(historyItem);

        // Keep only last 50 items
        if (this.outputHistory.length > 50) {
            this.outputHistory = this.outputHistory.slice(0, 50);
        }

        this.saveHistoryToStorage();
        this.updateHistoryPanel();
    }

    saveHistoryToStorage() {
        try {
            localStorage.setItem('marketing-superagent-history', JSON.stringify(this.outputHistory));
        } catch (e) {
            console.warn('Could not save history to localStorage:', e);
        }
    }

    loadHistoryFromStorage() {
        try {
            const stored = localStorage.getItem('marketing-superagent-history');
            if (stored) {
                this.outputHistory = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Could not load history from localStorage:', e);
            this.outputHistory = [];
        }
    }

    updateHistoryPanel() {
        const historyContent = document.querySelector('.history-content');
        if (!historyContent) return;

        if (this.outputHistory.length === 0) {
            historyContent.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history"></i>
                    <p>No tasks completed yet</p>
                    <small>Your completed tasks and outputs will appear here</small>
                </div>
            `;
            return;
        }

        const historyHTML = this.outputHistory.map(item => {
            const date = new Date(item.timestamp);
            const timeAgo = this.getTimeAgo(date);

            return `
                <div class="history-item" data-id="${item.id}">
                    <div class="history-item-header">
                        <div class="history-item-title">${item.title}</div>
                        <div class="history-item-time">${timeAgo}</div>
                    </div>
                    <div class="history-item-preview">
                        ${this.getContentPreview(item.content)}
                    </div>
                    <div class="history-item-actions">
                        <button class="history-action-btn view-btn" onclick="app.viewHistoryItem(${item.id})">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="history-action-btn delete-btn" onclick="app.deleteHistoryItem(${item.id})">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        historyContent.innerHTML = historyHTML;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }

    getContentPreview(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        return text.substring(0, 120) + (text.length > 120 ? '...' : '');
    }

    viewHistoryItem(id) {
        const item = this.outputHistory.find(h => h.id === id);
        if (!item) return;

        // Switch to working interface
        this.showWorkingInterface();

        // Restore the conversation
        this.messageHistory = [...item.messages];
        this.displayMessages();

        // Restore thought processes
        this.currentThoughtProcesses = item.thoughtProcesses ? [...item.thoughtProcesses] : [];

        // Show the output
        const outputTitle = document.getElementById('output-title');
        const outputContent = document.getElementById('output-content');

        if (outputTitle) outputTitle.textContent = item.title;
        if (outputContent) outputContent.innerHTML = item.content;

        // Restore thought processes in output area
        if (this.currentThoughtProcesses && this.currentThoughtProcesses.length > 0) {
            this.updateOutputThoughtProcesses();
        }

        // Add back to history button to output header
        this.addBackToHistoryButton();

        // Close history panel
        this.closeHistoryPanel();
    }

    deleteHistoryItem(id) {
        this.outputHistory = this.outputHistory.filter(h => h.id !== id);
        this.saveHistoryToStorage();
        this.updateHistoryPanel();
    }

    addBackToHistoryButton() {
        const outputHeader = document.querySelector('.output-header');
        if (!outputHeader) return;

        // Remove existing back button if present
        const existingBackBtn = outputHeader.querySelector('.back-to-history-btn');
        if (existingBackBtn) {
            existingBackBtn.remove();
        }

        // Create back to history button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-history-btn workspace-btn';
        backBtn.innerHTML = `
            <i class="fas fa-arrow-left"></i>
            <span>Back to History</span>
        `;

        backBtn.addEventListener('click', () => {
            this.openHistoryFromViewer();
        });

        // Insert the button at the beginning of the output meta section
        const outputMeta = outputHeader.querySelector('.output-meta');
        if (outputMeta) {
            outputHeader.insertBefore(backBtn, outputMeta);
        } else {
            outputHeader.appendChild(backBtn);
        }
    }

    openHistoryFromViewer() {
        // Remove the back button
        const backBtn = document.querySelector('.back-to-history-btn');
        if (backBtn) {
            backBtn.remove();
        }

        // Open history panel
        this.toggleHistoryPanel();
    }

    displayMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        chatMessages.innerHTML = '';

        this.messageHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}-message`;

            if (msg.sender === 'user') {
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">${msg.content}</div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">${msg.content}</div>
                    </div>
                `;
            }

            chatMessages.appendChild(messageDiv);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateJourneyFlowOutput(context, userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Determine journey type based on message
        let journeyType = 'Customer Journey Flow';
        let journeyDescription = 'Automated marketing journey';

        if (lowerMessage.includes('hotel') || lowerMessage.includes('travel')) {
            journeyType = 'Hotel Booking Journey';
            journeyDescription = 'Travel booking engagement flow';
        } else if (lowerMessage.includes('abandonment') || lowerMessage.includes('cart')) {
            journeyType = 'Cart Recovery Journey';
            journeyDescription = 'Abandoned cart recovery flow';
        } else if (lowerMessage.includes('welcome') || lowerMessage.includes('onboarding')) {
            journeyType = 'Welcome Journey';
            journeyDescription = 'New subscriber onboarding';
        } else if (lowerMessage.includes('retention') || lowerMessage.includes('win-back')) {
            journeyType = 'Retention Journey';
            journeyDescription = 'Customer win-back campaign';
        }

        return `
            <div class="modern-journey-container">
                <div class="journey-header">
                    <h3>${journeyType}</h3>
                    <p class="journey-subtitle">${journeyDescription}</p>
                    <div class="journey-stats">
                        <div class="stat">
                            <span class="stat-value">127</span>
                            <span class="stat-label">Active customers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">73%</span>
                            <span class="stat-label">Completion rate</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">4.2x</span>
                            <span class="stat-label">ROI</span>
                        </div>
                    </div>
                </div>

                <div class="journey-flow-modern">
                    <!-- Stage 1: Entry -->
                    <div class="journey-stage">
                        <div class="stage-header">
                            <span class="stage-number">1</span>
                            <span class="stage-title">Entry Point</span>
                        </div>
                        <div class="journey-card entry-card">
                            <div class="card-icon">
                                <i class="fas fa-sign-in-alt"></i>
                            </div>
                            <div class="card-content">
                                <h4>Campaign Subscribe</h4>
                                <p>Customer subscribes to campaign or meets segment criteria</p>
                                <div class="card-metrics">
                                    <span class="metric">1,240 entries</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Connector -->
                    <div class="journey-connector">
                        <div class="connector-line"></div>
                        <div class="connector-arrow">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>

                    <!-- Stage 2: Wait -->
                    <div class="journey-stage">
                        <div class="stage-header">
                            <span class="stage-number">2</span>
                            <span class="stage-title">Wait Period</span>
                        </div>
                        <div class="journey-card wait-card">
                            <div class="card-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="card-content">
                                <h4>24 Hour Wait</h4>
                                <p>Strategic delay for optimal engagement timing</p>
                                <div class="card-metrics">
                                    <span class="metric">Processing 892 customers</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Connector -->
                    <div class="journey-connector">
                        <div class="connector-line"></div>
                        <div class="connector-arrow">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>

                    <!-- Stage 3: Email -->
                    <div class="journey-stage">
                        <div class="stage-header">
                            <span class="stage-number">3</span>
                            <span class="stage-title">Engagement</span>
                        </div>
                        <div class="journey-card email-card">
                            <div class="card-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="card-content">
                                <h4>Welcome Email</h4>
                                <p>Personalized email with tracking enabled</p>
                                <div class="card-metrics">
                                    <span class="metric">67% open rate</span>
                                    <span class="metric">34% click rate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Decision Split -->
                    <div class="journey-connector">
                        <div class="connector-line"></div>
                        <div class="decision-split-modern">
                            <div class="split-icon">
                                <i class="fas fa-code-branch"></i>
                            </div>
                            <span class="split-label">Engagement Decision</span>
                        </div>
                    </div>

                    <!-- Stage 4: Branches -->
                    <div class="journey-branches">
                        <!-- Engaged Branch -->
                        <div class="journey-branch engaged">
                            <div class="branch-header">
                                <span class="branch-label">Engaged (34%)</span>
                            </div>
                            <div class="branch-steps">
                                <div class="journey-card small-card success">
                                    <div class="card-icon">
                                        <i class="fas fa-user-check"></i>
                                    </div>
                                    <div class="card-content">
                                        <h5>Interest Segmentation</h5>
                                        <p>Categorize by click behavior</p>
                                    </div>
                                </div>
                                <div class="small-connector">
                                    <i class="fas fa-arrow-down"></i>
                                </div>
                                <div class="journey-card small-card">
                                    <div class="card-icon">
                                        <i class="fas fa-bullhorn"></i>
                                    </div>
                                    <div class="card-content">
                                        <h5>Targeted Ads</h5>
                                        <p>Personalized Google Ads</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Not Engaged Branch -->
                        <div class="journey-branch not-engaged">
                            <div class="branch-header">
                                <span class="branch-label">Not Engaged (66%)</span>
                            </div>
                            <div class="branch-steps">
                                <div class="journey-card small-card warning">
                                    <div class="card-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="card-content">
                                        <h5>48 Hour Wait</h5>
                                        <p>Cool-down period</p>
                                    </div>
                                </div>
                                <div class="small-connector">
                                    <i class="fas fa-arrow-down"></i>
                                </div>
                                <div class="journey-card small-card">
                                    <div class="card-icon">
                                        <i class="fas fa-mobile-alt"></i>
                                    </div>
                                    <div class="card-content">
                                        <h5>Push Notification</h5>
                                        <p>Re-engagement attempt</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="journey-insights">
                    <h4>Key Insights</h4>
                    <div class="insights-grid">
                        <div class="insight-card">
                            <div class="insight-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="insight-content">
                                <h5>Performance</h5>
                                <p>34% email engagement rate exceeds industry average of 22%</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">
                                <i class="fas fa-target"></i>
                            </div>
                            <div class="insight-content">
                                <h5>Optimization</h5>
                                <p>Consider A/B testing subject lines to improve open rates</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="insight-content">
                                <h5>Segmentation</h5>
                                <p>Interest-based targeting shows 2.3x higher conversion</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="journey-actions">
                    <button class="journey-btn secondary" id="edit-journey-btn">
                        <i class="fas fa-edit"></i>
                        <span>Edit Journey</span>
                    </button>
                    <button class="journey-btn duplicate" id="duplicate-journey-btn">
                        <i class="fas fa-copy"></i>
                        <span>Duplicate</span>
                    </button>
                    <button class="journey-btn activate" id="activate-journey-btn">
                        <i class="fas fa-play"></i>
                        <span>Activate Journey</span>
                    </button>
                </div>
            </div>
        `;
    }

    handleJourneyActions() {
        // Add event listeners for journey action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#edit-journey-btn')) {
                this.editJourney();
            } else if (e.target.closest('#duplicate-journey-btn')) {
                this.duplicateJourney();
            } else if (e.target.closest('#activate-journey-btn')) {
                this.activateJourney();
            }
        });
    }

    editJourney() {
        // Create edit journey interface
        const editInterface = `
            <div class="journey-edit-modal">
                <div class="edit-modal-header">
                    <h3>Edit Journey Configuration</h3>
                    <button class="close-edit-btn" id="close-edit-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="edit-modal-content">
                    <div class="edit-section">
                        <h4>Journey Settings</h4>
                        <div class="form-group">
                            <label>Journey Name</label>
                            <input type="text" value="Customer Journey Flow" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea class="form-input" rows="2">Automated marketing journey</textarea>
                        </div>
                        <div class="form-group">
                            <label>Entry Criteria</label>
                            <select class="form-input">
                                <option>Campaign subscription</option>
                                <option>Segment qualification</option>
                                <option>Event trigger</option>
                                <option>Custom condition</option>
                            </select>
                        </div>
                    </div>

                    <div class="edit-section">
                        <h4>Journey Steps</h4>
                        <div class="steps-editor">
                            <div class="step-item">
                                <div class="step-header">
                                    <span class="step-number">1</span>
                                    <span class="step-title">Entry Point</span>
                                    <button class="edit-step-btn"><i class="fas fa-edit"></i></button>
                                </div>
                                <div class="step-config">
                                    <div class="form-group">
                                        <label>Wait Duration</label>
                                        <input type="text" value="Immediate" class="form-input">
                                    </div>
                                </div>
                            </div>

                            <div class="step-item">
                                <div class="step-header">
                                    <span class="step-number">2</span>
                                    <span class="step-title">Wait Period</span>
                                    <button class="edit-step-btn"><i class="fas fa-edit"></i></button>
                                </div>
                                <div class="step-config">
                                    <div class="form-group">
                                        <label>Wait Duration</label>
                                        <input type="text" value="24 hours" class="form-input">
                                    </div>
                                </div>
                            </div>

                            <div class="step-item">
                                <div class="step-header">
                                    <span class="step-number">3</span>
                                    <span class="step-title">Email Campaign</span>
                                    <button class="edit-step-btn"><i class="fas fa-edit"></i></button>
                                </div>
                                <div class="step-config">
                                    <div class="form-group">
                                        <label>Email Template</label>
                                        <select class="form-input">
                                            <option>Welcome Email</option>
                                            <option>Promotional Email</option>
                                            <option>Newsletter</option>
                                            <option>Custom Template</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="btn-secondary add-step-btn">
                            <i class="fas fa-plus"></i>
                            Add Step
                        </button>
                    </div>

                    <div class="edit-section">
                        <h4>Decision Logic</h4>
                        <div class="form-group">
                            <label>Engagement Criteria</label>
                            <div class="checkbox-group">
                                <label class="checkbox-item">
                                    <input type="checkbox" checked>
                                    <span>Email opened</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" checked>
                                    <span>Link clicked</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox">
                                    <span>Email replied to</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="edit-modal-actions">
                    <button class="journey-btn cancel" id="cancel-edit">
                        <i class="fas fa-times"></i>
                        <span>Cancel</span>
                    </button>
                    <button class="journey-btn primary" id="save-journey">
                        <i class="fas fa-save"></i>
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>
        `;

        // Add modal to output panel
        const outputContent = document.getElementById('output-content');
        if (outputContent) {
            outputContent.innerHTML = editInterface;

            // Add event listeners for modal actions
            document.getElementById('close-edit-modal')?.addEventListener('click', () => {
                this.closeEditModal();
            });
            document.getElementById('cancel-edit')?.addEventListener('click', () => {
                this.closeEditModal();
            });
            document.getElementById('save-journey')?.addEventListener('click', () => {
                this.saveJourneyChanges();
            });
        }
    }

    duplicateJourney() {
        this.addMessage('Creating a duplicate of this journey...', 'agent');

        setTimeout(() => {
            this.addMessage('✅ Journey duplicated successfully! The new journey "Customer Journey Flow (Copy)" has been created and saved to your drafts.', 'agent');
        }, 1500);
    }

    activateJourney() {
        this.addMessage('Activating journey and starting customer processing...', 'agent');

        setTimeout(() => {
            this.addMessage('🚀 Journey activated successfully! Customers meeting the entry criteria will now be automatically enrolled. You can monitor progress in the dashboard.', 'agent');
        }, 2000);
    }

    closeEditModal() {
        // Return to journey view
        const lastJourneyOutput = this.generateJourneyFlowOutput({}, 'customer journey');
        const outputContent = document.getElementById('output-content');
        if (outputContent) {
            outputContent.innerHTML = lastJourneyOutput;
        }
    }

    saveJourneyChanges() {
        this.addMessage('Saving journey configuration changes...', 'agent');

        setTimeout(() => {
            this.addMessage('✅ Journey changes saved successfully! The updated configuration is now active.', 'agent');
            this.closeEditModal();
        }, 1500);
    }

    addOutputActionButtons() {
        const outputHeader = document.querySelector('.output-header');
        if (!outputHeader) return;

        // Remove existing action buttons if present
        const existingActions = outputHeader.querySelector('.output-header-actions');
        if (existingActions) {
            existingActions.remove();
        }

        // Create action buttons container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'output-header-actions';
        actionsContainer.style.cssText = 'display: flex; gap: var(--space-sm); align-items: center;';

        // Create Export button
        const exportBtn = document.createElement('button');
        exportBtn.className = 'workspace-btn';
        exportBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Export</span>
        `;
        exportBtn.addEventListener('click', () => this.exportOutput());

        // Create Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'workspace-btn primary';
        shareBtn.innerHTML = `
            <i class="fas fa-share-alt"></i>
            <span>Share</span>
        `;
        shareBtn.addEventListener('click', () => this.shareOutput());

        actionsContainer.appendChild(shareBtn);
        actionsContainer.appendChild(exportBtn);

        // Add to header
        const outputTitleSection = outputHeader.querySelector('.output-title-section');
        if (outputTitleSection) {
            outputHeader.insertBefore(actionsContainer, outputTitleSection.nextSibling);
        } else {
            outputHeader.appendChild(actionsContainer);
        }
    }

    async shareOutput() {
        const outputTitle = document.getElementById('output-title')?.textContent || 'Marketing SuperAgent Output';
        const outputContent = document.getElementById('output-content');

        if (!outputContent) {
            this.addMessage("❌ No content available to share.", 'agent');
            return;
        }

        // Create shareable text
        const shareText = `${outputTitle}\n\nGenerated by Marketing SuperAgent\n\nView the full analysis and recommendations...`;
        const shareUrl = window.location.href;

        // Try Web Share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: outputTitle,
                    text: shareText,
                    url: shareUrl
                });
                this.addMessage("✅ Content shared successfully!", 'agent');
                return;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.warn('Web Share API failed:', error);
                }
                // Fall through to clipboard sharing
            }
        }

        // Fallback to clipboard
        this.fallbackShare(shareText, shareUrl);
    }

    async fallbackShare(shareText, shareUrl) {
        const fullShareText = `${shareText}\n\n${shareUrl}`;

        try {
            await navigator.clipboard.writeText(fullShareText);
            this.addMessage("✅ Share link copied to clipboard!", 'agent');
        } catch (error) {
            console.warn('Clipboard API failed:', error);

            // Ultimate fallback - show text to copy manually
            const shareModal = document.createElement('div');
            shareModal.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5); z-index: 1000;
                display: flex; align-items: center; justify-content: center;
            `;

            shareModal.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%;">
                    <h3 style="margin: 0 0 1rem 0;">Share Content</h3>
                    <p style="margin: 0 0 1rem 0; color: #666;">Copy this text to share:</p>
                    <textarea readonly style="width: 100%; height: 150px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 0.875rem;">${fullShareText}</textarea>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                        <button onclick="this.closest('.share-modal').remove()" style="padding: 0.5rem 1rem; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Close</button>
                    </div>
                </div>
            `;
            shareModal.className = 'share-modal';

            document.body.appendChild(shareModal);

            // Select the text for easy copying
            const textarea = shareModal.querySelector('textarea');
            textarea.select();
        }
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MarketingSuperAgentV4();
    app.handleJourneyActions();
    console.log('Marketing SuperAgent v4 loaded successfully');
});