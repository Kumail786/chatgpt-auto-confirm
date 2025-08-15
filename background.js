// Background service worker for ChatGPT Auto Confirm Extension

let enabledTabs = new Set(); // Track enabled tabs by tab ID
let monitoringInterval = null;

chrome.runtime.onInstalled.addListener(() => {
    console.log('ChatGPT Auto Confirm Extension installed');
    // Clear any old global state
    chrome.storage.local.remove(['autoConfirmEnabled']);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabId') {
        // Get the current tab ID for the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                sendResponse({ tabId: tabs[0].id });
            } else {
                sendResponse({ tabId: null });
            }
        });
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'getStatus') {
        // Get the current tab ID and check if it's enabled
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;
                const isEnabled = enabledTabs.has(tabId);
                sendResponse({ enabled: isEnabled, tabId: tabId });
            } else {
                sendResponse({ enabled: false, tabId: null });
            }
        });
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'toggle') {
        // Toggle the status for the current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;
                const isCurrentlyEnabled = enabledTabs.has(tabId);
                const newStatus = !isCurrentlyEnabled;
                
                if (newStatus) {
                    enabledTabs.add(tabId);
                } else {
                    enabledTabs.delete(tabId);
                }
                
                console.log(`ChatGPT Auto Confirm: Tab ${tabId} ${newStatus ? 'enabled' : 'disabled'}`);
                
                // Notify the specific tab
                chrome.tabs.sendMessage(tabId, {
                    action: 'toggle',
                    enabled: newStatus
                }).catch(() => {
                    // Tab might not have content script loaded yet
                });
                
                sendResponse({ enabled: newStatus, tabId: tabId });
            } else {
                sendResponse({ enabled: false, tabId: null });
            }
        });
        return true;
    }
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && 
        (tab.url.includes('chat.openai.com') || tab.url.includes('chatgpt.com'))) {
        // Inject content script if not already injected
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch(() => {
            // Script might already be injected, ignore error
        });
    }
});

// Handle tab removal to clean up state
chrome.tabs.onRemoved.addListener((tabId) => {
    if (enabledTabs.has(tabId)) {
        enabledTabs.delete(tabId);
        console.log(`ChatGPT Auto Confirm: Tab ${tabId} removed from enabled tabs`);
    }
});

// Background monitoring - check for ChatGPT tabs periodically
function startBackgroundMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }
    
    monitoringInterval = setInterval(() => {
        // Check for ChatGPT tabs and ensure content script is running
        chrome.tabs.query({ 
            url: [
                'https://chat.openai.com/*',
                'https://chatgpt.com/*',
                'https://*.chatgpt.com/*'
            ]
        }, (tabs) => {
            tabs.forEach(tab => {
                // Only monitor tabs that are enabled
                if (enabledTabs.has(tab.id)) {
                    // Send a ping to check if content script is responsive
                    chrome.tabs.sendMessage(tab.id, { action: 'ping' }).catch(() => {
                        // Content script not responding, inject it
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['content.js']
                        }).catch(() => {
                            // Ignore errors
                        });
                    });
                }
            });
        });
    }, 5000); // Check every 5 seconds
}

// Start background monitoring
startBackgroundMonitoring();

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    startBackgroundMonitoring();
});
