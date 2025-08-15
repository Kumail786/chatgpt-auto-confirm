// ChatGPT Auto Confirm Extension
// Automatically responds "Yes" to ChatGPT confirmation prompts

console.log('ChatGPT Auto Confirm: Content script loaded!');

// Check if the class is already defined to prevent duplicate declarations
if (typeof window.ChatGPTAutoConfirm === 'undefined') {
    class ChatGPTAutoConfirm {
        constructor() {
            this.isEnabled = false; // Default to disabled for each tab
            this.tabId = null;
            this.confirmationKeywords = [
                'confirm', 'proceed', 'continue', 'yes', 'no', 'okay', 'sure',
                'would you like', 'do you want', 'shall i', 'should i',
                'are you sure', 'is this correct', 'confirm this', 'proceed with',
                'continue with', 'go ahead', 'start', 'begin', 'execute'
            ];
            this.negativeKeywords = ['no', 'cancel', 'stop', 'abort', 'never'];
            this.lastMessageTime = 0;
            this.checkInterval = null;
            this.init();
        }

        init() {
            console.log('ChatGPT Auto Confirm: Extension loaded for this tab');
            this.getTabId();
            this.startMonitoring();
            this.setupMessageListener();
        }

        getTabId() {
            // Get the current tab ID using runtime message instead of chrome.tabs
            chrome.runtime.sendMessage({ action: 'getTabId' }, (response) => {
                if (response && response.tabId) {
                    this.tabId = response.tabId;
                    console.log(`ChatGPT Auto Confirm: Tab ID: ${this.tabId}`);
                    // Check if this tab is enabled
                    this.checkTabStatus();
                } else {
                    console.log('ChatGPT Auto Confirm: Could not get tab ID');
                }
            });
        }

        checkTabStatus() {
            // Check if this specific tab is enabled
            chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
                if (response && response.tabId === this.tabId) {
                    this.isEnabled = response.enabled;
                    console.log(`ChatGPT Auto Confirm: Tab ${this.tabId} is ${this.isEnabled ? 'enabled' : 'disabled'}`);
                }
            });
        }

        startMonitoring() {
            // Check for new messages every 2 seconds
            this.checkInterval = setInterval(() => {
                if (this.isEnabled) {
                    this.checkForConfirmationPrompts();
                }
            }, 2000);
        }

        setupMessageListener() {
            // Listen for messages from popup and background
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === 'toggle') {
                    this.isEnabled = request.enabled;
                    console.log(`ChatGPT Auto Confirm: ${this.isEnabled ? 'Enabled' : 'Disabled'}`);
                    sendResponse({ success: true });
                } else if (request.action === 'ping') {
                    // Respond to background script ping
                    sendResponse({ success: true, enabled: this.isEnabled });
                }
            });
        }

        checkForConfirmationPrompts() {
            try {
                console.log('ChatGPT Auto Confirm: Checking for prompts...');
                
                // Get the last assistant message
                const lastAssistantMessage = this.getLastAssistantMessage();
                if (!lastAssistantMessage) {
                    console.log('ChatGPT Auto Confirm: No assistant message found');
                    return;
                }

                // Check if this is a new message (not processed before)
                const messageTime = this.getMessageTime(lastAssistantMessage);
                console.log('ChatGPT Auto Confirm: Message time:', messageTime, 'Last time:', this.lastMessageTime);
                
                if (messageTime <= this.lastMessageTime) {
                    console.log('ChatGPT Auto Confirm: Message already processed');
                    return;
                }

                // Check if the message is still being typed (wait for LLM to finish)
                if (this.isMessageStillTyping(lastAssistantMessage)) {
                    console.log('ChatGPT Auto Confirm: Message still being typed, waiting...');
                    return;
                }

                // Get the message text and check if it's a confirmation prompt
                const messageText = this.getMessageText(lastAssistantMessage);
                console.log('ChatGPT Auto Confirm: Message text:', messageText.substring(0, 100) + '...');
                
                if (this.isConfirmationPrompt(messageText)) {
                    console.log('ChatGPT Auto Confirm: Detected confirmation prompt, responding with "Yes"');
                    // Add a small delay to ensure the message is fully loaded
                    setTimeout(() => {
                        this.autoRespond();
                    }, 1000);
                    this.lastMessageTime = messageTime;
                } else {
                    console.log('ChatGPT Auto Confirm: Not a confirmation prompt, skipping');
                    this.lastMessageTime = messageTime; // Still mark as processed
                }
                
            } catch (error) {
                console.error('ChatGPT Auto Confirm: Error checking for prompts:', error);
            }
        }

        isMessageStillTyping(messageElement) {
            // Check if there's a typing indicator or if the message is still being generated
            const typingIndicators = [
                '.typing-indicator',
                '[data-testid="typing-indicator"]',
                '.animate-pulse',
                '[class*="typing"]',
                '[class*="loading"]'
            ];
            
            for (const selector of typingIndicators) {
                if (messageElement.querySelector(selector)) {
                    return true;
                }
            }
            
            // Check if the message element itself has typing-related classes
            const classList = messageElement.className || '';
            if (classList.includes('typing') || classList.includes('loading') || classList.includes('animate-pulse')) {
                return true;
            }
            
            // Check if there are any elements with "..." or typing indicators in the message
            const text = this.getMessageText(messageElement);
            if (text.includes('...') && text.length < 50) {
                return true;
            }
            
            return false;
        }

        getLastAssistantMessage() {
            // Find the last message from the assistant
            // Using the same selectors as the OpenAI scraper
            const messageSelectors = [
                'div[data-message-author-role="assistant"]',
                'div.text-message',
                'div[class*="markdown"]',
                'div[class*="prose"]',
                // Additional selectors for current ChatGPT interface
                'div[data-testid="conversation-turn-2"]',
                'div[class*="text-base"]',
                'div[class*="whitespace-pre-wrap"]',
                'div[class*="markdown"]',
                'div[class*="prose"]',
                // Try to find any div with text content that looks like a message
                'div:has(> div[class*="text-base"])',
                'div:has(> div[class*="whitespace-pre-wrap"])',
                // More specific selectors for ChatGPT
                '[data-testid="conversation-turn-2"]',
                '[data-testid="conversation-turn-4"]',
                '[data-testid="conversation-turn-6"]',
                // Look for message containers
                'div[class*="group"]:has(div[class*="text-base"])',
                'div[class*="message"]',
                'div[class*="response"]'
            ];

            console.log('ChatGPT Auto Confirm: Looking for assistant messages...');
            
            for (const selector of messageSelectors) {
                const messages = document.querySelectorAll(selector);
                console.log(`ChatGPT Auto Confirm: Selector "${selector}" found ${messages.length} messages`);
                
                if (messages.length > 0) {
                    // Get the last assistant message
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage && this.isVisible(lastMessage)) {
                        const text = this.getMessageText(lastMessage);
                        console.log(`ChatGPT Auto Confirm: Found message with text: "${text.substring(0, 50)}..."`);
                        return lastMessage;
                    }
                }
            }
            
            // Fallback: try to find any text content that looks like a ChatGPT response
            console.log('ChatGPT Auto Confirm: Trying fallback method...');
            const allDivs = document.querySelectorAll('div');
            for (let i = allDivs.length - 1; i >= 0; i--) {
                const div = allDivs[i];
                const text = div.textContent || div.innerText || '';
                if (text.length > 10 && text.length < 2000 && this.isVisible(div)) {
                    // Check if this looks like a ChatGPT response (not user input)
                    if ((text.includes('Hello') || text.includes('How') || text.includes('?') || text.includes('!')) && 
                        !text.includes('You:') && !text.includes('User:') && !text.includes('Human:')) {
                        console.log(`ChatGPT Auto Confirm: Fallback found message: "${text.substring(0, 50)}..."`);
                        return div;
                    }
                }
            }
            
            console.log('ChatGPT Auto Confirm: No assistant messages found');
            return null;
        }

        getMessageTime(messageElement) {
            // Try to get timestamp from the message
            const timestampElement = messageElement.querySelector('time') || 
                                    messageElement.querySelector('[data-timestamp]') ||
                                    messageElement.closest('[data-timestamp]');
            
            if (timestampElement) {
                const timestamp = timestampElement.getAttribute('datetime') || 
                                timestampElement.getAttribute('data-timestamp');
                if (timestamp) {
                    return new Date(timestamp).getTime();
                }
            }
            
            // Fallback: use current time
            return Date.now();
        }

        getMessageText(messageElement) {
            // Extract text content from the message
            return messageElement.textContent || messageElement.innerText || '';
        }

        isVisible(element) {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && 
                   window.getComputedStyle(element).display !== 'none' &&
                   window.getComputedStyle(element).visibility !== 'hidden';
        }

        isConfirmationPrompt(text) {
            const lowerText = text.toLowerCase().trim();
            
            // Skip very short messages (likely not confirmation prompts)
            if (lowerText.length < 10) {
                return false;
            }
            
            // Check for confirmation keywords
            const hasConfirmationKeyword = this.confirmationKeywords.some(keyword => 
                lowerText.includes(keyword)
            );

            // Check if it's asking a yes/no question
            const isQuestion = /\?$/.test(lowerText) || 
                              lowerText.includes('would you like') ||
                              lowerText.includes('do you want') ||
                              lowerText.includes('shall i') ||
                              lowerText.includes('should i') ||
                              lowerText.includes('would you like me to') ||
                              lowerText.includes('do you want me to') ||
                              lowerText.includes('should i proceed') ||
                              lowerText.includes('shall i proceed') ||
                              lowerText.includes('can i proceed') ||
                              lowerText.includes('may i proceed');

            // Check if it's not a negative response
            const hasNegativeKeyword = this.negativeKeywords.some(keyword => 
                lowerText.includes(keyword)
            );

            // Additional checks for confirmation patterns
            const hasConfirmationPattern = 
                lowerText.includes('confirm') ||
                lowerText.includes('proceed') ||
                lowerText.includes('continue') ||
                lowerText.includes('go ahead') ||
                lowerText.includes('start') ||
                lowerText.includes('begin') ||
                lowerText.includes('execute') ||
                lowerText.includes('run') ||
                lowerText.includes('launch');

            // Check for specific confirmation phrases
            const confirmationPhrases = [
                'would you like me to',
                'do you want me to',
                'should i proceed',
                'shall i proceed',
                'can i proceed',
                'may i proceed',
                'would you like me to proceed',
                'do you want me to continue',
                'should i continue',
                'shall i continue',
                'can i continue',
                'may i continue',
                'would you like me to start',
                'do you want me to start',
                'should i start',
                'shall i start',
                'can i start',
                'may i start'
            ];

            const hasSpecificPhrase = confirmationPhrases.some(phrase => 
                lowerText.includes(phrase)
            );

            // Must have confirmation keyword AND be a question, OR have specific confirmation phrase
            const isConfirmation = (hasConfirmationKeyword && isQuestion && !hasNegativeKeyword) || 
                                  hasSpecificPhrase || 
                                  (hasConfirmationPattern && isQuestion && !hasNegativeKeyword);

            console.log('ChatGPT Auto Confirm: Confirmation analysis:', {
                text: lowerText.substring(0, 50) + '...',
                hasConfirmationKeyword,
                isQuestion,
                hasNegativeKeyword,
                hasConfirmationPattern,
                hasSpecificPhrase,
                isConfirmation
            });

            return isConfirmation;
        }

        autoRespond() {
            try {
                console.log('ChatGPT Auto Confirm: Auto-responding with "Yes"');
                
                // Find the input area using the same selectors as the OpenAI scraper
                const inputSelectors = [
                    'div#prompt-textarea[contenteditable="true"]',
                    'div[data-testid="text-input"]',
                    'div.text-input[contenteditable="true"]',
                    'div[role="textbox"]',
                    'textarea[placeholder*="Message"]',
                    'textarea[data-id="root"]',
                    // Additional selectors for current ChatGPT interface
                    'textarea[placeholder*="Ask anything"]',
                    'div[contenteditable="true"]',
                    'textarea',
                    'input[type="text"]'
                ];

                let inputElement = null;
                console.log('ChatGPT Auto Confirm: Looking for input element...');
                
                for (const selector of inputSelectors) {
                    inputElement = document.querySelector(selector);
                    console.log(`ChatGPT Auto Confirm: Selector "${selector}" found:`, inputElement);
                    if (inputElement && this.isVisible(inputElement)) {
                        console.log('ChatGPT Auto Confirm: Found visible input element:', inputElement);
                        break;
                    }
                }

                if (!inputElement) {
                    console.log('ChatGPT Auto Confirm: Could not find input element');
                    return;
                }

                // Clear the input and set "Yes"
                console.log('ChatGPT Auto Confirm: Setting input value to "Yes"');
                this.setInputValue(inputElement, 'Yes');
                
                // Find and click the send button
                console.log('ChatGPT Auto Confirm: Looking for send button');
                this.clickSendButton();

            } catch (error) {
                console.error('ChatGPT Auto Confirm: Error auto-responding:', error);
            }
        }

        setInputValue(inputElement, value) {
            // Try multiple methods to set the input value
            try {
                // Method 1: Direct value setting
                if (inputElement.tagName === 'TEXTAREA') {
                    inputElement.value = value;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    // Method 2: For contenteditable divs
                    inputElement.textContent = value;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Method 3: Focus and type
                inputElement.focus();
                inputElement.click();
                
                // Small delay to ensure focus
                setTimeout(() => {
                    // Clear existing content
                    if (inputElement.tagName === 'TEXTAREA') {
                        inputElement.value = '';
                    } else {
                        inputElement.textContent = '';
                    }
                    
                    // Set new value
                    if (inputElement.tagName === 'TEXTAREA') {
                        inputElement.value = value;
                    } else {
                        inputElement.textContent = value;
                    }
                    
                    // Trigger events
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                }, 100);

            } catch (error) {
                console.error('ChatGPT Auto Confirm: Error setting input value:', error);
            }
        }

        clickSendButton() {
            // Find the send button using various selectors
            const sendButtonSelectors = [
                'button[data-testid="send-button"]',
                'button[aria-label*="Send"]',
                'button[aria-label*="send"]',
                'button:has(svg[data-icon="paper-plane"])',
                'button:has(svg[data-icon="arrow-up"])',
                'button[type="submit"]',
                'button.send-button',
                'button[class*="send"]',
                // Additional selectors for current ChatGPT interface
                'button[data-testid="send-button"]',
                'button:has(svg)',
                'button[disabled="false"]',
                'button:not([disabled])'
            ];

            console.log('ChatGPT Auto Confirm: Looking for send button...');
            
            for (const selector of sendButtonSelectors) {
                try {
                    const sendButton = document.querySelector(selector);
                    console.log(`ChatGPT Auto Confirm: Send button selector "${selector}" found:`, sendButton);
                    if (sendButton && this.isVisible(sendButton) && !sendButton.disabled) {
                        console.log('ChatGPT Auto Confirm: Found enabled send button:', sendButton);
                        console.log('ChatGPT Auto Confirm: Clicking send button');
                        sendButton.click();
                        return;
                    }
                } catch (error) {
                    console.log(`ChatGPT Auto Confirm: Error with selector "${selector}":`, error);
                    continue;
                }
            }

            // Fallback: Try pressing Enter key
            console.log('ChatGPT Auto Confirm: Trying Enter key fallback...');
            try {
                const activeElement = document.activeElement;
                console.log('ChatGPT Auto Confirm: Active element:', activeElement);
                if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
                    console.log('ChatGPT Auto Confirm: Pressing Enter key');
                    activeElement.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    }));
                } else {
                    console.log('ChatGPT Auto Confirm: No suitable active element for Enter key');
                }
            } catch (error) {
                console.error('ChatGPT Auto Confirm: Error clicking send button:', error);
            }
        }

        stop() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
        }
    }

    // Make the class available globally
    window.ChatGPTAutoConfirm = ChatGPTAutoConfirm;
}

// Initialize the extension when the page loads
if (typeof window.autoConfirm === 'undefined') {
    let autoConfirm = null;

    function initializeExtension() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (!window.autoConfirm) {
                    window.autoConfirm = new ChatGPTAutoConfirm();
                }
            });
        } else {
            if (!window.autoConfirm) {
                window.autoConfirm = new ChatGPTAutoConfirm();
            }
        }
    }

    // Initialize immediately
    initializeExtension();

    // Also initialize when navigating to new chats
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (window.autoConfirm) {
                window.autoConfirm.stop();
                window.autoConfirm = null;
            }
            setTimeout(() => {
                if (!window.autoConfirm) {
                    window.autoConfirm = new ChatGPTAutoConfirm();
                }
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    // Simple test to verify extension is working
    setTimeout(() => {
        console.log('ChatGPT Auto Confirm: Extension test - if you see this, the extension is loaded!');
        console.log('ChatGPT Auto Confirm: Current URL:', window.location.href);
        console.log('ChatGPT Auto Confirm: Document ready state:', document.readyState);
    }, 2000);
}
