// Marketing SuperAgent v4 - Complete Two-Panel Interface
class MarketingSuperAgentV4 {
    constructor() {
        this.currentView = 'home';
        this.messageHistory = [];
        this.currentAgents = [];
        this.outputHistory = [];
        this.currentSuiteTitle = 'Creative Ideation'; // Store current AI suite title - default to Creative
        this.currentRoute = 'home';

        // Autopilot system
        this.autopilotTasks = [];
        this.taskTemplates = this.initializeTaskTemplates();

        this.init();
        this.loadHistoryFromStorage();
        this.setupUniversalNextStepsListeners();
        this.initializeAutopilot();
        this.initRouting();
    }

    init() {
        console.log('Marketing SuperAgent v4 initialized');
        this.setupEventListeners();
        this.initializeInterface();
    }

    // Utility function to check if knowledge base sections will be shown
    willShowKnowledgeBase() {
        // Check if we're in a context where knowledge base sections are typically shown
        // This includes most AI-generated outputs and responses
        return true; // For now, always position progress in top-right when present
    }

    setupEventListeners() {
        // Main input handling
        const mainInput = document.getElementById('main-input');
        const mainSend = document.getElementById('main-send');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        // Main chat input (ChatGPT style)
        if (mainInput && mainSend) {
            const sendMainMessage = () => {
                const message = mainInput.value.trim();
                if (message) {
                    this.handleMainInput(message);
                    mainInput.value = '';
                    this.updateSendButtonState();
                    this.autoResizeTextarea();
                }
            };

            // Auto-resize textarea
            this.autoResizeTextarea = () => {
                mainInput.style.height = 'auto';
                mainInput.style.height = Math.min(mainInput.scrollHeight, 200) + 'px';
            };

            // Update send button state
            this.updateSendButtonState = () => {
                const hasContent = mainInput.value.trim().length > 0;
                mainSend.disabled = !hasContent;
            };

            mainSend.addEventListener('click', (e) => {
                e.preventDefault();
                if (!mainSend.disabled) {
                    sendMainMessage();
                }
            });

            mainInput.addEventListener('input', () => {
                this.updateSendButtonState();
                this.autoResizeTextarea();
            });

            mainInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!mainSend.disabled) {
                        sendMainMessage();
                    }
                }
            });

            // Initial state
            this.updateSendButtonState();
        }

        // Input action buttons handling
        this.setupInputActionButtons();

        // Role selector handling
        this.setupRoleSelector();

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

        // Autopilot buttons
        const sidebarAutopilotBtn = document.getElementById('sidebar-autopilot-btn');
        if (sidebarAutopilotBtn) {
            console.log('Found Autopilot button, adding event listener');
            sidebarAutopilotBtn.addEventListener('click', (e) => {
                console.log('=== AUTOPILOT BUTTON CLICKED ===');
                console.log('Event target:', e.target);
                console.log('Current hash before click:', window.location.hash);

                // Visual confirmation the click was captured
                sidebarAutopilotBtn.style.backgroundColor = 'red';
                setTimeout(() => {
                    sidebarAutopilotBtn.style.backgroundColor = '';
                }, 200);

                e.preventDefault();
                e.stopPropagation();

                // Direct hash setting test
                console.log('Setting hash directly to #autopilot');
                window.location.hash = '#autopilot';
                console.log('Hash after direct setting:', window.location.hash);

                // Also call the normal navigation
                this.showAutopilotPage();

                // Check hash after a delay to see if something overwrites it
                setTimeout(() => {
                    console.log('Hash after 100ms:', window.location.hash);
                }, 100);

                setTimeout(() => {
                    console.log('Hash after 500ms:', window.location.hash);
                }, 500);

                console.log('=== END AUTOPILOT CLICK HANDLER ===');
            });
        } else {
            console.log('Autopilot button not found');
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

        // Fallback event delegation for Knowledge Base and Autopilot buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#sidebar-knowledge-btn') || e.target.closest('#sidebar-knowledge-btn-working')) {
                console.log('Knowledge Base button clicked via event delegation');
                this.openKnowledgeBase();
            }
            if (e.target.closest('#sidebar-autopilot-btn')) {
                console.log('Autopilot button clicked via event delegation');
                e.preventDefault();
                e.stopPropagation();
                this.showAutopilotPage();
            }
            if (e.target.closest('#sidebar-campaigns-btn') || e.target.closest('#autopilot-campaigns-btn') || e.target.closest('#kb-campaigns-btn')) {
                console.log('Campaigns button clicked via event delegation');
                e.preventDefault();
                e.stopPropagation();
                this.showCampaignsPage();
            }
            if (e.target.closest('#create-task-btn')) {
                console.log('Create task button clicked via event delegation');
                e.preventDefault();
                e.stopPropagation();
                this.showAutopilotTaskCreation();
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

        // Creative and Engage quick entries - using global event delegation
        document.addEventListener('click', (e) => {
            // Handle Creative AI quick entries
            if (e.target.closest('.creative-prompt-option')) {
                const button = e.target.closest('.creative-prompt-option');
                const prompt = button.getAttribute('data-prompt');
                console.log('🎨 Creative prompt clicked via global delegation:', prompt);
                if (prompt) {
                    this.handleCreativePrompt(prompt);
                }
                return;
            }

            // Handle Engage AI quick entries
            if (e.target.closest('.engage-prompt-option')) {
                const button = e.target.closest('.engage-prompt-option');
                const prompt = button.getAttribute('data-prompt');
                console.log('🎯 Engage prompt clicked via global delegation:', prompt);
                if (prompt) {
                    this.handleEngagePrompt(prompt);
                }
                return;
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

        // Budget Allocation prompts (highest priority to avoid conflicts)
        if (lowerPrompt.includes('budget allocation') ||
            (lowerPrompt.includes('optimize') && lowerPrompt.includes('budget') && (lowerPrompt.includes('google') || lowerPrompt.includes('meta') || lowerPrompt.includes('linkedin')))) {
            return {
                task: 'budget-allocation',
                agents: ['Deep Research Agent', 'Historical Performance Agent', 'Budget Optimization Agent'],
                suiteTitle: 'Paid Media AI Suite',
                messageType: 'paid-media'
            };
        }

        // Creative & Asset Generation prompts
        if (lowerPrompt.includes('creative assets') || lowerPrompt.includes('instagram ads') ||
            lowerPrompt.includes('video ad scripts') || lowerPrompt.includes('creative')) {
            return {
                task: 'generate-creative',
                agents: ['Creative Agent', 'Research Agent', 'Audience Agent'],
                suiteTitle: 'Creative Ideation',
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

        // Performance & Optimization prompts (excluding budget allocation which is handled above)
        if (lowerPrompt.includes('optimize') || lowerPrompt.includes('performance') ||
            lowerPrompt.includes('landing pages') || lowerPrompt.includes('conversion')) {
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

        // Paid Media prompts (excluding budget allocation which is handled above)
        if (lowerPrompt.includes('google') || lowerPrompt.includes('meta') || lowerPrompt.includes('linkedin') ||
            lowerPrompt.includes('shopping campaigns') || lowerPrompt.includes('retargeting')) {
            return {
                task: 'budget-allocation',
                agents: ['Deep Research Agent', 'Historical Performance Agent', 'Budget Optimization Agent'],
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

        // Set output title based on context
        if (this.currentTask && this.taskToSuite && this.taskToSuite[this.currentTask] === null) {
            // For Kate's campaign manager tasks, use the task name as title
            const taskTitles = {
                'design-campaign-program': 'Campaign Strategy Output',
                'research-personas': 'Persona Research Output',
                'pick-channel-mix': 'Channel Strategy Output',
                'create-creative-brief': 'Creative Brief Output',
                'build-campaign-brief': 'Campaign Brief Output',
                'analyze-competitors': 'Competitive Analysis Output',
                'define-kpis': 'KPI Definition Output',
                'set-campaign-budget': 'Budget Planning Output'
            };
            this.currentSuiteTitle = taskTitles[this.currentTask] || 'Campaign Output';
        } else {
            // Detect relevant AI suite based on the input for other tasks
            const relevantSuite = this.detectRelevantAISuite(message);
            if (relevantSuite) {
                const areaTitles = {
                    'engage': 'Engage AI Suite',
                    'paid-media': 'Paid Media AI Suite',
                    'personalization': 'Personalization AI Suite',
                    'service': 'Service AI Suite',
                    'creative': 'Creative Ideation'
                };
                this.currentSuiteTitle = areaTitles[relevantSuite];
            } else {
                // Fallback: map message type to appropriate AI suite
                const messageType = this.analyzeMessage(message);
                this.currentSuiteTitle = this.getAISuiteFromMessageType(messageType);
            }
        }

        // Transition to working interface
        this.showWorkingInterface();

        // Add initial message to chat
        this.addMessage(message, 'user');

        // Special handling for design-campaign-program - skip processing messages and go direct to output
        if (this.currentTask === 'design-campaign-program') {
            // Generate campaign strategy output directly without any processing messages
            setTimeout(() => {
                // Set the correct title for campaign strategy
                this.currentSuiteTitle = 'Campaign Strategy';
                const outputTitle = document.getElementById('output-title');
                if (outputTitle) {
                    outputTitle.textContent = this.currentSuiteTitle;
                }

                // Generate the output content directly
                const context = this.extractContextFromMessage(message);
                const content = this.generateCampaignStrategyOutput(context, message);

                // Update the output panel directly
                const outputContent = document.getElementById('output-content');
                if (outputContent) {
                    outputContent.innerHTML = content;
                }

                // Add task-specific suggestions
                setTimeout(() => {
                    this.addTaskSpecificSuggestions('design-campaign-program');
                }, 1000);
            }, 500);
        } else {
            // Show processing indicator
            this.showProcessingIndicator();

            // Route to agents and generate response
            setTimeout(() => {
                this.routeToAgents(message);
            }, 1000);
        }

        // Clear task context after processing completes
        setTimeout(() => {
            this.clearTaskContext();
        }, 12000); // Clear after all processing is done (increased to ensure completion)
    }

    handleFileAttachment(files) {
        console.log('Files attached:', files);

        // Create file attachment display
        const fileNames = files.map(file => file.name).join(', ');
        const message = `📎 Attached files: ${fileNames}`;

        // Show in chat interface
        this.showWorkingInterface();
        this.addMessage(message, 'user');

        // Show processing indicator
        this.showProcessingIndicator();

        // Generate response about the attached files
        setTimeout(() => {
            this.addMessage('I can see you\'ve attached files. I\'ll analyze them and provide insights based on their content. This feature is currently being enhanced to provide deeper file analysis capabilities.', 'assistant');
            this.hideProcessingIndicator();
        }, 2000);

        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    setupInputActionButtons() {
        // File attachment button
        const attachButton = document.getElementById('attach-files');
        const fileInput = document.getElementById('file-input');

        if (attachButton && fileInput) {
            attachButton.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    this.handleFileAttachment(files);
                }
            });
        }
    }

    setupRoleSelector() {
        const roleBtn = document.getElementById('role-selector-btn');
        const roleDropdown = document.getElementById('role-dropdown');
        const roleOptions = document.querySelectorAll('.role-option');

        if (!roleBtn || !roleDropdown) return;

        // Toggle dropdown
        roleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = roleDropdown.classList.contains('show');

            if (isOpen) {
                this.closeRoleDropdown();
            } else {
                this.openRoleDropdown();
            }
        });

        // Handle role selection
        roleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectRole(option.dataset.role);
                this.closeRoleDropdown();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!roleBtn.contains(e.target) && !roleDropdown.contains(e.target)) {
                this.closeRoleDropdown();
            }
        });

        // Set initial selected state
        this.selectRole('kate');
    }

    openRoleDropdown() {
        const roleBtn = document.getElementById('role-selector-btn');
        const roleDropdown = document.getElementById('role-dropdown');

        roleBtn.classList.add('active');
        roleDropdown.classList.add('show');
    }

    closeRoleDropdown() {
        const roleBtn = document.getElementById('role-selector-btn');
        const roleDropdown = document.getElementById('role-dropdown');

        roleBtn.classList.remove('active');
        roleDropdown.classList.remove('show');
    }

    selectRole(roleId) {
        const roles = {
            'laura': { name: 'Laura', title: 'Lifecycle Marketer', avatarClass: 'laura-avatar' },
            'josh': { name: 'Josh', title: 'Growth Marketer', avatarClass: 'josh-avatar' },
            'emily': { name: 'Emily', title: 'Creative Marketer', avatarClass: 'emily-avatar' },
            'kate': { name: 'Kate', title: 'Campaign Manager', avatarClass: 'kate-avatar' }
        };

        const role = roles[roleId];
        if (!role) return;

        // Update main button avatar
        const mainAvatar = document.querySelector('.role-btn .role-avatar');
        const mainAvatarIllustration = document.querySelector('.role-btn .avatar-illustration');

        if (mainAvatar) mainAvatar.setAttribute('data-role', roleId);
        if (mainAvatarIllustration) {
            // Remove all avatar classes
            mainAvatarIllustration.classList.remove('laura-avatar', 'josh-avatar', 'emily-avatar', 'kate-avatar');
            // Add the correct avatar class
            mainAvatarIllustration.classList.add(role.avatarClass);
        }

        // Update text elements (if they exist - they won't in avatar-only mode)
        const roleNameEl = document.querySelector('.role-btn .role-name');
        const roleTitleEl = document.querySelector('.role-btn .role-title');

        if (roleNameEl) roleNameEl.textContent = role.name;
        if (roleTitleEl) roleTitleEl.textContent = role.title;

        // Update selected state in dropdown
        document.querySelectorAll('.role-option').forEach(option => {
            option.classList.remove('selected');
        });

        const selectedOption = document.querySelector(`[data-role="${roleId}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Update personalized content
        this.updatePersonalizedContent(roleId);

        // Store current role
        this.currentRole = roleId;

        console.log(`Selected role: ${role.name} - ${role.title}`);
    }

    updatePersonalizedContent(roleId) {
        // Update header content
        const defaultHeader = document.querySelector('.default-header');
        const roleHeaders = document.querySelectorAll('.role-header');

        if (defaultHeader) defaultHeader.style.display = 'none';
        roleHeaders.forEach(header => header.style.display = 'none');

        const selectedHeader = document.querySelector(`.${roleId}-header`);
        if (selectedHeader) selectedHeader.style.display = 'block';

        // Update example suggestions
        const defaultExamples = document.querySelector('.default-examples');
        const roleExamples = document.querySelectorAll('.role-examples');

        if (defaultExamples) defaultExamples.style.display = 'none';
        roleExamples.forEach(examples => examples.style.display = 'none');

        const selectedExamples = document.querySelector(`.${roleId}-examples`);
        if (selectedExamples) selectedExamples.style.display = 'block';

        // Update chat input placeholder
        const chatInput = document.getElementById('main-input');
        if (chatInput) {
            const placeholders = {
                'laura': 'Ask about lifecycle campaigns, customer retention, or email automation...',
                'josh': 'Ask about growth strategies, conversion optimization, or acquisition funnels...',
                'emily': 'Ask about creative concepts, brand storytelling, or visual campaigns...',
                'kate': 'Ask about campaign management, execution strategies, or performance optimization...'
            };
            chatInput.placeholder = placeholders[roleId] || 'Message Marketing SuperAgent...';
        }

        // Hide/show AI Suites section based on role
        const aiSuitesSection = document.querySelector('.ai-suites-section');
        if (aiSuitesSection) {
            if (roleId === 'kate') {
                aiSuitesSection.style.display = 'none';
            } else {
                aiSuitesSection.style.display = 'block';
            }
        }

        // Update quick start tasks based on role
        const defaultTasks = document.querySelector('.default-tasks');
        const kateTasks = document.querySelector('.kate-tasks');

        if (defaultTasks && kateTasks) {
            if (roleId === 'kate') {
                defaultTasks.style.display = 'none';
                kateTasks.style.display = 'flex';
                kateTasks.style.flexWrap = 'wrap';
                kateTasks.style.gap = 'var(--space-md)';
                kateTasks.style.justifyContent = 'center';
                kateTasks.style.maxWidth = '1000px';
                kateTasks.style.margin = '0 auto';
            } else {
                defaultTasks.style.display = 'flex';
                kateTasks.style.display = 'none';
            }
        }

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
            'creative': 'Creative Ideation',
            'journey': 'Engage AI Suite',
            'performance': 'Paid Media AI Suite',
            'audience': 'Engage AI Suite',
            'paid-media': 'Paid Media AI Suite',
            'general': 'Creative Ideation' // Default to Creative for general tasks
        };

        return messageTypeToSuite[messageType] || 'Creative Ideation';
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
        this.currentSuiteTitle = areaTitles[area] || 'Creative Ideation';

        // Special handling for Engage AI Suite
        if (area === 'engage') {
            this.showEngageInterface();
            return;
        }

        // Special handling for Paid Media AI Suite
        if (area === 'paid-media') {
            this.showPaidMediaInterface();
            return;
        }

        // Special handling for Creative AI Suite
        if (area === 'creative') {
            this.showCreativeInterface();
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

    showCreativeInterface() {
        // Transition to working interface
        this.showWorkingInterface();

        // Set the output title
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        // Show Creative AI welcome message
        this.addMessage("Welcome to Creative AI — your partner for generating and testing high-performing assets. What would you like to create today?", 'agent', 'Creative AI Assistant');

        // Show suggested prompts after a delay
        setTimeout(() => {
            const creativeSuggestionsHTML = `
                <div class="creative-quick-entries">
                    <h4>Quick entries</h4>
                    <div class="creative-entries-grid">
                        <button class="creative-prompt-option" data-prompt="Generate 3 Instagram ad variations for my Fall Collection launch">
                            <div class="creative-prompt-icon instagram">
                                <i class="fab fa-instagram"></i>
                            </div>
                            <div class="creative-prompt-text">Generate 3 Instagram ad variations for my Fall Collection launch</div>
                        </button>

                        <button class="creative-prompt-option" data-prompt="Find best-performing hero images from my DAM for Black Friday campaign">
                            <div class="creative-prompt-icon dam">
                                <i class="fas fa-images"></i>
                            </div>
                            <div class="creative-prompt-text">Find best-performing hero images from my DAM for Black Friday campaign</div>
                        </button>

                        <button class="creative-prompt-option" data-prompt="Draft 2 email subject lines to improve open rates for cart abandoners">
                            <div class="creative-prompt-icon email">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="creative-prompt-text">Draft 2 email subject lines to improve open rates for cart abandoners</div>
                        </button>

                        <button class="creative-prompt-option" data-prompt="Test alternative copy for my landing page headline">
                            <div class="creative-prompt-icon copy">
                                <i class="fas fa-edit"></i>
                            </div>
                            <div class="creative-prompt-text">Test alternative copy for my landing page headline</div>
                        </button>
                    </div>
                </div>
            `;

            this.addMessage(creativeSuggestionsHTML, 'agent', 'Creative AI Assistant');

            // Event listeners are now handled via global delegation in setupEventListeners()
            console.log('Creative AI quick entries displayed - using global event delegation');

            // Add knowledge base toggle option after suggestions
            setTimeout(() => {
                const knowledgeToggleHTML = `
                    <div style="margin-top: 1rem; padding: 1rem; background: var(--gray-50); border: 1px solid var(--border-light); border-radius: 8px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-book" style="color: var(--accent-primary);"></i>
                                <span style="font-weight: 600; color: var(--text-primary);">Knowledge Base Context</span>
                            </div>
                            <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
                                <input type="checkbox" id="creative-kb-toggle" checked style="opacity: 0; width: 0; height: 0;">
                                <span class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3b82f6; transition: 0.3s; border-radius: 28px;"></span>
                                <span class="toggle-dot" style="position: absolute; content: ''; height: 22px; width: 22px; right: 3px; top: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                            </label>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.4;">
                            <span id="creative-kb-status">
                                ✅ Using your brand guidelines and creative briefs for personalized suggestions
                            </span>
                        </div>
                    </div>
                `;

                this.addMessage(knowledgeToggleHTML, 'agent', 'Creative AI Assistant');

                // Setup toggle event listener
                const toggleElement = document.getElementById('creative-kb-toggle');
                if (toggleElement) {
                    toggleElement.addEventListener('change', (e) => {
                        this.handleCreativeKBToggle(e.target.checked);
                    });
                }
            }, 500);
        }, 800);
    }

    showEngageInterface() {
        // Transition to working interface
        this.showWorkingInterface();

        // Set the output title
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        // Show Engage AI welcome message
        this.addMessage("Welcome to Engage AI - your hub for building audiences, orchestrating journeys, and optimizing engagement across channels. What would you like to do today?", 'agent', 'Engage AI Assistant');

        // Show suggested prompts after a delay
        setTimeout(() => {
            const engageSuggestionsHTML = `
                <div class="engage-quick-entries">
                    <h4>Quick entries</h4>
                    <div class="engage-entries-grid">
                        <button class="engage-prompt-option" data-prompt="Build an audience of cart abandoners from the last 14 days">
                            <div class="engage-prompt-icon audience">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="engage-prompt-text">Build an audience of cart abandoners from the last 14 days</div>
                        </button>

                        <button class="engage-prompt-option" data-prompt="Design a reactivation journey for inactive subscribers">
                            <div class="engage-prompt-icon journey">
                                <i class="fas fa-sitemap"></i>
                            </div>
                            <div class="engage-prompt-text">Design a reactivation journey for inactive subscribers</div>
                        </button>

                        <button class="engage-prompt-option" data-prompt="Launch an email campaign for my VIP customers">
                            <div class="engage-prompt-icon campaign">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="engage-prompt-text">Launch an email campaign for my VIP customers</div>
                        </button>

                        <button class="engage-prompt-option" data-prompt="Check open and click rates for my last three email sends">
                            <div class="engage-prompt-icon analytics">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <div class="engage-prompt-text">Check open and click rates for my last three email sends</div>
                        </button>
                    </div>
                </div>
            `;

            this.addMessage(engageSuggestionsHTML, 'agent', 'Engage AI Assistant');

            // Event listeners are now handled via global delegation in setupEventListeners()
            console.log('Engage AI quick entries displayed - using global event delegation');
        }, 800);
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

        // Special handling for campaign brief - show examples interface
        if (task === 'campaign-brief') {
            this.showCampaignBriefExamples();
            return;
        }

        // Special handling for design campaign program - show guided example
        if (task === 'design-campaign-program') {
            this.showCampaignProgramGuide();
            return;
        }

        // Special handling for campaign strategy flow

        const taskPrompts = {
            'campaign-brief': 'Create a comprehensive campaign brief with objectives, target audience, and strategy',
            'optimize-campaign': 'Analyze my current campaign performance and provide optimization recommendations',
            'campaign-insights': 'Generate detailed insights and analytics for my running campaigns',
            'setup-journey': 'Design an automated customer journey with email, SMS, and push notifications',
            'generate-creative': 'Start an interactive creative ideation workshop to brainstorm and develop innovative concepts based on your brief',
            'audience-segments': 'Build detailed audience segments based on demographics, behavior, and preferences',
            'budget-allocation': 'Optimize my marketing budget allocation across channels for maximum ROI',
            'ab-test': 'Set up A/B testing framework for campaigns with statistical significance tracking',
            'competitor-analysis': 'Analyze competitor marketing strategies, positioning, and performance benchmarks',
            'content-calendar': 'Create a strategic content calendar with scheduling and theme planning',
            // Kate's campaign manager tasks
            'design-campaign-program': 'Design a comprehensive campaign program with strategic direction, messaging, audience targeting, and competitive analysis',
            'research-personas': 'Research and develop detailed target audience personas for campaign planning',
            'pick-channel-mix': 'Recommend the optimal channel mix and budget allocation for campaign success',
            'create-creative-brief': 'Create a detailed creative brief with messaging, visual direction, and brand guidelines',
            'build-campaign-brief': 'Build a comprehensive campaign brief with objectives, strategy, and execution plan',
            'analyze-competitors': 'Analyze competitor campaigns, positioning, and market opportunities',
            'define-kpis': 'Define key performance indicators and measurement framework for campaign success',
            'set-campaign-budget': 'Set and optimize campaign budget allocation across channels and tactics'
        };

        // Task-to-agents mapping - specify which agents are most relevant for each task
        const taskToAgents = {
            'campaign-brief': ['Research Agent', 'Audience Agent', 'Performance Agent'],
            'optimize-campaign': ['Performance Agent', 'Analytics Agent', 'Historical Agent'],
            'campaign-insights': ['Analytics Agent', 'Performance Agent', 'Historical Agent'],
            'setup-journey': ['Journey Agent', 'Audience Agent', 'Personalization Agent'],
            'generate-creative': ['Creative Agent', 'Research Agent', 'Audience Agent'],
            'audience-segments': ['Audience Agent', 'Analytics Agent', 'Research Agent'],
            'budget-allocation': ['Deep Research Agent', 'Historical Performance Agent', 'Budget Optimization Agent'],
            'ab-test': ['Creative Agent', 'Performance Agent', 'Analytics Agent'],
            'competitor-analysis': ['Research Agent', 'Performance Agent', 'Historical Agent'],
            'content-calendar': ['Creative Agent', 'Research Agent', 'Journey Agent'],
            // Kate's campaign manager tasks with specialized agents
            'design-campaign-program': ['Campaign Architect Agent', 'Persona Research Agent', 'Competitive Intelligence Agent'],
            'research-personas': ['Persona Research Agent', 'Research Agent', 'Analytics Agent'],
            'pick-channel-mix': ['Campaign Architect Agent', 'Channel Strategy Agent', 'Persona Research Agent'],
            'create-creative-brief': ['Creative Brief Agent', 'Creative Ideation Agent', 'Campaign Architect Agent'],
            'build-campaign-brief': ['Campaign Architect Agent', 'Research Agent', 'Performance Agent'],
            'analyze-competitors': ['Competitive Intelligence Agent', 'Research Agent', 'Performance Agent'],
            'define-kpis': ['Performance Agent', 'Analytics Agent', 'Campaign Architect Agent'],
            'set-campaign-budget': ['Budget Optimization Agent', 'Performance Agent', 'Campaign Architect Agent']
        };

        // Direct task-to-suite mapping for higher accuracy
        this.taskToSuite = {
            'campaign-brief': 'paid-media',
            'optimize-campaign': 'paid-media',
            'campaign-insights': 'paid-media',
            'setup-journey': 'engage',
            'generate-creative': 'creative',
            'audience-segments': 'engage',
            'budget-allocation': 'paid-media',
            'ab-test': 'creative',
            'competitor-analysis': null, // Let AI detection handle this
            'content-calendar': 'creative',
            // Kate's campaign manager tasks - no suite mapping
            'design-campaign-program': null,
            'research-personas': null,
            'pick-channel-mix': null,
            'create-creative-brief': null,
            'build-campaign-brief': null,
            'analyze-competitors': null,
            'define-kpis': null,
            'set-campaign-budget': null
        };

        // Set AI suite title if we have a direct mapping
        const directSuite = this.taskToSuite[task];
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

        console.log('🎯 Task context set:', {
            task: this.currentTask,
            agents: this.currentTaskAgents
        });

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
        console.log('🔄 showWorkingInterface called'); // Debug log

        const homeScreen = document.getElementById('home-screen');
        const workingInterface = document.getElementById('working-interface');
        const appHeader = document.querySelector('.app-header');
        const mainContent = document.querySelector('.main-content');

        console.log('🔍 Elements found:', {
            homeScreen: !!homeScreen,
            workingInterface: !!workingInterface,
            appHeader: !!appHeader,
            mainContent: !!mainContent
        }); // Debug log

        if (homeScreen) {
            homeScreen.style.display = 'none';
            console.log('✅ Home screen hidden'); // Debug log
        }
        if (workingInterface) {
            workingInterface.style.display = 'grid';
            console.log('✅ Working interface shown'); // Debug log
        }
        if (appHeader) {
            appHeader.style.display = 'none';
            console.log('✅ App header hidden'); // Debug log
        }
        if (mainContent) {
            mainContent.classList.add('working-mode');
            console.log('✅ Working mode class added'); // Debug log
        }

        this.currentView = 'working';
        console.log('🎯 Current view set to working'); // Debug log

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

    showCampaignBriefExamples() {
        // Show working interface first
        this.showWorkingInterface();

        // Set AI suite title
        this.currentSuiteTitle = 'Campaign Brief Assistant';
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        // Add initial message
        this.addMessage("I'll help you create a comprehensive campaign brief. Choose from these example scenarios or describe your own campaign:", 'agent', 'Campaign Brief Assistant');

        // Show examples interface in chat messages
        const campaignExamplesHTML = `
                <div class="creative-quick-entries">
                    <h4>Campaign Brief Examples</h4>
                    <div class="creative-entries-grid">
                        <button class="creative-prompt-option" data-campaign-type="product-launch-tech">
                            <div class="creative-prompt-icon email">
                                <i class="fas fa-laptop"></i>
                            </div>
                            <span class="creative-prompt-text">Tech Product Launch - Launch a new SaaS platform targeting B2B customers with $100K budget</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="product-launch-consumer">
                            <div class="creative-prompt-icon dam">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <span class="creative-prompt-text">Consumer Product Launch - Launch eco-friendly skincare line targeting millennials and Gen Z</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="holiday-sale">
                            <div class="creative-prompt-icon instagram">
                                <i class="fas fa-gift"></i>
                            </div>
                            <span class="creative-prompt-text">Holiday Sale Campaign - Black Friday/Cyber Monday campaign for e-commerce retailer</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="back-to-school">
                            <div class="creative-prompt-icon copy">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <span class="creative-prompt-text">Back-to-School Campaign - Target students and parents with education technology solutions</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="user-acquisition">
                            <div class="creative-prompt-icon email">
                                <i class="fas fa-users"></i>
                            </div>
                            <span class="creative-prompt-text">User Acquisition - Scale mobile app downloads and registrations for fintech startup</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="retention-campaign">
                            <div class="creative-prompt-icon dam">
                                <i class="fas fa-heart"></i>
                            </div>
                            <span class="creative-prompt-text">Customer Retention - Re-engage inactive subscribers with personalized win-back campaign</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="brand-awareness">
                            <div class="creative-prompt-icon instagram">
                                <i class="fas fa-bullhorn"></i>
                            </div>
                            <span class="creative-prompt-text">Brand Awareness - Build brand recognition for sustainable fashion startup targeting Gen Z</span>
                        </button>
                        <button class="creative-prompt-option" data-campaign-type="brand-repositioning">
                            <div class="creative-prompt-icon copy">
                                <i class="fas fa-sync-alt"></i>
                            </div>
                            <span class="creative-prompt-text">Brand Repositioning - Modernize established brand perception for younger demographics</span>
                        </button>
                    </div>
                </div>
            `;

        // Add examples as a chat message
        this.addMessage(campaignExamplesHTML, 'agent', 'Campaign Brief Assistant');

        // Add event listeners for example cards
        this.setupCampaignExampleListeners();
    }

    showCampaignProgramGuide() {
        // Show working interface first
        this.showWorkingInterface();

        // Set task context for design-campaign-program
        this.currentTaskAgents = ['Campaign Architect Agent', 'Persona Research Agent', 'Competitive Intelligence Agent'];
        this.currentTask = 'design-campaign-program';

        // Set AI suite title
        this.currentSuiteTitle = 'Campaign Strategy';
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = this.currentSuiteTitle;
        }

        // Show guided example interface
        const campaignGuideHTML = `
            <div class="campaign-guide-interface">
                <div class="guide-header">
                    <h2>Great! Let's design your campaign</h2>
                    <p>Tell me about your campaign goals, budget, target audience, and timeline - just like you're briefing a team member.</p>
                </div>

                <div class="guide-example">
                    <div class="example-header">
                        <div class="example-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <span class="example-label">For example:</span>
                    </div>

                    <div class="example-content">
                        <p>"I need to launch a holiday campaign for our new smartwatch. We're targeting tech-savvy millennials aged 25-40 who are interested in fitness and productivity. Our budget is $75K over 6 weeks, starting Black Friday through New Year's. Main goal is driving online sales with a target ROAS of 4x. We want to focus on Google Ads and Meta platforms, with video creative showcasing the health tracking features."</p>
                    </div>
                </div>

                <div class="guide-pro-tip">
                    <div class="pro-tip-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="pro-tip-content">
                        <strong>Pro tip:</strong> The more details you provide, the more tailored and actionable your campaign strategy will be!
                    </div>
                </div>
            </div>
        `;

        // Add guide as a chat message
        this.addMessage(campaignGuideHTML, 'agent', 'Campaign Architect Agent');

        // Enable input for user to describe their campaign
        const inputField = document.getElementById('main-input');
        if (inputField) {
            inputField.placeholder = "Describe your campaign goals, budget, target audience, and timeline...";
            inputField.focus();
        }
    }

    generateCustomCampaignBrief(description) {
        this.addMessage(`Create a comprehensive campaign brief: ${description}`, 'user');

        // Determine relevant agents based on description keywords
        let agents = ['Research Agent', 'Audience Agent', 'Performance Agent'];

        if (description.toLowerCase().includes('creative') || description.toLowerCase().includes('design') || description.toLowerCase().includes('content')) {
            agents.push('Creative Agent');
        }
        if (description.toLowerCase().includes('journey') || description.toLowerCase().includes('automation') || description.toLowerCase().includes('flow')) {
            agents.push('Journey Agent');
        }
        if (description.toLowerCase().includes('analytics') || description.toLowerCase().includes('measurement') || description.toLowerCase().includes('tracking')) {
            agents.push('Analytics Agent');
        }
        if (description.toLowerCase().includes('personalization') || description.toLowerCase().includes('targeting') || description.toLowerCase().includes('segmentation')) {
            agents.push('Personalization Agent');
        }

        // Remove duplicates and limit to 4 agents
        agents = [...new Set(agents)].slice(0, 4);

        // Show processing indicator
        this.showProcessingIndicator();

        // Show agent progress
        setTimeout(() => {
            this.showCampaignBriefAgentProgress(agents, 'custom', description);
        }, 1000);

        // Generate comprehensive brief
        setTimeout(() => {
            this.displayComprehensiveCampaignBrief('custom', description);
        }, 4000);
    }

    showCampaignBriefAgentProgress(agents, campaignType, description = '') {
        const agentConfigs = {
            'Research Agent': { color: '#9256d9', icon: 'fas fa-search' },
            'Audience Agent': { color: '#2d9d78', icon: 'fas fa-users' },
            'Performance Agent': { color: '#1957db', icon: 'fas fa-chart-line' },
            'Creative Agent': { color: '#e34850', icon: 'fas fa-palette' },
            'Journey Agent': { color: '#e68619', icon: 'fas fa-sitemap' },
            'Analytics Agent': { color: '#1957db', icon: 'fas fa-chart-bar' },
            'Historical Agent': { color: '#6366f1', icon: 'fas fa-history' },
            'Personalization Agent': { color: '#9256d9', icon: 'fas fa-user-cog' },
            'Campaign Architect Agent': { color: '#e11d48', icon: 'fas fa-blueprint' },
            'Persona Research Agent': { color: '#7c3aed', icon: 'fas fa-user-friends' },
            'Channel Strategy Agent': { color: '#f59e0b', icon: 'fas fa-broadcast-tower' },
            'Competitive Intelligence Agent': { color: '#dc2626', icon: 'fas fa-chess' },
            'Creative Brief Agent': { color: '#8b5cf6', icon: 'fas fa-file-alt' },
            'Ad Copy Agent': { color: '#ec4899', icon: 'fas fa-pen-nib' },
            'Creative Ideation Agent': { color: '#f59e0b', icon: 'fas fa-lightbulb' },
            'Social Creative Agent': { color: '#10b981', icon: 'fas fa-share-alt' },
            'Display Creative Agent': { color: '#3b82f6', icon: 'fas fa-image' },
            'Knowledge Base Onboarding Agent': { color: '#6366f1', icon: 'fas fa-graduation-cap' }
        };

        const agentDetails = {
            'Research Agent': {
                name: 'Research Agent',
                tasks: [
                    'Analyzing market landscape and opportunities',
                    'Researching competitive positioning',
                    'Identifying industry trends and insights',
                    'Compiling strategic recommendations'
                ]
            },
            'Audience Agent': {
                name: 'Audience Agent',
                tasks: [
                    'Defining target audience segments',
                    'Analyzing demographic and psychographic data',
                    'Creating detailed buyer personas',
                    'Mapping audience journey touchpoints'
                ]
            },
            'Performance Agent': {
                name: 'Performance Agent',
                tasks: [
                    'Setting performance benchmarks and KPIs',
                    'Analyzing budget allocation strategies',
                    'Forecasting campaign performance',
                    'Defining success metrics and tracking'
                ]
            },
            'Creative Agent': {
                name: 'Creative Agent',
                tasks: [
                    'Developing creative strategy and concepts',
                    'Designing campaign messaging framework',
                    'Planning visual identity and assets',
                    'Creating content themes and guidelines'
                ]
            },
            'Journey Agent': {
                name: 'Journey Agent',
                tasks: [
                    'Mapping customer journey stages',
                    'Designing touchpoint experiences',
                    'Creating automation workflows',
                    'Optimizing conversion funnels'
                ]
            },
            'Analytics Agent': {
                name: 'Analytics Agent',
                tasks: [
                    'Setting up measurement framework',
                    'Defining attribution models',
                    'Creating performance dashboards',
                    'Establishing reporting cadence'
                ]
            },
            'Historical Agent': {
                name: 'Historical Agent',
                tasks: [
                    'Analyzing past campaign performance',
                    'Identifying successful strategies',
                    'Learning from previous challenges',
                    'Applying historical insights'
                ]
            },
            'Personalization Agent': {
                name: 'Personalization Agent',
                tasks: [
                    'Creating personalization strategies',
                    'Defining dynamic content rules',
                    'Setting up behavioral triggers',
                    'Optimizing individual experiences'
                ]
            },
            'Campaign Architect Agent': {
                name: 'Campaign Architect Agent',
                tasks: [
                    'Designing comprehensive campaign structure',
                    'Creating strategic framework and blueprint',
                    'Mapping campaign architecture and flow',
                    'Establishing campaign governance model'
                ]
            },
            'Persona Research Agent': {
                name: 'Persona Research Agent',
                tasks: [
                    'Conducting deep audience research',
                    'Creating detailed persona profiles',
                    'Analyzing behavioral patterns and motivations',
                    'Validating persona assumptions with data'
                ]
            },
            'Channel Strategy Agent': {
                name: 'Channel Strategy Agent',
                tasks: [
                    'Optimizing channel mix and allocation',
                    'Analyzing channel performance metrics',
                    'Creating multi-channel distribution strategy',
                    'Coordinating cross-channel integration'
                ]
            },
            'Competitive Intelligence Agent': {
                name: 'Competitive Intelligence Agent',
                tasks: [
                    'Monitoring competitive landscape',
                    'Analyzing competitor strategies and tactics',
                    'Identifying market positioning opportunities',
                    'Providing strategic competitive insights'
                ]
            },
            'Creative Brief Agent': {
                name: 'Creative Brief Agent',
                tasks: [
                    'Developing comprehensive creative briefs',
                    'Defining creative strategy and direction',
                    'Establishing brand guidelines and standards',
                    'Creating creative framework and requirements'
                ]
            },
            'Ad Copy Agent': {
                name: 'Ad Copy Agent',
                tasks: [
                    'Writing compelling ad headlines and copy',
                    'Creating persuasive call-to-action messaging',
                    'Optimizing copy for different platforms',
                    'Testing and refining messaging variants'
                ]
            },
            'Creative Ideation Agent': {
                name: 'Creative Ideation Agent',
                tasks: [
                    'Generating innovative creative concepts',
                    'Brainstorming unique campaign ideas',
                    'Developing creative themes and narratives',
                    'Exploring emerging creative trends'
                ]
            },
            'Social Creative Agent': {
                name: 'Social Creative Agent',
                tasks: [
                    'Designing social media creative assets',
                    'Creating platform-specific content formats',
                    'Developing social engagement strategies',
                    'Optimizing content for social algorithms'
                ]
            },
            'Display Creative Agent': {
                name: 'Display Creative Agent',
                tasks: [
                    'Creating display advertising visuals',
                    'Designing banner and rich media ads',
                    'Optimizing creative for different placements',
                    'Developing responsive ad layouts'
                ]
            },
            'Knowledge Base Onboarding Agent': {
                name: 'Knowledge Base Onboarding Agent',
                tasks: [
                    'Guiding knowledge base setup process',
                    'Organizing information architecture',
                    'Creating onboarding workflows',
                    'Establishing knowledge management best practices'
                ]
            }
        };

        // Check if knowledge base sections will be shown
        const hasKnowledgeBase = this.willShowKnowledgeBase();
        const progressClass = hasKnowledgeBase ? 'agent-progress-display kb-positioned' : 'agent-progress-display';
        console.log('Progress positioning:', { hasKnowledgeBase, progressClass });

        let progressContent = `
            <div class="${progressClass}">
                <div class="progress-header">
                    <i class="fas fa-cogs"></i>
                    Campaign Brief Generation in Progress
                </div>
                <div class="agent-progress-list">
        `;

        agents.forEach((agentName, index) => {
            const config = agentConfigs[agentName];
            const details = agentDetails[agentName];

            if (config && details) {
                const currentTask = details.tasks[Math.floor(Math.random() * details.tasks.length)];

                progressContent += `
                    <div class="agent-progress-item working" style="animation-delay: ${index * 0.5}s">
                        <div class="agent-progress-icon" style="background: linear-gradient(135deg, ${config.color}, ${config.color}dd)">
                            <i class="${config.icon}"></i>
                        </div>
                        <div class="agent-progress-content">
                            <div class="agent-progress-name">${agentName}</div>
                            <div class="agent-progress-task">${currentTask}</div>
                        </div>
                        <div class="agent-status-indicator working">
                            <i class="fas fa-sync-alt fa-spin"></i>
                        </div>
                    </div>
                `;
            }
        });

        progressContent += `
                </div>
            </div>
        `;

        this.addMessage(progressContent, 'agent', 'Campaign Brief Assistant');
    }

    displayComprehensiveCampaignBrief(campaignType, customDescription = '') {
        const outputContent = document.getElementById('output-content');
        if (!outputContent) return;

        // Campaign brief data for different types
        const campaignBriefs = {
            'product-launch-tech': {
                title: 'SaaS Platform Launch Campaign Brief',
                objective: 'Drive awareness and trial adoption for new B2B SaaS platform among technology decision-makers',
                budget: '$100,000',
                duration: '12 weeks',
                targetAudience: 'B2B Technology Decision-Makers',
                primaryGoal: 'Generate 500 qualified leads and 50 trial signups',
                kpis: ['Lead Generation: 500 qualified leads', 'Trial Conversions: 50 signups', 'Brand Awareness: 25% lift', 'Cost per Lead: <$200'],
                channels: ['LinkedIn Ads', 'Google Ads', 'Content Marketing', 'Webinars'],
                messaging: 'Transform your workflow with intelligent automation'
            },
            'product-launch-consumer': {
                title: 'Eco-Friendly Skincare Launch Campaign Brief',
                objective: 'Launch sustainable skincare line targeting environmentally conscious millennials and Gen Z consumers',
                budget: '$75,000',
                duration: '8 weeks',
                targetAudience: 'Eco-conscious Millennials & Gen Z',
                primaryGoal: 'Achieve 1,000 product sales and 15% market awareness',
                kpis: ['Product Sales: 1,000 units', 'Brand Awareness: 15% lift', 'Social Engagement: 10K interactions', 'Customer Acquisition Cost: <$75'],
                channels: ['Instagram Ads', 'TikTok', 'Influencer Partnerships', 'Email Marketing'],
                messaging: 'Clean beauty that cares for you and the planet'
            },
            'holiday-sale': {
                title: 'Black Friday/Cyber Monday Campaign Brief',
                objective: 'Maximize revenue during peak shopping season with strategic promotions and channel optimization',
                budget: '$150,000',
                duration: '6 weeks',
                targetAudience: 'E-commerce Shoppers & Existing Customers',
                primaryGoal: 'Achieve $1.5M in revenue with 4:1 ROAS',
                kpis: ['Revenue: $1.5M target', 'ROAS: 4:1 minimum', 'Conversion Rate: 8% lift', 'Customer Retention: 25% increase'],
                channels: ['Google Shopping', 'Facebook/Instagram Ads', 'Email Marketing', 'Retargeting'],
                messaging: 'Biggest savings of the year - limited time only'
            },
            'back-to-school': {
                title: 'Back-to-School EdTech Campaign Brief',
                objective: 'Capture education market during back-to-school season targeting students, parents, and educators',
                budget: '$80,000',
                duration: '10 weeks',
                targetAudience: 'Students, Parents & Educators',
                primaryGoal: 'Drive 2,000 app downloads and 500 premium subscriptions',
                kpis: ['App Downloads: 2,000', 'Premium Subscriptions: 500', 'Brand Awareness: 20% lift', 'Cost per Acquisition: <$160'],
                channels: ['Social Media', 'Search Ads', 'Educational Partnerships', 'Content Marketing'],
                messaging: 'Empower learning success this school year'
            },
            'user-acquisition': {
                title: 'Fintech App User Acquisition Campaign Brief',
                objective: 'Scale mobile app downloads and user registrations for fintech platform targeting young professionals',
                budget: '$120,000',
                duration: '16 weeks',
                targetAudience: 'Young Professionals (25-35)',
                primaryGoal: 'Acquire 10,000 new users with 30% activation rate',
                kpis: ['New Users: 10,000', 'Activation Rate: 30%', 'Cost per Install: <$12', 'Lifetime Value: >$300'],
                channels: ['App Store Optimization', 'Social Media Ads', 'Referral Program', 'Financial Media'],
                messaging: 'Take control of your financial future'
            },
            'retention-campaign': {
                title: 'Win-Back Retention Campaign Brief',
                objective: 'Re-engage inactive subscribers with personalized experiences to drive reactivation and retention',
                budget: '$50,000',
                duration: '12 weeks',
                targetAudience: 'Inactive Subscribers (90+ days)',
                primaryGoal: 'Reactivate 20% of inactive subscribers',
                kpis: ['Reactivation Rate: 20%', 'Email Open Rate: 35%', 'Click-through Rate: 8%', 'Revenue Recovery: $200K'],
                channels: ['Email Marketing', 'SMS', 'Push Notifications', 'Personalized Offers'],
                messaging: 'We miss you - come back to exclusive benefits'
            },
            'brand-awareness': {
                title: 'Sustainable Fashion Brand Awareness Campaign Brief',
                objective: 'Build brand recognition and consideration for sustainable fashion startup among Gen Z consumers',
                budget: '$90,000',
                duration: '14 weeks',
                targetAudience: 'Eco-conscious Gen Z (18-26)',
                primaryGoal: 'Achieve 25% brand awareness and 500K social impressions',
                kpis: ['Brand Awareness: 25%', 'Social Impressions: 500K', 'Website Traffic: 50K visits', 'Social Followers: +10K'],
                channels: ['TikTok', 'Instagram', 'Influencer Partnerships', 'Sustainable Fashion Media'],
                messaging: 'Fashion that doesnt cost the earth'
            },
            'brand-repositioning': {
                title: 'Brand Modernization Campaign Brief',
                objective: 'Reposition established brand to appeal to younger demographics while maintaining core customer base',
                budget: '$200,000',
                duration: '20 weeks',
                targetAudience: 'Millennials & Gen Z + Existing Customers',
                primaryGoal: 'Shift brand perception and increase younger demo consideration by 30%',
                kpis: ['Brand Perception Shift: 30%', 'Younger Demo Consideration: 30%', 'Overall Brand Health: Maintain', 'Social Sentiment: +15%'],
                channels: ['Multi-platform Digital', 'Influencer Partnerships', 'Content Marketing', 'PR & Events'],
                messaging: 'Timeless quality meets modern innovation'
            }
        };

        let briefData;
        if (campaignType === 'custom') {
            briefData = {
                title: 'Custom Campaign Brief',
                objective: customDescription,
                budget: 'To be determined',
                duration: '8-12 weeks',
                targetAudience: 'Target audience analysis pending',
                primaryGoal: 'Campaign goals to be defined based on objectives',
                kpis: ['Lead Generation: TBD', 'Conversion Rate: TBD', 'Brand Awareness: TBD', 'ROI: TBD'],
                channels: ['Multi-channel approach recommended', 'Channel mix to be optimized', 'Based on audience insights'],
                messaging: 'Messaging strategy to be developed'
            };
        } else {
            briefData = campaignBriefs[campaignType] || campaignBriefs['product-launch-tech'];
        }

        const comprehensiveBrief = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-document-alt"></i>${briefData.title}</h2>
                        <p class="output-subtitle">Comprehensive campaign strategy with specialist agent analysis</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">${briefData.budget}</span>
                            <span class="stat-label">Budget</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${briefData.duration}</span>
                            <span class="stat-label">Duration</span>
                        </div>
                    </div>
                </div>

                <div class="campaign-brief-grid">
                    <div class="brief-section campaign-overview">
                        <div class="section-header">
                            <h3><i class="fas fa-bullseye"></i>Campaign Overview</h3>
                        </div>
                        <div class="overview-content">
                            <div class="overview-item">
                                <h4>Primary Objective</h4>
                                <p>${briefData.objective}</p>
                            </div>
                            <div class="overview-item">
                                <h4>Target Audience</h4>
                                <p>${briefData.targetAudience}</p>
                            </div>
                            <div class="overview-item">
                                <h4>Primary Goal</h4>
                                <p>${briefData.primaryGoal}</p>
                            </div>
                            <div class="overview-item">
                                <h4>Key Messaging</h4>
                                <p>${briefData.messaging}</p>
                            </div>
                        </div>
                    </div>

                    <div class="brief-section kpi-metrics">
                        <div class="section-header">
                            <h3><i class="fas fa-chart-line"></i>Key Performance Indicators</h3>
                        </div>
                        <div class="kpi-grid">
                            ${briefData.kpis.map(kpi => `
                                <div class="kpi-card">
                                    <div class="kpi-icon">
                                        <i class="fas fa-chart-bar"></i>
                                    </div>
                                    <div class="kpi-details">
                                        <span class="kpi-metric">${kpi}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="brief-section channel-strategy">
                        <div class="section-header">
                            <h3><i class="fas fa-broadcast-tower"></i>Channel Strategy</h3>
                        </div>
                        <div class="channel-grid">
                            ${briefData.channels.map((channel, index) => `
                                <div class="channel-card priority-${index < 2 ? 'high' : 'medium'}">
                                    <div class="channel-icon">
                                        <i class="fas fa-${channel.toLowerCase().includes('google') ? 'search' :
                                                  channel.toLowerCase().includes('social') || channel.toLowerCase().includes('instagram') || channel.toLowerCase().includes('facebook') ? 'share-alt' :
                                                  channel.toLowerCase().includes('email') ? 'envelope' :
                                                  channel.toLowerCase().includes('tiktok') ? 'video' : 'bullhorn'}"></i>
                                    </div>
                                    <span class="channel-name">${channel}</span>
                                    <span class="channel-priority">${index < 2 ? 'Primary' : 'Secondary'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="brief-section specialist-analysis">
                        <div class="section-header">
                            <h3><i class="fas fa-users-cog"></i>Specialist Agent Analysis</h3>
                        </div>
                        <div class="analysis-insights">
                            <div class="insight-card research">
                                <div class="insight-icon">
                                    <i class="fas fa-search"></i>
                                </div>
                                <div class="insight-content">
                                    <h4>Market Research Insights</h4>
                                    <ul>
                                        <li>Competitive landscape analysis shows 23% market opportunity</li>
                                        <li>Trend analysis indicates 45% growth in target segment</li>
                                        <li>Consumer sentiment data supports positioning strategy</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="insight-card audience">
                                <div class="insight-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="insight-content">
                                    <h4>Audience Intelligence</h4>
                                    <ul>
                                        <li>Primary segment: ${briefData.targetAudience}</li>
                                        <li>Behavioral patterns optimized for ${briefData.channels[0]}</li>
                                        <li>Messaging resonance score: 8.2/10</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="insight-card performance">
                                <div class="insight-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="insight-content">
                                    <h4>Performance Forecasting</h4>
                                    <ul>
                                        <li>Projected ROAS: 4.2:1 based on historical data</li>
                                        <li>Expected conversion rate: 3.8% (+15% vs industry)</li>
                                        <li>Budget efficiency score: 94/100</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="brief-section implementation-timeline">
                        <div class="section-header">
                            <h3><i class="fas fa-calendar-alt"></i>Implementation Timeline</h3>
                        </div>
                        <div class="timeline-phases">
                            <div class="phase-card setup">
                                <div class="phase-number">1</div>
                                <div class="phase-content">
                                    <h4>Setup & Preparation</h4>
                                    <span class="phase-duration">Weeks 1-2</span>
                                    <p>Campaign setup, creative development, audience configuration</p>
                                </div>
                            </div>

                            <div class="phase-card launch">
                                <div class="phase-number">2</div>
                                <div class="phase-content">
                                    <h4>Launch & Scale</h4>
                                    <span class="phase-duration">Weeks 3-6</span>
                                    <p>Campaign launch, performance monitoring, initial optimizations</p>
                                </div>
                            </div>

                            <div class="phase-card optimize">
                                <div class="phase-number">3</div>
                                <div class="phase-content">
                                    <h4>Optimize & Expand</h4>
                                    <span class="phase-duration">Weeks 7-${briefData.duration.split(' ')[0]}</span>
                                    <p>Data-driven optimizations, budget reallocation, scale winning elements</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        outputContent.innerHTML = comprehensiveBrief;

        // Add final message
        this.addMessage("✅ Comprehensive campaign brief generated! The specialist agents have analyzed market opportunities, audience insights, and performance forecasts to create your strategic foundation. Ready to move to execution?", 'agent', 'Campaign Brief Assistant');

        // Setup next steps listeners - not needed since we moved suggestions to chat
        // this.setupBriefNextStepsListeners();
    }

    setupBriefNextStepsListeners() {
        // Remove existing listener first to prevent duplicates
        if (this.briefNextStepsHandler) {
            document.removeEventListener('click', this.briefNextStepsHandler);
        }

        // Create new handler and store reference
        this.briefNextStepsHandler = (e) => {
            const btn = e.target.closest('.next-step-btn');
            if (btn) {
                const action = btn.getAttribute('data-action');
                this.handleBriefNextStep(action);
            }
        };

        // Add the new listener
        document.addEventListener('click', this.briefNextStepsHandler);
    }

    handleBriefNextStep(action) {
        const actionMessages = {
            'generate-creative': 'Generate creative assets and variations for this campaign',
            'build-audiences': 'Build detailed target audience segments for this campaign',
            'design-journey': 'Design customer journey flows and touchpoints for this campaign',
            'setup-tracking': 'Setup comprehensive performance tracking and analytics for this campaign'
        };

        const message = actionMessages[action] || 'Continue with campaign development';
        this.addMessage(message, 'user');

        // Route to appropriate specialist based on action
        const actionRouting = {
            'generate-creative': () => this.handleCreativeRequest(),
            'build-audiences': () => this.handleEngageRequest(),
            'design-journey': () => this.handleEngageRequest(),
            'setup-tracking': () => this.routeToAgents('Setup performance tracking and analytics')
        };

        setTimeout(() => {
            if (actionRouting[action]) {
                actionRouting[action]();
            } else {
                this.routeToAgents(message);
            }
        }, 1000);
    }

    generateSuggestedNextSteps(outputType, context = {}) {
        const nextStepsConfigs = {
            'campaign-brief': [
                'Generate creative assets for this campaign',
                'Build target audiences for segments',
                'Design customer journey flows',
                'Setup performance tracking'
            ],
            'audience-analysis': [
                'Create detailed personas',
                'Map customer journey for segments',
                'Generate targeted creative assets',
                'Setup targeted campaigns'
            ],
            'creative-concepts': [
                'Create more creative variations',
                'Setup A/B tests for concepts',
                'Build campaigns with assets',
                'Generate additional assets'
            ],
            'journey-flow': [
                'Add more customer touchpoints',
                'Generate journey content',
                'Setup marketing automation',
                'Test journey effectiveness'
            ],
            'content-calendar': [
                'Create content assets',
                'Schedule publishing workflow',
                'Setup approval processes',
                'Track content performance'
            ],
            'performance-analysis': [
                'Optimize campaign performance',
                'Create campaign improvements',
                'Scale winning elements',
                'Test new variations'
            ],
            'research-insights': [
                'Create strategy brief',
                'Design target audiences',
                'Develop campaign messaging',
                'Plan channel strategy'
            ],
            'default': [
                'Create campaign brief',
                'Generate creative assets',
                'Analyze target audience',
                'Setup customer journey'
            ]
        };

        const suggestions = nextStepsConfigs[outputType] || nextStepsConfigs['default'];

        return `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--gray-700);">Suggested next steps:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${suggestions.map(suggestion => `
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
    }

    setupUniversalNextStepsListeners() {
        // Remove existing listener first to prevent duplicates
        if (this.universalNextStepsHandler) {
            document.removeEventListener('click', this.universalNextStepsHandler);
        }

        // Create new handler and store reference
        this.universalNextStepsHandler = (e) => {
            const btn = e.target.closest('.next-step-action-btn');
            if (btn) {
                const action = btn.getAttribute('data-action');
                this.handleUniversalNextStep(action);
            }
        };

        // Add the new listener
        document.addEventListener('click', this.universalNextStepsHandler);
    }

    handleUniversalNextStep(action) {
        const actionMap = {
            'generate-creative': 'Generate creative assets and variations',
            'build-audiences': 'Build detailed target audience segments',
            'design-journey': 'Design customer journey flows and touchpoints',
            'setup-tracking': 'Setup comprehensive performance tracking',
            'create-personas': 'Create detailed customer personas',
            'create-variations': 'Create more creative variations',
            'setup-ab-test': 'Setup A/B testing framework',
            'build-campaigns': 'Build comprehensive marketing campaigns',
            'create-assets': 'Generate additional creative assets',
            'create-touchpoints': 'Add more customer touchpoints',
            'generate-content': 'Generate content for customer journey',
            'setup-automation': 'Setup marketing automation workflows',
            'test-journey': 'Test customer journey effectiveness',
            'create-content': 'Create content assets for calendar',
            'schedule-posts': 'Schedule content publishing',
            'setup-approval': 'Setup content approval workflows',
            'track-performance': 'Track content performance metrics',
            'optimize-campaigns': 'Optimize campaign performance',
            'create-improvements': 'Create campaign improvements',
            'expand-winning': 'Scale winning campaign elements',
            'test-variations': 'Test new campaign variations',
            'create-strategy': 'Create comprehensive strategy brief',
            'design-audience': 'Design target audience segments',
            'develop-messaging': 'Develop campaign messaging',
            'plan-channels': 'Plan multi-channel strategy',
            'create-campaign': 'Create new campaign brief',
            'analyze-audience': 'Analyze target audience insights',
            'setup-journey': 'Setup customer journey automation'
        };

        const message = actionMap[action] || 'Continue with marketing development';
        this.addMessage(message, 'user');

        // Route to appropriate specialist based on action
        setTimeout(() => {
            if (action.includes('creative') || action.includes('assets') || action.includes('content')) {
                this.handleCreativeRequest();
            } else if (action.includes('audience') || action.includes('journey') || action.includes('personas')) {
                this.handleEngageRequest();
            } else if (action.includes('campaign') || action === 'create-strategy') {
                this.showCampaignBriefExamples();
            } else {
                this.routeToAgents(message);
            }
        }, 1000);
    }

    addMessage(content, sender = 'agent', agentName = 'SuperAgent') {
        console.log(`📧 addMessage called: sender=${sender}, agentName=${agentName}, content preview=${content.substring(0, 50)}...`); // Debug log

        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) {
            console.log('❌ chat-messages element not found in addMessage'); // Debug log
            return;
        }

        console.log('✅ chat-messages element found, creating message...'); // Debug log

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

        console.log('🔗 Appending message to chat...'); // Debug log
        chatMessages.appendChild(messageDiv);

        // Scroll behavior: For agent messages, scroll to show the beginning of the message
        // For user messages, scroll to bottom as usual
        if (sender === 'agent') {
            // Scroll to show the beginning of the agent message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // For user messages, scroll to bottom as before
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        console.log('✅ Message appended successfully'); // Debug log

        this.messageHistory.push({
            content,
            sender,
            agentName,
            timestamp: new Date()
        });
    }

    displayOutput(content, title = 'AI Output', agentName = 'SuperAgent') {
        console.log(`🖥️ displayOutput called: title=${title}, agentName=${agentName}`); // Debug log

        // First, remove any typing indicators
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const typingIndicators = chatMessages.querySelectorAll('.agent-typing');
            typingIndicators.forEach(indicator => {
                console.log('🗑️ Removing typing indicator...'); // Debug log
                indicator.remove();
            });
        }

        // Update the output panel title and metadata
        const outputTitle = document.getElementById('output-title');
        if (outputTitle) {
            outputTitle.textContent = title;
            console.log('📝 Updated output title:', title); // Debug log
        }

        const lastUpdated = document.getElementById('last-updated');
        if (lastUpdated) {
            lastUpdated.textContent = 'Just now';
            console.log('⏰ Updated timestamp'); // Debug log
        }

        const agentsUsed = document.getElementById('agents-used');
        if (agentsUsed) {
            agentsUsed.textContent = agentName;
            console.log('🤖 Updated agent name:', agentName); // Debug log
        }

        // Update the output content
        const outputContent = document.getElementById('output-content');
        if (outputContent) {
            outputContent.innerHTML = content;

            // Restore thought processes after setting content
            setTimeout(() => {
                if (this.currentThoughtProcesses && this.currentThoughtProcesses.length > 0) {
                    this.updateOutputThoughtProcesses();
                }
            }, 100);

            // Add universal suggested next steps to chat
            setTimeout(() => {
                try {
                    console.log('🔍 Debug: Starting next steps timeout'); // Debug log
                    const outputType = this.getOutputTypeFromTitle(title);
                    console.log('🔍 Debug: title=', title, 'outputType=', outputType); // Debug log
                const nextStepsConfigs = {
                    'campaign-brief': [
                        'Generate creative assets for this campaign',
                        'Build target audiences for segments',
                        'Design customer journey flows',
                        'Setup performance tracking'
                    ],
                    'creative': [
                        'Test these creatives with A/B experiments',
                        'Generate additional creative variations',
                        'Setup creative performance tracking',
                        'Launch multi-channel creative campaigns'
                    ],
                    'journey': [
                        'Activate this customer journey',
                        'Create personalized content for each touchpoint',
                        'Setup journey performance monitoring',
                        'Build advanced audience segmentation for this flow'
                    ],
                    'audience': [
                        'Create targeted campaigns for each segment',
                        'Generate personalized creative assets',
                        'Design multi-channel customer journeys',
                        'Setup lookalike audience expansion'
                    ],
                    'performance': [
                        'Optimize budget allocation based on insights',
                        'Create new audience segments from learnings',
                        'Generate improved creative variants',
                        'Setup automated optimization rules'
                    ],
                    'budget': [
                        'Setup budget alerts and monitoring',
                        'Create scenario planning models',
                        'Implement auto-bidding strategies',
                        'Schedule regular budget reviews'
                    ],
                    'ab-test': [
                        'Launch these test variations',
                        'Setup test monitoring dashboard',
                        'Plan follow-up experiments',
                        'Create testing documentation'
                    ],
                    'research': [
                        'Set up competitive monitoring alerts',
                        'Create competitive positioning strategy',
                        'Analyze competitor creative strategies',
                        'Build market intelligence dashboard'
                    ],
                    'optimization': [
                        'Implement optimization recommendations',
                        'Setup automated optimization rules',
                        'Create performance monitoring alerts',
                        'Plan next optimization experiments'
                    ],
                    'email': [
                        'Activate this email campaign',
                        'Setup automated email workflows',
                        'Create email performance dashboard',
                        'Design follow-up email sequences'
                    ],
                    'general': [
                        'Continue with creative asset generation',
                        'Setup advanced audience targeting',
                        'Design customer journey optimization',
                        'Launch comprehensive performance tracking'
                    ]
                };
                const suggestions = nextStepsConfigs[outputType] || nextStepsConfigs['general'];
                console.log('🔍 Debug: Adding suggestions:', suggestions); // Debug log
                this.addFollowUpSuggestions(suggestions);
                } catch (error) {
                    console.error('❌ Error in next steps timeout:', error);
                }
            }, 1000);

            console.log('✅ Output content updated successfully'); // Debug log
        } else {
            console.log('❌ output-content element not found'); // Debug log
        }

        // Add completion message to chat
        this.addMessage(`✅ ${title} generated successfully! Check the output panel for detailed results.`, 'agent', agentName);
    }

    getOutputTypeFromTitle(title) {
        const titleLower = title.toLowerCase();

        if (titleLower.includes('campaign brief') || titleLower.includes('brief')) return 'campaign-brief';
        if (titleLower.includes('creative') || titleLower.includes('ad variations') || titleLower.includes('instagram') || titleLower.includes('dam image') || titleLower.includes('asset')) return 'creative';
        if (titleLower.includes('journey') || titleLower.includes('flow') || titleLower.includes('reactivation')) return 'journey';
        if (titleLower.includes('audience') || titleLower.includes('segment') || titleLower.includes('abandoner') || titleLower.includes('targeting')) return 'audience';
        if (titleLower.includes('performance') || titleLower.includes('analytics') || titleLower.includes('report') || titleLower.includes('analysis')) return 'performance';
        if (titleLower.includes('budget') || titleLower.includes('allocation') || titleLower.includes('media plan')) return 'budget';
        if (titleLower.includes('a/b test') || titleLower.includes('test') || titleLower.includes('headline') || titleLower.includes('subject line')) return 'ab-test';
        if (titleLower.includes('competitor') || titleLower.includes('research') || titleLower.includes('market')) return 'research';
        if (titleLower.includes('optimization') || titleLower.includes('optimize')) return 'optimization';
        if (titleLower.includes('email') || titleLower.includes('engagement') || titleLower.includes('vip')) return 'email';

        return 'general';
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
            performance: ['Performance', 'Analytics Agent', 'Research Agent'],
            audience: ['Audience', 'Research Agent', 'Analytics Agent'],
            'paid-media': ['Paid Media', 'Performance', 'Analytics Agent'],
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
            'Journey': { icon: 'fas fa-sitemap', color: '#f59e0b', task: 'Mapping customer touchpoints and flows' },
            'Journey Agent': { icon: 'fas fa-sitemap', color: '#f59e0b', task: 'Mapping customer touchpoints and flows' },
            'Performance': { icon: 'fas fa-chart-bar', color: '#3b82f6', task: 'Reviewing campaign performance data' },
            'Performance Agent': { icon: 'fas fa-chart-bar', color: '#3b82f6', task: 'Reviewing campaign performance data' },
            'Audience': { icon: 'fas fa-users', color: '#10b981', task: 'Identifying target segments' },
            'Audience Agent': { icon: 'fas fa-users', color: '#10b981', task: 'Identifying target segments' },
            'Paid Media': { icon: 'fas fa-dollar-sign', color: '#14b8a6', task: 'Optimizing budget allocation' },
            'Historical': { icon: 'fas fa-history', color: '#6366f1', task: 'Analyzing past campaign learnings' },
            'Historical Agent': { icon: 'fas fa-history', color: '#6366f1', task: 'Analyzing past campaign learnings' },
            'AI Decisioning': { icon: 'fas fa-microchip', color: '#ef4444', task: 'Processing strategic recommendations' },
            'Analytics Agent': { icon: 'fas fa-chart-line', color: '#2563eb', task: 'Analyzing data and metrics' },
            'Personalization Agent': { icon: 'fas fa-user-edit', color: '#9256d9', task: 'Optimizing personalized experiences' },
            'Budget Optimization Agent': { icon: 'fas fa-calculator', color: '#059669', task: 'Optimizing budget allocation and ROI' },
            'Historical Performance Agent': { icon: 'fas fa-chart-bar', color: '#7c3aed', task: 'Analyzing historical campaign performance' },
            'Campaign Architect Agent': { icon: 'fas fa-blueprint', color: '#e11d48', task: 'Designing comprehensive campaign structure and framework' },
            'Persona Research Agent': { icon: 'fas fa-user-friends', color: '#7c3aed', task: 'Researching target audience personas and behaviors' },
            'Channel Strategy Agent': { icon: 'fas fa-broadcast-tower', color: '#f59e0b', task: 'Optimizing channel mix and distribution strategy' },
            'Competitive Intelligence Agent': { icon: 'fas fa-chess', color: '#dc2626', task: 'Analyzing competitive landscape and positioning opportunities' },
            'Creative Brief Agent': { icon: 'fas fa-file-alt', color: '#8b5cf6', task: 'Developing creative briefs and strategic direction' },
            'Ad Copy Agent': { icon: 'fas fa-pen-nib', color: '#ec4899', task: 'Creating compelling ad copy and messaging' },
            'Creative Ideation Agent': { icon: 'fas fa-lightbulb', color: '#f59e0b', task: 'Generating innovative creative concepts and ideas' },
            'Social Creative Agent': { icon: 'fas fa-share-alt', color: '#10b981', task: 'Designing social media creative assets and content' },
            'Display Creative Agent': { icon: 'fas fa-image', color: '#3b82f6', task: 'Creating display advertising visuals and layouts' },
            'Knowledge Base Onboarding Agent': { icon: 'fas fa-graduation-cap', color: '#6366f1', task: 'Guiding knowledge base setup and organization' }
        };

        // Generate a unique timestamp for this progress session
        const timestamp = Date.now();

        // Check if knowledge base sections will be shown
        const hasKnowledgeBase = this.willShowKnowledgeBase();
        const progressClass = hasKnowledgeBase ? 'agent-progress-display kb-positioned' : 'agent-progress-display';
        console.log('Progress positioning:', { hasKnowledgeBase, progressClass });

        const progressHTML = `
            <div class="${progressClass}">
                <div class="progress-header" id="progress-header-${timestamp}">
                    <i class="fas fa-cog fa-spin" id="progress-icon-${timestamp}"></i>
                    <span id="progress-text-${timestamp}">Activating ${activeAgents.length} specialist agents</span>
                </div>
                <div class="agent-progress-list">
                    ${activeAgents.map((agentName, index) => {
                        const agent = agentDetails[agentName];
                        if (!agent) {
                            console.error(`Agent details not found for: ${agentName}`);
                            return ''; // Skip this agent if details not found
                        }
                        const itemId = `agent-${agentName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
                        return `
                            <div class="agent-progress-item" id="${itemId}">
                                <div class="agent-progress-icon" style="background: ${agent.color}">
                                    <i class="${agent.icon}"></i>
                                </div>
                                <div class="agent-progress-content">
                                    <div class="agent-progress-name">${agentName}</div>
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

        // Clear previous thought processes for clean state
        this.currentThoughtProcesses = [];

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
            // Generate thought processes for all agents that actually ran
            this.generateThoughtProcessesForCurrentAgents(userMessage);
        }, maxCompletionTime);
    }

    generateThoughtProcessesForCurrentAgents(userMessage = '') {
        // Generate thought processes only for agents that actually ran
        if (!this.currentAgents || this.currentAgents.length === 0) {
            return;
        }

        // Clear any existing thought processes first
        this.currentThoughtProcesses = [];

        // Generate thought processes for each agent that ran
        this.currentAgents.forEach((agentName, index) => {
            setTimeout(() => {
                this.addAgentReasoningToResponse(agentName, userMessage);
            }, index * 300); // Stagger them for natural flow
        });
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
                        taskDiv.innerHTML = `<i class="fas fa-microchip" style="margin-right: 6px; color: var(--accent-purple);"></i>${shortStatus}`;
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
            },
            'Deep Research Agent': {
                'budget': 'Market intelligence reveals optimal budget allocation opportunities based on competitive analysis and emerging digital advertising trends, with video content showing 73% growth in effectiveness.',
                'google': 'Search advertising landscape analysis indicates high-intent keyword opportunities with 40% lower competition in premium inventory segments.',
                'meta': 'Social platform analysis shows audience overlap optimization can reduce acquisition costs by 22% while maintaining reach objectives.',
                'default': 'Comprehensive market research indicates strategic budget reallocation opportunities with projected 31% ROI improvement through data-driven channel optimization.'
            },
            'Historical Performance Agent': {
                'budget': 'Historical performance patterns show seasonal budget allocation strategies yielding 45% higher conversion rates, with mobile engagement peaking during evening hours.',
                'allocation': 'Past campaign data reveals optimal 38% search, 32% social, 18% display, 12% testing allocation produces highest sustained ROAS across quarterly cycles.',
                'optimize': 'Performance trend analysis indicates budget reallocation timing within first 3 weeks of campaign launch maximizes scaling opportunities and efficiency gains.',
                'default': 'Historical analysis reveals budget optimization opportunities with proven 23% performance improvement through strategic channel reallocation and timing adjustments.'
            },
            'Budget Optimization Agent': {
                'allocation': 'AI-driven allocation modeling processes 24M data points to recommend optimal budget distribution with 95% confidence score and 31% projected ROI lift.',
                'google': 'Budget allocation optimization for Google Ads indicates 38% allocation optimal for search + shopping campaigns targeting high-intent keywords.',
                'meta': 'Meta platform budget modeling suggests 32% allocation for video ads and retargeting achieves optimal audience engagement and conversion efficiency.',
                'default': 'Budget optimization analysis recommends strategic reallocation across 7 channels with mathematical modeling projecting 31% ROI improvement and enhanced performance scalability.'
            },
            'Creative Agent': {
                'instagram': 'Creative analysis shows Instagram carousel formats achieve 42% higher engagement with bold typography and 3-color palettes performing optimally for brand consistency.',
                'video': 'Video creative research indicates 6-second hooks capture 73% more attention, with emotional storytelling frameworks outperforming product-focused content by 35%.',
                'assets': 'Creative asset analysis reveals multi-variant testing across 3-5 concept directions optimizes campaign effectiveness while reducing creative fatigue through systematic rotation.',
                'default': 'Creative performance modeling suggests strategic creative variations with A/B testing frameworks to optimize engagement and conversion across all touchpoints.'
            },
            'Research Agent': {
                'competitor': 'Competitive analysis reveals 3 key market gaps: pricing strategy opportunities, underserved demographic segments, and timing advantages for promotional campaigns.',
                'market': 'Market research indicates strong growth opportunities in emerging consumer segments, with data supporting a multi-channel approach for maximum reach and engagement.',
                'analysis': 'Research analysis identifies market positioning opportunities with competitive intelligence supporting strategic differentiation and audience targeting refinements.',
                'default': 'Market research indicates strategic opportunities for audience expansion and competitive positioning with data-driven insights supporting campaign optimization.'
            },
            'Audience Agent': {
                'segments': 'Audience segmentation identifies 4 high-value behavioral segments representing 73% of revenue potential, with personalized messaging increasing relevance scores by 45%.',
                'targeting': 'Targeting analysis reveals precision audience strategies that improve conversion rates by 31% through behavioral pattern recognition and demographic optimization.',
                'persona': 'Audience persona analysis indicates 3 primary customer archetypes with distinct engagement preferences and purchasing behaviors for tailored campaign approaches.',
                'default': 'Audience analysis reveals untapped segments with 40% higher lifetime value potential and specific messaging preferences that align with strategic positioning.'
            },
            'Performance Agent': {
                'optimization': 'Performance analysis shows conversion rate optimization opportunities across 4 funnel stages, with landing page improvements projected to increase conversions by 23%.',
                'analytics': 'Analytics insights reveal optimization opportunities that could improve campaign efficiency by 18-25% through strategic budget reallocation and targeting refinements.',
                'tracking': 'Performance tracking analysis identifies key measurement frameworks and attribution models to optimize campaign effectiveness and ROI measurement accuracy.',
                'default': 'Performance data analysis reveals optimization opportunities that could improve campaign efficiency by 18-25% through strategic refinements and data-driven adjustments.'
            },
            'Journey Agent': {
                'flow': 'Journey mapping analysis identifies 7 key touchpoints with personalization opportunities that can increase conversion rates by an average of 31% through optimized sequencing.',
                'automation': 'Customer journey automation reveals strategic touchpoint optimization opportunities with behavioral triggers increasing engagement rates by 45%.',
                'touchpoints': 'Journey touchpoint analysis shows optimal messaging sequence timing can improve conversion flows by 28% through personalized engagement strategies.',
                'default': 'Customer journey mapping identifies optimization opportunities across touchpoints with personalization strategies increasing conversion rates by an average of 31%.'
            },
            'Analytics Agent': {
                'insights': 'Analytics framework reveals performance patterns and optimization opportunities with statistical modeling showing 27% improvement potential through data-driven adjustments.',
                'metrics': 'Metrics analysis identifies key performance indicators and measurement strategies that optimize campaign tracking and attribution for enhanced decision-making.',
                'reporting': 'Analytics reporting framework provides comprehensive performance insights with predictive modeling capabilities for proactive campaign optimization.',
                'default': 'Analytics insights reveal comprehensive performance optimization opportunities with statistical modeling projecting 27% improvement through strategic data-driven adjustments.'
            },
            'Personalization Agent': {
                'targeting': 'Personalization analysis reveals dynamic content strategies with behavioral triggers and customer preference mapping increasing engagement by 52%.',
                'content': 'Content personalization framework shows individualized messaging approaches improving conversion rates by 38% through preference-based content delivery.',
                'experience': 'Experience personalization strategies identify optimal user journey customization opportunities with behavioral data driving 41% engagement improvements.',
                'default': 'Personalization analysis reveals dynamic content strategies designed with behavioral triggers and customer preference mapping for enhanced engagement effectiveness.'
            },
            'Historical Agent': {
                'performance': 'Historical performance analysis reveals seasonal trends and cyclical behaviors with proven strategies that have consistently delivered 25-40% above-benchmark results.',
                'trends': 'Historical trend analysis shows optimal timing and promotional strategies from past campaigns with success factors for repeatable performance improvements.',
                'learnings': 'Historical learnings analysis identifies key success factors and failure indicators from past campaigns to inform current strategy optimization.',
                'default': 'Historical performance patterns indicate seasonal trends and messaging strategies that have consistently delivered 25-40% above-benchmark results.'
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
        // Only add if this agent actually ran in the current session
        if (this.currentAgents && this.currentAgents.includes(agentName)) {
            setTimeout(() => {
                this.addThoughtProcessToOutput(agentName, insight, userMessage);
            }, Math.random() * 2000 + 500); // Stagger insights naturally
        }
    }

    addThoughtProcessSection(agentName, insight, userMessage) {
        const thoughtProcessId = `thought-process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const thoughtProcessHTML = `
            <div class="thought-process-container" style="margin: var(--space-sm) 0; border: var(--border); border-radius: var(--radius-md); background: var(--gray-50);">
                <div class="thought-process-header" onclick="app.toggleThoughtProcess('${thoughtProcessId}')" style="padding: var(--space-sm) var(--space-md); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border);">
                    <div style="display: flex; align-items: center; gap: var(--space-xs);">
                        <i class="fas fa-microchip" style="color: var(--accent-purple);"></i>
                        <span style="font-weight: 600; color: var(--text-primary); font-size: var(--label);">${agentName} - Thought Process</span>
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

        // Only add thought process if this agent actually ran
        if (this.currentAgents && this.currentAgents.includes(agentName)) {
            this.currentThoughtProcesses.push({
                agentName,
                insight,
                userMessage,
                framework: this.getAnalysisFramework(agentName, userMessage)
            });

            // Update the output area with thought processes
            this.updateOutputThoughtProcesses();
        }
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
                    <i class="fas fa-microchip" style="color: var(--accent-purple);"></i>
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
                            <i class="fas fa-microchip" style="color: var(--accent-purple); font-size: 14px;"></i>
                            <span style="font-weight: 600; color: var(--text-primary); font-size: var(--font-base);">${process.agentName.replace(/ Agent$/, '')} Agent</span>
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

        // Skip response generation if we're already handling a creative prompt
        if (this.isHandlingCreativePrompt && messageType === 'creative') {
            console.log('🎨 Skipping generateResponse for creative - already handled by handleCreativePrompt');
            return;
        }

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
        // Preserve task context locally in case it gets cleared during processing
        const preservedTask = this.currentTask;
        const preservedTaskAgents = this.currentTaskAgents;

        console.log('🔍 updateOutputPanel called with:', messageType, 'currentTask:', this.currentTask, 'currentTaskAgents:', this.currentTaskAgents);
        console.log('🔍 Will use task-specific output:', !!(this.currentTask && this.currentTaskAgents));

        // Skip output panel update if we're already handling a creative prompt
        if (this.isHandlingCreativePrompt && messageType === 'creative') {
            console.log('🎨 Skipping updateOutputPanel for creative - already handled by handleCreativePrompt');
            return;
        }

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
        // Temporarily restore task context for output generation
        const originalTask = this.currentTask;
        const originalTaskAgents = this.currentTaskAgents;
        this.currentTask = preservedTask;
        this.currentTaskAgents = preservedTaskAgents;

        const content = this.generateCollectiveAgentOutput(messageType, userMessage);

        // Restore original context
        this.currentTask = originalTask;
        this.currentTaskAgents = originalTaskAgents;

        // Add task-specific suggestions if this is a task-specific output
        if (preservedTask && preservedTaskAgents) {
            setTimeout(() => {
                this.addTaskSpecificSuggestions(preservedTask);
            }, 2500);
        }

        // Add export button to the output content
        outputContent.innerHTML = content;

        // Restore thought processes after setting content
        setTimeout(() => {
            if (this.currentThoughtProcesses && this.currentThoughtProcesses.length > 0) {
                this.updateOutputThoughtProcesses();
            }
        }, 100);

        // Add universal suggested next steps to chat
        setTimeout(() => {
            try {
            const nextStepsConfigs = {
                'campaign-brief': [
                    'Generate creative assets for this campaign',
                    'Build target audiences for segments',
                    'Design customer journey flows',
                    'Setup performance tracking'
                ],
                'creative': [
                    'Generate additional creative variations',
                    'Setup A/B testing framework',
                    'Launch creative optimization campaign',
                    'Analyze creative performance metrics'
                ],
                'journey': [
                    'Activate this customer journey',
                    'Create creative assets for touchpoints',
                    'Setup advanced segmentation',
                    'Launch performance monitoring'
                ],
                'audience': [
                    'Create targeted campaigns for each segment',
                    'Generate personalized creative assets',
                    'Design multi-channel customer journeys',
                    'Setup advanced tracking and attribution'
                ],
                'performance': [
                    'Optimize budget allocation',
                    'Create new audience segments',
                    'Generate improved creative variants',
                    'Setup automated bidding strategies'
                ],
                'budget': [
                    'Setup budget alerts',
                    'Create scenario planning',
                    'Implement auto-bidding rules',
                    'Schedule budget reviews'
                ],
                'ab-test': [
                    'Setup additional test variations',
                    'Create test monitoring dashboard',
                    'Plan follow-up experiments',
                    'Document testing methodology'
                ],
                'research': [
                    'Set up competitor monitoring',
                    'Create competitive positioning map',
                    'Analyze competitor ad creative',
                    'Track competitor pricing changes'
                ],
                'optimization': [
                    'Review ad creative performance',
                    'Analyze audience segment effectiveness',
                    'Adjust budget allocation by channel',
                    'Test new bidding strategies'
                ],
                'email': [
                    'Design welcome email series',
                    'Setup automated email workflows',
                    'Create email performance tracking',
                    'Plan email content calendar'
                ],
                'general': [
                    'Continue with creative asset generation',
                    'Setup advanced audience targeting',
                    'Design customer journey optimization',
                    'Launch comprehensive performance tracking'
                ]
            };
            const suggestions = nextStepsConfigs[messageType] || nextStepsConfigs['general'];
            this.addFollowUpSuggestions(suggestions);
            } catch (error) {
                console.error('❌ Error in next steps timeout:', error);
            }
        }, 2000);

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
            keywords: [],
            campaign_type: '',
            product: '',
            urgency: '',
            tone: '',
            specific_request: message // Keep the original message for detailed analysis
        };

        // Extract platforms
        const platforms = ['google', 'meta', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'twitter', 'snapchat', 'pinterest', 'reddit'];
        platforms.forEach(platform => {
            if (lowerMessage.includes(platform)) {
                context.platform.push(platform.charAt(0).toUpperCase() + platform.slice(1));
            }
        });

        // Extract objectives with more nuance
        if (lowerMessage.includes('awareness') || lowerMessage.includes('brand')) context.objective = 'Brand Awareness';
        else if (lowerMessage.includes('conversion') || lowerMessage.includes('sales') || lowerMessage.includes('purchase')) context.objective = 'Conversions';
        else if (lowerMessage.includes('traffic') || lowerMessage.includes('visits') || lowerMessage.includes('website')) context.objective = 'Traffic';
        else if (lowerMessage.includes('leads') || lowerMessage.includes('lead generation') || lowerMessage.includes('signup')) context.objective = 'Lead Generation';
        else if (lowerMessage.includes('engagement') || lowerMessage.includes('interact')) context.objective = 'Engagement';
        else if (lowerMessage.includes('download') || lowerMessage.includes('app install')) context.objective = 'App Downloads';

        // Extract audience with more detail
        if (lowerMessage.includes('millennials')) context.audience = 'Millennials (25-40)';
        else if (lowerMessage.includes('gen z')) context.audience = 'Gen Z (18-28)';
        else if (lowerMessage.includes('gen x')) context.audience = 'Gen X (35-50)';
        else if (lowerMessage.includes('b2b') || lowerMessage.includes('business')) context.audience = 'B2B Decision Makers';
        else if (lowerMessage.includes('parents')) context.audience = 'Parents';
        else if (lowerMessage.includes('students')) context.audience = 'Students';
        else if (lowerMessage.includes('professionals')) context.audience = 'Working Professionals';

        // Extract campaign types
        if (lowerMessage.includes('black friday') || lowerMessage.includes('holiday') || lowerMessage.includes('christmas')) {
            context.campaign_type = 'Holiday/Seasonal';
            context.urgency = 'high';
        } else if (lowerMessage.includes('product launch') || lowerMessage.includes('new product')) {
            context.campaign_type = 'Product Launch';
        } else if (lowerMessage.includes('sale') || lowerMessage.includes('promotion') || lowerMessage.includes('discount')) {
            context.campaign_type = 'Promotional';
        } else if (lowerMessage.includes('retention') || lowerMessage.includes('loyalty')) {
            context.campaign_type = 'Retention';
        }

        // Extract timeline/urgency
        if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('quickly')) context.urgency = 'high';
        else if (lowerMessage.includes('next week') || lowerMessage.includes('soon')) context.urgency = 'medium';

        // Extract budget indicators
        if (lowerMessage.match(/\$[\d,]+k/)) context.budget = lowerMessage.match(/\$[\d,]+k/)[0];
        else if (lowerMessage.match(/\$[\d,]+/)) context.budget = lowerMessage.match(/\$[\d,]+/)[0];
        else if (lowerMessage.includes('small budget') || lowerMessage.includes('limited budget')) context.budget = 'Limited Budget';
        else if (lowerMessage.includes('large budget') || lowerMessage.includes('big budget')) context.budget = 'Large Budget';

        // Extract product/service mentions
        const productKeywords = ['app', 'software', 'course', 'book', 'service', 'product', 'subscription', 'saas'];
        productKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                context.product = keyword;
            }
        });

        // Extract industry context
        const industries = ['tech', 'healthcare', 'education', 'finance', 'retail', 'travel', 'fitness', 'food', 'fashion'];
        industries.forEach(industry => {
            if (lowerMessage.includes(industry)) {
                context.industry = industry;
            }
        });

        return context;
    }

    generateTaskSpecificOutput(task, context, userMessage) {
        console.log('generateTaskSpecificOutput called for task:', task);
        console.log('Available task generators:', Object.keys({
            'campaign-brief': () => this.generateCampaignBriefOutput(context, userMessage),
            'optimize-campaign': () => this.generateOptimizationOutput(context, userMessage),
            'campaign-insights': () => this.generateInsightsOutput(context, userMessage),
            'setup-journey': () => this.generateJourneySetupOutput(context, userMessage),
            'generate-creative': () => this.generateCreativeIdeationOutput(context, userMessage),
            'audience-segments': () => this.generateAudienceSegmentsOutput(context, userMessage),
            'budget-allocation': () => this.generateBudgetAllocationOutput(context, userMessage),
            'ab-test': () => this.generateABTestOutput(context, userMessage),
            'competitor-analysis': () => this.generateCompetitorAnalysisOutput(context, userMessage),
            'content-calendar': () => this.generateContentCalendarOutput(context, userMessage),
            'design-campaign-program': () => this.generateCampaignStrategyOutput(context, userMessage),
            'create-creative-brief': () => this.generateCreativeBriefOutput(context, userMessage)
        }));
        const taskOutputGenerators = {
            'campaign-brief': () => this.generateCampaignBriefOutput(context, userMessage),
            'optimize-campaign': () => this.generateOptimizationOutput(context, userMessage),
            'campaign-insights': () => this.generateInsightsOutput(context, userMessage),
            'setup-journey': () => this.generateJourneySetupOutput(context, userMessage),
            'generate-creative': () => this.generateCreativeIdeationOutput(context, userMessage),
            'audience-segments': () => this.generateAudienceSegmentsOutput(context, userMessage),
            'budget-allocation': () => this.generateBudgetAllocationOutput(context, userMessage),
            'ab-test': () => this.generateABTestOutput(context, userMessage),
            'competitor-analysis': () => this.generateCompetitorAnalysisOutput(context, userMessage),
            'content-calendar': () => this.generateContentCalendarOutput(context, userMessage),
            'design-campaign-program': () => this.generateCampaignStrategyOutput(context, userMessage),
            'create-creative-brief': () => this.generateCreativeBriefOutput(context, userMessage)
        };

        const generator = taskOutputGenerators[task];
        return generator ? generator() : this.generateDefaultTaskOutput(task, context, userMessage);
    }

    generateCampaignBriefOutput(context, userMessage) {
        // Generate dynamic content based on the actual user request
        const campaignTitle = this.generateCampaignTitle(context, userMessage);
        const objectives = this.generateObjectives(context);
        const targetAudience = this.generateTargetAudience(context);
        const platforms = this.generatePlatformStrategy(context);
        const budget = this.generateBudgetStrategy(context);
        const timeline = this.generateTimeline(context);
        const kpis = this.generateKPIs(context);

        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-rocket" style="color: var(--accent-primary);"></i> ${campaignTitle}</h2>
                        <p class="output-subtitle">Campaign brief generated from: "${userMessage}"</p>
                    </div>
                    <div class="output-stats">
                        ${kpis.map(kpi => `
                            <div class="stat-card">
                                <div class="stat-number">${kpi.value}</div>
                                <div class="stat-label">${kpi.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="campaign-brief-grid">
                    <div class="brief-section">
                        <div class="section-header">
                            <h3><i class="fas fa-target"></i> Campaign Overview</h3>
                        </div>
                        <div class="overview-content">
                            <div class="overview-item">
                                <h4>Objective</h4>
                                <p>${objectives.primary}</p>
                            </div>
                            <div class="overview-item">
                                <h4>Campaign Type</h4>
                                <p>${context.campaign_type || 'Brand Activation'}</p>
                            </div>
                            <div class="overview-item">
                                <h4>Timeline</h4>
                                <p>${timeline}</p>
                            </div>
                            <div class="overview-item">
                                <h4>Budget</h4>
                                <p>${budget}</p>
                            </div>
                        </div>
                    </div>

                    <div class="brief-section">
                        <div class="section-header">
                            <h3><i class="fas fa-users"></i> Target Audience</h3>
                        </div>
                        <div class="analysis-insights">
                            <div class="insight-card audience">
                                <div class="insight-icon"><i class="fas fa-bullseye"></i></div>
                                <div class="insight-content">
                                    <h4>Primary Audience</h4>
                                    <ul>
                                        <li><strong>Demographics:</strong> ${targetAudience.demographics}</li>
                                        <li><strong>Behaviors:</strong> ${targetAudience.behaviors}</li>
                                        <li><strong>Interests:</strong> ${targetAudience.interests}</li>
                                        <li><strong>Pain Points:</strong> ${targetAudience.painPoints}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="brief-section">
                        <div class="section-header">
                            <h3><i class="fas fa-bullhorn"></i> Channel Strategy</h3>
                        </div>
                        <div class="channel-grid">
                            ${platforms.map(platform => `
                                <div class="channel-card ${platform.priority}">
                                    <div class="channel-icon">
                                        <i class="${platform.icon}"></i>
                                    </div>
                                    <div class="channel-name">${platform.name}</div>
                                    <div class="channel-priority">${platform.priority} Priority</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="brief-section">
                        <div class="section-header">
                            <h3><i class="fas fa-chart-line"></i> Key Performance Indicators</h3>
                        </div>
                        <div class="kpi-grid">
                            ${this.generateDetailedKPIs(context).map(kpi => `
                                <div class="kpi-card">
                                    <div class="kpi-icon">
                                        <i class="${kpi.icon}"></i>
                                    </div>
                                    <div class="kpi-metric">${kpi.metric}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="brief-section">
                        <div class="section-header">
                            <h3><i class="fas fa-calendar-alt"></i> Execution Timeline</h3>
                        </div>
                        <div class="timeline-phases">
                            ${this.generateExecutionPhases(context).map((phase, index) => `
                                <div class="phase-card">
                                    <div class="phase-number">${index + 1}</div>
                                    <div class="phase-content">
                                        <h4>${phase.name}</h4>
                                        <div class="phase-duration">${phase.duration}</div>
                                        <p>${phase.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="brief-section">
                        <div class="section-header">
                            <h3><i class="fas fa-lightbulb"></i> Strategic Recommendations</h3>
                        </div>
                        <div class="analysis-insights">
                            ${this.generateStrategicRecommendations(context).map(rec => `
                                <div class="insight-card ${rec.type}">
                                    <div class="insight-icon"><i class="${rec.icon}"></i></div>
                                    <div class="insight-content">
                                        <h4>${rec.title}</h4>
                                        <ul>
                                            ${rec.points.map(point => `<li>${point}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCampaignTitle(context, userMessage) {
        if (context.campaign_type === 'Holiday/Seasonal') {
            return `${context.campaign_type} Campaign Strategy`;
        } else if (context.campaign_type === 'Product Launch') {
            return `${context.product ? context.product.charAt(0).toUpperCase() + context.product.slice(1) : 'Product'} Launch Campaign`;
        } else if (context.objective) {
            return `${context.objective} Campaign Brief`;
        } else {
            return 'Campaign Brief & Strategy';
        }
    }

    generateObjectives(context) {
        const objectiveMap = {
            'Brand Awareness': 'Build brand recognition and visibility among target audiences',
            'Conversions': 'Drive sales and conversion actions through targeted messaging',
            'Traffic': 'Increase qualified website traffic and user engagement',
            'Lead Generation': 'Capture high-quality leads and grow the sales pipeline',
            'Engagement': 'Foster community engagement and brand loyalty',
            'App Downloads': 'Drive mobile app installations and first-time user activation'
        };

        return {
            primary: objectiveMap[context.objective] || 'Drive brand growth and customer acquisition through strategic marketing initiatives'
        };
    }

    generateTargetAudience(context) {
        const audienceProfiles = {
            'Millennials (25-40)': {
                demographics: 'Ages 25-40, college-educated, household income $50-100K',
                behaviors: 'Research-driven, value-conscious, digitally native',
                interests: 'Technology, sustainability, work-life balance, experiences',
                painPoints: 'Time constraints, budget management, information overload'
            },
            'Gen Z (18-28)': {
                demographics: 'Ages 18-28, mobile-first, diverse backgrounds',
                behaviors: 'Authenticity-seeking, social-conscious, quick decision-makers',
                interests: 'Social media, creativity, social causes, entrepreneurship',
                painPoints: 'Financial stress, social pressure, career uncertainty'
            },
            'B2B Decision Makers': {
                demographics: 'Professional roles, 30-55 years old, industry leadership',
                behaviors: 'Data-driven, ROI-focused, long sales cycles',
                interests: 'Industry trends, efficiency tools, networking, growth',
                painPoints: 'Budget constraints, technology adoption, competitive pressure'
            },
            'Parents': {
                demographics: 'Parents with children, ages 25-45, household-focused',
                behaviors: 'Safety-conscious, family-first, time-pressed',
                interests: 'Child development, family activities, education, health',
                painPoints: 'Time management, budget allocation, safety concerns'
            }
        };

        return audienceProfiles[context.audience] || {
            demographics: 'Primary target demographic based on campaign requirements',
            behaviors: 'Engaged consumers seeking relevant solutions',
            interests: 'Category-specific interests and lifestyle preferences',
            painPoints: 'Common challenges and unmet needs in the market'
        };
    }

    generatePlatformStrategy(context) {
        const platformMap = {
            'Instagram': { icon: 'fab fa-instagram', priority: 'priority-high' },
            'Facebook': { icon: 'fab fa-facebook', priority: 'priority-medium' },
            'Tiktok': { icon: 'fab fa-tiktok', priority: 'priority-high' },
            'LinkedIn': { icon: 'fab fa-linkedin', priority: 'priority-medium' },
            'Google': { icon: 'fab fa-google', priority: 'priority-high' },
            'Youtube': { icon: 'fab fa-youtube', priority: 'priority-medium' }
        };

        if (context.platform.length > 0) {
            return context.platform.map(platform => ({
                name: platform,
                icon: platformMap[platform]?.icon || 'fas fa-globe',
                priority: platformMap[platform]?.priority || 'priority-medium'
            }));
        }

        // Default platform recommendations based on audience
        if (context.audience === 'Gen Z (18-28)') {
            return [
                { name: 'TikTok', icon: 'fab fa-tiktok', priority: 'priority-high' },
                { name: 'Instagram', icon: 'fab fa-instagram', priority: 'priority-high' },
                { name: 'YouTube', icon: 'fab fa-youtube', priority: 'priority-medium' }
            ];
        } else if (context.audience === 'B2B Decision Makers') {
            return [
                { name: 'LinkedIn', icon: 'fab fa-linkedin', priority: 'priority-high' },
                { name: 'Google', icon: 'fab fa-google', priority: 'priority-high' },
                { name: 'Facebook', icon: 'fab fa-facebook', priority: 'priority-medium' }
            ];
        }

        return [
            { name: 'Facebook', icon: 'fab fa-facebook', priority: 'priority-high' },
            { name: 'Instagram', icon: 'fab fa-instagram', priority: 'priority-high' },
            { name: 'Google', icon: 'fab fa-google', priority: 'priority-medium' }
        ];
    }

    generateBudgetStrategy(context) {
        if (context.budget && context.budget !== 'Budget optimization') {
            return `${context.budget} total campaign budget`;
        } else if (context.budget === 'Limited Budget') {
            return 'Optimized for cost-effective reach and engagement';
        } else if (context.budget === 'Large Budget') {
            return 'Comprehensive multi-channel approach with premium placements';
        }
        return 'Budget allocation optimized across high-performing channels';
    }

    generateTimeline(context) {
        if (context.urgency === 'high') {
            return 'Fast-track execution within 1-2 weeks';
        } else if (context.campaign_type === 'Holiday/Seasonal') {
            return '4-6 weeks for seasonal campaign optimization';
        } else if (context.campaign_type === 'Product Launch') {
            return '8-12 weeks for comprehensive launch strategy';
        }
        return '4-8 weeks for full campaign development and execution';
    }

    generateKPIs(context) {
        const kpiTemplates = {
            'Brand Awareness': [
                { value: '2.5M', label: 'Impressions' },
                { value: '15%', label: 'Brand Lift' },
                { value: '45%', label: 'Reach' }
            ],
            'Conversions': [
                { value: '4.2x', label: 'ROAS' },
                { value: '18%', label: 'Conversion Rate' },
                { value: '750+', label: 'Conversions' }
            ],
            'Lead Generation': [
                { value: '500+', label: 'Qualified Leads' },
                { value: '$45', label: 'Cost per Lead' },
                { value: '12%', label: 'Lead Quality' }
            ]
        };

        return kpiTemplates[context.objective] || [
            { value: '3.2x', label: 'Projected ROI' },
            { value: '25%', label: 'Engagement Lift' },
            { value: '1,000+', label: 'Actions' }
        ];
    }

    generateDetailedKPIs(context) {
        return [
            { metric: 'Click-through Rate: 2.4%', icon: 'fas fa-mouse-pointer' },
            { metric: 'Cost per Click: $1.25', icon: 'fas fa-dollar-sign' },
            { metric: 'Conversion Rate: 8.5%', icon: 'fas fa-chart-line' },
            { metric: 'Return on Ad Spend: 4.2x', icon: 'fas fa-chart-pie' }
        ];
    }

    generateExecutionPhases(context) {
        if (context.urgency === 'high') {
            return [
                { name: 'Strategy & Setup', duration: 'Week 1', description: 'Campaign strategy, audience setup, and creative brief development' },
                { name: 'Launch & Optimize', duration: 'Week 2', description: 'Campaign launch with real-time optimization and performance monitoring' }
            ];
        }

        return [
            { name: 'Planning & Research', duration: 'Weeks 1-2', description: 'Market research, competitor analysis, and strategic planning' },
            { name: 'Creative Development', duration: 'Weeks 3-4', description: 'Asset creation, messaging development, and creative testing' },
            { name: 'Campaign Launch', duration: 'Week 5', description: 'Multi-channel campaign activation and initial performance monitoring' },
            { name: 'Optimization & Scale', duration: 'Weeks 6-8', description: 'Performance optimization, budget reallocation, and scaling successful elements' }
        ];
    }

    generateStrategicRecommendations(context) {
        const recommendations = [
            {
                type: 'research',
                icon: 'fas fa-search',
                title: 'Market Research Insights',
                points: [
                    `Target ${context.audience || 'primary audience'} shows highest engagement during evening hours`,
                    `${context.campaign_type || 'Campaign'} messaging should emphasize value proposition and urgency`,
                    'Competitor analysis reveals opportunity for differentiated positioning'
                ]
            },
            {
                type: 'performance',
                icon: 'fas fa-chart-bar',
                title: 'Performance Optimization',
                points: [
                    'Implement progressive audience expansion based on initial performance',
                    'A/B test creative messaging and call-to-action variations',
                    'Monitor and optimize for cost-efficiency across all channels'
                ]
            }
        ];

        if (context.platform.length > 0) {
            recommendations.push({
                type: 'audience',
                icon: 'fas fa-users',
                title: 'Platform-Specific Strategy',
                points: context.platform.map(platform =>
                    `Optimize ${platform} content for platform-native engagement and conversion`
                )
            });
        }

        return recommendations;
    }

    generateCreativeOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-lightbulb" style="color: var(--accent-orange);"></i> Creative Ideation Workshop</h2>
                        <p class="output-subtitle">Interactive brainstorming session based on your creative brief - explore concepts, generate ideas, and refine directions</p>
                        <div class="output-stats">
                            <div class="stat-pill creative-concepts">
                                <i class="fas fa-brain"></i>
                                <span>15 Concept Directions</span>
                            </div>
                            <div class="stat-pill inspiration-sources">
                                <i class="fas fa-star"></i>
                                <span>8 Inspiration Sources</span>
                            </div>
                            <div class="stat-pill collaboration-tools">
                                <i class="fas fa-users"></i>
                                <span>5 Ideation Tools</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="creative-brief-grid">

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

    generateCreativeIdeationOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-lightbulb" style="color: var(--accent-orange);"></i> Creative Ideation Workshop</h2>
                        <p class="output-subtitle">Interactive brainstorming session based on your creative brief - explore concepts, generate ideas, and refine directions</p>
                        <div class="output-stats">
                            <div class="stat-pill strategic-insights">
                                <i class="fas fa-brain"></i>
                                <span>15 Concept Directions</span>
                            </div>
                            <div class="stat-pill strategy-areas">
                                <i class="fas fa-star"></i>
                                <span>8 Inspiration Sources</span>
                            </div>
                            <div class="stat-pill specialist-agents">
                                <i class="fas fa-users"></i>
                                <span>5 Ideation Tools</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="creative-brief-grid">
                    <div class="creative-card ideation-tools">
                        <div class="creative-card-header">
                            <div class="creative-icon tools">
                                <i class="fas fa-tools"></i>
                            </div>
                            <h4>Brainstorming Tools & Methods</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('ideation-tools')">
                                <i class="fas fa-magic"></i> Generate More
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-cogs"></i>
                            <span>Interactive tools to spark creativity and expand your concept thinking</span>
                        </div>
                        <div class="tools-grid">
                            <div class="tool-card" onclick="triggerIdeationTool('mindmap')">
                                <div class="tool-icon">
                                    <i class="fas fa-project-diagram"></i>
                                </div>
                                <div class="tool-content">
                                    <h6>Mind Mapping</h6>
                                    <p>Visual concept exploration</p>
                                </div>
                            </div>
                            <div class="tool-card" onclick="triggerIdeationTool('scamper')">
                                <div class="tool-icon">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <div class="tool-content">
                                    <h6>SCAMPER Method</h6>
                                    <p>Systematic idea generation</p>
                                </div>
                            </div>
                            <div class="tool-card" onclick="triggerIdeationTool('random')">
                                <div class="tool-icon">
                                    <i class="fas fa-dice"></i>
                                </div>
                                <div class="tool-content">
                                    <h6>Random Stimuli</h6>
                                    <p>Unexpected inspiration</p>
                                </div>
                            </div>
                            <div class="tool-card" onclick="triggerIdeationTool('competitor')">
                                <div class="tool-icon">
                                    <i class="fas fa-search"></i>
                                </div>
                                <div class="tool-content">
                                    <h6>Competitive Analysis</h6>
                                    <p>Market gap identification</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card concept-directions">
                        <div class="creative-card-header">
                            <div class="creative-icon directions">
                                <i class="fas fa-compass"></i>
                            </div>
                            <h4>Initial Concept Directions</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('concept-directions')">
                                <i class="fas fa-magic"></i> Expand Ideas
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-star"></i>
                            <span>AI-generated starting points based on your creative brief objectives</span>
                        </div>
                        <div class="directions-grid">
                            <div class="direction-card emotional">
                                <div class="direction-header">
                                    <span class="direction-type">Emotional</span>
                                    <h6>Transformation Story</h6>
                                </div>
                                <p>Focus on personal transformation and aspirational outcomes. Show the emotional journey from challenge to success.</p>
                                <div class="direction-tags">
                                    <span class="tag">Storytelling</span>
                                    <span class="tag">Before/After</span>
                                    <span class="tag">Inspiration</span>
                                </div>
                            </div>
                            <div class="direction-card rational">
                                <div class="direction-header">
                                    <span class="direction-type">Rational</span>
                                    <h6>Problem-Solution Focus</h6>
                                </div>
                                <p>Direct approach highlighting specific problems and clear solutions. Emphasize benefits and practical outcomes.</p>
                                <div class="direction-tags">
                                    <span class="tag">Benefits</span>
                                    <span class="tag">Features</span>
                                    <span class="tag">ROI</span>
                                </div>
                            </div>
                            <div class="direction-card social">
                                <div class="direction-header">
                                    <span class="direction-type">Social</span>
                                    <h6>Community & Belonging</h6>
                                </div>
                                <p>Emphasize community, social proof, and shared experiences. Show how others benefit and belong.</p>
                                <div class="direction-tags">
                                    <span class="tag">Testimonials</span>
                                    <span class="tag">Community</span>
                                    <span class="tag">FOMO</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card inspiration-sources">
                        <div class="creative-card-header">
                            <div class="creative-icon inspiration">
                                <i class="fas fa-star"></i>
                            </div>
                            <h4>Inspiration & References</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('inspiration-sources')">
                                <i class="fas fa-magic"></i> Find More
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-palette"></i>
                            <span>Curated inspiration sources to spark creative thinking across different mediums</span>
                        </div>
                        <div class="inspiration-categories">
                            <div class="inspiration-category">
                                <h6><i class="fas fa-trophy"></i> Award-Winning Campaigns</h6>
                                <div class="inspiration-items">
                                    <div class="inspiration-item">
                                        <strong>"The Man Your Man Could Smell Like"</strong> - Old Spice
                                        <p>Humor + Confidence + Memorable Characters</p>
                                    </div>
                                    <div class="inspiration-item">
                                        <strong>"Share a Coke"</strong> - Coca-Cola
                                        <p>Personalization + Social Sharing + Emotional Connection</p>
                                    </div>
                                </div>
                            </div>
                            <div class="inspiration-category">
                                <h6><i class="fas fa-trending-up"></i> Trending Formats</h6>
                                <div class="inspiration-items">
                                    <div class="inspiration-item">
                                        <strong>Short-Form Video</strong> - TikTok/Reels Style
                                        <p>Quick engagement + Authentic feel + Viral potential</p>
                                    </div>
                                    <div class="inspiration-item">
                                        <strong>Interactive Stories</strong> - Choose Your Path
                                        <p>Engagement + Personalization + Data collection</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card collaboration-space">
                        <div class="creative-card-header">
                            <div class="creative-icon collaboration">
                                <i class="fas fa-users"></i>
                            </div>
                            <h4>Team Collaboration Space</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('collaboration-space')">
                                <i class="fas fa-magic"></i> Facilitate Session
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-handshake"></i>
                            <span>Tools and frameworks for productive team brainstorming sessions</span>
                        </div>
                        <div class="collaboration-tools">
                            <div class="collab-section">
                                <h6>Ideation Framework: "Yes, And..." Method</h6>
                                <div class="framework-steps">
                                    <div class="step">
                                        <span class="step-number">1</span>
                                        <p><strong>Present Initial Ideas:</strong> Share 3 core concepts from brief</p>
                                    </div>
                                    <div class="step">
                                        <span class="step-number">2</span>
                                        <p><strong>Build Upon Ideas:</strong> Each person adds "Yes, and..." to expand</p>
                                    </div>
                                    <div class="step">
                                        <span class="step-number">3</span>
                                        <p><strong>Capture Everything:</strong> No judgment, record all variations</p>
                                    </div>
                                    <div class="step">
                                        <span class="step-number">4</span>
                                        <p><strong>Prioritize & Refine:</strong> Evaluate against brief objectives</p>
                                    </div>
                                </div>
                            </div>
                            <div class="voting-system">
                                <h6>Concept Voting System</h6>
                                <p>Rate each concept on: <strong>Brand Alignment</strong> | <strong>Audience Resonance</strong> | <strong>Execution Feasibility</strong> | <strong>Innovation Factor</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card concept-development">
                        <div class="creative-card-header">
                            <div class="creative-icon development">
                                <i class="fas fa-seedling"></i>
                            </div>
                            <h4>Concept Development Workshop</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('concept-development')">
                                <i class="fas fa-magic"></i> Develop Further
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-rocket"></i>
                            <span>Structured approach to evolve raw ideas into fully developed creative concepts</span>
                        </div>
                        <div class="development-framework">
                            <div class="concept-canvas">
                                <h6>Creative Concept Canvas</h6>
                                <div class="canvas-grid">
                                    <div class="canvas-section">
                                        <h7>Core Message</h7>
                                        <p>What's the single key idea?</p>
                                    </div>
                                    <div class="canvas-section">
                                        <h7>Emotional Hook</h7>
                                        <p>How will it make people feel?</p>
                                    </div>
                                    <div class="canvas-section">
                                        <h7>Visual Direction</h7>
                                        <p>What's the visual style/mood?</p>
                                    </div>
                                    <div class="canvas-section">
                                        <h7>Call to Action</h7>
                                        <p>What should people do next?</p>
                                    </div>
                                    <div class="canvas-section">
                                        <h7>Success Metric</h7>
                                        <p>How will you measure impact?</p>
                                    </div>
                                    <div class="canvas-section">
                                        <h7>Unique Element</h7>
                                        <p>What makes this stand out?</p>
                                    </div>
                                </div>
                            </div>
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
                            <div class="agent-icon"><i class="fas fa-chart-line"></i></div>
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

    generateCampaignStrategyOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-rocket" style="color: var(--accent-green);"></i> Campaign Strategy Overview</h2>
                        <p class="output-subtitle">Comprehensive campaign strategy with strategic direction, messaging, and competitive intelligence</p>
                        <div class="output-stats">
                            <div class="stat-pill strategy-areas">
                                <i class="fas fa-layer-group"></i>
                                <span>5 Strategy Areas</span>
                            </div>
                            <div class="stat-pill specialist-agents">
                                <i class="fas fa-users-cog"></i>
                                <span>3 Specialist Agents</span>
                            </div>
                            <div class="stat-pill strategic-insights">
                                <i class="fas fa-lightbulb"></i>
                                <span>15+ Strategic Insights</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="strategy-cards-grid">
                    <div class="agent-analysis-card strategy">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-compass"></i></div>
                            <h4>Strategic Direction Overview</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('strategy')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Integrated multi-channel approach targeting key customer segments with compelling value propositions</span>
                        </div>
                        <div class="strategy-content">
                            <h5>Primary Objective</h5>
                            <p>Drive brand awareness and sales conversion through data-driven insights and personalized customer experiences across digital touchpoints.</p>

                            <h5>Core Strategy</h5>
                            <p>Leverage competitive differentiators and product benefits to create authentic connections with target audiences through strategic channel optimization.</p>

                            <div class="success-metrics">
                                <h5>Success Framework</h5>
                                <div class="metric-tags">
                                    <span class="metric-tag">Brand Awareness +25%</span>
                                    <span class="metric-tag">Conversion Rate +15%</span>
                                    <span class="metric-tag">Customer Acquisition</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card messaging">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-comment-dots"></i></div>
                            <h4>Key Messaging Pillars</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('messaging')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-bullseye"></i>
                            <span>Four core messaging pillars designed to resonate with target audience values and motivations</span>
                        </div>
                        <div class="messaging-framework">
                            <div class="pillar-list">
                                <div class="pillar-item">
                                    <div class="pillar-number">1</div>
                                    <div class="pillar-content">
                                        <strong>Value Proposition:</strong> "Transform your experience with innovative solutions designed for modern needs"
                                    </div>
                                </div>
                                <div class="pillar-item">
                                    <div class="pillar-number">2</div>
                                    <div class="pillar-content">
                                        <strong>Trust & Credibility:</strong> "Trusted by thousands of customers with proven results and exceptional support"
                                    </div>
                                </div>
                                <div class="pillar-item">
                                    <div class="pillar-number">3</div>
                                    <div class="pillar-content">
                                        <strong>Innovation Leadership:</strong> "Leading the industry with cutting-edge technology and forward-thinking approach"
                                    </div>
                                </div>
                                <div class="pillar-item">
                                    <div class="pillar-number">4</div>
                                    <div class="pillar-content">
                                        <strong>Customer Success:</strong> "Your success is our priority - dedicated support every step of the way"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-users"></i></div>
                            <h4>Target Audience & Persona Hypotheses</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('audience')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-bullseye"></i>
                            <span>Two primary persona segments representing 100% of campaign targeting strategy</span>
                        </div>
                        <div class="audience-breakdown">
                            <h5>Persona Distribution</h5>
                            <div class="segment-bars">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Growth-Oriented Professional</span>
                                        <span class="segment-percentage">70%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 70%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Value-Conscious Consumer</span>
                                        <span class="segment-percentage">30%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 30%; background: var(--accent-secondary);"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="persona-details">
                                <div class="persona-section">
                                    <h6>Primary Persona Attributes</h6>
                                    <ul>
                                        <li><strong>Demographics:</strong> 28-45 years, college-educated, $60K+ income</li>
                                        <li><strong>Psychographics:</strong> Values efficiency, seeks innovation, data-driven decisions</li>
                                        <li><strong>Behaviors:</strong> Research-oriented, social media active, mobile-first</li>
                                        <li><strong>Pain Points:</strong> Time constraints, information overload, solution complexity</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card channels">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-broadcast-tower"></i></div>
                            <h4>Channel Strategy Outline</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('channels')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-chart-pie"></i>
                            <span>Strategic budget allocation across 4 primary channels for maximum reach and conversion</span>
                        </div>
                        <div class="channel-breakdown">
                            <h5>Budget Allocation</h5>
                            <div class="segment-bars">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Digital Advertising</span>
                                        <span class="segment-percentage">40%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 40%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Content Marketing</span>
                                        <span class="segment-percentage">25%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 25%; background: var(--accent-green);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Email Marketing</span>
                                        <span class="segment-percentage">20%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 20%; background: var(--accent-orange);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Social & Influencer</span>
                                        <span class="segment-percentage">15%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 15%; background: var(--accent-purple);"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="channel-tactics">
                                <h5>Key Tactics</h5>
                                <div class="tactic-grid">
                                    <span class="tactic-tag">Search Campaigns</span>
                                    <span class="tactic-tag">Display Retargeting</span>
                                    <span class="tactic-tag">SEO Content</span>
                                    <span class="tactic-tag">Welcome Series</span>
                                    <span class="tactic-tag">Social Proof</span>
                                    <span class="tactic-tag">Video Ads</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card competitive">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chess"></i></div>
                            <h4>Competitive Snapshot</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('competitive')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-search"></i>
                            <span>Market analysis reveals differentiation opportunities in messaging and channel optimization</span>
                        </div>
                        <div class="competitive-landscape">
                            <h5>Market Leaders Analysis</h5>
                            <div class="competitor-cards">
                                <div class="competitor-card">
                                    <div class="competitor-header">
                                        <h6>Competitor A - Market Leader</h6>
                                        <span class="market-share">35%</span>
                                    </div>
                                    <div class="competitor-insights">
                                        <div class="insight-item strength">
                                            <strong>Strengths:</strong> Brand recognition, extensive distribution, premium positioning
                                        </div>
                                        <div class="insight-item opportunity">
                                            <strong>Opportunity:</strong> Limited personalization, higher price point, slower innovation
                                        </div>
                                    </div>
                                </div>
                                <div class="competitor-card">
                                    <div class="competitor-header">
                                        <h6>Competitor B - Fast Follower</h6>
                                        <span class="market-share">22%</span>
                                    </div>
                                    <div class="competitor-insights">
                                        <div class="insight-item strength">
                                            <strong>Strengths:</strong> Competitive pricing, digital-first approach, rapid iteration
                                        </div>
                                        <div class="insight-item opportunity">
                                            <strong>Opportunity:</strong> Limited customer support, brand trust gaps, narrow feature set
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="positioning-recommendation">
                                <h5>Recommended Positioning</h5>
                                <p><strong>"The perfect balance of innovation and reliability"</strong> - Premium features at competitive prices with exceptional support, emphasizing customer success stories and proven ROI.</p>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;
    }

    generateInsightsOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-chart-line" style="color: var(--accent-purple);"></i> Campaign Insights & Analytics</h2>
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
                            <div class="agent-icon"><i class="fas fa-chart-line"></i></div>
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

    generateCreativeBriefOutput(context, userMessage) {
        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-palette" style="color: var(--accent-red);"></i> Creative Brief & Strategy</h2>
                        <p class="output-subtitle">Comprehensive creative direction with visual concepts, messaging framework, and brand alignment</p>
                        <div class="output-stats">
                            <div class="stat-pill creative-concepts">
                                <i class="fas fa-lightbulb"></i>
                                <span>8 Creative Concepts</span>
                            </div>
                            <div class="stat-pill brand-elements">
                                <i class="fas fa-swatchbook"></i>
                                <span>5 Brand Elements</span>
                            </div>
                            <div class="stat-pill content-variants">
                                <i class="fas fa-layer-group"></i>
                                <span>12+ Content Variants</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="creative-brief-grid">
                    <div class="creative-card brief-overview">
                        <div class="creative-card-header">
                            <div class="creative-icon">
                                <i class="fas fa-bullseye"></i>
                            </div>
                            <h4>Creative Objective & Direction</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('creative-objective')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-compass"></i>
                            <span>Strategic creative direction designed to drive brand awareness and emotional connection</span>
                        </div>
                        <div class="brief-content">
                            <h5>Primary Creative Goal</h5>
                            <p>Create compelling visual and verbal narratives that resonate with target audiences while reinforcing brand values and driving specific business outcomes.</p>

                            <h5>Creative Challenge</h5>
                            <p>How might we create memorable, authentic content that stands out in a crowded marketplace while maintaining brand consistency across all touchpoints?</p>

                            <div class="success-metrics">
                                <h5>Creative Success Metrics</h5>
                                <div class="metric-tags">
                                    <span class="metric-tag">Brand Recall +35%</span>
                                    <span class="metric-tag">Engagement Rate +45%</span>
                                    <span class="metric-tag">Share Rate +25%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card brand-identity">
                        <div class="creative-card-header">
                            <div class="creative-icon brand">
                                <i class="fas fa-gem"></i>
                            </div>
                            <h4>Brand Identity & Visual Language</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('brand-identity')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-palette"></i>
                            <span>Cohesive visual system establishing brand recognition and emotional impact</span>
                        </div>
                        <div class="brand-framework">
                            <div class="brand-elements-grid">
                                <div class="brand-element">
                                    <div class="element-icon">
                                        <i class="fas fa-eye"></i>
                                    </div>
                                    <div class="element-content">
                                        <h6>Visual Style</h6>
                                        <p>Modern, clean aesthetic with bold typography and dynamic compositions that convey innovation and trust</p>
                                    </div>
                                </div>
                                <div class="brand-element">
                                    <div class="element-icon">
                                        <i class="fas fa-paint-brush"></i>
                                    </div>
                                    <div class="element-content">
                                        <h6>Color Palette</h6>
                                        <p>Primary: Deep blue (#1e40af), Secondary: Vibrant orange (#f59e0b), Accent: Emerald green (#10b981)</p>
                                    </div>
                                </div>
                                <div class="brand-element">
                                    <div class="element-icon">
                                        <i class="fas fa-font"></i>
                                    </div>
                                    <div class="element-content">
                                        <h6>Typography</h6>
                                        <p>Headlines: Bold sans-serif (Montserrat), Body: Clean, readable (Inter), Script: Elegant accent font</p>
                                    </div>
                                </div>
                                <div class="brand-element">
                                    <div class="element-icon">
                                        <i class="fas fa-images"></i>
                                    </div>
                                    <div class="element-content">
                                        <h6>Imagery Style</h6>
                                        <p>Authentic lifestyle photography, diverse representation, bright natural lighting, aspirational settings</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card messaging-framework">
                        <div class="creative-card-header">
                            <div class="creative-icon messaging">
                                <i class="fas fa-comment-dots"></i>
                            </div>
                            <h4>Messaging Framework & Tone</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('messaging-framework')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-volume-up"></i>
                            <span>Distinct brand voice that builds trust and drives action across all content</span>
                        </div>
                        <div class="messaging-content">
                            <div class="tone-attributes">
                                <h5>Brand Voice Attributes</h5>
                                <div class="attribute-grid">
                                    <div class="attribute-item">
                                        <span class="attribute-label">Confident</span>
                                        <div class="attribute-bar">
                                            <div class="attribute-fill" style="width: 90%;"></div>
                                        </div>
                                    </div>
                                    <div class="attribute-item">
                                        <span class="attribute-label">Approachable</span>
                                        <div class="attribute-bar">
                                            <div class="attribute-fill" style="width: 85%;"></div>
                                        </div>
                                    </div>
                                    <div class="attribute-item">
                                        <span class="attribute-label">Innovative</span>
                                        <div class="attribute-bar">
                                            <div class="attribute-fill" style="width: 95%;"></div>
                                        </div>
                                    </div>
                                    <div class="attribute-item">
                                        <span class="attribute-label">Authentic</span>
                                        <div class="attribute-bar">
                                            <div class="attribute-fill" style="width: 88%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="key-messages">
                                <h5>Core Message Pillars</h5>
                                <div class="message-pillars">
                                    <div class="pillar-card">
                                        <div class="pillar-number">1</div>
                                        <div class="pillar-content">
                                            <strong>Innovation Leadership</strong>
                                            <p>"Leading the way with cutting-edge solutions that transform your experience"</p>
                                        </div>
                                    </div>
                                    <div class="pillar-card">
                                        <div class="pillar-number">2</div>
                                        <div class="pillar-content">
                                            <strong>Trusted Partnership</strong>
                                            <p>"Your success is our mission - dedicated support every step of the journey"</p>
                                        </div>
                                    </div>
                                    <div class="pillar-card">
                                        <div class="pillar-number">3</div>
                                        <div class="pillar-content">
                                            <strong>Results Driven</strong>
                                            <p>"Proven outcomes that matter - measurable impact on your business goals"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card concept-gallery">
                        <div class="creative-card-header">
                            <div class="creative-icon concepts">
                                <i class="fas fa-magic"></i>
                            </div>
                            <h4>Creative Concepts & Ideas</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('creative-concepts')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Innovative creative directions spanning multiple formats and touchpoints</span>
                        </div>
                        <div class="concepts-grid">
                            <div class="concept-card primary">
                                <div class="concept-header">
                                    <span class="concept-priority">Primary</span>
                                    <h6>Transform Your Story</h6>
                                </div>
                                <p>Narrative-driven campaign focusing on customer transformation journeys with before/after storytelling</p>
                                <div class="concept-formats">
                                    <span class="format-tag">Video Series</span>
                                    <span class="format-tag">Social Stories</span>
                                    <span class="format-tag">Display Ads</span>
                                </div>
                            </div>
                            <div class="concept-card secondary">
                                <div class="concept-header">
                                    <span class="concept-priority">Secondary</span>
                                    <h6>Behind the Innovation</h6>
                                </div>
                                <p>Technology-focused content showcasing product development and innovation process</p>
                                <div class="concept-formats">
                                    <span class="format-tag">Tech Demos</span>
                                    <span class="format-tag">Infographics</span>
                                    <span class="format-tag">Interactive Content</span>
                                </div>
                            </div>
                            <div class="concept-card supporting">
                                <div class="concept-header">
                                    <span class="concept-priority">Supporting</span>
                                    <h6>Community Champions</h6>
                                </div>
                                <p>User-generated content campaign highlighting real customer success stories and community</p>
                                <div class="concept-formats">
                                    <span class="format-tag">UGC Campaign</span>
                                    <span class="format-tag">Testimonials</span>
                                    <span class="format-tag">Community Features</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="creative-card execution-guide">
                        <div class="creative-card-header">
                            <div class="creative-icon execution">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <h4>Execution Guidelines & Next Steps</h4>
                            <button class="btn-secondary refine-btn" onclick="refineWithAI('execution-guide')">
                                <i class="fas fa-magic"></i> Refine with AI
                            </button>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-cogs"></i>
                            <span>Comprehensive production roadmap with specifications and approval workflows</span>
                        </div>
                        <div class="execution-content">
                            <div class="production-phases">
                                <h5>Production Timeline</h5>
                                <div class="phase-timeline">
                                    <div class="phase-step">
                                        <div class="step-number">1</div>
                                        <div class="step-content">
                                            <h6>Creative Development</h6>
                                            <span class="step-duration">Week 1-2</span>
                                            <p>Concept refinement, design mockups, copy development</p>
                                        </div>
                                    </div>
                                    <div class="phase-step">
                                        <div class="step-number">2</div>
                                        <div class="step-content">
                                            <h6>Asset Production</h6>
                                            <span class="step-duration">Week 3-4</span>
                                            <p>Photography, video production, graphic design, copywriting</p>
                                        </div>
                                    </div>
                                    <div class="phase-step">
                                        <div class="step-number">3</div>
                                        <div class="step-content">
                                            <h6>Review & Optimization</h6>
                                            <span class="step-duration">Week 5</span>
                                            <p>Stakeholder review, revisions, final approvals, format optimization</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="deliverables-checklist">
                                <h5>Key Deliverables</h5>
                                <div class="checklist-grid">
                                    <div class="checklist-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Brand style guide & asset library</span>
                                    </div>
                                    <div class="checklist-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Campaign creative assets (all formats)</span>
                                    </div>
                                    <div class="checklist-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Copy variations & messaging templates</span>
                                    </div>
                                    <div class="checklist-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Social media content calendar</span>
                                    </div>
                                    <div class="checklist-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Performance tracking framework</span>
                                    </div>
                                    <div class="checklist-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Brand compliance guidelines</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateBudgetAllocationOutput(context, userMessage) {
        const totalBudget = context.total_budget || '$50,000';
        const timeframe = context.timeframe || 'Q4 2024';

        return `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-chart-pie" style="color: var(--accent-primary);"></i> Intelligent Budget Allocation</h2>
                        <p class="output-subtitle">AI-optimized budget distribution across channels for maximum ROI in ${timeframe}</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <div class="stat-number">+31%</div>
                            <div class="stat-label">Projected ROI Lift</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">7</div>
                            <div class="stat-label">Channels Analyzed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">24M</div>
                            <div class="stat-label">Data Points</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">95%</div>
                            <div class="stat-label">Confidence Score</div>
                        </div>
                    </div>
                </div>

                <!-- Agent Analysis Cards -->
                <div class="agent-analysis-section">
                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h4>Deep Research Agent</h4>
                        </div>
                        <div class="agent-analysis-content">
                            <h5>Market Intelligence & Opportunity Analysis</h5>
                            <div class="research-insights">
                                <div class="insight-item">
                                    <div class="insight-icon"><i class="fas fa-chart-line"></i></div>
                                    <div class="insight-content">
                                        <strong>Market Growth Trends:</strong> Digital advertising spending increased 18% YoY, with video and social commerce driving 73% of new budget allocation
                                    </div>
                                </div>
                                <div class="insight-item">
                                    <div class="insight-icon"><i class="fas fa-target"></i></div>
                                    <div class="insight-content">
                                        <strong>Competitive Analysis:</strong> Top competitors allocating 40% to programmatic display, 35% to search, and 25% to social platforms
                                    </div>
                                </div>
                                <div class="insight-item">
                                    <div class="insight-icon"><i class="fas fa-users"></i></div>
                                    <div class="insight-content">
                                        <strong>Audience Behavior:</strong> Target demographics showing 65% mobile engagement, 23% desktop, 12% tablet across touchpoints
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <h4>Historical Performance Agent</h4>
                        </div>
                        <div class="agent-analysis-content">
                            <h5>Performance Pattern Analysis & Learnings</h5>
                            <div class="performance-metrics">
                                <div class="metric-grid">
                                    <div class="metric-card">
                                        <div class="metric-value">4.2x</div>
                                        <div class="metric-label">Best Channel ROAS</div>
                                        <div class="metric-detail">Google Ads (Search)</div>
                                    </div>
                                    <div class="metric-card">
                                        <div class="metric-value">2.8x</div>
                                        <div class="metric-label">Avg Cross-Channel</div>
                                        <div class="metric-detail">Last 12 months</div>
                                    </div>
                                    <div class="metric-card">
                                        <div class="metric-value">34%</div>
                                        <div class="metric-label">Video CTR Lift</div>
                                        <div class="metric-detail">vs Static Ads</div>
                                    </div>
                                </div>
                                <div class="seasonal-trends">
                                    <h6>Seasonal Performance Insights</h6>
                                    <ul>
                                        <li><strong>Q4 Peak:</strong> 45% higher conversion rates, optimal for brand awareness campaigns</li>
                                        <li><strong>Mobile Surge:</strong> Evening hours (6-9 PM) show 67% higher engagement rates</li>
                                        <li><strong>Creative Fatigue:</strong> Ad refresh needed every 21 days to maintain performance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card creative">
                        <div class="agent-card-header">
                            <div class="agent-icon">
                                <i class="fas fa-calculator"></i>
                            </div>
                            <h4>Budget Optimization Agent</h4>
                        </div>
                        <div class="agent-analysis-content">
                            <h5>AI-Driven Allocation Strategy</h5>
                            <div class="allocation-strategy">
                                <div class="budget-chart">
                                    <div class="budget-item primary">
                                        <div class="budget-bar" style="width: 38%;">
                                            <span class="budget-percentage">38%</span>
                                        </div>
                                        <div class="budget-details">
                                            <strong>Google Ads</strong> - $${(parseFloat(totalBudget.replace(/[^0-9.]/g, '')) * 0.38 / 1000).toFixed(0)}K
                                            <small>Search + Shopping campaigns, high-intent keywords</small>
                                        </div>
                                    </div>
                                    <div class="budget-item secondary">
                                        <div class="budget-bar" style="width: 32%;">
                                            <span class="budget-percentage">32%</span>
                                        </div>
                                        <div class="budget-details">
                                            <strong>Meta Platforms</strong> - $${(parseFloat(totalBudget.replace(/[^0-9.]/g, '')) * 0.32 / 1000).toFixed(0)}K
                                            <small>Video ads, retargeting, lookalike audiences</small>
                                        </div>
                                    </div>
                                    <div class="budget-item tertiary">
                                        <div class="budget-bar" style="width: 18%;">
                                            <span class="budget-percentage">18%</span>
                                        </div>
                                        <div class="budget-details">
                                            <strong>Programmatic Display</strong> - $${(parseFloat(totalBudget.replace(/[^0-9.]/g, '')) * 0.18 / 1000).toFixed(0)}K
                                            <small>Premium inventory, brand safety, viewability</small>
                                        </div>
                                    </div>
                                    <div class="budget-item quaternary">
                                        <div class="budget-bar" style="width: 12%;">
                                            <span class="budget-percentage">12%</span>
                                        </div>
                                        <div class="budget-details">
                                            <strong>Testing & Innovation</strong> - $${(parseFloat(totalBudget.replace(/[^0-9.]/g, '')) * 0.12 / 1000).toFixed(0)}K
                                            <small>TikTok, Connected TV, emerging platforms</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ROI Projection Section -->
                <div class="roi-projection-section">
                    <h3><i class="fas fa-rocket"></i> Performance Projections</h3>
                    <div class="projection-grid">
                        <div class="projection-card">
                            <div class="projection-header">
                                <h4>Expected ROAS</h4>
                                <div class="projection-value">3.4x</div>
                            </div>
                            <div class="projection-details">
                                <div class="projection-change positive">+31% vs current allocation</div>
                                <div class="projection-confidence">95% confidence interval: 2.8x - 4.1x</div>
                            </div>
                        </div>
                        <div class="projection-card">
                            <div class="projection-header">
                                <h4>Reach Estimate</h4>
                                <div class="projection-value">2.3M</div>
                            </div>
                            <div class="projection-details">
                                <div class="projection-change positive">+18% unique users</div>
                                <div class="projection-confidence">Frequency cap: 4.2 impressions/user</div>
                            </div>
                        </div>
                        <div class="projection-card">
                            <div class="projection-header">
                                <h4>Conversion Lift</h4>
                                <div class="projection-value">+27%</div>
                            </div>
                            <div class="projection-details">
                                <div class="projection-change positive">Cross-channel attribution</div>
                                <div class="projection-confidence">View-through + click-through</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Implementation Roadmap -->
                <div class="implementation-section">
                    <h3><i class="fas fa-route"></i> Implementation Roadmap</h3>
                    <div class="implementation-timeline">
                        <div class="timeline-item">
                            <div class="timeline-marker week-1"></div>
                            <div class="timeline-content">
                                <h4>Week 1: Foundation Setup</h4>
                                <ul>
                                    <li>Account restructuring and campaign migration</li>
                                    <li>Budget reallocation across platforms</li>
                                    <li>Enhanced tracking and attribution setup</li>
                                </ul>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker week-2"></div>
                            <div class="timeline-content">
                                <h4>Week 2-3: Launch & Monitor</h4>
                                <ul>
                                    <li>Gradual budget shift to high-performing channels</li>
                                    <li>Daily performance monitoring and adjustments</li>
                                    <li>Creative rotation and messaging optimization</li>
                                </ul>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker week-4"></div>
                            <div class="timeline-content">
                                <h4>Week 4+: Optimize & Scale</h4>
                                <ul>
                                    <li>Performance-based budget rebalancing</li>
                                    <li>Audience expansion and lookalike scaling</li>
                                    <li>Cross-channel attribution analysis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Risk Assessment -->
                <div class="risk-assessment-section">
                    <h3><i class="fas fa-shield-alt"></i> Risk Assessment & Mitigation</h3>
                    <div class="risk-grid">
                        <div class="risk-item low-risk">
                            <div class="risk-level">Low Risk</div>
                            <div class="risk-content">
                                <h4>Platform Algorithm Changes</h4>
                                <p>Diversified allocation reduces dependency risk. Contingency: 15% emergency reallocation buffer.</p>
                            </div>
                        </div>
                        <div class="risk-item medium-risk">
                            <div class="risk-level">Medium Risk</div>
                            <div class="risk-content">
                                <h4>Seasonal Performance Variation</h4>
                                <p>Historical data shows ±12% seasonal variance. Mitigation: Dynamic budget caps and automated rules.</p>
                            </div>
                        </div>
                        <div class="risk-item low-risk">
                            <div class="risk-level">Low Risk</div>
                            <div class="risk-content">
                                <h4>Creative Fatigue</h4>
                                <p>Proactive creative refresh schedule every 3 weeks. Automated A/B testing maintains performance.</p>
                            </div>
                        </div>
                    </div>
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
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-calendar-alt" style="color: var(--accent-primary);"></i> Strategic Content Calendar</h2>
                        <p class="output-subtitle">AI-optimized content strategy with scheduling and performance insights</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">28</span>
                            <span class="stat-label">Content Pieces</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">5</span>
                            <span class="stat-label">Platforms</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">78%</span>
                            <span class="stat-label">Engagement Rate</span>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card creative">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-palette"></i></div>
                            <h4>Content Strategy</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Multi-format content mix optimized for each platform's native experience</span>
                        </div>

                        <div class="content-strategy-overview">
                            <h5>Content Pillars</h5>
                            <div class="content-pillars">
                                <div class="pillar-card education">
                                    <div class="pillar-icon"><i class="fas fa-graduation-cap"></i></div>
                                    <div class="pillar-info">
                                        <h6>Educational</h6>
                                        <span>40% - How-tos, Tips, Insights</span>
                                    </div>
                                </div>
                                <div class="pillar-card entertainment">
                                    <div class="pillar-icon"><i class="fas fa-laugh"></i></div>
                                    <div class="pillar-info">
                                        <h6>Entertainment</h6>
                                        <span>30% - Stories, Behind-scenes</span>
                                    </div>
                                </div>
                                <div class="pillar-card promotional">
                                    <div class="pillar-icon"><i class="fas fa-bullhorn"></i></div>
                                    <div class="pillar-info">
                                        <h6>Promotional</h6>
                                        <span>20% - Products, Offers</span>
                                    </div>
                                </div>
                                <div class="pillar-card community">
                                    <div class="pillar-icon"><i class="fas fa-users"></i></div>
                                    <div class="pillar-info">
                                        <h6>Community</h6>
                                        <span>10% - User-generated, Q&A</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card research">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-search"></i></div>
                            <h4>Optimal Timing</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-clock"></i>
                            <span>Peak engagement windows identified across all target platforms</span>
                        </div>

                        <div class="timing-analysis">
                            <h5>Best Posting Times</h5>
                            <div class="platform-timing">
                                <div class="timing-row">
                                    <div class="platform-icon"><i class="fab fa-instagram"></i></div>
                                    <div class="timing-info">
                                        <span class="platform-name">Instagram</span>
                                        <span class="best-time">11 AM - 1 PM, 7 PM - 9 PM</span>
                                    </div>
                                </div>
                                <div class="timing-row">
                                    <div class="platform-icon"><i class="fab fa-linkedin"></i></div>
                                    <div class="timing-info">
                                        <span class="platform-name">LinkedIn</span>
                                        <span class="best-time">8 AM - 10 AM, 12 PM - 2 PM</span>
                                    </div>
                                </div>
                                <div class="timing-row">
                                    <div class="platform-icon"><i class="fab fa-twitter"></i></div>
                                    <div class="timing-info">
                                        <span class="platform-name">Twitter</span>
                                        <span class="best-time">9 AM - 10 AM, 7 PM - 9 PM</span>
                                    </div>
                                </div>
                                <div class="timing-row">
                                    <div class="platform-icon"><i class="fab fa-facebook"></i></div>
                                    <div class="timing-info">
                                        <span class="platform-name">Facebook</span>
                                        <span class="best-time">1 PM - 3 PM, 7 PM - 9 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Monthly Calendar View -->
                <div class="content-calendar-section">
                    <div class="calendar-header">
                        <h3><i class="fas fa-calendar-week"></i> December 2024 Content Calendar</h3>
                        <div class="calendar-actions">
                            <button class="calendar-btn" id="export-calendar-btn">
                                <i class="fas fa-download"></i>
                                Export Calendar
                            </button>
                            <button class="calendar-btn primary" id="create-content-btn">
                                <i class="fas fa-plus"></i>
                                Create Content
                            </button>
                        </div>
                    </div>

                    <div class="calendar-grid">
                        <div class="calendar-day header">Mon</div>
                        <div class="calendar-day header">Tue</div>
                        <div class="calendar-day header">Wed</div>
                        <div class="calendar-day header">Thu</div>
                        <div class="calendar-day header">Fri</div>
                        <div class="calendar-day header">Sat</div>
                        <div class="calendar-day header">Sun</div>

                        <!-- Week 1 -->
                        <div class="calendar-day empty"></div>
                        <div class="calendar-day empty"></div>
                        <div class="calendar-day empty"></div>
                        <div class="calendar-day empty"></div>
                        <div class="calendar-day empty"></div>
                        <div class="calendar-day empty"></div>
                        <div class="calendar-day">
                            <span class="day-number">1</span>
                            <div class="content-item educational">
                                <i class="fas fa-graduation-cap"></i>
                                <span>Holiday Shopping Guide</span>
                            </div>
                        </div>

                        <!-- Week 2 -->
                        <div class="calendar-day">
                            <span class="day-number">2</span>
                            <div class="content-item entertainment">
                                <i class="fab fa-instagram"></i>
                                <span>Behind the Scenes</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">3</span>
                            <div class="content-item educational">
                                <i class="fas fa-lightbulb"></i>
                                <span>Tips & Tricks</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">4</span>
                            <div class="content-item promotional">
                                <i class="fas fa-percent"></i>
                                <span>Flash Sale Announcement</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">5</span>
                            <div class="content-item community">
                                <i class="fas fa-users"></i>
                                <span>Customer Spotlight</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">6</span>
                            <div class="content-item educational">
                                <i class="fas fa-video"></i>
                                <span>Product Demo</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">7</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-camera"></i>
                                <span>Weekend Vibes</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">8</span>
                            <div class="content-item promotional">
                                <i class="fas fa-gift"></i>
                                <span>Gift Guide</span>
                            </div>
                        </div>

                        <!-- Week 3 -->
                        <div class="calendar-day">
                            <span class="day-number">9</span>
                            <div class="content-item educational">
                                <i class="fas fa-book"></i>
                                <span>Industry Insights</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">10</span>
                            <div class="content-item community">
                                <i class="fas fa-star"></i>
                                <span>Customer Reviews</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">11</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-music"></i>
                                <span>Trending Challenge</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">12</span>
                            <div class="content-item educational">
                                <i class="fas fa-question-circle"></i>
                                <span>FAQ Friday</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">13</span>
                            <div class="content-item promotional">
                                <i class="fas fa-tags"></i>
                                <span>Weekend Sale</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">14</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-heart"></i>
                                <span>Team Appreciation</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">15</span>
                            <div class="content-item community">
                                <i class="fas fa-comments"></i>
                                <span>Community Q&A</span>
                            </div>
                        </div>

                        <!-- Week 4 -->
                        <div class="calendar-day">
                            <span class="day-number">16</span>
                            <div class="content-item educational">
                                <i class="fas fa-chart-line"></i>
                                <span>Year in Review</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">17</span>
                            <div class="content-item promotional">
                                <i class="fas fa-snowflake"></i>
                                <span>Holiday Special</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">18</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-gamepad"></i>
                                <span>Interactive Poll</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">19</span>
                            <div class="content-item educational">
                                <i class="fas fa-trophy"></i>
                                <span>Success Stories</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">20</span>
                            <div class="content-item community">
                                <i class="fas fa-handshake"></i>
                                <span>Partner Feature</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">21</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-calendar-star"></i>
                                <span>Weekend Fun</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">22</span>
                            <div class="content-item promotional">
                                <i class="fas fa-fire"></i>
                                <span>Last Chance Sale</span>
                            </div>
                        </div>

                        <!-- Final week -->
                        <div class="calendar-day">
                            <span class="day-number">23</span>
                            <div class="content-item educational">
                                <i class="fas fa-rocket"></i>
                                <span>Looking Ahead 2025</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">24</span>
                            <div class="content-item community">
                                <i class="fas fa-gift-heart"></i>
                                <span>Holiday Wishes</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">25</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-tree"></i>
                                <span>Christmas Special</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">26</span>
                            <div class="content-item community">
                                <i class="fas fa-thanks"></i>
                                <span>Thank You Post</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">27</span>
                            <div class="content-item educational">
                                <i class="fas fa-lightbulb"></i>
                                <span>Year-end Tips</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">28</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-party-horn"></i>
                                <span>Weekend Celebration</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">29</span>
                            <div class="content-item promotional">
                                <i class="fas fa-fireworks"></i>
                                <span>New Year Preview</span>
                            </div>
                        </div>

                        <!-- Extra days -->
                        <div class="calendar-day">
                            <span class="day-number">30</span>
                            <div class="content-item community">
                                <i class="fas fa-heart"></i>
                                <span>Community Love</span>
                            </div>
                        </div>
                        <div class="calendar-day">
                            <span class="day-number">31</span>
                            <div class="content-item entertainment">
                                <i class="fas fa-clock"></i>
                                <span>Countdown 2025</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Performance Insights -->
                <div class="strategic-recommendations">
                    <h3><i class="fas fa-chart-line"></i> Performance Insights & Recommendations</h3>
                    <div class="recommendations-grid">
                        <div class="recommendation-card priority-high">
                            <span class="rec-priority">High Impact</span>
                            <h5>Video Content Strategy</h5>
                            <p>Increase video content to 60% of posts. Video content generates 3x more engagement than static posts on your platforms.</p>
                        </div>
                        <div class="recommendation-card priority-medium">
                            <span class="rec-priority">Medium Impact</span>
                            <h5>User-Generated Content</h5>
                            <p>Launch UGC campaigns to boost community content from 10% to 25%. Customer content builds trust and authenticity.</p>
                        </div>
                        <div class="recommendation-card priority-low">
                            <span class="rec-priority">Optimization</span>
                            <h5>Cross-Platform Adaptation</h5>
                            <p>Adapt content formats for each platform's native experience while maintaining consistent messaging and brand voice.</p>
                        </div>
                    </div>
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
        // Analyze the message to determine task type and required agents
        const messageType = this.analyzeMessage(message);
        const context = this.extractContextFromMessage(message);


        // Show initial processing message
        this.addMessage('🧠 **Analyzing your request...**', 'agent');

        // Get the appropriate AI suite title
        const suiteTitle = this.getAISuiteFromMessageType(messageType);
        this.currentSuiteTitle = suiteTitle;

        // Determine which agents to activate based on message type
        const agentConfigs = {
            brief: ['Deep Research', 'Performance', 'Audience'],
            creative: ['Creative', 'Research Agent', 'Audience'],
            journey: ['Journey', 'Audience', 'Performance'],
            performance: ['Performance', 'Analytics Agent', 'Research Agent'],
            audience: ['Audience', 'Research Agent', 'Analytics Agent'],
            'paid-media': ['Paid Media', 'Performance', 'Analytics Agent'],
            general: ['Deep Research', 'Performance', 'Creative']
        };

        const activeAgents = agentConfigs[messageType] || agentConfigs.general;

        // Show agent activation message
        setTimeout(() => {
            this.addMessage(`🚀 **Activating ${activeAgents.length} specialist agents:** ${activeAgents.join(', ')}`, 'agent');
        }, 800);

        // Show agent progress with visual indicators
        setTimeout(() => {
            this.showAgentProgress(messageType, message);
        }, 1200);

        // Show thinking process specific to the task
        const thinkingProcess = this.getTaskSpecificThinking(messageType, context);

        thinkingProcess.forEach((thought, index) => {
            setTimeout(() => {
                this.addMessage(`🔍 ${thought}`, 'agent');
            }, 1800 + (index * 800));
        });

        // Generate final response message
        const finalResponseDelay = 1800 + (thinkingProcess.length * 800) + 500;
        setTimeout(() => {
            const responseMessage = this.getTaskSpecificResponse(messageType, context);
            this.addMessage(responseMessage, 'agent');
        }, finalResponseDelay);

        // Add thought process to output area
        setTimeout(() => {
            const contextualInsight = this.getFollowUpInsight(message, messageType);
            this.addThoughtProcessToOutput('Strategy Coordinator', contextualInsight, message);
        }, finalResponseDelay + 800);

        // Generate comprehensive polished output
        setTimeout(() => {
            this.updateOutputPanel(messageType, message);
        }, finalResponseDelay + 1500);
    }

    getTaskSpecificThinking(messageType, context) {
        const thinkingTemplates = {
            brief: [
                'Analyzing market landscape and competitive positioning...',
                'Researching target audience behaviors and preferences...',
                'Evaluating campaign objectives and success metrics...',
                'Synthesizing strategic recommendations and budget allocation...'
            ],
            creative: [
                'Analyzing brand guidelines and creative requirements...',
                'Researching visual trends and platform specifications...',
                'Generating creative concepts and messaging strategies...',
                'Preparing asset recommendations and A/B testing plans...'
            ],
            journey: [
                'Mapping customer touchpoints and interaction patterns...',
                'Analyzing conversion paths and drop-off points...',
                'Designing automated workflow triggers and sequences...',
                'Optimizing journey timing and personalization rules...'
            ],
            performance: [
                'Collecting and analyzing campaign performance data...',
                'Identifying optimization opportunities and bottlenecks...',
                'Calculating ROI and attribution across channels...',
                'Generating actionable improvement recommendations...'
            ],
            audience: [
                'Analyzing demographic and psychographic data...',
                'Identifying high-value customer segments...',
                'Researching behavioral patterns and preferences...',
                'Creating targeting strategies and lookalike audiences...'
            ],
            'paid-media': [
                'Analyzing budget allocation and channel performance...',
                'Researching platform-specific optimization opportunities...',
                'Calculating bid strategies and audience targeting...',
                'Preparing media mix recommendations and scaling plans...'
            ]
        };

        return thinkingTemplates[messageType] || [
            'Processing your request and identifying key requirements...',
            'Activating relevant specialist agents for analysis...',
            'Gathering data and insights from multiple sources...',
            'Preparing comprehensive recommendations and next steps...'
        ];
    }

    getTaskSpecificResponse(messageType, context) {
        const responses = {
            brief: `✅ **Campaign brief completed!** I've analyzed your requirements and created a comprehensive strategy covering market analysis, audience targeting, and budget allocation. The output panel shows detailed insights from our Research, Performance, and Audience agents.`,

            creative: `🎨 **Creative strategy ready!** Our Creative, Research, and Audience agents have developed concepts, messaging, and asset recommendations. Check the output panel for visual mockups and A/B testing strategies.`,

            journey: `🗺️ **Customer journey mapped!** The Journey, Audience, and Performance agents have created a comprehensive flow with touchpoints, automation triggers, and optimization recommendations available in the output panel.`,

            performance: `📊 **Performance analysis complete!** Our Performance, Analytics, and Research agents have identified optimization opportunities, ROI improvements, and actionable insights now available in the output panel.`,

            audience: `👥 **Audience insights generated!** The Audience, Research, and Analytics agents have created detailed segmentation, targeting strategies, and behavioral analysis available in the output panel.`,

            'paid-media': `💰 **Media plan optimized!** Our Paid Media, Performance, and Analytics agents have developed budget allocation, channel strategies, and scaling recommendations now in the output panel.`
        };

        return responses[messageType] || `✅ **Analysis complete!** Our specialist agents have processed your request and generated comprehensive insights and recommendations available in the output panel.`;
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
            },
            'create-creative-brief': {
                agent: 'Creative Brief Team',
                content: `Perfect! I've activated our Creative Brief, Creative Ideation, and Campaign Architect agents to create a comprehensive creative brief. They're developing strategic creative direction, visual concepts, messaging frameworks, and execution guidelines to bring your campaign vision to life.`
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
            ],
            'create-creative-brief': [
                { text: 'Create Channel Strategy & Journey design', task: 'pick-channel-mix' },
                { text: 'Creative Ideation', task: 'generate-creative' },
                { text: 'Generate creative assets and mockups', task: 'generate-creative' },
                { text: 'Set up creative approval workflow', task: 'content-calendar' }
            ],
            'design-campaign-program': [
                { text: 'Develop creative strategy', task: 'create-creative-brief' },
                { text: 'Create Channel Strategy & Journey design', task: 'pick-channel-mix' }
            ]
        };

        const suggestions = taskSuggestions[task] || [
            'Refine the strategy further',
            'Add more specific requirements',
            'Create implementation timeline',
            'Set up performance monitoring'
        ];

        // Handle both string and object suggestions
        if (task === 'design-campaign-program' || task === 'create-creative-brief') {
            this.addTaskSuggestionButtons(suggestions);
        } else {
            this.addFollowUpSuggestions(suggestions);
        }
    }

    addTaskSuggestionButtons(suggestions) {
        const suggestionsHTML = `
            <div class="next-steps-suggestions">
                <div class="suggestions-header">
                    <i class="fas fa-arrow-right"></i>
                    <h4>Recommended Next Steps</h4>
                </div>
                <div class="suggestions-grid">
                    ${suggestions.map(suggestion => {
                        const taskConfig = {
                            'create-creative-brief': { icon: 'fa-palette', desc: 'Create detailed creative briefs and asset specifications based on your strategic foundation' },
                            'pick-channel-mix': { icon: 'fa-share-alt-square', desc: 'Design comprehensive channel mix and customer journey mapping for optimal reach' },
                            'generate-creative': { icon: 'fa-magic', desc: 'Generate innovative creative concepts and visual assets for your campaigns' },
                            'content-calendar': { icon: 'fa-calendar-alt', desc: 'Set up structured workflow and approval processes for content creation' }
                        };
                        const config = taskConfig[suggestion.task] || { icon: 'fa-arrow-right', desc: 'Continue with next steps in your marketing workflow' };

                        return `
                        <div class="suggestion-card" onclick="app.handleTaskSuggestion('${suggestion.task}')">
                            <div class="suggestion-icon">
                                <i class="fas ${config.icon}"></i>
                            </div>
                            <div class="suggestion-content">
                                <h5>${suggestion.text}</h5>
                                <p>${config.desc}</p>
                            </div>
                            <div class="suggestion-action">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        this.addMessage(suggestionsHTML, 'agent', 'Campaign Architect Agent');
    }

    handleTaskSuggestion(task) {
        console.log('🎯 handleTaskSuggestion called with task:', task);
        this.handleTaskClick(task);
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
        console.log('🧹 Clearing task context. Previous task was:', this.currentTask);
        console.log('🧹 Stack trace:', new Error().stack);
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

                    // Keep progress indicator visible after completion
                    // Removed auto-hide behavior to preserve agent completion status
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

            // Re-initialize knowledge base interactions to ensure toggles work
            this.setupKnowledgeBaseInteractions();

            // Initialize progress indicator visibility (hidden by default)
            const kbCardsContainer = kbPage.querySelector('.kb-onboarding-cards');
            if (kbCardsContainer) {
                kbCardsContainer.classList.remove('has-visible-cards');
            }

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
        console.log('Setting window.location.hash to:', url);
        window.location.hash = url;
        console.log('window.location.hash after setting:', window.location.hash);
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

            case 'autopilot':
                console.log('=== SHOWING AUTOPILOT PAGE ===');
                console.log('Switching to Autopilot page');
                // Show autopilot page
                const autopilotPage = document.getElementById('autopilot-page');
                if (autopilotPage) {
                    console.log('Found Autopilot page element, setting display to grid');
                    autopilotPage.style.display = 'grid';
                    autopilotPage.style.visibility = 'visible';
                    autopilotPage.style.opacity = '1';
                    console.log('Autopilot page display set to:', autopilotPage.style.display);
                    console.log('Autopilot page computed style:', window.getComputedStyle(autopilotPage).display);
                } else {
                    console.error('Autopilot page element not found');
                    // List all elements with autopilot in the ID
                    const allAutopilotElements = document.querySelectorAll('[id*="autopilot"]');
                    console.log('All elements with autopilot in ID:', allAutopilotElements);
                }

                // Update main content class
                const mainContentAutopilot = document.querySelector('.main-content');
                if (mainContentAutopilot) {
                    console.log('Updating main content class to home-mode');
                    mainContentAutopilot.className = 'main-content home-mode';
                } else {
                    console.error('Main content element not found');
                }

                // Hide header
                const headerAutopilot = document.querySelector('.app-header');
                if (headerAutopilot) {
                    console.log('Hiding app header');
                    headerAutopilot.style.display = 'none';
                }

                // Populate task list
                this.renderTaskList();
                break;

            case 'campaigns':
                console.log('Switching to Campaigns page');
                // Show campaigns page
                const campaignsPage = document.getElementById('campaigns-page');
                if (campaignsPage) {
                    console.log('Found Campaigns page element, setting display to grid');
                    campaignsPage.style.display = 'grid';
                    console.log('Campaigns page display set to:', campaignsPage.style.display);
                } else {
                    console.error('Campaigns page element not found');
                }

                // Update main content class
                const mainContentCampaigns = document.querySelector('.main-content');
                if (mainContentCampaigns) {
                    console.log('Updating main content class to home-mode');
                    mainContentCampaigns.className = 'main-content home-mode';
                } else {
                    console.error('Main content element not found');
                }

                // Hide header
                const headerCampaigns = document.querySelector('.app-header');
                if (headerCampaigns) {
                    console.log('Hiding app header');
                    headerCampaigns.style.display = 'none';
                } else {
                    console.error('App header element not found');
                }

                // Populate campaigns list
                this.renderCampaignsList();
                break;

            case 'home':
            default:
                console.log('Displaying Home page');
                this.showHomePage();
                break;
        }
    }

    hideAllPages() {
        const pages = [
            'home-screen',
            'working-interface',
            'knowledge-base-page',
            'autopilot-page',
            'campaigns-page'
        ];

        pages.forEach(pageId => {
            const page = document.getElementById(pageId);
            if (page) {
                page.style.display = 'none';
            }
        });
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
        // Remove existing listeners to prevent duplicates
        if (this.kbClickHandler) {
            document.removeEventListener('click', this.kbClickHandler);
        }

        // Create new click handler
        this.kbClickHandler = (e) => {
            // Toggle pinned context items
            if (e.target.closest('.pinned-toggle')) {
                console.log('🔧 KB Toggle: Pinned toggle clicked');
                const toggle = e.target.closest('.pinned-toggle');
                const pinnedItem = toggle.closest('.pinned-item');
                const icon = toggle.querySelector('i');

                if (toggle.classList.contains('active')) {
                    // Deactivate
                    console.log('🔧 KB Toggle: Deactivating pinned item');
                    toggle.classList.remove('active');
                    pinnedItem.classList.remove('active');
                    icon.className = 'fas fa-toggle-off';
                    pinnedItem.querySelector('.pinned-status').textContent = 'Inactive';
                } else {
                    // Activate
                    console.log('🔧 KB Toggle: Activating pinned item');
                    toggle.classList.add('active');
                    pinnedItem.classList.add('active');
                    icon.className = 'fas fa-toggle-on';
                    pinnedItem.querySelector('.pinned-status').textContent = 'Active';
                }
                return;
            }

            // Toggle context packs
            if (e.target.closest('.pack-toggle')) {
                console.log('🔧 KB Toggle: Pack toggle clicked');
                const toggle = e.target.closest('.pack-toggle');
                const icon = toggle.querySelector('i');

                if (toggle.classList.contains('active')) {
                    // Deactivate
                    console.log('🔧 KB Toggle: Deactivating pack');
                    toggle.classList.remove('active');
                    icon.className = 'fas fa-toggle-off';
                } else {
                    // Activate
                    console.log('🔧 KB Toggle: Activating pack');
                    toggle.classList.add('active');
                    icon.className = 'fas fa-toggle-on';
                }
                return;
            }
        };

        // Add the click handler
        document.addEventListener('click', this.kbClickHandler);

        // Direct event listener for Enhance Knowledge Base button
        const enhanceKBBtn = document.getElementById('btn-kb-onboarding');
        if (enhanceKBBtn) {
            console.log('Found Enhance KB button, adding direct listener');
            enhanceKBBtn.addEventListener('click', (e) => {
                console.log('Direct KB onboarding button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.openKBOnboarding();
            });
        } else {
            console.log('Enhance KB button not found');
        }

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
            console.log('Click detected:', e.target);
            if (e.target.closest('.kb-action-btn')) {
                console.log('KB action button detected');
                const btn = e.target.closest('.kb-action-btn');
                const spanElement = btn.querySelector('span');
                console.log('Button span element:', spanElement);
                const actionText = spanElement ? spanElement.textContent : '';
                console.log('Action text:', actionText);

                switch(actionText) {
                    case 'Enhance Knowledge Base':
                        console.log('Enhance Knowledge Base clicked via global handler');
                        e.preventDefault();
                        e.stopPropagation();
                        this.openKBOnboarding();
                        return false;
                        break;
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
        window.addEventListener('hashchange', (e) => {
            console.log('=== HASHCHANGE EVENT ===');
            console.log('Old URL:', e.oldURL);
            console.log('New URL:', e.newURL);
            console.log('Current hash:', window.location.hash);
            const route = this.getRouteFromURL();
            console.log('Hash changed to route:', route);
            this.currentRoute = route;
            this.showPage(route);
            console.log('=== END HASHCHANGE EVENT ===');
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
                case 'autopilot':
                    return 'autopilot';
                case 'campaigns':
                    return 'campaigns';
                default:
                    return 'home';
            }
        }

        // Fallback to path-based routing
        const path = window.location.pathname;
        switch(path) {
            case '/knowledge-base':
                return 'knowledge-base';
            case '/autopilot':
                return 'autopilot';
            case '/campaigns':
                return 'campaigns';
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
        // Show export options modal
        this.showExportOptionsModal();
    }

    showExportOptionsModal() {
        const modal = document.createElement('div');
        modal.className = 'export-modal-overlay';
        modal.innerHTML = `
            <div class="export-modal">
                <div class="export-modal-header">
                    <h3><i class="fas fa-download"></i> Export Options</h3>
                    <button class="close-export-modal" id="close-export-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="export-modal-content">
                    <div class="export-options">
                        <div class="export-option" data-type="pdf">
                            <div class="export-icon pdf"><i class="fas fa-file-pdf"></i></div>
                            <div class="export-info">
                                <h4>PDF Report</h4>
                                <p>Comprehensive report with all analysis and recommendations</p>
                            </div>
                        </div>
                        <div class="export-option" data-type="powerpoint">
                            <div class="export-icon powerpoint"><i class="fas fa-file-powerpoint"></i></div>
                            <div class="export-info">
                                <h4>PowerPoint Slides</h4>
                                <p>Ready-to-present slide deck with key insights and visuals</p>
                            </div>
                        </div>
                        <div class="export-option" data-type="google-slides">
                            <div class="export-icon google-slides"><i class="fab fa-google"></i></div>
                            <div class="export-info">
                                <h4>Google Slides</h4>
                                <p>Shareable Google Slides presentation format</p>
                            </div>
                        </div>
                        <div class="export-option" data-type="markdown">
                            <div class="export-icon markdown"><i class="fab fa-markdown"></i></div>
                            <div class="export-info">
                                <h4>Markdown</h4>
                                <p>Clean markdown format for documentation and sharing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#close-export-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Handle export option selection
        modal.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', () => {
                const exportType = option.dataset.type;
                document.body.removeChild(modal);
                this.handleExport(exportType);
            });
        });
    }

    handleExport(exportType) {
        const outputContent = document.getElementById('output-content');
        const outputTitle = document.getElementById('output-title');

        if (!outputContent || !outputTitle) {
            this.addMessage("❌ No content available to export.", 'agent');
            return;
        }

        switch (exportType) {
            case 'pdf':
                this.addMessage("📄 Preparing PDF export with all outputs, data, and recommendations. Download will start shortly.", 'agent');
                setTimeout(() => this.generatePDF(), 1000);
                break;
            case 'powerpoint':
                this.addMessage("🎯 Generating PowerPoint slide deck with key insights and visuals. Download will start shortly.", 'agent');
                setTimeout(() => this.generatePowerPointSlides(), 1000);
                break;
            case 'google-slides':
                this.addMessage("📊 Creating Google Slides presentation format. Download will start shortly.", 'agent');
                setTimeout(() => this.generateGoogleSlides(), 1000);
                break;
            case 'markdown':
                this.addMessage("📝 Preparing Markdown export for documentation. Download will start shortly.", 'agent');
                setTimeout(() => this.generateMarkdown(), 1000);
                break;
        }
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

    generatePowerPointSlides() {
        try {
            const outputTitle = document.getElementById('output-title')?.textContent || 'Marketing SuperAgent Analysis';
            const outputContent = document.getElementById('output-content');

            if (!outputContent) {
                this.addMessage("❌ No content available to export.", 'agent');
                return;
            }

            // Extract structured data for slides
            const slideData = this.extractSlideContent(outputContent, outputTitle);

            // Generate PowerPoint-compatible HTML
            const pptContent = this.generatePowerPointHTML(slideData);

            // Create and download the file
            this.downloadFile(pptContent, `${outputTitle.replace(/[^a-z0-9]/gi, '_')}_slides.html`, 'text/html');

            this.addMessage("✅ PowerPoint slides exported successfully! The HTML file can be imported into PowerPoint or presented directly in a browser.", 'agent');

        } catch (error) {
            console.error('PowerPoint export error:', error);
            this.addMessage("❌ Error generating PowerPoint slides. Please try again.", 'agent');
        }
    }

    generateGoogleSlides() {
        try {
            const outputTitle = document.getElementById('output-title')?.textContent || 'Marketing SuperAgent Analysis';
            const outputContent = document.getElementById('output-content');

            if (!outputContent) {
                this.addMessage("❌ No content available to export.", 'agent');
                return;
            }

            // Extract structured data for slides
            const slideData = this.extractSlideContent(outputContent, outputTitle);

            // Generate Google Slides-compatible format
            const googleSlidesContent = this.generateGoogleSlidesFormat(slideData);

            // Create and download the file
            this.downloadFile(googleSlidesContent, `${outputTitle.replace(/[^a-z0-9]/gi, '_')}_google_slides.html`, 'text/html');

            this.addMessage("✅ Google Slides format exported successfully! Upload the HTML file to Google Drive and convert to Google Slides.", 'agent');

        } catch (error) {
            console.error('Google Slides export error:', error);
            this.addMessage("❌ Error generating Google Slides format. Please try again.", 'agent');
        }
    }

    generateMarkdown() {
        try {
            const outputTitle = document.getElementById('output-title')?.textContent || 'Marketing SuperAgent Analysis';
            const outputContent = document.getElementById('output-content');

            if (!outputContent) {
                this.addMessage("❌ No content available to export.", 'agent');
                return;
            }

            // Convert HTML content to Markdown
            const markdownContent = this.convertToMarkdown(outputContent, outputTitle);

            // Create and download the file
            this.downloadFile(markdownContent, `${outputTitle.replace(/[^a-z0-9]/gi, '_')}_report.md`, 'text/markdown');

            this.addMessage("✅ Markdown export completed successfully! Perfect for documentation and sharing.", 'agent');

        } catch (error) {
            console.error('Markdown export error:', error);
            this.addMessage("❌ Error generating Markdown file. Please try again.", 'agent');
        }
    }

    extractSlideContent(contentElement, title) {
        const slides = [];

        // Title slide
        slides.push({
            type: 'title',
            title: title,
            subtitle: 'AI-Powered Marketing Analysis',
            timestamp: new Date().toLocaleDateString()
        });

        // Extract all major sections for slides
        const sections = contentElement.querySelectorAll('.agent-analysis-card, .creative-concepts-section, .competitive-intelligence-section, .strategic-recommendations, .timeline-section, .knowledge-base-section, .enhanced-output > *');

        sections.forEach((section, index) => {
            const sectionTitle = section.querySelector('h3, h4, h2')?.textContent || section.querySelector('.agent-card-header h4')?.textContent || `Section ${index + 1}`;

            // Extract insights from multiple sources
            const insights = section.querySelectorAll('.insight-highlight, .insight-highlight span, .forecast-item, .trend-item');

            // Extract metrics from multiple sources
            const metrics = section.querySelectorAll('.metric-item, .key-metrics .metric-item, .stat-card, .metric, .forecast-details');

            // Extract concepts and recommendations
            const concepts = section.querySelectorAll('.concept-card, .recommendation-card, .intelligence-card, .knowledge-source-card, .hypothesis-card');

            // Extract bullet points and lists
            const bulletPoints = section.querySelectorAll('ul li, .segment-bar, .platform-chip');

            // Extract general paragraphs as content
            const paragraphs = section.querySelectorAll('p');
            const contentParagraphs = Array.from(paragraphs)
                .map(p => p.textContent.trim())
                .filter(text => text.length > 20 && !text.includes('Updated:') && !text.includes('Generated'));

            // Create content slide with enhanced extraction
            const slideContent = {
                type: 'content',
                title: sectionTitle,
                insights: Array.from(insights).map(insight => {
                    const text = insight.querySelector('span')?.textContent || insight.textContent;
                    return text.trim();
                }).filter(text => text.length > 10),
                metrics: Array.from(metrics).map(metric => {
                    const value = metric.querySelector('.metric-value, .stat-number, .forecast-metric')?.textContent ||
                                 metric.querySelector('strong')?.textContent || '';
                    const desc = metric.querySelector('.metric-desc, .metric-label, .stat-label, .forecast-value')?.textContent ||
                                metric.textContent.replace(value, '').trim();
                    return { value: value.trim(), description: desc.trim() };
                }).filter(metric => metric.value || metric.description),
                concepts: Array.from(concepts).map(concept => {
                    const title = concept.querySelector('h4, h5, .source-info h4')?.textContent || '';
                    const description = concept.querySelector('p, .source-details')?.textContent || '';
                    return { title: title.trim(), description: description.trim() };
                }).filter(concept => concept.title || concept.description),
                bulletPoints: Array.from(bulletPoints).map(item => {
                    const text = item.textContent.trim();
                    return text;
                }).filter(text => text.length > 10 && text.length < 150),
                content: contentParagraphs.slice(0, 3) // Limit to first 3 relevant paragraphs
            };

            // Include slide if it has any meaningful content
            if (slideContent.insights.length > 0 || slideContent.metrics.length > 0 ||
                slideContent.concepts.length > 0 || slideContent.bulletPoints.length > 0 ||
                slideContent.content.length > 0) {
                slides.push(slideContent);
            }
        });

        // If no sections were found, extract from the entire content
        if (slides.length === 1) { // Only title slide
            const fallbackInsights = contentElement.querySelectorAll('h3, h4, h5, strong');
            const fallbackContent = Array.from(fallbackInsights)
                .map(el => el.textContent.trim())
                .filter(text => text.length > 10)
                .slice(0, 10);

            if (fallbackContent.length > 0) {
                slides.push({
                    type: 'content',
                    title: 'Analysis Overview',
                    insights: [],
                    metrics: [],
                    concepts: [],
                    bulletPoints: fallbackContent,
                    content: []
                });
            }
        }

        // Summary slide with top insights
        const allInsights = contentElement.querySelectorAll('.insight-highlight, .recommendation-card h5, .concept-header h4');
        slides.push({
            type: 'summary',
            title: 'Key Takeaways',
            insights: Array.from(allInsights).slice(0, 6).map(insight => insight.textContent.trim()).filter(text => text.length > 10)
        });

        return slides;
    }

    generatePowerPointHTML(slideData) {
        const timestamp = new Date().toLocaleDateString();

        let slidesHTML = '';

        slideData.forEach((slide, index) => {
            if (slide.type === 'title') {
                slidesHTML += `
                    <div class="slide title-slide">
                        <div class="slide-content">
                            <h1>${slide.title}</h1>
                            <h2>${slide.subtitle}</h2>
                            <p class="timestamp">${slide.timestamp}</p>
                        </div>
                    </div>
                `;
            } else if (slide.type === 'content') {
                slidesHTML += `
                    <div class="slide content-slide">
                        <div class="slide-content">
                            <h1>${slide.title}</h1>
                            ${slide.insights.length > 0 ? `
                                <div class="insights-section">
                                    <h3>Key Insights</h3>
                                    <ul>
                                        ${slide.insights.map(insight => `<li>${insight}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            ${slide.content && slide.content.length > 0 ? `
                                <div class="content-section">
                                    ${slide.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
                                </div>
                            ` : ''}
                            ${slide.bulletPoints && slide.bulletPoints.length > 0 ? `
                                <div class="bullets-section">
                                    <ul>
                                        ${slide.bulletPoints.map(bullet => `<li>${bullet}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            ${slide.metrics.length > 0 ? `
                                <div class="metrics-section">
                                    <h3>Key Metrics</h3>
                                    <div class="metrics-grid">
                                        ${slide.metrics.map(metric => `
                                            <div class="metric">
                                                <div class="metric-value">${metric.value}</div>
                                                <div class="metric-label">${metric.description}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${slide.concepts.length > 0 ? `
                                <div class="concepts-section">
                                    <h3>Recommendations</h3>
                                    <ul>
                                        ${slide.concepts.map(concept => `
                                            <li><strong>${concept.title}</strong>${concept.description ? `<br>${concept.description}` : ''}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else if (slide.type === 'summary') {
                slidesHTML += `
                    <div class="slide summary-slide">
                        <div class="slide-content">
                            <h1>${slide.title}</h1>
                            <ul class="summary-list">
                                ${slide.insights.map(insight => `<li>${insight}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Marketing SuperAgent - Presentation</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                        background: #f5f5f5;
                        overflow-x: auto;
                        white-space: nowrap;
                        padding: 20px;
                    }

                    .slide {
                        display: inline-block;
                        width: 1024px;
                        height: 768px;
                        background: white;
                        margin-right: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        vertical-align: top;
                        position: relative;
                        overflow: hidden;
                    }

                    .slide-content {
                        padding: 60px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }

                    .title-slide {
                        background: linear-gradient(135deg, #1957db, #4475e6);
                        color: white;
                    }

                    .title-slide .slide-content {
                        justify-content: center;
                        text-align: center;
                    }

                    .title-slide h1 {
                        font-size: 48px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        line-height: 1.2;
                    }

                    .title-slide h2 {
                        font-size: 24px;
                        opacity: 0.9;
                        margin-bottom: 40px;
                    }

                    .content-slide h1 {
                        font-size: 36px;
                        color: #1957db;
                        margin-bottom: 40px;
                        border-bottom: 3px solid #1957db;
                        padding-bottom: 10px;
                    }

                    .content-slide h3 {
                        font-size: 24px;
                        color: #2c2c2c;
                        margin: 30px 0 15px 0;
                    }

                    .content-slide ul {
                        list-style: none;
                        margin: 0 0 30px 0;
                    }

                    .content-slide li {
                        padding: 8px 0;
                        padding-left: 25px;
                        position: relative;
                        font-size: 18px;
                        line-height: 1.5;
                    }

                    .content-slide li::before {
                        content: "▶";
                        position: absolute;
                        left: 0;
                        color: #1957db;
                        font-size: 12px;
                        top: 12px;
                    }

                    .content-section {
                        margin: 20px 0;
                    }

                    .content-section p {
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 15px;
                        color: #2c2c2c;
                    }

                    .bullets-section {
                        margin: 20px 0;
                    }

                    .bullets-section ul {
                        list-style: none;
                        margin: 0;
                    }

                    .bullets-section li {
                        padding: 6px 0;
                        padding-left: 25px;
                        position: relative;
                        font-size: 16px;
                        line-height: 1.5;
                    }

                    .bullets-section li::before {
                        content: "•";
                        position: absolute;
                        left: 0;
                        color: #1957db;
                        font-size: 16px;
                        font-weight: bold;
                        top: 6px;
                    }

                    .metrics-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin: 20px 0;
                    }

                    .metric {
                        text-align: center;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border-left: 4px solid #1957db;
                    }

                    .metric-value {
                        font-size: 32px;
                        font-weight: 700;
                        color: #1957db;
                        margin-bottom: 5px;
                    }

                    .metric-label {
                        font-size: 14px;
                        color: #6e6e6e;
                    }

                    .summary-slide {
                        background: linear-gradient(135deg, #2d9d78, #34d399);
                        color: white;
                    }

                    .summary-list li {
                        font-size: 20px;
                        margin-bottom: 15px;
                        padding-left: 30px;
                    }

                    .timestamp {
                        font-size: 16px;
                        opacity: 0.8;
                    }

                    @media print {
                        body { padding: 0; }
                        .slide {
                            display: block;
                            margin: 0;
                            page-break-after: always;
                            width: 100%;
                            height: 100vh;
                        }
                    }
                </style>
            </head>
            <body>
                ${slidesHTML}
                <script>
                    // Add navigation with arrow keys
                    let currentSlide = 0;
                    const slides = document.querySelectorAll('.slide');

                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
                            currentSlide++;
                            slides[currentSlide].scrollIntoView({ behavior: 'smooth' });
                        } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
                            currentSlide--;
                            slides[currentSlide].scrollIntoView({ behavior: 'smooth' });
                        }
                    });

                    // Click to navigate
                    slides.forEach((slide, index) => {
                        slide.addEventListener('click', () => {
                            currentSlide = index;
                        });
                    });
                </script>
            </body>
            </html>
        `;
    }

    generateGoogleSlidesFormat(slideData) {
        // Similar to PowerPoint but optimized for Google Slides import
        return this.generatePowerPointHTML(slideData);
    }

    convertToMarkdown(contentElement, title) {
        const timestamp = new Date().toLocaleDateString();
        let markdown = `# ${title}\n\n`;
        markdown += `*Generated by Marketing SuperAgent on ${timestamp}*\n\n`;

        // Extract and convert sections
        const sections = contentElement.querySelectorAll('.agent-analysis-card, .creative-concepts-section, .competitive-intelligence-section, .strategic-recommendations, .timeline-section, .knowledge-base-section');

        sections.forEach(section => {
            const sectionTitle = section.querySelector('h3, h4')?.textContent;
            if (sectionTitle) {
                markdown += `## ${sectionTitle}\n\n`;
            }

            // Extract insights
            const insights = section.querySelectorAll('.insight-highlight');
            if (insights.length > 0) {
                markdown += `### Key Insights\n\n`;
                insights.forEach(insight => {
                    markdown += `- ${insight.textContent.trim()}\n`;
                });
                markdown += `\n`;
            }

            // Extract metrics
            const metrics = section.querySelectorAll('.metric-item');
            if (metrics.length > 0) {
                markdown += `### Metrics\n\n`;
                metrics.forEach(metric => {
                    const value = metric.querySelector('.metric-value')?.textContent || '';
                    const desc = metric.querySelector('.metric-desc, .metric-label')?.textContent || '';
                    markdown += `- **${value}** - ${desc}\n`;
                });
                markdown += `\n`;
            }

            // Extract general content
            const paragraphs = section.querySelectorAll('p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text && !text.includes('Updated:') && text.length > 10) {
                    markdown += `${text}\n\n`;
                }
            });
        });

        markdown += `\n---\n\n*Generated by Marketing SuperAgent - AI-Native Marketing Platform*`;

        return markdown;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
            } else if (e.target.closest('#create-journey-btn')) {
                const button = e.target.closest('#create-journey-btn');
                const journeyType = button.getAttribute('data-journey-type') || 'reactivation';
                this.createJourneyFlow(journeyType);
            }
        });
    }

    handlePersonalizationActions() {
        // Add event listeners for Web Personalization Agent buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#enable-personalization-trial')) {
                this.enablePersonalizationTrial();
            } else if (e.target.closest('#learn-more-personalization')) {
                this.learnMorePersonalization();
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

    createJourneyFlow(journeyType = 'reactivation') {
        console.log('🚀 Creating journey flow for:', journeyType);

        // Add user action message
        this.addMessage(`Create ${journeyType} journey flow`, 'user');

        // Show agent progress for journey creation
        this.showAgentProgress('journey', `Creating ${journeyType} journey flow`);

        // Generate the journey flow after agent progress
        setTimeout(() => {
            // Create a journey-specific message to pass to generateJourneyFlowOutput
            let journeyMessage = '';
            switch(journeyType) {
                case 'reactivation':
                    journeyMessage = 'Create a customer reactivation journey for inactive subscribers';
                    break;
                case 'cart-abandonment':
                    journeyMessage = 'Create a cart abandonment recovery journey';
                    break;
                case 'welcome':
                    journeyMessage = 'Create a welcome onboarding journey';
                    break;
                default:
                    journeyMessage = 'Create a customer journey flow';
            }

            // Generate the journey flow using the existing method
            const journeyOutput = this.generateJourneyFlowOutput('journey', journeyMessage);

            // Display the journey flow with action buttons
            this.displayOutput(journeyOutput, 'Journey Flow Created', 'Journey Agent');
        }, 3000);
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
        exportBtn.className = 'workspace-btn primary';
        exportBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Export</span>
        `;
        exportBtn.addEventListener('click', () => this.exportOutput());

        // Create Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'workspace-btn';
        shareBtn.innerHTML = `
            <i class="fas fa-share-alt"></i>
            <span>Share</span>
        `;
        shareBtn.addEventListener('click', () => this.shareOutput());

        actionsContainer.appendChild(exportBtn);
        actionsContainer.appendChild(shareBtn);

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

    enablePersonalizationTrial() {
        this.addMessage('Enabling Web Personalization trial for 7 days...', 'agent', 'Web Personalization Agent');

        setTimeout(() => {
            this.addMessage('✅ Web Personalization trial activated! Your website will now show personalized experiences to returning visitors from your reactivation journey. Trial includes:\n\n• Dynamic content based on email engagement\n• Personalized product recommendations\n• Exit-intent offers\n• Journey-synced messaging\n\nYou can monitor performance in the Analytics dashboard.', 'agent', 'Web Personalization Agent');
        }, 2000);
    }

    learnMorePersonalization() {
        const infoMessage = `
            <div class="personalization-info-card">
                <h4>🌐 Web Personalization Agent</h4>
                <p><strong>What it does:</strong> Creates personalized website experiences that adapt to where visitors are in your marketing journeys.</p>

                <h5>Key Features:</h5>
                <ul>
                    <li><strong>Journey Integration:</strong> Syncs with email campaigns to show relevant website content</li>
                    <li><strong>Dynamic Content:</strong> Changes headlines, offers, and products based on visitor behavior</li>
                    <li><strong>Smart Targeting:</strong> Different experiences for new vs. returning visitors</li>
                    <li><strong>Exit-Intent:</strong> Captures departing visitors with targeted offers</li>
                    <li><strong>A/B Testing:</strong> Automatically tests different personalization strategies</li>
                </ul>

                <h5>Perfect for:</h5>
                <ul>
                    <li>E-commerce sites wanting to increase conversions</li>
                    <li>SaaS companies optimizing trial signups</li>
                    <li>Service businesses improving lead quality</li>
                    <li>Any business running email marketing campaigns</li>
                </ul>

                <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--gray-100); border-radius: var(--radius-md);">
                    <strong>💡 Pro Tip:</strong> Works best when combined with Audience and Journey agents for complete customer experience optimization.
                </div>
            </div>
        `;

        this.addMessage(infoMessage, 'agent', 'Web Personalization Agent');
    }

    handleCreativePrompt(prompt) {
        console.log('🎨 handleCreativePrompt called with:', prompt); // Debug log

        // Ensure we're in working mode (but don't clear messages if already in working mode)
        console.log('🔄 Checking current mode...'); // Debug log
        if (this.currentView !== 'working') {
            console.log('🔄 Switching to working mode...'); // Debug log
            this.showWorkingInterface();
        } else {
            console.log('✅ Already in working mode, preserving chat history'); // Debug log
        }

        // Set creative handling flag to prevent duplicate processing
        this.isHandlingCreativePrompt = true;

        // Add user selection message
        console.log('💬 Adding user message...'); // Debug log
        this.addMessage(prompt, 'user');

        // Show specialist agent progress for creative tasks
        console.log('⏳ Showing agent progress for creative task...'); // Debug log
        this.showAgentProgress('creative', prompt);

        // Generate appropriate creative output based on the prompt
        setTimeout(() => {
            console.log('🚀 Generating output for:', prompt); // Debug log
            if (prompt.includes('Instagram ad variations')) {
                console.log('📸 Generating Instagram ad variations...'); // Debug log
                this.generateInstagramAdVariations();
            } else if (prompt.includes('hero images')) {
                console.log('🖼️ Generating DAM image recommendations...'); // Debug log
                this.generateDAMImageRecommendations();
            } else if (prompt.includes('email subject lines')) {
                console.log('📧 Generating email subject lines...'); // Debug log
                this.generateEmailSubjectLines();
            } else if (prompt.includes('landing page headline')) {
                console.log('📄 Generating headline test variations...'); // Debug log
                this.generateHeadlineTestVariations();
            } else {
                console.log('❓ No matching generator found for prompt:', prompt); // Debug log
                // Fallback - generate generic creative output
                this.generateGenericCreativeOutput(prompt);
            }
        }, 1500);

        // Clear the flag after processing completes
        setTimeout(() => {
            this.isHandlingCreativePrompt = false;
        }, 5000);
    }

    handleCreativeKBToggle(isEnabled) {
        const statusElement = document.getElementById('creative-kb-status');
        if (statusElement) {
            if (isEnabled) {
                statusElement.innerHTML = '✅ Using your brand guidelines and creative briefs for personalized suggestions';
                statusElement.style.color = 'var(--accent-green)';
            } else {
                statusElement.innerHTML = '⚪ Using general creative best practices only';
                statusElement.style.color = 'var(--text-secondary)';
            }
        }
    }


    generateInstagramAdVariations() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-palette" style="color: var(--accent-red);"></i> Instagram Ad Variations</h2>
                        <p class="output-subtitle">3 creative variations for Fall Collection launch</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">3</span>
                            <span class="stat-label">Variations</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">85%</span>
                            <span class="stat-label">Predicted CTR</span>
                        </div>
                    </div>
                </div>

                <div class="creative-concepts-section">
                    <h3><i class="fas fa-lightbulb"></i> Creative Variations</h3>
                    <div class="concepts-grid">
                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Lifestyle Focus</h4>
                                <div class="concept-type">Carousel</div>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format"
                                     alt="Fall Collection Lifestyle - Woman in cozy sweater walking through autumn leaves"
                                     class="concept-image">
                            </div>
                            <div class="concept-details">
                                <p><strong>Copy:</strong> "Fall into style 🍂 Discover our new collection featuring cozy knits and warm tones perfect for autumn adventures."</p>
                                <div class="concept-metrics">
                                    <div class="metric">Engagement: <strong>High</strong></div>
                                    <div class="metric">CTR: <strong>4.2%</strong></div>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Product Showcase</h4>
                                <div class="concept-type">Single Image</div>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop&auto=format"
                                     alt="Fall Collection Product - Elegant autumn clothing laid out with warm accessories"
                                     class="concept-image">
                            </div>
                            <div class="concept-details">
                                <p><strong>Copy:</strong> "New arrivals just dropped! ✨ Shop our Fall Collection with 25% off your first order. Limited time only."</p>
                                <div class="concept-metrics">
                                    <div class="metric">Conversion: <strong>High</strong></div>
                                    <div class="metric">ROAS: <strong>3.8x</strong></div>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Social Proof</h4>
                                <div class="concept-type">Video</div>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=300&fit=crop&auto=format"
                                     alt="Fall Collection Social Proof - Happy customers wearing fall fashion in natural setting"
                                     class="concept-image">
                            </div>
                            <div class="concept-details">
                                <p><strong>Copy:</strong> "Join 50K+ happy customers loving our Fall Collection! See why everyone's talking about our quality and style."</p>
                                <div class="concept-metrics">
                                    <div class="metric">Trust Score: <strong>9.2/10</strong></div>
                                    <div class="metric">Share Rate: <strong>12%</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'Instagram Ad Variations', 'Creative AI Assistant');
    }

    generateDAMImageRecommendations() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-images" style="color: var(--accent-orange);"></i> DAM Image Recommendations</h2>
                        <p class="output-subtitle">Best-performing hero images for Black Friday campaign</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">12</span>
                            <span class="stat-label">Images Analyzed</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">92%</span>
                            <span class="stat-label">Performance Score</span>
                        </div>
                    </div>
                </div>

                <div class="creative-concepts-section">
                    <h3><i class="fas fa-star"></i> Top Performing Images</h3>
                    <div class="concepts-grid">
                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Hero_BF_2023_Main.jpg</h4>
                                <div class="concept-type">Hero Image</div>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=250&fit=crop&auto=format"
                                     alt="Black Friday Hero Image"
                                     class="concept-image"
                                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                            </div>
                            <div class="concept-details">
                                <p><strong>Performance:</strong> This image drove 34% higher CTR in previous Black Friday campaigns with strong conversion metrics.</p>
                                <div class="concept-metrics">
                                    <div class="metric">CTR: <strong>6.8%</strong></div>
                                    <div class="metric">CVR: <strong>4.2%</strong></div>
                                    <div class="metric">Engagement: <strong>High</strong></div>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Product_Grid_Sale.jpg</h4>
                                <div class="concept-type">Product Grid</div>
                            </div>
                            <div class="concept-preview">
                                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&auto=format"
                                     alt="Product Grid Sale Image"
                                     class="concept-image"
                                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                            </div>
                            <div class="concept-details">
                                <p><strong>Performance:</strong> Product grid format showed 28% higher add-to-cart rates during sale events.</p>
                                <div class="concept-metrics">
                                    <div class="metric">ATC Rate: <strong>8.5%</strong></div>
                                    <div class="metric">Dwell Time: <strong>45s</strong></div>
                                    <div class="metric">Mobile Optimized: <strong>Yes</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'DAM Image Recommendations', 'Creative AI Assistant');
    }

    generateEmailSubjectLines() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-envelope" style="color: var(--accent-primary);"></i> Email Subject Line Optimization</h2>
                        <p class="output-subtitle">Cart abandonment email subject lines with A/B test recommendations</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">2</span>
                            <span class="stat-label">Variations</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">+35%</span>
                            <span class="stat-label">Expected Open Rate</span>
                        </div>
                    </div>
                </div>

                <div class="variation-cards">
                    <div class="variation-card test">
                        <div class="variation-header">
                            <h4>Subject Line A (Urgency Focus)</h4>
                            <div class="variation-badge test">Test</div>
                        </div>
                        <div style="padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md); margin: 1rem 0;">
                            <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">
                                "Your cart is about to expire ⏰ Complete your order now"
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                <strong>Strategy:</strong> Creates urgency while being clear about the deadline
                            </div>
                        </div>
                        <div class="concept-metrics">
                            <div class="metric">Predicted Open Rate: <strong>28%</strong></div>
                            <div class="metric">Urgency Score: <strong>9/10</strong></div>
                            <div class="metric">Spam Risk: <strong>Low</strong></div>
                        </div>
                    </div>

                    <div class="variation-card control">
                        <div class="variation-header">
                            <h4>Subject Line B (Value Focus)</h4>
                            <div class="variation-badge control">Control</div>
                        </div>
                        <div style="padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md); margin: 1rem 0;">
                            <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">
                                "Still thinking? Here's 10% off to help you decide 💭"
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                <strong>Strategy:</strong> Empathetic tone with added incentive to complete purchase
                            </div>
                        </div>
                        <div class="concept-metrics">
                            <div class="metric">Predicted Open Rate: <strong>32%</strong></div>
                            <div class="metric">Empathy Score: <strong>8/10</strong></div>
                            <div class="metric">Conversion Potential: <strong>High</strong></div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'Email Subject Line Tests', 'Creative AI Assistant');
    }

    generateHeadlineTestVariations() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-text-height" style="color: var(--accent-green);"></i> Landing Page Headline Tests</h2>
                        <p class="output-subtitle">Alternative copy variations for headline optimization</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">3</span>
                            <span class="stat-label">Variations</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">+42%</span>
                            <span class="stat-label">Expected CVR Lift</span>
                        </div>
                    </div>
                </div>

                <div class="hypothesis-grid">
                    <div class="hypothesis-card">
                        <h5><i class="fas fa-trophy"></i> Current Headline (Control)</h5>
                        <div style="padding: 1.5rem; background: var(--gray-50); border-radius: var(--radius-md); margin: 1rem 0;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); text-align: center;">
                                "Get the Best Deals on Fashion"
                            </div>
                        </div>
                        <div class="concept-metrics">
                            <div class="metric">Current CVR: <strong>2.4%</strong></div>
                            <div class="metric">Clarity Score: <strong>6/10</strong></div>
                        </div>
                    </div>

                    <div class="hypothesis-card">
                        <h5><i class="fas fa-bullseye"></i> Variation A (Benefit-Focused)</h5>
                        <div style="padding: 1.5rem; background: var(--gray-50); border-radius: var(--radius-md); margin: 1rem 0;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); text-align: center;">
                                "Save Up to 70% on Designer Fashion"
                            </div>
                        </div>
                        <div class="concept-metrics">
                            <div class="metric">Predicted CVR: <strong>3.2%</strong></div>
                            <div class="metric">Value Clarity: <strong>9/10</strong></div>
                        </div>
                    </div>

                    <div class="hypothesis-card">
                        <h5><i class="fas fa-heart"></i> Variation B (Emotional Appeal)</h5>
                        <div style="padding: 1.5rem; background: var(--gray-50); border-radius: var(--radius-md); margin: 1rem 0;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); text-align: center;">
                                "Transform Your Style, Transform Your Confidence"
                            </div>
                        </div>
                        <div class="concept-metrics">
                            <div class="metric">Predicted CVR: <strong>3.6%</strong></div>
                            <div class="metric">Emotional Score: <strong>8/10</strong></div>
                        </div>
                    </div>
                </div>

                <div class="statistical-framework">
                    <h4>A/B Test Framework</h4>
                    <div class="framework-grid">
                        <div class="framework-item">
                            <span class="framework-value">95%</span>
                            <span class="framework-label">Confidence Level</span>
                        </div>
                        <div class="framework-item">
                            <span class="framework-value">10,000</span>
                            <span class="framework-label">Sample Size</span>
                        </div>
                        <div class="framework-item">
                            <span class="framework-value">14</span>
                            <span class="framework-label">Test Duration (Days)</span>
                        </div>
                        <div class="framework-item">
                            <span class="framework-value">20%</span>
                            <span class="framework-label">Minimum Detectable Effect</span>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'Headline A/B Tests', 'Creative AI Assistant');
    }

    generateGenericCreativeOutput(prompt) {
        console.log('🎯 Generating generic creative output for:', prompt); // Debug log
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-magic" style="color: var(--accent-primary);"></i> Creative AI Output</h2>
                        <p class="output-subtitle">AI-generated creative response</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">1</span>
                            <span class="stat-label">Task</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">Complete</span>
                        </div>
                    </div>
                </div>

                <div class="creative-concepts-section">
                    <h3><i class="fas fa-lightbulb"></i> Creative Response</h3>
                    <div class="concepts-grid">
                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Creative Solution</h4>
                                <div class="concept-type">AI Generated</div>
                            </div>
                            <div class="concept-details">
                                <p><strong>Task:</strong> ${prompt}</p>
                                <p><strong>Response:</strong> I've processed your creative request. This is a demonstration of the Creative AI functionality working correctly.</p>
                                <div class="concept-metrics">
                                    <div class="metric">Status: <strong>Complete</strong></div>
                                    <div class="metric">Confidence: <strong>High</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        console.log('📤 Displaying generic creative output...'); // Debug log
        this.displayOutput(output, 'Creative AI Response', 'Creative AI Assistant');
    }

    showAgentProgressForEngagePrompt(prompt) {
        // Map prompts to appropriate agent configurations
        let agentConfig;

        if (prompt.includes('cart abandoners')) {
            // Audience building task
            agentConfig = 'audience';
        } else if (prompt.includes('reactivation journey')) {
            // Journey design task
            agentConfig = 'journey';
        } else if (prompt.includes('email campaign')) {
            // Email campaign task
            agentConfig = 'paid-media';
        } else if (prompt.includes('open and click rates')) {
            // Analytics task
            agentConfig = 'performance';
        } else {
            // Default engagement task
            agentConfig = 'audience';
        }

        console.log('🎯 Using agent config:', agentConfig, 'for prompt:', prompt);
        this.showAgentProgress(agentConfig, prompt);
    }

    handleEngagePrompt(prompt) {
        console.log('🎯 handleEngagePrompt called with:', prompt); // Debug log

        // Ensure we're in working mode (but don't clear messages if already in working mode)
        console.log('🔄 Checking current mode...'); // Debug log
        if (this.currentView !== 'working') {
            console.log('🔄 Switching to working mode...'); // Debug log
            this.showWorkingInterface();
        } else {
            console.log('✅ Already in working mode, preserving chat history'); // Debug log
        }

        // Add user selection message
        console.log('💬 Adding user message...'); // Debug log
        this.addMessage(prompt, 'user');

        // Show relevant agent progress based on the prompt
        console.log('⏳ Showing agent progress for engagement task...'); // Debug log
        this.showAgentProgressForEngagePrompt(prompt);

        // Generate appropriate engagement output based on the prompt
        setTimeout(() => {
            console.log('🚀 Generating engagement output for:', prompt); // Debug log
            if (prompt.includes('cart abandoners')) {
                console.log('🛒 Generating cart abandoner audience...'); // Debug log
                this.generateCartAbandonerAudience();
            } else if (prompt.includes('reactivation journey')) {
                console.log('🔄 Generating reactivation journey...'); // Debug log
                this.generateReactivationJourney();
            } else if (prompt.includes('email campaign')) {
                console.log('📧 Generating VIP email campaign...'); // Debug log
                this.generateVIPEmailCampaign();
            } else if (prompt.includes('open and click rates')) {
                console.log('📊 Generating email performance report...'); // Debug log
                this.generateEmailPerformanceReport();
            } else {
                console.log('❓ No matching generator found for prompt:', prompt); // Debug log
                // Fallback - generate generic engagement output
                this.generateGenericEngagementOutput(prompt);
            }
        }, 1500);
    }

    generateCartAbandonerAudience() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-users" style="color: var(--accent-green);"></i> Cart Abandoner Audience</h2>
                        <p class="output-subtitle">Segmented audience built from last 14 days of cart abandonment data</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">2,847</span>
                            <span class="stat-label">Users</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">$127</span>
                            <span class="stat-label">Avg Cart Value</span>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-users"></i></div>
                            <h4>Audience Segmentation</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-bullseye"></i>
                            <span>High-value cart abandoners with strong re-engagement potential</span>
                        </div>
                        <div class="audience-breakdown">
                            <h5>Audience Segments</h5>
                            <div class="segment-bars">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">High Value ($100+)</span>
                                        <span class="segment-percentage">42%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 42%; background: var(--accent-green);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Medium Value ($50-99)</span>
                                        <span class="segment-percentage">35%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 35%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Low Value ($25-49)</span>
                                        <span class="segment-percentage">23%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 23%; background: var(--accent-orange);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Engagement Strategy</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Personalized recovery campaigns with time-sensitive offers</span>
                        </div>
                        <div class="forecast-grid">
                            <div class="forecast-item">
                                <div class="forecast-icon awareness">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="forecast-details">
                                    <div class="forecast-metric">Email Recovery Campaign</div>
                                    <div class="forecast-value">Expected 24% recovery rate</div>
                                </div>
                            </div>
                            <div class="forecast-item">
                                <div class="forecast-icon conversions">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <div class="forecast-details">
                                    <div class="forecast-metric">SMS Follow-up</div>
                                    <div class="forecast-value">+8% additional recovery</div>
                                </div>
                            </div>
                            <div class="forecast-item">
                                <div class="forecast-icon roi">
                                    <i class="fas fa-bullhorn"></i>
                                </div>
                                <div class="forecast-details">
                                    <div class="forecast-metric">Retargeting Ads</div>
                                    <div class="forecast-value">+12% reach extension</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'Cart Abandoner Audience', 'Engage AI Assistant');
    }

    generateReactivationJourney() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-sitemap" style="color: var(--accent-orange);"></i> Reactivation Journey</h2>
                        <p class="output-subtitle">Multi-channel journey to re-engage inactive subscribers</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">5</span>
                            <span class="stat-label">Touchpoints</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">28%</span>
                            <span class="stat-label">Expected Reactivation</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">14</span>
                            <span class="stat-label">Days Duration</span>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card journey">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-sitemap"></i></div>
                            <h4>Journey Strategy</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>Progressive value approach with escalating incentives for maximum reactivation</span>
                        </div>
                        <div class="journey-insights">
                            <h5>Journey Flow Design</h5>
                            <ul>
                                <li><strong>Day 1:</strong> "We miss you" soft re-engagement email</li>
                                <li><strong>Day 3:</strong> Value reminder with popular content</li>
                                <li><strong>Day 7:</strong> Exclusive 15% discount offer</li>
                                <li><strong>Day 10:</strong> SMS with limited-time 25% offer</li>
                                <li><strong>Day 14:</strong> Final chance 30% discount + free shipping</li>
                            </ul>
                            <div style="margin-top: var(--space-lg); text-align: center;">
                                <button class="journey-btn primary" id="create-journey-btn" data-journey-type="reactivation">
                                    <i class="fas fa-plus"></i>
                                    Create Journey
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-users"></i></div>
                            <h4>Target Audience Analysis</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-bullseye"></i>
                            <span>12,450 inactive subscribers (no engagement in 60+ days)</span>
                        </div>
                        <div class="audience-breakdown">
                            <h5>Subscriber Segments</h5>
                            <div class="segment-bars">
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">High Lifetime Value</span>
                                        <span class="segment-percentage">35%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 35%; background: var(--accent-green);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Recent Purchasers</span>
                                        <span class="segment-percentage">28%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 28%; background: var(--accent-primary);"></div>
                                    </div>
                                </div>
                                <div class="segment-bar">
                                    <div class="segment-info">
                                        <span class="segment-name">Long-term Inactive</span>
                                        <span class="segment-percentage">37%</span>
                                    </div>
                                    <div class="segment-progress">
                                        <div class="segment-fill" style="width: 37%; background: var(--accent-orange);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'Reactivation Journey', 'Engage AI Assistant');

        // Add Web Personalization Agent recommendation after specialist agents complete
        setTimeout(() => {
            const webPersonalizationMessage = `
                <div class="agent-recommendation-card">
                    <div class="recommendation-header">
                        <div class="agent-icon personalization">
                            <i class="fas fa-globe-americas"></i>
                        </div>
                        <div class="recommendation-info">
                            <h4>Web Personalization Agent</h4>
                            <p>Enhance your reactivation journey with targeted website experiences</p>
                        </div>
                    </div>

                    <div class="recommendation-content">
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>I can create personalized landing pages that adapt based on where subscribers are in your reactivation journey</span>
                        </div>

                        <div class="personalization-features">
                            <h5>What I can do:</h5>
                            <ul>
                                <li><strong>Dynamic content:</strong> Show different offers based on customer segment</li>
                                <li><strong>Behavioral triggers:</strong> Personalized pop-ups for returning visitors</li>
                                <li><strong>Journey-synced messaging:</strong> Website content that matches email touchpoints</li>
                                <li><strong>Exit-intent captures:</strong> Last-chance offers for departing visitors</li>
                            </ul>
                        </div>

                        <div class="preview-section">
                            <h5>Preview Experience:</h5>
                            <div class="website-preview" id="website-preview">
                                <div class="preview-browser">
                                    <div class="browser-bar">
                                        <div class="browser-dots">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <div class="browser-url">yourstore.com</div>
                                    </div>
                                    <div class="preview-content">
                                        <div class="hero-section">
                                            <h3>Welcome Back! We've Missed You 💙</h3>
                                            <p>Here's that 25% off we promised in your email</p>
                                            <div class="cta-button">Claim Your Discount</div>
                                        </div>
                                        <div class="personalized-products">
                                            <h4>Picked Just For You</h4>
                                            <div class="product-grid">
                                                <div class="product-card">New Arrivals</div>
                                                <div class="product-card">Your Favorites</div>
                                                <div class="product-card">Trending Now</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="recommendation-actions">
                            <button class="journey-btn primary" id="enable-personalization-trial">
                                <i class="fas fa-magic"></i>
                                Enable Trial for 7 Days
                            </button>
                            <button class="journey-btn secondary" id="learn-more-personalization">
                                <i class="fas fa-info-circle"></i>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.addMessage(webPersonalizationMessage, 'agent', 'Web Personalization Agent');
        }, 3000); // Show after 3 seconds to let specialist agents complete
    }

    generateVIPEmailCampaign() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-envelope" style="color: var(--accent-primary);"></i> VIP Email Campaign</h2>
                        <p class="output-subtitle">Exclusive campaign for high-value customers</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">1,247</span>
                            <span class="stat-label">VIP Recipients</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">52%</span>
                            <span class="stat-label">Expected Open Rate</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">$385</span>
                            <span class="stat-label">Avg Customer Value</span>
                        </div>
                    </div>
                </div>

                <div class="creative-concepts-section">
                    <h3><i class="fas fa-star"></i> VIP Campaign Elements</h3>
                    <div class="concepts-grid">
                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Early Access Offer</h4>
                                <div class="concept-type">Email</div>
                            </div>
                            <div class="concept-details">
                                <p><strong>Subject:</strong> "VIP Early Access: New Collection Preview ⭐"</p>
                                <p><strong>Copy:</strong> "As one of our most valued customers, you get first access to our new collection 48 hours before everyone else. Plus, enjoy exclusive VIP pricing."</p>
                                <div class="concept-metrics">
                                    <div class="metric">Open Rate: <strong>58%</strong></div>
                                    <div class="metric">CTR: <strong>12.5%</strong></div>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Personalized Recommendations</h4>
                                <div class="concept-type">Dynamic Content</div>
                            </div>
                            <div class="concept-details">
                                <p><strong>Strategy:</strong> AI-powered product recommendations based on purchase history</p>
                                <p><strong>Personalization:</strong> "Based on your love for [Category], we think you'll adore these new arrivals"</p>
                                <div class="concept-metrics">
                                    <div class="metric">Relevance Score: <strong>94%</strong></div>
                                    <div class="metric">Conversion: <strong>18.2%</strong></div>
                                </div>
                            </div>
                        </div>

                        <div class="concept-card">
                            <div class="concept-header">
                                <h4>Exclusive VIP Benefits</h4>
                                <div class="concept-type">Value Proposition</div>
                            </div>
                            <div class="concept-details">
                                <p><strong>Benefits:</strong> Free shipping, extended returns, priority customer service, birthday month discount</p>
                                <p><strong>CTA:</strong> "Continue Your VIP Journey"</p>
                                <div class="concept-metrics">
                                    <div class="metric">Engagement: <strong>High</strong></div>
                                    <div class="metric">Loyalty Impact: <strong>+32%</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'VIP Email Campaign', 'Engage AI Assistant');
    }

    generateEmailPerformanceReport() {
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-chart-bar" style="color: var(--accent-purple);"></i> Email Performance Report</h2>
                        <p class="output-subtitle">Performance analysis for your last 3 email campaigns</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">3</span>
                            <span class="stat-label">Campaigns</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">43.2%</span>
                            <span class="stat-label">Avg Open Rate</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">8.7%</span>
                            <span class="stat-label">Avg Click Rate</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">2.1%</span>
                            <span class="stat-label">Conversion Rate</span>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card performance">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                            <h4>Campaign Performance Analysis</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-trending-up"></i>
                            <span>Open rates trending upward, but click rates show opportunity for improvement</span>
                        </div>
                        <div class="key-metrics">
                            <div class="metric-item">
                                <span class="metric-value">+12%</span>
                                <span class="metric-desc">Open Rate vs Industry</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">-3%</span>
                                <span class="metric-desc">Click Rate vs Industry</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">0.8%</span>
                                <span class="metric-desc">Unsubscribe Rate</span>
                            </div>
                        </div>
                    </div>

                    <div class="agent-analysis-card analytics">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-chart-line"></i></div>
                            <h4>Detailed Campaign Breakdown</h4>
                        </div>
                        <div class="creative-insights">
                            <h5>Individual Campaign Performance</h5>
                            <ul>
                                <li><strong>Holiday Promo (Dec 15):</strong> 48.3% open rate, 11.2% click rate, $12,450 revenue</li>
                                <li><strong>New Arrivals (Dec 8):</strong> 41.7% open rate, 7.8% click rate, $8,290 revenue</li>
                                <li><strong>Flash Sale (Dec 1):</strong> 39.6% open rate, 7.1% click rate, $15,680 revenue</li>
                            </ul>
                        </div>
                        <div class="research-findings">
                            <h5>Optimization Recommendations</h5>
                            <ul>
                                <li><strong>Subject Lines:</strong> A/B test urgency vs. curiosity-driven subjects</li>
                                <li><strong>Send Time:</strong> Tuesday 10 AM shows highest engagement</li>
                                <li><strong>Content:</strong> Include more personalized product recommendations</li>
                                <li><strong>CTAs:</strong> Test button color and placement variations</li>
                            </ul>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        this.displayOutput(output, 'Email Performance Report', 'Engage AI Assistant');
    }

    generateGenericEngagementOutput(prompt) {
        console.log('🎯 Generating generic engagement output for:', prompt); // Debug log
        const output = `
            <div class="enhanced-output">
                <div class="output-header-section">
                    <div class="output-title-area">
                        <h2><i class="fas fa-users" style="color: var(--accent-green);"></i> Engage AI Output</h2>
                        <p class="output-subtitle">AI-generated engagement response</p>
                    </div>
                    <div class="output-stats">
                        <div class="stat-card">
                            <span class="stat-number">1</span>
                            <span class="stat-label">Task</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">Complete</span>
                        </div>
                    </div>
                </div>

                <div class="agent-analysis-grid">
                    <div class="agent-analysis-card audience">
                        <div class="agent-card-header">
                            <div class="agent-icon"><i class="fas fa-users"></i></div>
                            <h4>Engagement Solution</h4>
                        </div>
                        <div class="insight-highlight">
                            <i class="fas fa-lightbulb"></i>
                            <span>AI-powered engagement strategy delivered successfully</span>
                        </div>
                        <div style="margin-top: var(--space-md);">
                            <p><strong>Task:</strong> ${prompt}</p>
                            <p><strong>Response:</strong> I've processed your engagement request. This demonstrates the Engage AI functionality working correctly for audience building, journey orchestration, and engagement optimization.</p>
                        </div>
                    </div>
                </div>

                ${this.generateKnowledgeBaseSection()}
            </div>
        `;

        console.log('📤 Displaying generic engagement output...'); // Debug log
        this.displayOutput(output, 'Engage AI Response', 'Engage AI Assistant');
    }

    generateKnowledgeBaseSection() {
        return `
            <div class="knowledge-base-section">
                <h3><i class="fas fa-book"></i> Knowledge Base Sources</h3>
                <div class="knowledge-sources">
                    <div class="knowledge-source-card">
                        <div class="source-header">
                            <div class="source-icon brand"><i class="fas fa-palette"></i></div>
                            <div class="source-info">
                                <h4>Brand Guidelines</h4>
                                <span class="source-status active">Active</span>
                            </div>
                        </div>
                        <p class="source-details">Voice, tone, visual identity, and messaging standards</p>
                        <div class="source-metrics">
                            <span class="source-metric">Last updated: <strong>2 days ago</strong></span>
                            <span class="source-metric">Documents: <strong>12</strong></span>
                        </div>
                    </div>

                    <div class="knowledge-source-card">
                        <div class="source-header">
                            <div class="source-icon compliance"><i class="fas fa-shield-alt"></i></div>
                            <div class="source-info">
                                <h4>Compliance Rules</h4>
                                <span class="source-status active">Active</span>
                            </div>
                        </div>
                        <p class="source-details">Legal requirements, claims restrictions, and approval processes</p>
                        <div class="source-metrics">
                            <span class="source-metric">Last updated: <strong>1 week ago</strong></span>
                            <span class="source-metric">Documents: <strong>8</strong></span>
                        </div>
                    </div>

                    <div class="knowledge-source-card">
                        <div class="source-header">
                            <div class="source-icon customer"><i class="fas fa-users"></i></div>
                            <div class="source-info">
                                <h4>Customer Personas</h4>
                                <span class="source-status synced">Synced</span>
                            </div>
                        </div>
                        <p class="source-details">Target audience profiles, behaviors, and preferences</p>
                        <div class="source-metrics">
                            <span class="source-metric">Last updated: <strong>3 days ago</strong></span>
                            <span class="source-metric">Segments: <strong>6</strong></span>
                        </div>
                    </div>

                    <div class="knowledge-source-card">
                        <div class="source-header">
                            <div class="source-icon product"><i class="fas fa-box"></i></div>
                            <div class="source-info">
                                <h4>Product Catalog</h4>
                                <span class="source-status synced">Synced</span>
                            </div>
                        </div>
                        <p class="source-details">Product specifications, features, and positioning</p>
                        <div class="source-metrics">
                            <span class="source-metric">Last updated: <strong>1 hour ago</strong></span>
                            <span class="source-metric">Products: <strong>247</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeKnowledgeBaseSearch() {
        const searchContainer = document.querySelector('.kb-search-hover-container');
        const searchInput = document.getElementById('kb-search');

        if (searchContainer && searchInput) {
            // Auto-focus when search expands on hover
            searchContainer.addEventListener('mouseenter', () => {
                setTimeout(() => {
                    if (searchInput.offsetWidth > 0) {
                        searchInput.focus();
                    }
                }, 350); // Delay to allow animation to complete
            });

            // Handle escape key to clear search
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    searchInput.blur();
                }
            });

            // Keep search open when input is focused
            searchInput.addEventListener('focus', () => {
                searchContainer.style.zIndex = '100';
            });

            searchInput.addEventListener('blur', () => {
                searchContainer.style.zIndex = '';
            });
        }
    }

    // =====================================
    // AUTOPILOT SYSTEM
    // =====================================

    initializeTaskTemplates() {
        return {
            'BUDGET_REBALANCER': {
                name: 'Budget Rebalancer',
                description: 'Automatically rebalance paid media budgets to maximize ROAS',
                icon: 'fas fa-chart-line',
                category: 'Paid Media',
                autonomyLevels: ['SUGGEST', 'GUARDED_AUTO', 'FULL_AUTO'],
                defaultTrigger: { type: 'CRON', expr: '0 7 * * *' }
            },
            'CREATIVE_WINNER': {
                name: 'Creative Winner Roll-forward',
                description: 'Identify winning creative assets and scale them across campaigns',
                icon: 'fas fa-trophy',
                category: 'Creative',
                autonomyLevels: ['SUGGEST', 'GUARDED_AUTO', 'FULL_AUTO'],
                defaultTrigger: { type: 'CRON', expr: '0 9 * * *' }
            },
            'AUDIENCE_REFRESHER': {
                name: 'Audience Refresher',
                description: 'Keep audience segments fresh by adding new prospects and removing converters',
                icon: 'fas fa-users-cog',
                category: 'Audience',
                autonomyLevels: ['SUGGEST', 'GUARDED_AUTO', 'FULL_AUTO'],
                defaultTrigger: { type: 'CRON', expr: '0 18 * * *' }
            },
            'INSIGHTS_DIGEST': {
                name: 'Weekly Insights Digest',
                description: 'Compile and send weekly performance insights and recommendations',
                icon: 'fas fa-chart-bar',
                category: 'Analytics',
                autonomyLevels: ['SUGGEST', 'FULL_AUTO'],
                defaultTrigger: { type: 'CRON', expr: '0 9 * * MON' }
            },
            'COST_WATCHDOG': {
                name: 'Cost Anomaly Watchdog',
                description: 'Monitor campaign costs and alert on unusual spending patterns',
                icon: 'fas fa-shield-alt',
                category: 'Performance',
                autonomyLevels: ['SUGGEST', 'GUARDED_AUTO'],
                defaultTrigger: { type: 'REALTIME', condition: 'cost_spike > threshold' }
            },
            'EXPERIMENT_LAUNCHER': {
                name: 'A/B Test Launcher',
                description: 'Automatically launch A/B tests based on performance patterns',
                icon: 'fas fa-flask',
                category: 'Testing',
                autonomyLevels: ['SUGGEST', 'GUARDED_AUTO'],
                defaultTrigger: { type: 'EVENT', condition: 'performance_plateau' }
            }
        };
    }

    initializeAutopilot() {
        // Load sample tasks for demo
        this.loadSampleTasks();

        // Setup navigation handlers
        this.setupAutopilotNavigation();
        this.setupCampaignsNavigation();

        // Setup action handlers
        this.setupAutopilotActions();

        console.log('Autopilot system initialized');
    }

    setupAutopilotNavigation() {
        // Home page Autopilot navigation
        const autopilotBtn = document.getElementById('sidebar-autopilot-btn');
        const autopilotBtnWorking = document.getElementById('sidebar-autopilot-btn-working');
        const autopilotBackToHome = document.getElementById('autopilot-back-to-home');
        const autopilotKnowledgeBtn = document.getElementById('autopilot-knowledge-btn');
        const kbAutopilotBtn = document.getElementById('kb-autopilot-btn');

        if (autopilotBtn) {
            autopilotBtn.addEventListener('click', () => this.showAutopilotPage());
        }

        if (autopilotBtnWorking) {
            autopilotBtnWorking.addEventListener('click', () => this.showAutopilotPage());
        }

        if (autopilotBackToHome) {
            autopilotBackToHome.addEventListener('click', () => this.showHomePage());
        }

        if (autopilotKnowledgeBtn) {
            autopilotKnowledgeBtn.addEventListener('click', () => this.openKnowledgeBase());
        }

        if (kbAutopilotBtn) {
            kbAutopilotBtn.addEventListener('click', () => this.showAutopilotPage());
        }
    }

    setupCampaignsNavigation() {
        // Home page Campaigns navigation
        const campaignsBtn = document.getElementById('sidebar-campaigns-btn');
        const campaignsBackToHome = document.getElementById('campaigns-back-to-home');
        const campaignsAutopilotBtn = document.getElementById('campaigns-autopilot-btn');
        const campaignsKnowledgeBtn = document.getElementById('campaigns-knowledge-btn');
        const campaignsHistoryBtn = document.getElementById('campaigns-history-btn');

        // Autopilot page Campaigns navigation
        const autopilotCampaignsBtn = document.getElementById('autopilot-campaigns-btn');

        // Knowledge base page Campaigns navigation
        const kbCampaignsBtn = document.getElementById('kb-campaigns-btn');

        if (campaignsBtn) {
            campaignsBtn.addEventListener('click', (e) => {
                console.log('Campaigns button clicked!');
                e.preventDefault();
                e.stopPropagation();
                this.showCampaignsPage();
            });
        }

        if (campaignsBackToHome) {
            campaignsBackToHome.addEventListener('click', () => this.showHomePage());
        }

        if (campaignsAutopilotBtn) {
            campaignsAutopilotBtn.addEventListener('click', () => this.showAutopilotPage());
        }

        if (campaignsKnowledgeBtn) {
            campaignsKnowledgeBtn.addEventListener('click', () => this.openKnowledgeBase());
        }

        if (campaignsHistoryBtn) {
            campaignsHistoryBtn.addEventListener('click', () => this.openHistory());
        }

        if (autopilotCampaignsBtn) {
            autopilotCampaignsBtn.addEventListener('click', () => this.showCampaignsPage());
        }

        if (kbCampaignsBtn) {
            kbCampaignsBtn.addEventListener('click', () => this.showCampaignsPage());
        }
    }

    setupAutopilotActions() {
        // Create task button
        const createTaskBtn = document.getElementById('create-task-btn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', (e) => {
                console.log('Create task button clicked in setupAutopilotActions');
                e.preventDefault();
                e.stopPropagation();
                this.showAutopilotTaskCreation();
            });
        }

        // Bulk actions button
        const bulkActionsBtn = document.getElementById('bulk-actions-btn');
        if (bulkActionsBtn) {
            bulkActionsBtn.addEventListener('click', () => this.showBulkActionsDialog());
        }

        // Task filters
        const statusFilter = document.getElementById('task-status-filter');
        const typeFilter = document.getElementById('task-type-filter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterTasks());
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterTasks());
        }
    }

    showAutopilotPage() {
        console.log('showAutopilotPage called');
        console.log('Current window.location.hash before navigation:', window.location.hash);
        this.navigateToRoute('autopilot');
        // Force hash update as backup
        setTimeout(() => {
            if (window.location.hash !== '#autopilot') {
                console.log('Hash not set correctly, forcing update');
                window.location.hash = '#autopilot';
            }
        }, 10);

        // Setup create task functionality
        setTimeout(() => {
            this.setupAutopilotChat();
        }, 100);
    }


    setupAutopilotChat() {
        console.log('setupAutopilotChat called');
        // Create Task button handler
        const createTaskBtn = document.getElementById('create-task-btn');
        console.log('Create task button found:', createTaskBtn);
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', (e) => {
                console.log('Create task button clicked!');
                e.preventDefault();
                e.stopPropagation();
                this.showAutopilotTaskCreation();
            });
            console.log('Event listener added to create task button');
        } else {
            console.error('Create task button not found!');
        }

        // Note: Old modal functionality removed - now using main chat interface
    }


    showCampaignsPage() {
        console.log('showCampaignsPage called');
        console.log('Current window.location.hash before navigation:', window.location.hash);
        this.navigateToRoute('campaigns');
        // Force hash update as backup
        setTimeout(() => {
            if (window.location.hash !== '#campaigns') {
                console.log('Hash not set correctly, forcing update');
                window.location.hash = '#campaigns';
            }
        }, 10);
    }

    showAutopilotTaskCreation() {
        console.log('=== showAutopilotTaskCreation called ===');

        try {
            // Set context for autopilot task creation
            this.currentTask = 'autopilot-task-creation';
            this.currentTaskAgents = ['Research Agent', 'Creative Agent', 'Performance Agent', 'Audience Agent'];
            this.currentSuiteTitle = 'Autopilot Task Creation';

            // Transition to working interface
            this.showWorkingInterface();

            // Add initial message to chat
            this.addMessage('I\'d like to create a new autopilot task. What would you like me to help you build?', 'user');

            // Show the 6 AI action suggestions in the chat
            setTimeout(() => {
                this.showAutopilotSuggestions();
            }, 500);
        } catch (error) {
            console.error('Error in showAutopilotTaskCreation:', error);
        }
    }

    showAutopilotSuggestions() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        // Create a suggestions message
        const suggestionsHtml = `
            <div class="message assistant-message">
                <div class="message-content">
                    <p><strong>Here are some suggested autopilot tasks you can create:</strong></p>
                    <div class="autopilot-suggestions-grid">
                        <button class="autopilot-suggestion-btn" data-prompt="Analyze budget allocation across my active campaigns and suggest optimizations">
                            <div class="suggestion-icon budget">💰</div>
                            <div class="suggestion-content">
                                <h4>Optimize Budget Allocation</h4>
                                <p>Analyze spend distribution and suggest rebalancing opportunities</p>
                            </div>
                        </button>

                        <button class="autopilot-suggestion-btn" data-prompt="Review my autopilot agents performance and recommend improvements">
                            <div class="suggestion-icon performance">🤖</div>
                            <div class="suggestion-content">
                                <h4>Agent Performance Review</h4>
                                <p>Get insights on agent efficiency and optimization recommendations</p>
                            </div>
                        </button>

                        <button class="autopilot-suggestion-btn" data-prompt="Create a new autopilot agent to handle creative testing for my campaigns">
                            <div class="suggestion-icon creative">🎨</div>
                            <div class="suggestion-content">
                                <h4>Setup Creative Testing Agent</h4>
                                <p>Build an agent to automatically test and optimize ad creatives</p>
                            </div>
                        </button>

                        <button class="autopilot-suggestion-btn" data-prompt="Analyze my campaign performance trends and identify areas needing attention">
                            <div class="suggestion-icon analytics">📈</div>
                            <div class="suggestion-content">
                                <h4>Performance Trend Analysis</h4>
                                <p>Deep dive into metrics to spot declining performance early</p>
                            </div>
                        </button>

                        <button class="autopilot-suggestion-btn" data-prompt="Set up audience refresh automation for my retargeting campaigns">
                            <div class="suggestion-icon audience">👥</div>
                            <div class="suggestion-content">
                                <h4>Automate Audience Refresh</h4>
                                <p>Create smart audience management for optimal reach</p>
                            </div>
                        </button>

                        <button class="autopilot-suggestion-btn" data-prompt="Generate a comprehensive report on my Q4 marketing performance">
                            <div class="suggestion-icon reporting">📊</div>
                            <div class="suggestion-content">
                                <h4>Generate Performance Report</h4>
                                <p>Create detailed analytics report with actionable insights</p>
                            </div>
                        </button>
                    </div>
                    <p style="margin-top: 16px; font-size: 14px; color: #64748b;">Click on any suggestion above or type your own custom autopilot task below.</p>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', suggestionsHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add click handlers for the suggestion buttons
        const suggestionBtns = chatMessages.querySelectorAll('.autopilot-suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                if (prompt) {
                    const chatInput = document.getElementById('chat-input');
                    if (chatInput) {
                        chatInput.value = prompt;
                        chatInput.focus();
                        // Optional: Auto-send the prompt
                        // this.handleChatSend();
                    }
                }
            });
        });
    }

    loadSampleTasks() {
        this.autopilotTasks = [
            {
                task_id: 'br-001',
                name: 'Q4 Budget Rebalancer',
                type: 'BUDGET_REBALANCER',
                status: 'ENABLED',
                owner: 'kristen@td.com',
                approver: 'cpo@td.com',
                last_run: '2024-01-15T07:00:00Z',
                next_run: '2024-01-15T23:00:00Z',
                actions_this_week: 12,
                kpi_trend: [3.2, 3.1, 3.4, 3.3, 3.5, 3.4, 3.6],
                objective: { metric: 'ROAS', target: 3.5, current: 3.6 },
                scope: {
                    campaign_ids: ['meta:holiday-2024', 'google:black-friday'],
                    total_budget: 50000
                },
                constraints: {
                    max_daily_shift_pct: 10,
                    channel_caps: { meta: 30000, google: 20000 }
                },
                trigger: { type: 'CRON', expr: '0 7 * * *', timezone: 'America/Los_Angeles' },
                autonomy_level: 'GUARDED_AUTO',
                created_at: '2024-01-01T00:00:00Z'
            },
            {
                task_id: 'cw-001',
                name: 'Holiday Creative Winner',
                type: 'CREATIVE_WINNER',
                status: 'PAUSED',
                owner: 'kristen@td.com',
                approver: 'cpo@td.com',
                last_run: '2024-01-14T09:00:00Z',
                next_run: 'Invalid Date',
                actions_this_week: 3,
                kpi_trend: [2.8, 3.2, 2.9, 3.1, 2.7, 3.0, 3.1],
                objective: { metric: 'CTR', target: 3.0, current: 3.1 },
                scope: {
                    campaign_ids: ['meta:holiday-creatives', 'google:seasonal-ads'],
                    creative_types: ['video', 'carousel', 'static']
                },
                constraints: {
                    min_performance_threshold: 2.5,
                    max_budget_shift: 5000
                },
                trigger: { type: 'CRON', expr: '0 9 * * *', timezone: 'America/Los_Angeles' },
                autonomy_level: 'SUGGEST',
                created_at: '2024-01-02T00:00:00Z'
            },
            {
                task_id: 'ar-001',
                name: 'Nightly Audience Refresh',
                type: 'AUDIENCE_REFRESHER',
                status: 'ENABLED',
                owner: 'kristen@td.com',
                approver: 'cpo@td.com',
                last_run: '2024-01-15T18:00:00Z',
                next_run: '2024-01-16T10:00:00Z',
                actions_this_week: 35,
                kpi_trend: [87000, 89000, 91000, 88000, 92000, 90000, 91000],
                objective: { metric: 'Audience_Size', target: 90000, current: 91000 },
                scope: {
                    audience_segments: ['lookalike-purchasers', 'interest-based', 'behavioral'],
                    platforms: ['meta', 'google', 'linkedin']
                },
                constraints: {
                    min_audience_size: 50000,
                    max_daily_additions: 10000,
                    exclude_converters_days: 30
                },
                trigger: { type: 'CRON', expr: '0 18 * * *', timezone: 'America/Los_Angeles' },
                autonomy_level: 'FULL_AUTO',
                created_at: '2024-01-03T00:00:00Z'
            },
            {
                task_id: 'cw-002',
                name: 'API Cost Watchdog',
                type: 'COST_WATCHDOG',
                status: 'ENABLED',
                owner: 'kristen@td.com',
                approver: 'cpo@td.com',
                last_run: '2024-01-15T22:30:00Z',
                next_run: 'realtime',
                actions_this_week: 2,
                kpi_trend: [1200, 1150, 1300, 1180, 1220, 2100, 1190],
                objective: { metric: 'Daily_Cost', target: 1500, current: 1190 },
                scope: {
                    services: ['meta-api', 'google-ads-api', 'analytics-api'],
                    environments: ['prod', 'staging']
                },
                constraints: {
                    spike_threshold: 40,
                    daily_cap: 2500
                },
                trigger: { type: 'REALTIME', condition: 'cost_spike > 40%' },
                autonomy_level: 'GUARDED_AUTO',
                created_at: '2024-01-01T00:00:00Z'
            }
        ];
    }

    renderTaskList() {
        console.log('renderTaskList called');
        const taskList = document.getElementById('autopilot-task-list');
        if (!taskList) {
            console.log('Task list element not found');
            return;
        }

        console.log('autopilotTasks:', this.autopilotTasks);
        const filteredTasks = this.getFilteredTasks();
        console.log('filteredTasks:', filteredTasks);

        if (filteredTasks.length === 0) {
            console.log('No filtered tasks, showing empty state');
            taskList.innerHTML = `
                <div style="text-align: center; padding: var(--space-xl); color: var(--text-secondary);">
                    <i class="fas fa-robot" style="font-size: 48px; margin-bottom: var(--space-md); opacity: 0.3;"></i>
                    <h3>No tasks found</h3>
                    <p>Create your first autonomous task to get started.</p>
                    <button class="autopilot-action-btn primary" onclick="app.showTaskCreationWizard()" style="margin-top: var(--space-md);">
                        <i class="fas fa-plus"></i>
                        <span>Create Task</span>
                    </button>
                </div>
            `;
            return;
        }

        console.log('Rendering', filteredTasks.length, 'tasks');
        const taskCards = filteredTasks.map(task => {
            console.log('Rendering task:', task.name);
            return this.renderTaskCard(task);
        });
        taskList.innerHTML = taskCards.join('');
    }

    renderTaskCard(task) {
        const template = this.taskTemplates[task.type] || {};
        const statusClass = task.status.toLowerCase();
        const nextRunText = task.next_run === 'realtime' ? 'Real-time' :
                           task.next_run ? new Date(task.next_run).toLocaleString() : 'Paused';
        const lastRunText = task.last_run ? this.timeAgo(task.last_run) : 'Never';
        const typeClass = task.type.toLowerCase().replace(/_/g, '-');

        // Get agent-specific KPIs
        const kpis = this.getAgentKPIs(task.type, task);
        const sparklines = this.getAgentSparklines(task.type, task);
        const impactBadges = this.getImpactBadges(task.type, task);
        const systemKPIs = this.getSystemKPIs(task);

        return `
            <div class="autopilot-agent-card" data-agent-id="${task.task_id}">
                <!-- Card Header -->
                <div class="agent-card-header">
                    <div class="agent-header-top">
                        <div class="agent-title-section">
                            <h3 class="agent-title">${task.name}</h3>
                            <div class="agent-meta">
                                <span><i class="fas fa-clock"></i> ${task.schedule || 'Daily at 9:00 AM'}</span>
                                <span><i class="fas fa-history"></i> Last run: ${lastRunText}</span>
                                <span><i class="fas fa-forward"></i> Next run: ${nextRunText}</span>
                            </div>
                        </div>
                        <div class="agent-header-actions">
                            <div class="agent-status-pill ${statusClass}">
                                <div class="status-dot"></div>
                                ${task.status}
                            </div>
                            <div class="agent-quick-actions">
                                <button class="agent-action-btn" onclick="app.toggleTask('${task.task_id}')" title="${task.status === 'ENABLED' ? 'Pause' : 'Resume'}">
                                    <i class="fas fa-${task.status === 'ENABLED' ? 'pause' : 'play'}"></i>
                                </button>
                                <button class="agent-action-btn" onclick="app.runTaskNow('${task.task_id}')" title="Run now">
                                    <i class="fas fa-play-circle"></i>
                                </button>
                                <button class="agent-action-btn" onclick="app.editTask('${task.task_id}')" title="View config">
                                    <i class="fas fa-cog"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KPI Strip -->
                <div class="agent-kpi-strip">
                    <div class="agent-kpis-grid">
                        ${kpis.map(kpi => `
                            <div class="agent-kpi-item">
                                <div class="kpi-header">
                                    <span class="kpi-name">${kpi.name}</span>
                                    <div class="kpi-trend ${kpi.trend}">
                                        <i class="fas fa-${kpi.trend === 'up' ? 'arrow-up' : kpi.trend === 'down' ? 'arrow-down' : 'minus'}"></i>
                                        ${kpi.delta}
                                    </div>
                                </div>
                                <div class="kpi-value">${kpi.value}</div>
                                <div class="kpi-tooltip">${kpi.tooltip}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Sparklines -->
                ${sparklines.length > 0 ? `
                <div class="agent-sparklines">
                    <div class="sparklines-grid">
                        ${sparklines.slice(0, 2).map(sparkline => `
                            <div class="sparkline-item">
                                <div class="sparkline-header">
                                    <span class="sparkline-name">${sparkline.name}</span>
                                    <span class="sparkline-period">${sparkline.period}</span>
                                </div>
                                <div class="sparkline-chart" data-values="${sparkline.data.join(',')}">
                                    ${this.generateSparklineSVG(sparkline.data, sparkline.color)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Impact Badges -->
                ${impactBadges.length > 0 ? `
                <div class="agent-impact-badges">
                    <div class="impact-badges-grid">
                        ${impactBadges.map(badge => `
                            <div class="impact-badge ${badge.type}">${badge.text}</div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Card Footer -->
                <div class="agent-card-footer">
                    <button class="agent-footer-btn" onclick="app.showAnalyticsModal('${task.task_id}')">
                        View Analytics
                    </button>
                    <button class="agent-footer-btn" onclick="app.showRunHistoryDrawer('${task.task_id}')">
                        Run Log
                    </button>
                </div>

                <!-- System KPIs Overlay -->
                <div class="system-kpis-overlay">
                    <div class="system-kpis-content">
                        <h4 class="system-kpis-title">System KPIs</h4>
                        <div class="system-kpis-grid">
                            ${systemKPIs.map(kpi => `
                                <div class="system-kpi-item">
                                    <div class="system-kpi-value">${kpi.value}</div>
                                    <div class="system-kpi-name">${kpi.name}</div>
                                    <div class="system-kpi-period">(${kpi.period})</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateSparkline(data) {
        if (!data || data.length === 0) return '<div style="width: 60px; height: 20px;"></div>';

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        // Create points with proper scaling for 60x20 viewport
        const width = 60;
        const height = 20;
        const padding = 2; // Small padding to prevent clipping

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        }).join(' ');

        const lastValue = data[data.length - 1];
        const secondLastValue = data[data.length - 2] || lastValue;
        const isUp = lastValue >= secondLastValue;
        const color = isUp ? '#10b981' : '#ef4444';

        return `
            <svg width="60" height="20" viewBox="0 0 60 20" style="display: block;">
                <polyline
                    points="${points}"
                    fill="none"
                    stroke="${color}"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;
    }

    getFilteredTasks() {
        const statusFilter = document.getElementById('task-status-filter')?.value || 'all';
        const typeFilter = document.getElementById('task-type-filter')?.value || 'all';

        // Ensure autopilotTasks is initialized
        if (!this.autopilotTasks || this.autopilotTasks.length === 0) {
            console.log('autopilotTasks not initialized, calling loadSampleTasks');
            this.loadSampleTasks();
        }

        return (this.autopilotTasks || []).filter(task => {
            const statusMatch = statusFilter === 'all' || task.status.toLowerCase() === statusFilter;
            const typeMatch = typeFilter === 'all' || this.getTypeCategory(task.type).toLowerCase() === typeFilter;
            return statusMatch && typeMatch;
        });
    }

    getTypeCategory(type) {
        const categoryMap = {
            'BUDGET_REBALANCER': 'budget',
            'CREATIVE_WINNER': 'creative',
            'AUDIENCE_REFRESHER': 'audience',
            'INSIGHTS_DIGEST': 'insights',
            'COST_WATCHDOG': 'watchdog',
            'EXPERIMENT_LAUNCHER': 'experiments'
        };
        return categoryMap[type] || type;
    }

    filterTasks() {
        this.renderTaskList();
    }

    // Task actions
    toggleTask(taskId) {
        const task = this.autopilotTasks.find(t => t.task_id === taskId);
        if (task) {
            task.status = task.status === 'ENABLED' ? 'PAUSED' : 'ENABLED';
            this.renderTaskList();

            // Show notification
            this.showNotification(
                `Task ${task.status === 'ENABLED' ? 'enabled' : 'paused'}: ${task.name}`,
                task.status === 'ENABLED' ? 'success' : 'warning'
            );
        }
    }

    runTaskNow(taskId) {
        const task = this.autopilotTasks.find(t => t.task_id === taskId);
        if (task) {
            this.showNotification(`Running task: ${task.name}`, 'info');

            // Simulate task execution
            setTimeout(() => {
                task.last_run = new Date().toISOString();
                task.actions_this_week += 1;
                this.renderTaskList();
                this.showNotification(`Task completed: ${task.name}`, 'success');
            }, 2000);
        }
    }

    editTask(taskId) {
        const task = this.autopilotTasks.find(t => t.task_id === taskId);
        if (task) {
            this.showTaskCreationWizard(task);
        }
    }

    showTaskDetail(taskId) {
        const task = this.autopilotTasks.find(t => t.task_id === taskId);
        if (task) {
            this.showNotification(`Task Details: ${task.name} - ${task.status}`, 'info');
        }
    }

    showTaskCreationWizard(existingTask = null) {
        console.log('OLD showTaskCreationWizard called - redirecting to new method');
        this.showAutopilotTaskCreation();
    }

    showBulkActionsDialog() {
        this.showNotification('Bulk actions dialog coming soon!', 'info');
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: var(--space-md);
            background: ${type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: var(--radius-md);
            z-index: 1000;
            font-size: var(--font-sm);
            max-width: 300px;
            box-shadow: var(--shadow-lg);
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Campaigns Page Functionality
    renderCampaignsList() {
        const campaignsList = document.getElementById('campaigns-list');
        if (!campaignsList) return;

        // Mock campaigns data
        const campaigns = [
            {
                id: 'camp-001',
                name: 'Holiday Q4 Campaign',
                platform: 'Meta',
                status: 'active',
                spend: '$12.4k',
                roas: '4.8x',
                conversions: 245,
                lastUpdate: '2 hours ago',
                performance: 'excellent'
            },
            {
                id: 'camp-002',
                name: 'Brand Awareness Drive',
                platform: 'Google Ads',
                status: 'active',
                spend: '$8.7k',
                roas: '3.2x',
                conversions: 156,
                lastUpdate: '4 hours ago',
                performance: 'good'
            },
            {
                id: 'camp-003',
                name: 'Retargeting Campaign',
                platform: 'TikTok',
                status: 'paused',
                spend: '$3.1k',
                roas: '2.1x',
                conversions: 78,
                lastUpdate: '1 day ago',
                performance: 'needs-attention'
            }
        ];

        campaignsList.innerHTML = campaigns.map(campaign => `
            <div class="campaign-card ${campaign.status}">
                <div class="campaign-header">
                    <div class="campaign-info">
                        <h3 class="campaign-name">${campaign.name}</h3>
                        <div class="campaign-meta">
                            <span class="platform-badge ${campaign.platform.toLowerCase().replace(' ', '-')}">${campaign.platform}</span>
                            <span class="status-badge ${campaign.status}">${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span>
                        </div>
                    </div>
                    <div class="campaign-actions">
                        <button class="action-btn" onclick="app.editCampaign('${campaign.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="app.toggleCampaign('${campaign.id}')">
                            <i class="fas fa-${campaign.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                    </div>
                </div>
                <div class="campaign-metrics">
                    <div class="metric">
                        <span class="metric-label">Spend</span>
                        <span class="metric-value">${campaign.spend}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">ROAS</span>
                        <span class="metric-value">${campaign.roas}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Conversions</span>
                        <span class="metric-value">${campaign.conversions}</span>
                    </div>
                </div>
                <div class="campaign-footer">
                    <span class="last-update">Updated ${campaign.lastUpdate}</span>
                    <div class="performance-indicator ${campaign.performance}">
                        <i class="fas fa-circle"></i>
                        ${campaign.performance.replace('-', ' ')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    editCampaign(campaignId) {
        this.showNotification(`Campaign editor for ${campaignId} coming soon!`, 'info');
    }

    toggleCampaign(campaignId) {
        this.showNotification(`Campaign ${campaignId} status toggled`, 'success');
        // Refresh the list after a brief delay
        setTimeout(() => {
            this.renderCampaignsList();
        }, 1000);
    }

    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    // Enhanced Autopilot Functionality
    setupAutopilotEnhancements() {
        this.setupAnalyticsModal();
        this.setupRunHistoryDrawer();
        this.enhanceSparklines();
    }

    setupAnalyticsModal() {
        // Create analytics modal HTML if it doesn't exist
        if (!document.getElementById('analytics-modal')) {
            const modalHTML = `
                <div class="analytics-modal" id="analytics-modal">
                    <div class="analytics-modal-content">
                        <div class="analytics-modal-header">
                            <div>
                                <h2 class="analytics-modal-title" id="analytics-title">Agent Analytics</h2>
                                <p class="analytics-modal-subtitle">Detailed performance metrics and insights</p>
                            </div>
                            <button class="analytics-close-btn" onclick="app.closeAnalyticsModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="analytics-tabs">
                            <button class="analytics-tab active" data-tab="overview">Overview</button>
                            <button class="analytics-tab" data-tab="actions">Actions & Impact</button>
                            <button class="analytics-tab" data-tab="experiments">Experiments</button>
                            <button class="analytics-tab" data-tab="costs">Costs & Savings</button>
                            <button class="analytics-tab" data-tab="reliability">Reliability</button>
                        </div>
                        <div class="analytics-content" id="analytics-content">
                            <!-- Dynamic content will be loaded here -->
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Setup tab navigation
            document.querySelectorAll('.analytics-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    document.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    this.loadAnalyticsTab(e.target.dataset.tab);
                });
            });
        }
    }

    setupRunHistoryDrawer() {
        // Create run history drawer HTML if it doesn't exist
        if (!document.getElementById('run-history-drawer')) {
            const drawerHTML = `
                <div class="run-history-drawer" id="run-history-drawer">
                    <div class="run-history-header">
                        <div>
                            <h2 class="run-history-title" id="run-history-title">Run History</h2>
                            <p class="run-history-subtitle">Execution logs and detailed run information</p>
                        </div>
                        <button class="run-history-close" onclick="app.closeRunHistoryDrawer()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="run-history-content">
                        <div class="run-list">
                            <div class="run-list-header">
                                <h3 class="run-list-title">Recent Runs</h3>
                            </div>
                            <div id="run-list-items">
                                <!-- Dynamic content will be loaded here -->
                            </div>
                        </div>
                        <div class="run-detail" id="run-detail">
                            <div style="text-align: center; padding: 40px; color: #64748b;">
                                <i class="fas fa-history" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                                <h3>Select a run to view details</h3>
                                <p>Choose a run from the list to see detailed execution information</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', drawerHTML);
        }
    }

    enhanceSparklines() {
        // Add sparkline interactivity
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.sparkline-chart')) {
                this.showSparklineTooltip(e);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.sparkline-chart')) {
                this.hideSparklineTooltip(e);
            }
        });
    }

    // Agent-specific KPI functions
    getAgentKPIs(type, task) {
        const kpiConfig = {
            'BUDGET_REBALANCER': [
                { name: 'ROAS Δ (7d)', value: '+12.5%', delta: '+12.5%', trend: 'up', tooltip: 'Return on Ad Spend change vs previous 7 days' },
                { name: 'Spend Reallocation (7d)', value: '$24.8k', delta: '+24.8k', trend: 'up', tooltip: 'Total spend moved between platforms' },
                { name: 'Wasted Spend Prevented', value: '$8.2k', delta: '+8.2k', trend: 'up', tooltip: 'Estimated spend prevented from going to underperforming placements' }
            ],
            'CREATIVE_WINNER': [
                { name: 'CTR Δ (vs control)', value: '+18.3%', delta: '+18.3%', trend: 'up', tooltip: 'Click-through rate improvement vs control group' },
                { name: 'CVR Lift', value: '+22.1%', delta: '+22.1%', trend: 'up', tooltip: 'Conversion rate lift from creative optimization' },
                { name: 'Win Rate', value: '73%', delta: '+8%', trend: 'up', tooltip: 'Champion vs challenger win rate' }
            ],
            'AUDIENCE_REFRESHER': [
                { name: 'Audience Size Δ (7d)', value: '+125k', delta: '+125k', trend: 'up', tooltip: 'Change in reachable audience size over 7 days' },
                { name: 'Reachable Users', value: '2.8M', delta: '+45k', trend: 'up', tooltip: 'Total reachable users after refresh' },
                { name: 'Eligibility Errors', value: '0.8%', delta: '-0.3%', trend: 'down', tooltip: 'Percentage of users with eligibility errors' }
            ],
            'COST_WATCHDOG': [
                { name: 'Daily Cost', value: '$142', delta: '-$23', trend: 'down', tooltip: 'Current daily API cost' },
                { name: 'Anomaly Count (7d)', value: '3', delta: '-2', trend: 'down', tooltip: 'Number of cost anomalies detected in last 7 days' },
                { name: 'Estimated Savings', value: '$1.2k', delta: '+$1.2k', trend: 'up', tooltip: 'Total estimated savings from optimizations' }
            ]
        };

        return kpiConfig[type] || [
            { name: 'Performance', value: 'N/A', delta: '0%', trend: 'stable', tooltip: 'No data available' },
            { name: 'Impact', value: 'TBD', delta: '0%', trend: 'stable', tooltip: 'To be determined' },
            { name: 'Status', value: 'Active', delta: '0%', trend: 'stable', tooltip: 'Current status' }
        ];
    }

    getAgentSparklines(type, task) {
        const sparklineData = {
            'BUDGET_REBALANCER': [
                { name: 'ROAS Trend', data: [4.2, 4.3, 4.1, 4.5, 4.7, 4.8, 4.9], period: '7d', color: '#059669' },
                { name: 'Spend Reallocation', data: [18.2, 22.1, 19.5, 25.8, 23.4, 26.1, 24.8], period: '7d', color: '#3b82f6' }
            ],
            'CREATIVE_WINNER': [
                { name: 'CTR Trend', data: [2.8, 3.1, 3.2, 3.4, 3.5, 3.6, 3.8], period: '7d', color: '#059669' }
            ],
            'AUDIENCE_REFRESHER': [
                { name: 'Audience Size', data: [2.65, 2.68, 2.71, 2.74, 2.76, 2.78, 2.80], period: '7d', color: '#059669' }
            ],
            'COST_WATCHDOG': [
                { name: 'Daily Cost', data: [165, 158, 152, 148, 145, 143, 142], period: '7d', color: '#dc2626' }
            ]
        };

        return sparklineData[type] || [];
    }

    getImpactBadges(type, task) {
        const badgeConfig = {
            'BUDGET_REBALANCER': [
                { text: 'Saved $4.2k this week', type: 'savings' },
                { text: '+0.8 ROAS', type: 'improvement' }
            ],
            'CREATIVE_WINNER': [
                { text: '-12% CPA', type: 'reduction' },
                { text: '+$18k revenue', type: 'improvement' }
            ],
            'AUDIENCE_REFRESHER': [
                { text: '+15% reach potential', type: 'improvement' },
                { text: 'Reduced errors by 35%', type: 'reduction' }
            ],
            'COST_WATCHDOG': [
                { text: 'Prevented $845 overage', type: 'savings' },
                { text: '-14% API costs', type: 'reduction' }
            ]
        };

        return badgeConfig[type] || [];
    }

    getSystemKPIs(task) {
        return [
            { name: 'Run Success Rate', value: '98.5%', period: '30d' },
            { name: 'Mean Runtime', value: '4.2s', period: 'avg' },
            { name: 'Action Failure', value: '1.2%', period: '30d' },
            { name: 'SLA Breach Count', value: '0', period: '30d' }
        ];
    }

    generateSparklineSVG(data, color = '#059669') {
        if (!data || data.length === 0) return '';

        const width = 100;
        const height = 30;
        const padding = 2;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        }).join(' ');

        return `
            <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}">
                <polyline
                    class="sparkline-path"
                    points="${points}"
                    stroke="${color}"
                    fill="none"
                    stroke-width="2"
                />
            </svg>
        `;
    }

    // Modal and drawer functions
    showAnalyticsModal(agentId) {
        const modal = document.getElementById('analytics-modal');
        const task = this.autopilotTasks.find(t => t.task_id === agentId);

        if (task) {
            document.getElementById('analytics-title').textContent = `${task.name} Analytics`;
            this.loadAnalyticsTab('overview');
            modal.classList.add('open');
        }
    }

    closeAnalyticsModal() {
        const modal = document.getElementById('analytics-modal');
        modal.classList.remove('open');
    }

    showRunHistoryDrawer(agentId) {
        const drawer = document.getElementById('run-history-drawer');
        const task = this.autopilotTasks.find(t => t.task_id === agentId);

        if (task) {
            document.getElementById('run-history-title').textContent = `${task.name} - Run History`;
            this.loadRunHistory(agentId);
            drawer.classList.add('open');
        }
    }

    closeRunHistoryDrawer() {
        const drawer = document.getElementById('run-history-drawer');
        drawer.classList.remove('open');
    }

    loadAnalyticsTab(tabName) {
        const content = document.getElementById('analytics-content');

        const tabContent = {
            overview: `
                <div style="padding: 20px;">
                    <h3>Performance Overview</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                            <h4>ROAS Δ</h4>
                            <div style="font-size: 24px; font-weight: bold; color: #059669;">+12.5%</div>
                            <div style="font-size: 12px; color: #64748b;">vs last 7 days</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                            <h4>Spend Optimized</h4>
                            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">$24.8k</div>
                            <div style="font-size: 12px; color: #64748b;">reallocated this week</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                            <h4>Cost Savings</h4>
                            <div style="font-size: 24px; font-weight: bold; color: #059669;">$8.2k</div>
                            <div style="font-size: 12px; color: #64748b;">waste prevented</div>
                        </div>
                    </div>
                </div>
            `,
            actions: `
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3>Recent Actions</h3>
                        <button style="background: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
                            <i class="fas fa-download"></i> Export CSV
                        </button>
                    </div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Timestamp</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Action</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Impact</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">Jan 15, 09:00</td>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">Shifted $12K from Google Display to TikTok</td>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #059669;">+$2,400</td>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #059669;">Success</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">Jan 14, 09:00</td>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">Promoted creative variant #789</td>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #059669;">+$1,800</td>
                                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #059669;">Success</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            experiments: `
                <div style="padding: 20px;">
                    <h3>A/B Test Results</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 12px; text-align: left;">Variant</th>
                                <th style="padding: 12px; text-align: left;">CTR</th>
                                <th style="padding: 12px; text-align: left;">CVR</th>
                                <th style="padding: 12px; text-align: left;">Significance</th>
                                <th style="padding: 12px; text-align: left;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 12px;">Control</td>
                                <td style="padding: 12px;">3.2%</td>
                                <td style="padding: 12px;">4.1%</td>
                                <td style="padding: 12px;">-</td>
                                <td style="padding: 12px;">Baseline</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">Video A</td>
                                <td style="padding: 12px;">3.8%</td>
                                <td style="padding: 12px;">4.9%</td>
                                <td style="padding: 12px;">95.2%</td>
                                <td style="padding: 12px; color: #059669;">Winner</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            costs: `
                <div style="padding: 20px;">
                    <h3>Cost Analysis & Savings</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                            <h4>Daily Cost</h4>
                            <div style="font-size: 24px; font-weight: bold;">$142</div>
                            <div style="font-size: 12px; color: #059669;">-14% vs avg</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                            <h4>Total Savings</h4>
                            <div style="font-size: 24px; font-weight: bold;">$8.2k</div>
                            <div style="font-size: 12px; color: #64748b;">this month</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                            <h4>Efficiency Gain</h4>
                            <div style="font-size: 24px; font-weight: bold;">23%</div>
                            <div style="font-size: 12px; color: #64748b;">cost reduction</div>
                        </div>
                    </div>
                </div>
            `,
            reliability: `
                <div style="padding: 20px;">
                    <h3>System Reliability</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0;">
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">98.5%</div>
                            <div style="font-size: 12px; color: #64748b;">Run Success Rate</div>
                            <div style="font-size: 10px; color: #94a3b8;">(30d)</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">4.2s</div>
                            <div style="font-size: 12px; color: #64748b;">Mean Runtime</div>
                            <div style="font-size: 10px; color: #94a3b8;">(avg)</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">1.2%</div>
                            <div style="font-size: 12px; color: #64748b;">Action Failure</div>
                            <div style="font-size: 10px; color: #94a3b8;">(30d)</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">0</div>
                            <div style="font-size: 12px; color: #64748b;">SLA Breaches</div>
                            <div style="font-size: 10px; color: #94a3b8;">(30d)</div>
                        </div>
                    </div>
                </div>
            `
        };

        content.innerHTML = tabContent[tabName] || '<div>Content not available</div>';
    }

    loadRunHistory(agentId) {
        const runListItems = document.getElementById('run-list-items');

        const mockRuns = [
            { id: 'run-001', timestamp: '2024-01-15 09:00:00', status: 'success', duration: '4.2s', actions: 3, impact: '+$2,400' },
            { id: 'run-002', timestamp: '2024-01-14 09:00:00', status: 'success', duration: '3.8s', actions: 2, impact: '+$1,800' },
            { id: 'run-003', timestamp: '2024-01-13 09:00:00', status: 'failed', duration: '12.1s', actions: 0, impact: '$0' }
        ];

        runListItems.innerHTML = mockRuns.map(run => `
            <div class="run-item" onclick="app.showRunDetail('${run.id}')">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <i class="fas fa-${run.status === 'success' ? 'check-circle' : run.status === 'failed' ? 'times-circle' : 'clock'}"
                       style="color: ${run.status === 'success' ? '#059669' : run.status === 'failed' ? '#dc2626' : '#3b82f6'};"></i>
                    <span style="font-size: 12px; color: #64748b;">${new Date(run.timestamp).toLocaleString()}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px;">
                    <div>
                        <div style="color: #94a3b8;">Duration</div>
                        <div>${run.duration}</div>
                    </div>
                    <div>
                        <div style="color: #94a3b8;">Actions</div>
                        <div>${run.actions}</div>
                    </div>
                    <div>
                        <div style="color: #94a3b8;">Impact</div>
                        <div style="color: ${run.status === 'success' ? '#059669' : '#64748b'};">${run.impact}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showRunDetail(runId) {
        document.querySelectorAll('.run-item').forEach(item => item.classList.remove('selected'));
        event.target.closest('.run-item').classList.add('selected');

        const runDetail = document.getElementById('run-detail');
        runDetail.innerHTML = `
            <div style="padding: 20px;">
                <h3>Run Details - ${runId}</h3>
                <div style="margin-top: 20px;">
                    <h4>Execution Summary</h4>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 12px 0;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 14px;">
                            <div><strong>Started:</strong> Jan 15, 2024 09:00:00</div>
                            <div><strong>Duration:</strong> 4.2s</div>
                            <div><strong>Actions:</strong> 3</div>
                            <div><strong>Impact:</strong> +$2,400</div>
                        </div>
                    </div>

                    <h4>Decisions Made</h4>
                    <div style="margin: 12px 0;">
                        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                            <strong>TikTok:</strong> Increase budget <span style="color: #059669;">+12%</span>
                        </div>
                        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                            <strong>Google Display:</strong> Decrease budget <span style="color: #dc2626;">-8%</span>
                        </div>
                        <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
                            <strong>Meta:</strong> Maintain budget <span style="color: #64748b;">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showSparklineTooltip(e) {
        // Add sparkline tooltip functionality
    }

    hideSparklineTooltip(e) {
        // Hide sparkline tooltip
    }

    // KB Onboarding System
    initKBOnboarding() {
        this.kbOnboardingState = {
            isActive: false,
            selectedTasks: [],
            currentStep: 'welcome',
            completedCards: [],
            taskProgress: {}
        };

        this.taskToKnowledgeMapping = {
            'campaign_launch': ['brand-guidelines', 'product-catalog', 'creative-assets', 'customer-personas'],
            'paid_media': ['media-guidelines', 'audience-segments', 'conversion-tracking', 'budget-parameters'],
            'creative': ['brand-guidelines', 'creative-assets', 'tone-voice', 'visual-standards'],
            'personalization': ['customer-personas', 'behavioral-data', 'content-library', 'segmentation-rules'],
            'lifecycle': ['customer-journey', 'email-templates', 'automation-rules', 'retention-metrics'],
            'analytics': ['tracking-setup', 'kpi-definitions', 'dashboard-config', 'reporting-templates']
        };

        this.knowledgeCards = [
            { id: 'brand-guidelines', title: 'Brand Guidelines', description: 'Core brand identity, logo usage, color palette', category: 'Brand', priority: 'high' },
            { id: 'product-catalog', title: 'Product Catalog', description: 'Product details, pricing, availability', category: 'Product', priority: 'high' },
            { id: 'creative-assets', title: 'Creative Assets', description: 'Images, videos, design templates', category: 'Creative', priority: 'medium' },
            { id: 'customer-personas', title: 'Customer Personas', description: 'Target audience profiles and behaviors', category: 'Audience', priority: 'high' },
            { id: 'media-guidelines', title: 'Media Guidelines', description: 'Ad policies, creative specs, platform rules', category: 'Media', priority: 'medium' },
            { id: 'audience-segments', title: 'Audience Segments', description: 'Custom audiences and targeting criteria', category: 'Audience', priority: 'medium' },
            { id: 'conversion-tracking', title: 'Conversion Tracking', description: 'Pixel setup, event tracking, attribution', category: 'Analytics', priority: 'high' },
            { id: 'budget-parameters', title: 'Budget Parameters', description: 'Spend limits, bid strategies, pacing', category: 'Strategy', priority: 'medium' },
            { id: 'tone-voice', title: 'Tone & Voice', description: 'Brand communication style and messaging', category: 'Brand', priority: 'medium' },
            { id: 'visual-standards', title: 'Visual Standards', description: 'Design principles, layout guidelines', category: 'Creative', priority: 'low' },
            { id: 'behavioral-data', title: 'Behavioral Data', description: 'User interaction patterns and preferences', category: 'Analytics', priority: 'medium' },
            { id: 'content-library', title: 'Content Library', description: 'Existing content assets and templates', category: 'Creative', priority: 'low' },
            { id: 'segmentation-rules', title: 'Segmentation Rules', description: 'Customer classification criteria', category: 'Strategy', priority: 'medium' },
            { id: 'customer-journey', title: 'Customer Journey', description: 'Touchpoint mapping and flow', category: 'Strategy', priority: 'high' },
            { id: 'email-templates', title: 'Email Templates', description: 'Lifecycle email designs and copy', category: 'Creative', priority: 'medium' },
            { id: 'automation-rules', title: 'Automation Rules', description: 'Trigger conditions and workflows', category: 'Strategy', priority: 'medium' },
            { id: 'retention-metrics', title: 'Retention Metrics', description: 'Lifecycle KPIs and benchmarks', category: 'Analytics', priority: 'low' },
            { id: 'tracking-setup', title: 'Tracking Setup', description: 'Analytics configuration and tags', category: 'Analytics', priority: 'high' },
            { id: 'kpi-definitions', title: 'KPI Definitions', description: 'Success metrics and calculations', category: 'Analytics', priority: 'medium' },
            { id: 'dashboard-config', title: 'Dashboard Config', description: 'Reporting layout and data sources', category: 'Analytics', priority: 'low' },
            { id: 'reporting-templates', title: 'Reporting Templates', description: 'Standard report formats and schedules', category: 'Analytics', priority: 'low' }
        ];

        // Note: KB Onboarding button click is handled by the global .kb-action-btn handler

        // Set up close button listener
        const closeBtn = document.getElementById('kb-onboarding-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeKBOnboarding());
        }

        // Set up task chip listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('task-chip')) {
                this.handleTaskSelection(e.target.dataset.task);
            }
        });

        // Set up knowledge card listeners
        document.addEventListener('click', (e) => {
            if (e.target.closest('.knowledge-card')) {
                const card = e.target.closest('.knowledge-card');
                this.handleKnowledgeCardClick(card.dataset.cardId);
            }
        });

        // Set up filter listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilterChange(e.target.dataset.filter);
            }
        });

        // Set up onboarding chat input
        const onboardingChatInput = document.getElementById('kb-chat-input');
        const onboardingChatSend = document.getElementById('kb-chat-send');

        if (onboardingChatInput && onboardingChatSend) {
            const sendOnboardingMessage = () => {
                const message = onboardingChatInput.value.trim();
                if (message) {
                    this.handleOnboardingChatMessage(message);
                    onboardingChatInput.value = '';
                }
            };

            onboardingChatSend.addEventListener('click', sendOnboardingMessage);
            onboardingChatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendOnboardingMessage();
                }
            });
        }
    }

    openKBOnboarding() {
        console.log('🚀 openKBOnboarding called - starting KB onboarding process');
        this.kbOnboardingState.isActive = true;
        this.kbOnboardingState.currentStep = 'welcome';

        const onboardingMode = document.getElementById('kb-onboarding-mode');
        const kbView = document.getElementById('knowledge-base-page');

        console.log('onboardingMode element:', onboardingMode);
        console.log('kbView element:', kbView);

        // Create KB onboarding interface dynamically since the HTML element won't display
        const kbOnboardingOverlay = document.createElement('div');
        kbOnboardingOverlay.id = 'dynamic-kb-onboarding';
        kbOnboardingOverlay.innerHTML = `
            <!-- Left Sidebar (same as main KB page) -->
            <div class="sidebar-nav">
                <div class="nav-section">
                    <div class="nav-item" id="kb-onboarding-back-to-home">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </div>
                    <div class="nav-item" id="kb-onboarding-campaigns-btn">
                        <i class="fas fa-bullhorn"></i>
                        <span>Campaigns</span>
                    </div>
                    <div class="nav-item" id="kb-onboarding-autopilot-btn">
                        <i class="fas fa-robot"></i>
                        <span>Autopilot</span>
                    </div>
                    <div class="nav-item active">
                        <i class="fas fa-book"></i>
                        <span>Knowledge Base</span>
                    </div>
                    <div class="nav-item" id="kb-onboarding-history-btn">
                        <i class="fas fa-history"></i>
                        <span>History</span>
                    </div>
                </div>

                <div class="agent-status-sidebar">
                    <div class="status-header">
                        <i class="fas fa-robot"></i>
                        <span>KB Setup Assistant</span>
                    </div>
                    <div class="agent-indicators">
                        <div class="agent-indicator">
                            <div class="status-indicator active"></div>
                            <span>Knowledge Agent</span>
                        </div>
                        <div class="agent-indicator">
                            <div class="status-indicator idle"></div>
                            <span>Research Agent</span>
                        </div>
                        <div class="agent-indicator">
                            <div class="status-indicator idle"></div>
                            <span>Creative Agent</span>
                        </div>
                        <div class="agent-indicator">
                            <div class="status-indicator idle"></div>
                            <span>Performance Agent</span>
                        </div>
                        <div class="agent-indicator">
                            <div class="status-indicator idle"></div>
                            <span>Audience Agent</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KB Onboarding Chat (middle) -->
            <div class="kb-onboarding-chat" style="position: absolute; top: 0; left: 60px; width: 400px; height: 100vh; background: var(--card-bg, #fff); border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; z-index: 2; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1)); border-radius: var(--radius-lg, 8px); overflow: hidden;">
                <div class="chat-header" style="padding: var(--space-lg, 24px); border-bottom: var(--border, 1px solid #e5e7eb); display: flex; justify-content: space-between; align-items: center;">
                    <div class="chat-title" style="display: flex; align-items: center; gap: var(--space-sm, 8px); font-size: var(--h3, 16px); font-weight: var(--h3-weight, 600); color: var(--text-primary, #2c2c2c); font-family: var(--font-family, 'Figtree', sans-serif);">
                        <i class="fas fa-robot" style="color: var(--accent-primary, #1957db);"></i>
                        <span>Knowledge Base Assistant</span>
                    </div>
                    <button class="chat-close" id="dynamic-kb-close" style="background: none; border: none; padding: var(--space-xs, 8px); border-radius: var(--radius-sm, 4px); cursor: pointer; color: var(--text-muted, #9e9e9e); transition: all var(--transition-fast, 130ms ease-out);" onmouseover="this.style.background='var(--border-light, #f0f0f0)'; this.style.color='var(--text-secondary, #6e6e6e)'" onmouseout="this.style.background='none'; this.style.color='var(--text-muted, #9e9e9e)'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="chat-messages" id="dynamic-chat-messages" style="flex: 1; padding: var(--space-md, 16px) var(--space-sm, 12px); padding-top: var(--space-xl, 32px); overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-lg, 24px); background: white; font-family: var(--font-family, 'Figtree', sans-serif);">
                    <!-- Initial messages will be added via JavaScript -->
                </div>

                <div class="chat-input-section" style="padding: var(--space-md, 16px) var(--space-sm, 12px); border-top: none; background: var(--card-bg, #fff);">
                    <div class="input-container" style="display: flex; align-items: center; gap: var(--space-sm, 12px); background: var(--primary-bg, #fafafa); border: var(--border, 1px solid #e5e7eb); border-radius: var(--radius-lg, 8px); padding: var(--space-sm, 12px) var(--space-md, 16px); transition: all var(--transition-fast, 130ms ease-out);">
                        <input type="text" id="dynamic-chat-input" placeholder="Or describe what you'd like help with..." style="flex: 1; border: none; outline: none; padding: var(--space-xs, 8px) 0; font-size: var(--font-base, 14px); background: transparent; color: var(--text-primary, #2c2c2c); font-family: var(--font-family, 'Figtree', sans-serif);">
                        <button id="dynamic-chat-send" style="padding: var(--space-sm, 12px); background: var(--accent-primary, #1957db); border: none; border-radius: 8px; color: white; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='var(--accent-secondary, #4475e6)'" onmouseout="this.style.background='var(--accent-primary, #1957db)'">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Knowledge Cards (right - remaining space) -->
            <div class="kb-onboarding-cards" style="position: absolute; top: 0; left: 460px; right: 0; height: 100vh; background: white; display: flex; flex-direction: column; font-family: var(--font-family, 'Figtree', sans-serif);">
                <div class="cards-header" style="padding: var(--space-lg, 24px); border-bottom: var(--border, 1px solid #e5e7eb); background: var(--card-bg, white);">
                    <div class="cards-title" style="margin-bottom: var(--space-md, 16px);">
                        <h3 style="margin: 0 0 var(--space-sm, 12px) 0; font-size: var(--h2, 20px); font-weight: var(--h2-weight, 400); color: var(--text-primary, #2c2c2c);">Knowledge Required</h3>
                        <div id="dynamic-selected-tasks-pills" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 32px; align-items: center;">
                            <span id="dynamic-no-tasks-message" style="color: var(--text-secondary, #6e6e6e); font-size: var(--font-base, 14px); font-style: italic;">Select tasks to see requirements</span>
                        </div>
                    </div>
                    <div class="progress-indicator" style="background: transparent; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <span id="dynamic-progress-text" style="font-size: 14px; color: #475569;">Select tasks to see recommended knowledge</span>
                        <div style="background: #e2e8f0; height: 4px; border-radius: 2px; margin-top: 8px;">
                            <div id="dynamic-progress-fill" style="background: var(--primary-color, #3b82f6); height: 100%; border-radius: 2px; width: 0%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                </div>

                <div class="knowledge-cards-grid" id="dynamic-cards-grid" style="flex: 1; padding: 20px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
                    <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
                        <div style="font-size: 48px; margin-bottom: 16px;">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0; font-size: 18px;">Select a task to see required knowledge</h4>
                        <p style="margin: 0; font-size: 14px;">Choose one of the task options above to see what knowledge your SuperAgent needs.</p>
                    </div>
                </div>
            </div>
        `;

        kbOnboardingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 9999;
            display: flex;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        `;

        document.body.appendChild(kbOnboardingOverlay);
        console.log('Created dynamic KB onboarding interface');

        // Set up event listeners for the dynamic interface
        this.setupDynamicKBListeners();

        // Initialize the chat flow
        this.initializeDynamicKBChat();

        // Initialize agent status
        this.updateKBOnboardingAgentStatus('active');

        // Hide the knowledge base page
        if (kbView) {
            kbView.style.display = 'none';
        }
    }

    setupDynamicKBListeners() {
        // Close button
        const closeBtn = document.getElementById('dynamic-kb-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDynamicKBOnboarding());
        }

        // Sidebar navigation buttons
        const homeBtn = document.getElementById('kb-onboarding-back-to-home');
        const campaignBtn = document.getElementById('kb-onboarding-campaigns-btn');
        const autopilotBtn = document.getElementById('kb-onboarding-autopilot-btn');
        const historyBtn = document.getElementById('kb-onboarding-history-btn');

        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.closeDynamicKBOnboarding();
                this.showHomeScreen();
            });
        }

        if (campaignBtn) {
            campaignBtn.addEventListener('click', () => {
                this.closeDynamicKBOnboarding();
                this.openCampaigns();
            });
        }

        if (autopilotBtn) {
            autopilotBtn.addEventListener('click', () => {
                this.closeDynamicKBOnboarding();
                this.openAutopilot();
            });
        }

        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                this.closeDynamicKBOnboarding();
                // Add history functionality if needed
            });
        }

        // Task option buttons (in chat)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dynamic-task-option') && e.target.closest('#dynamic-kb-onboarding')) {
                const taskOption = e.target.closest('.dynamic-task-option');
                this.handleDynamicTaskSelection(taskOption.dataset.task);
            }
        });

        // Continue button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'dynamic-continue-btn') {
                this.handleDynamicTaskConfirmation();
            }
        });

        // Chat input
        const chatInput = document.getElementById('dynamic-chat-input');
        const chatSend = document.getElementById('dynamic-chat-send');
        const inputContainer = chatInput?.closest('.input-container');

        if (chatInput && chatSend) {
            const sendMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.handleDynamicChatMessage(message);
                    chatInput.value = '';
                }
            };

            // Add focus styling like SuperAgent
            if (inputContainer) {
                chatInput.addEventListener('focus', () => {
                    inputContainer.style.borderColor = 'var(--accent-primary, #1957db)';
                    inputContainer.style.boxShadow = '0 0 0 2px rgba(25, 87, 219, 0.2)';
                });

                chatInput.addEventListener('blur', () => {
                    inputContainer.style.borderColor = 'var(--border-color, #e5e7eb)';
                    inputContainer.style.boxShadow = 'none';
                });
            }

            chatSend.addEventListener('click', sendMessage);
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }

    closeDynamicKBOnboarding() {
        this.kbOnboardingState.isActive = false;

        const dynamicOverlay = document.getElementById('dynamic-kb-onboarding');
        const kbView = document.getElementById('knowledge-base-page');

        if (dynamicOverlay) {
            dynamicOverlay.remove();
        }

        if (kbView) {
            kbView.style.display = 'grid';
            console.log('KB page restored with display: grid');
        } else {
            console.error('Knowledge base page element not found');
        }
    }

    handleDynamicTaskSelection(taskId) {
        const taskOption = document.querySelector(`#dynamic-kb-onboarding [data-task="${taskId}"]`);
        if (!taskOption) return;

        const taskNames = {
            'campaign_launch': 'Campaign Launch',
            'paid_media': 'Paid Media',
            'creative': 'Creative Brief',
            'personalization': 'Personalization',
            'lifecycle': 'Lifecycle Setup',
            'analytics': 'Performance Analysis'
        };

        if (this.kbOnboardingState.selectedTasks.includes(taskId)) {
            // Deselect task
            this.kbOnboardingState.selectedTasks = this.kbOnboardingState.selectedTasks.filter(id => id !== taskId);
            taskOption.style.borderColor = 'var(--border-color, #e5e7eb)';
            taskOption.style.background = 'white';
            taskOption.style.boxShadow = 'none';
            taskOption.style.transform = 'none';

            // Remove checkmark if it exists
            const existingCheck = taskOption.querySelector('.task-selected-indicator');
            if (existingCheck) {
                existingCheck.remove();
            }

            // Removed immediate chat message - will handle in confirmation
        } else {
            // Select task
            this.kbOnboardingState.selectedTasks.push(taskId);

            // Get the color from the task options data
            const taskColors = {
                'campaign_launch': '#3b82f6',
                'paid_media': '#059669',
                'creative': '#dc2626',
                'personalization': '#7c3aed',
                'lifecycle': '#ea580c',
                'analytics': '#0891b2'
            };

            taskOption.style.borderColor = taskColors[taskId];
            taskOption.style.background = `${taskColors[taskId]}08`;
            taskOption.style.boxShadow = `0 4px 12px ${taskColors[taskId]}20`;
            taskOption.style.transform = 'none';

            // Add checkmark indicator
            if (!taskOption.querySelector('.task-selected-indicator')) {
                const checkmark = document.createElement('div');
                checkmark.className = 'task-selected-indicator';
                checkmark.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 20px;
                    height: 20px;
                    background: ${taskColors[taskId]};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                `;
                checkmark.innerHTML = '✓';
                taskOption.style.position = 'relative';
                taskOption.appendChild(checkmark);
            }

            // Removed immediate chat message - will handle in confirmation
        }

        // Update the continue button visibility and text
        this.updateDynamicContinueButton();

        // Update pills display in real-time (but don't trigger knowledge cards until confirmation)
        this.updateDynamicSelectedTasksPills();

        // No immediate chat responses - wait for confirmation button
    }

    updateDynamicContinueButton() {
        const continueBtn = document.getElementById('dynamic-continue-btn');
        if (!continueBtn) return;

        if (this.kbOnboardingState.selectedTasks.length > 0) {
            // Enable button
            continueBtn.style.opacity = '1';
            continueBtn.style.pointerEvents = 'auto';
            continueBtn.style.background = 'var(--accent-primary, #3b82f6)';

            // Update button text based on selection count
            const count = this.kbOnboardingState.selectedTasks.length;
            continueBtn.textContent = count === 1
                ? 'Continue with Selected Task'
                : `Continue with ${count} Selected Tasks`;
        } else {
            // Disable button
            continueBtn.style.opacity = '0.5';
            continueBtn.style.pointerEvents = 'none';
            continueBtn.style.background = '#9ca3af';
            continueBtn.textContent = 'Continue with Selected Tasks';
        }
    }

    handleDynamicTaskConfirmation() {
        if (this.kbOnboardingState.selectedTasks.length === 0) return;

        // Now trigger the original actions that were happening immediately
        this.updateDynamicKnowledgeCardsDisplay();
        this.updateDynamicProgressIndicator();

        // Provide confirmation message
        const taskNames = {
            'campaign_launch': 'Campaign Launch',
            'paid_media': 'Paid Media',
            'creative': 'Creative Brief',
            'personalization': 'Personalization',
            'lifecycle': 'Lifecycle Setup',
            'analytics': 'Performance Analysis'
        };

        const selectedTaskNames = this.kbOnboardingState.selectedTasks.map(id => taskNames[id]);

        // Add user confirmation message showing what was selected
        this.addDynamicChatMessage(`Selected tasks: ${selectedTaskNames.join(', ')}`, 'user');

        setTimeout(() => {
            if (this.kbOnboardingState.selectedTasks.length === 1) {
                this.addDynamicChatMessage(`Perfect! I've updated the knowledge cards to show what you need for ${selectedTaskNames[0]}. You can start adding knowledge or select additional tasks by going back.`, 'agent');
            } else {
                this.addDynamicChatMessage(`Excellent! I'm now showing knowledge for: ${selectedTaskNames.join(', ')}. The cards are sorted by priority and relevance across all your selected tasks.`, 'agent');
            }
        }, 800);
    }

    updateDynamicSelectedTasksPills() {
        const pillsContainer = document.getElementById('dynamic-selected-tasks-pills');
        const noTasksMessage = document.getElementById('dynamic-no-tasks-message');

        if (!pillsContainer) return;

        if (this.kbOnboardingState.selectedTasks.length > 0) {
            // Hide the "no tasks" message
            if (noTasksMessage) {
                noTasksMessage.style.display = 'none';
            }

            // Clear existing pills
            const existingPills = pillsContainer.querySelectorAll('.task-pill');
            existingPills.forEach(pill => pill.remove());

            // Create pills for selected tasks
            const taskNames = {
                'campaign_launch': 'Campaign Launch',
                'paid_media': 'Paid Media',
                'creative': 'Creative Brief',
                'personalization': 'Personalization',
                'lifecycle': 'Lifecycle Setup',
                'analytics': 'Performance Analysis'
            };

            const taskColors = {
                'campaign_launch': '#3b82f6',
                'paid_media': '#059669',
                'creative': '#dc2626',
                'personalization': '#7c3aed',
                'lifecycle': '#ea580c',
                'analytics': '#0891b2'
            };

            this.kbOnboardingState.selectedTasks.forEach(taskId => {
                const pill = document.createElement('span');
                pill.className = 'task-pill';
                pill.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    background: ${taskColors[taskId]}15;
                    border: 1px solid ${taskColors[taskId]}40;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 500;
                    color: ${taskColors[taskId]};
                    white-space: nowrap;
                `;
                pill.textContent = taskNames[taskId] || taskId;
                pillsContainer.appendChild(pill);
            });
        } else {
            // Show the "no tasks" message and clear pills
            if (noTasksMessage) {
                noTasksMessage.style.display = 'inline';
            }
            const existingPills = pillsContainer.querySelectorAll('.task-pill');
            existingPills.forEach(pill => pill.remove());
        }
    }

    updateDynamicKnowledgeCardsDisplay() {
        const cardsGrid = document.getElementById('dynamic-cards-grid');
        if (!cardsGrid) return;

        // Get relevant knowledge cards based on selected tasks
        const relevantCardIds = new Set();
        this.kbOnboardingState.selectedTasks.forEach(taskId => {
            const cards = this.taskToKnowledgeMapping[taskId] || [];
            cards.forEach(cardId => relevantCardIds.add(cardId));
        });

        if (relevantCardIds.size === 0) {
            cardsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
                    <div style="font-size: 48px; margin-bottom: 16px;">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <h4 style="margin: 0 0 8px 0; font-size: 18px;">Select a task to see required knowledge</h4>
                    <p style="margin: 0; font-size: 14px;">Choose one of the task options above to see what knowledge your SuperAgent needs.</p>
                </div>
            `;
            return;
        }

        // Sort cards by relevance and priority
        const sortedCards = this.knowledgeCards.sort((a, b) => {
            const aRelevant = relevantCardIds.has(a.id);
            const bRelevant = relevantCardIds.has(b.id);

            if (aRelevant && !bRelevant) return -1;
            if (!aRelevant && bRelevant) return 1;

            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        cardsGrid.innerHTML = sortedCards.map(card => {
            const isRelevant = relevantCardIds.has(card.id);
            const isCompleted = this.kbOnboardingState.completedCards.includes(card.id);

            if (!isRelevant) return ''; // Only show relevant cards

            return `
                <div class="knowledge-card" data-card-id="${card.id}" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; ${isCompleted ? 'border-color: #22c55e; background: #f0fdf4;' : ''}"
                     onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'"
                     onclick="app.handleDynamicKnowledgeCardClick('${card.id}')">
                    <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 8px;">
                        <h4 style="margin: 0; font-size: 16px; font-weight: 600; flex: 1;">${card.title}</h4>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="background: ${card.priority === 'high' ? 'rgba(227, 72, 80, 0.1)' : card.priority === 'medium' ? 'rgba(230, 134, 25, 0.1)' : 'rgba(45, 157, 120, 0.1)'}; color: ${card.priority === 'high' ? '#e34850' : card.priority === 'medium' ? '#e68619' : '#2d9d78'}; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${card.priority === 'high' ? 'rgba(227, 72, 80, 0.2)' : card.priority === 'medium' ? 'rgba(230, 134, 25, 0.2)' : 'rgba(45, 157, 120, 0.2)'};">${card.priority}</span>
                            ${isCompleted ? '<i class="fas fa-check-circle" style="color: #22c55e;"></i>' : ''}
                        </div>
                    </div>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; line-height: 1.4;">${card.description}</p>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">${card.category}</div>
                    <div style="display: flex; gap: 8px;">
                        <button style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                        <button style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <i class="fas fa-link"></i> Link
                        </button>
                        <button style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <i class="fas fa-edit"></i> Form
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateDynamicProgressIndicator() {
        const progressText = document.getElementById('dynamic-progress-text');
        const progressBar = document.getElementById('dynamic-progress-fill');
        const selectedTask = document.getElementById('dynamic-selected-task');

        if (!progressText || !progressBar) return;

        const totalRelevantCards = new Set();
        this.kbOnboardingState.selectedTasks.forEach(taskId => {
            const cards = this.taskToKnowledgeMapping[taskId] || [];
            cards.forEach(cardId => totalRelevantCards.add(cardId));
        });

        const total = totalRelevantCards.size;
        const completed = this.kbOnboardingState.completedCards.filter(cardId =>
            totalRelevantCards.has(cardId)
        ).length;

        // Update selected tasks pills display
        this.updateDynamicSelectedTasksPills();

        if (total > 0) {
            const percentage = Math.round((completed / total) * 100);
            progressText.textContent = `${completed} of ${total} recommended knowledge added`;
            progressBar.style.width = `${percentage}%`;

            // Style progress indicator for top-right positioning when cards are visible
            const allCards = document.querySelectorAll('.knowledge-card');
            const progressContainer = progressText.closest('.progress-indicator') || progressText.parentElement;
            if (progressContainer && allCards.length > 0) {
                console.log('Styling modal progress indicator for top-right position');
                progressContainer.style.position = 'fixed';
                progressContainer.style.top = '24px';
                progressContainer.style.right = '24px';
                progressContainer.style.zIndex = '1001'; // Above modal
                progressContainer.style.background = 'linear-gradient(135deg, var(--card-bg), rgba(255, 255, 255, 0.95))';
                progressContainer.style.backdropFilter = 'blur(10px)';
                progressContainer.style.border = '1px solid rgba(220, 224, 232, 0.8)';
                progressContainer.style.borderRadius = '12px';
                progressContainer.style.padding = '16px';
                progressContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)';
                progressContainer.style.width = '280px';
                progressContainer.style.animation = 'slideInFromRight 0.4s ease-out';

                // Style the text
                progressText.style.fontWeight = '600';
                progressText.style.fontSize = '14px';
                progressText.style.textAlign = 'center';
                progressText.style.color = 'var(--text-primary)';
                progressText.style.textTransform = 'uppercase';
                progressText.style.letterSpacing = '0.5px';
            }
        } else {
            progressText.textContent = 'Select tasks to see recommended knowledge';
            progressBar.style.width = '0%';

            // Reset positioning when no progress
            const progressContainer = progressText.closest('.progress-indicator') || progressText.parentElement;
            if (progressContainer) {
                progressContainer.style.position = '';
                progressContainer.style.top = '';
                progressContainer.style.right = '';
                progressContainer.style.zIndex = '';
                progressContainer.style.background = '';
                progressContainer.style.backdropFilter = '';
                progressContainer.style.border = '';
                progressContainer.style.borderRadius = '';
                progressContainer.style.padding = '';
                progressContainer.style.boxShadow = '';
                progressContainer.style.width = '';
                progressContainer.style.animation = '';
            }
        }

        // Manage visibility class for stylish progress positioning
        const kbCardsContainer = document.querySelector('.kb-onboarding-cards');
        if (kbCardsContainer) {
            const allCards = document.querySelectorAll('.knowledge-card');
            console.log('Progress debug:', { total, allCardsCount: allCards.length, hasVisibleClass: kbCardsContainer.classList.contains('has-visible-cards') });

            if (allCards.length > 0 && total > 0) {
                kbCardsContainer.classList.add('has-visible-cards');
                console.log('Added has-visible-cards class - cards visible');

                // Force test the progress indicator
                const progressIndicator = document.querySelector('.progress-indicator');
                const allProgressElements = document.querySelectorAll('*[class*="progress"]');
                const kbProgressText = document.getElementById('kb-progress-text');
                const kbProgressFill = document.getElementById('kb-progress-fill');

                console.log('Searching for progress elements:', {
                    progressIndicator: !!progressIndicator,
                    allProgressElements: allProgressElements.length,
                    kbProgressText: !!kbProgressText,
                    kbProgressFill: !!kbProgressFill,
                    currentPage: document.body.className,
                    kbCardsContainer: !!kbCardsContainer
                });

                if (progressIndicator) {
                    console.log('Progress indicator found, forcing visibility');
                    progressIndicator.style.display = 'flex';
                    progressIndicator.style.background = 'red';
                    progressIndicator.style.border = '3px solid blue';
                    progressIndicator.style.position = 'fixed';
                    progressIndicator.style.top = '50px';
                    progressIndicator.style.right = '50px';
                    progressIndicator.style.zIndex = '9999';
                } else if (kbProgressText) {
                    console.log('Found kb-progress-text, using parent element');
                    const parent = kbProgressText.closest('.progress-indicator') || kbProgressText.parentElement;
                    if (parent) {
                        parent.style.display = 'flex';
                        parent.style.background = 'red';
                        parent.style.border = '3px solid blue';
                        parent.style.position = 'fixed';
                        parent.style.top = '50px';
                        parent.style.right = '50px';
                        parent.style.zIndex = '9999';
                    }
                } else {
                    console.error('No progress elements found at all!');
                }
            } else {
                kbCardsContainer.classList.remove('has-visible-cards');
                console.log('Removed has-visible-cards class - no cards');
            }
        }
    }

    initializeDynamicKBChat() {
        // Add welcome message
        setTimeout(() => {
            this.addDynamicChatMessage('Hi! I\'ll help you set up your knowledge base with exactly what your marketing agent needs.', 'agent');
        }, 500);

        // Add task selection message with options after a delay
        setTimeout(() => {
            this.addDynamicChatMessage('What type of marketing work are you planning? Choose one or more:', 'agent');
            this.showDynamicTaskOptions();
        }, 1500);
    }

    addDynamicChatMessage(content, sender = 'agent', agentName = 'KB Assistant') {
        const chatMessages = document.getElementById('dynamic-chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        messageDiv.style.transition = 'all 0.3s ease-out';

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-avatar" style="display: none;">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content" style="flex: 1;">
                    <div class="message-text" style="background: var(--accent-primary, #3b82f6); border: 1px solid var(--accent-primary, #3b82f6); color: white; border-radius: var(--radius-lg, 12px) var(--radius-lg, 12px) var(--radius-sm, 4px) var(--radius-lg, 12px); padding: 12px 16px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1)); max-width: 80%; margin-left: auto;">${content}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar" style="display: none;">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content" style="flex: 1;">
                    <div class="message-text" style="background: transparent; border: none; color: var(--text-primary, #1e293b); border-radius: none; box-shadow: none; padding: 0;">${content}</div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);

        // Trigger animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);

        // Scroll behavior: For agent messages, scroll to show the beginning of the message
        if (sender === 'agent') {
            setTimeout(() => {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            // For user messages, scroll to bottom
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }

    showDynamicTaskOptions() {
        const chatMessages = document.getElementById('dynamic-chat-messages');
        if (!chatMessages) return;

        const taskOptionsDiv = document.createElement('div');
        taskOptionsDiv.className = 'message agent-message';
        taskOptionsDiv.style.opacity = '0';
        taskOptionsDiv.style.transform = 'translateY(20px)';
        taskOptionsDiv.style.transition = 'all 0.3s ease-out';

        const taskOptions = [
            { id: 'campaign_launch', name: 'Campaign Launch', icon: 'bullhorn', color: '#3b82f6', desc: 'Multi-channel campaign planning' },
            { id: 'paid_media', name: 'Paid Media', icon: 'dollar-sign', color: '#059669', desc: 'Ad optimization & budget management' },
            { id: 'creative', name: 'Creative Brief', icon: 'palette', color: '#dc2626', desc: 'Asset creation & brand guidelines' },
            { id: 'personalization', name: 'Personalization', icon: 'user-cog', color: '#7c3aed', desc: 'Targeted experiences & segmentation' },
            { id: 'lifecycle', name: 'Lifecycle Setup', icon: 'sync-alt', color: '#ea580c', desc: 'Customer journey automation' },
            { id: 'analytics', name: 'Performance Analysis', icon: 'chart-line', color: '#0891b2', desc: 'Reporting & ROI tracking' }
        ];

        const optionsHTML = taskOptions.map(task => `
            <button class="dynamic-task-option" data-task="${task.id}"
                    style="background: white; border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 1rem; cursor: pointer;
                           transition: all var(--transition-fast, 0.15s ease); display: flex; align-items: center; gap: 1rem; text-align: left; width: 100%;"
                    onmouseover="this.style.borderColor='${task.color}'; this.style.boxShadow='0 4px 12px rgba(25, 87, 219, 0.15)'; this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.borderColor='var(--border-color, #e5e7eb)'; this.style.boxShadow='none'; this.style.transform='translateY(0)'">
                <div style="background: linear-gradient(135deg, ${task.color}, ${task.color}aa); color: white; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fas fa-${task.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary, #1e293b); margin-bottom: 0.25rem;">${task.name}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary, #64748b);">${task.desc}</div>
                </div>
            </button>
        `).join('');

        taskOptionsDiv.innerHTML = `
            <div class="message-content" style="flex: 1;">
                <div class="message-text" style="background: transparent; border: none; color: var(--text-primary, #1e293b); padding: 0;">
                    <div style="margin-top: 1rem; padding: 1.5rem; background: var(--card-bg, #ffffff); border: var(--border, 1px solid #e5e7eb); border-radius: 12px;">
                        <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--text-primary, #1e293b); font-weight: 600;">Quick entries</h4>
                        <div style="display: grid; gap: 1rem;">
                            ${optionsHTML}
                        </div>
                        <div style="margin-top: 1rem; padding: 12px; background: var(--bg-muted, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px; font-size: 14px; color: var(--text-secondary, #64748b);">
                            💡 <strong>Multi-select:</strong> Click multiple tasks to see combined knowledge requirements. Click again to deselect.
                        </div>
                        <div style="margin-top: 1rem; text-align: center;">
                            <button id="dynamic-continue-btn" style="
                                background: var(--accent-primary, #3b82f6);
                                color: white;
                                border: none;
                                border-radius: 8px;
                                padding: 12px 24px;
                                font-size: 14px;
                                font-weight: 600;
                                cursor: pointer;
                                opacity: 0.5;
                                pointer-events: none;
                                transition: all 0.2s ease;
                            ">
                                Continue with Selected Tasks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        chatMessages.appendChild(taskOptionsDiv);

        // Trigger animation
        setTimeout(() => {
            taskOptionsDiv.style.opacity = '1';
            taskOptionsDiv.style.transform = 'translateY(0)';
        }, 500);

        // Scroll to show the task options
        setTimeout(() => {
            taskOptionsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 600);
    }

    handleDynamicKnowledgeCardClick(cardId) {
        if (!this.kbOnboardingState.completedCards.includes(cardId)) {
            this.kbOnboardingState.completedCards.push(cardId);
            this.updateDynamicKnowledgeCardsDisplay();
            this.updateDynamicProgressIndicator();

            const card = this.knowledgeCards.find(c => c.id === cardId);
            this.addDynamicChatMessage(`Added: ${card.title}`, 'user');

            setTimeout(() => {
                this.addDynamicChatMessage(`Perfect! Your agent now understands ${card.title.toLowerCase()}. This will help with ${card.description.toLowerCase()}.`, 'agent');

                // Check progress and provide encouragement
                const totalRelevant = new Set();
                this.kbOnboardingState.selectedTasks.forEach(taskId => {
                    const cards = this.taskToKnowledgeMapping[taskId] || [];
                    cards.forEach(cardId => totalRelevant.add(cardId));
                });

                const completed = this.kbOnboardingState.completedCards.filter(cardId => totalRelevant.has(cardId)).length;
                const total = totalRelevant.size;

                if (completed === total && total > 0) {
                    setTimeout(() => {
                        this.addDynamicChatMessage('🎉 Excellent! You\'ve added all the recommended knowledge. Your SuperAgent is now fully equipped for your selected tasks!', 'agent');
                    }, 1200);
                } else if (completed > 0 && completed % 3 === 0) {
                    setTimeout(() => {
                        this.addDynamicChatMessage(`You're making great progress! ${completed} of ${total} knowledge areas completed.`, 'agent');
                    }, 1200);
                }
            }, 600);
        }
    }

    handleDynamicChatMessage(message) {
        // Add user message
        this.addDynamicChatMessage(message, 'user');

        // Simple response logic
        setTimeout(() => {
            let response = 'I understand. Let me know if you need help with any specific knowledge areas.';

            if (message.toLowerCase().includes('done') || message.toLowerCase().includes('finished')) {
                response = 'Perfect! Your knowledge base is now set up. Click the X to return to your Knowledge Base.';
            } else if (message.toLowerCase().includes('help')) {
                response = 'I can help you understand what each knowledge area covers. Just click on any card to learn more, or select tasks to see my recommendations.';
            } else if (message.toLowerCase().includes('what') && message.toLowerCase().includes('next')) {
                response = 'Great question! You can either select more marketing tasks above, or click on the knowledge cards on the right to add them to your agent.';
            }

            this.addDynamicChatMessage(response, 'agent');
        }, 1000);
    }

    updateKBOnboardingAgentStatus(status) {
        // Update agent status indicators in the KB onboarding sidebar
        const knowledgeAgent = document.querySelector('#dynamic-kb-onboarding .agent-indicator:first-child .status-indicator');
        if (knowledgeAgent) {
            knowledgeAgent.className = `status-indicator ${status}`;
        }
    }

    closeKBOnboarding() {
        // Legacy method - kept for compatibility
        this.closeDynamicKBOnboarding();
    }

    initializeOnboardingChat() {
        const chatMessages = document.getElementById('kb-chat-messages');
        if (!chatMessages) {
            console.error('kb-chat-messages element not found');
            return;
        }
        console.log('Found kb-chat-messages element');

        const welcomeMessage = {
            type: 'agent',
            content: 'Hi! I\'ll help you set up your knowledge base with exactly what your marketing agent needs. First, let me know what you\'re planning to work on.',
            timestamp: new Date()
        };

        this.addOnboardingChatMessage(welcomeMessage);

        // Show task selection after a brief delay
        setTimeout(() => {
            this.showTaskSelection();
        }, 1000);
    }

    showTaskSelection() {
        const tasksContainer = document.getElementById('kb-task-chips');
        if (tasksContainer) {
            tasksContainer.style.display = 'block';
        }

        const message = {
            type: 'agent',
            content: 'Select the marketing tasks you\'re planning to work on. I\'ll show you the most relevant knowledge for each:',
            timestamp: new Date()
        };
        this.addOnboardingChatMessage(message);
    }

    addOnboardingChatMessage(message) {
        const chatMessages = document.getElementById('kb-chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.type}`;

        const timeStr = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        messageElement.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-time">${timeStr}</div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    handleTaskSelection(taskId) {
        const taskChip = document.querySelector(`[data-task="${taskId}"]`);
        if (!taskChip) return;

        if (this.kbOnboardingState.selectedTasks.includes(taskId)) {
            // Deselect task
            this.kbOnboardingState.selectedTasks = this.kbOnboardingState.selectedTasks.filter(id => id !== taskId);
            taskChip.classList.remove('selected');
        } else {
            // Select task
            this.kbOnboardingState.selectedTasks.push(taskId);
            taskChip.classList.add('selected');
        }

        console.log('Task selection changed:', { taskId, selectedTasks: this.kbOnboardingState.selectedTasks });
        this.updateKnowledgeCardsDisplay();
        this.updateProgressIndicator();

        // Add chat message about task selection
        const taskNames = {
            'campaign_launch': 'Campaign Launch',
            'paid_media': 'Paid Media Optimization',
            'creative': 'Creative Brief Creation',
            'personalization': 'Personalization Planning',
            'lifecycle': 'Lifecycle Setup',
            'analytics': 'Performance Analysis'
        };

        const message = {
            type: 'user',
            content: `Selected: ${taskNames[taskId]}`,
            timestamp: new Date()
        };
        this.addOnboardingChatMessage(message);

        if (this.kbOnboardingState.selectedTasks.length === 1) {
            const agentMessage = {
                type: 'agent',
                content: 'Great! I\'ve highlighted the knowledge cards most relevant to your selected tasks. You can add more tasks or start adding knowledge.',
                timestamp: new Date()
            };
            this.addOnboardingChatMessage(agentMessage);
        }
    }

    updateKnowledgeCardsDisplay() {
        console.log('=== updateKnowledgeCardsDisplay called ===');
        const cardsGrid = document.getElementById('kb-cards-grid');
        if (!cardsGrid) {
            console.error('kb-cards-grid element not found');
            return;
        }
        console.log('Found kb-cards-grid element');

        // Get relevant knowledge cards based on selected tasks
        const relevantCardIds = new Set();
        this.kbOnboardingState.selectedTasks.forEach(taskId => {
            const cards = this.taskToKnowledgeMapping[taskId] || [];
            cards.forEach(cardId => relevantCardIds.add(cardId));
        });

        // Sort cards by relevance and priority
        const sortedCards = this.knowledgeCards.sort((a, b) => {
            const aRelevant = relevantCardIds.has(a.id);
            const bRelevant = relevantCardIds.has(b.id);

            if (aRelevant && !bRelevant) return -1;
            if (!aRelevant && bRelevant) return 1;

            // If both relevant or both not relevant, sort by priority
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        cardsGrid.innerHTML = sortedCards.map(card => {
            const isRelevant = relevantCardIds.has(card.id);
            const isCompleted = this.kbOnboardingState.completedCards.includes(card.id);

            return `
                <div class="knowledge-card ${isRelevant ? 'relevant' : ''} ${isCompleted ? 'completed' : ''}"
                     data-card-id="${card.id}" data-category="${card.category}">
                    <div class="card-header">
                        <h4>${card.title}</h4>
                        <div class="card-badges">
                            ${isRelevant ? '<span class="relevance-badge">Recommended</span>' : ''}
                            <span class="priority-badge ${card.priority}">${card.priority}</span>
                            ${isCompleted ? '<i class="fas fa-check-circle completed-icon"></i>' : ''}
                        </div>
                    </div>
                    <p class="card-description">${card.description}</p>
                    <div class="card-category">${card.category}</div>
                    <div class="card-actions">
                        <button class="card-action-btn" data-action="upload">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                        <button class="card-action-btn" data-action="link">
                            <i class="fas fa-link"></i> Link
                        </button>
                        <button class="card-action-btn" data-action="form">
                            <i class="fas fa-edit"></i> Form
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateProgressIndicator() {
        const progressText = document.getElementById('kb-progress-text');
        const progressBar = document.getElementById('kb-progress-fill');

        if (!progressText || !progressBar) return;

        const totalRelevantCards = new Set();
        this.kbOnboardingState.selectedTasks.forEach(taskId => {
            const cards = this.taskToKnowledgeMapping[taskId] || [];
            cards.forEach(cardId => totalRelevantCards.add(cardId));
        });

        const total = totalRelevantCards.size;
        const completed = this.kbOnboardingState.completedCards.filter(cardId =>
            totalRelevantCards.has(cardId)
        ).length;

        if (total > 0) {
            const percentage = Math.round((completed / total) * 100);
            progressText.textContent = `${completed} of ${total} recommended knowledge added`;
            progressBar.style.width = `${percentage}%`;
        } else {
            progressText.textContent = 'Select tasks to see recommended knowledge';
            progressBar.style.width = '0%';
        }

        // Manage visibility class for stylish progress positioning
        const kbCardsContainer = document.querySelector('.kb-onboarding-cards');
        if (kbCardsContainer) {
            const allCards = document.querySelectorAll('.knowledge-card');
            console.log('Progress debug:', { total, allCardsCount: allCards.length, hasVisibleClass: kbCardsContainer.classList.contains('has-visible-cards') });

            if (allCards.length > 0 && total > 0) {
                kbCardsContainer.classList.add('has-visible-cards');
                console.log('Added has-visible-cards class - cards visible');

                // Force test the progress indicator
                const progressIndicator = document.querySelector('.progress-indicator');
                const allProgressElements = document.querySelectorAll('*[class*="progress"]');
                const kbProgressText = document.getElementById('kb-progress-text');
                const kbProgressFill = document.getElementById('kb-progress-fill');

                console.log('Searching for progress elements:', {
                    progressIndicator: !!progressIndicator,
                    allProgressElements: allProgressElements.length,
                    kbProgressText: !!kbProgressText,
                    kbProgressFill: !!kbProgressFill,
                    currentPage: document.body.className,
                    kbCardsContainer: !!kbCardsContainer
                });

                if (progressIndicator) {
                    console.log('Progress indicator found, forcing visibility');
                    progressIndicator.style.display = 'flex';
                    progressIndicator.style.background = 'red';
                    progressIndicator.style.border = '3px solid blue';
                    progressIndicator.style.position = 'fixed';
                    progressIndicator.style.top = '50px';
                    progressIndicator.style.right = '50px';
                    progressIndicator.style.zIndex = '9999';
                } else if (kbProgressText) {
                    console.log('Found kb-progress-text, using parent element');
                    const parent = kbProgressText.closest('.progress-indicator') || kbProgressText.parentElement;
                    if (parent) {
                        parent.style.display = 'flex';
                        parent.style.background = 'red';
                        parent.style.border = '3px solid blue';
                        parent.style.position = 'fixed';
                        parent.style.top = '50px';
                        parent.style.right = '50px';
                        parent.style.zIndex = '9999';
                    }
                } else {
                    console.error('No progress elements found at all!');
                }
            } else {
                kbCardsContainer.classList.remove('has-visible-cards');
                console.log('Removed has-visible-cards class - no cards');
            }
        }
    }

    handleKnowledgeCardClick(cardId) {
        // This would open a modal or form for adding knowledge
        // For now, we'll simulate adding the knowledge
        if (!this.kbOnboardingState.completedCards.includes(cardId)) {
            this.kbOnboardingState.completedCards.push(cardId);
            this.updateKnowledgeCardsDisplay();
            this.updateProgressIndicator();

            const card = this.knowledgeCards.find(c => c.id === cardId);
            const message = {
                type: 'agent',
                content: `Great! Added ${card.title} to your knowledge base. Your agent now understands this area better.`,
                timestamp: new Date()
            };
            this.addOnboardingChatMessage(message);
        }
    }

    handleFilterChange(filter) {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Apply filter to cards
        const cards = document.querySelectorAll('.knowledge-card');
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category.toLowerCase() === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    handleOnboardingChatMessage(message) {
        // Add user message
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        this.addOnboardingChatMessage(userMessage);

        // Simple response logic
        setTimeout(() => {
            let response = 'I understand. Let me know if you need help with any specific knowledge areas.';

            if (message.toLowerCase().includes('done') || message.toLowerCase().includes('finished')) {
                response = 'Perfect! Your knowledge base is now set up. Click "Finish Setup" to return to your Knowledge Base.';
            } else if (message.toLowerCase().includes('help')) {
                response = 'I can help you understand what each knowledge area covers. Just click on any card to learn more, or select tasks to see my recommendations.';
            }

            const agentMessage = {
                type: 'agent',
                content: response,
                timestamp: new Date()
            };
            this.addOnboardingChatMessage(agentMessage);
        }, 1000);
    }
}

// Interactive ideation tool functions
function triggerIdeationTool(toolType) {
    console.log(`🛠️ Triggering ideation tool: ${toolType}`);

    const toolMessages = {
        'mindmap': 'Starting mind mapping session... Think of your core concept and branch out with related ideas, emotions, and associations.',
        'scamper': 'Applying SCAMPER method... Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse your current concepts.',
        'random': 'Generating random stimulus... Use these unexpected elements to spark new creative directions.',
        'competitor': 'Analyzing competitive landscape... Identifying gaps and opportunities for differentiation.'
    };

    const message = toolMessages[toolType] || 'Launching ideation tool...';

    // Show a toast notification
    const toast = document.createElement('div');
    toast.className = 'refine-toast';
    toast.innerHTML = `
        <div class="refine-toast-content">
            <i class="fas fa-tools"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // Remove toast after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 4000);
}

// Test function to directly trigger creative brief
function testCreativeBrief() {
    console.log('🧪 Testing creative brief directly...');
    if (window.app) {
        window.app.currentTask = 'create-creative-brief';
        window.app.currentTaskAgents = ['Creative Brief Agent', 'Creative Ideation Agent', 'Campaign Architect Agent'];
        const context = { industry: 'technology' };
        const userMessage = 'Create a detailed creative brief with messaging, visual direction, and brand guidelines';
        const output = window.app.generateCreativeBriefOutput(context, userMessage);

        const outputContent = document.getElementById('output-content');
        if (outputContent) {
            outputContent.innerHTML = output;
            console.log('✅ Creative brief output generated and displayed!');
        } else {
            console.log('❌ output-content element not found');
        }
    } else {
        console.log('❌ App not found');
    }
}

// Global function for refining campaign strategy cards with AI
function refineWithAI(cardType) {
    console.log(`Refining ${cardType} with AI`);

    const refinements = {
        strategy: 'Refining strategic direction with enhanced market insights and competitive positioning...',
        messaging: 'Optimizing messaging pillars with advanced sentiment analysis and audience psychology...',
        audience: 'Enhancing audience segmentation with predictive analytics and behavioral modeling...',
        channels: 'Optimizing channel strategy with real-time performance data and attribution modeling...',
        competitive: 'Deepening competitive analysis with market intelligence and positioning opportunities...',
        'creative-objective': 'Refining creative objectives with strategic alignment and outcome optimization...',
        'brand-identity': 'Enhancing brand identity framework with visual consistency and emotional impact analysis...',
        'messaging-framework': 'Optimizing messaging framework with tone calibration and audience resonance testing...',
        'creative-concepts': 'Expanding creative concepts with innovative approaches and format optimization...',
        'execution-guide': 'Refining execution guidelines with production best practices and workflow optimization...',
        'ideation-tools': 'Generating additional brainstorming methods and creative thinking techniques...',
        'concept-directions': 'Expanding creative directions with new approaches and angles...',
        'inspiration-sources': 'Finding more inspirational references and creative examples...',
        'collaboration-space': 'Enhancing team collaboration tools and facilitation methods...',
        'concept-development': 'Developing concepts further with detailed frameworks and canvases...'
    };

    const message = refinements[cardType] || 'Refining analysis with AI-powered insights...';

    // Show a toast notification or progress indicator
    const toast = document.createElement('div');
    toast.className = 'refine-toast';
    toast.innerHTML = `
        <div class="refine-toast-content">
            <i class="fas fa-magic"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);

    // Here you could add actual AI refinement logic
    // For now, this serves as a placeholder for the functionality
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MarketingSuperAgentV4();
    window.app = app; // Make app available globally
    app.handleJourneyActions();
    app.handlePersonalizationActions();
    app.initializeKnowledgeBaseSearch();
    app.setupAutopilotEnhancements();
    app.initKBOnboarding();
    console.log('Marketing SuperAgent v4 loaded successfully');
});