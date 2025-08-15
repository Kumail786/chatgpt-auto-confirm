// Popup script for ChatGPT Auto Confirm Extension

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const status = document.getElementById('status');
    
    console.log('Popup loaded, toggleSwitch:', toggleSwitch);
    
    // Load current status
    loadStatus();
    
    // Add click event to toggle switch
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', toggleAutoConfirm);
    } else {
        console.error('Toggle switch element not found!');
    }
    
    function loadStatus() {
        console.log('Loading status...');
        chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
            console.log('Status response:', response);
            if (chrome.runtime.lastError) {
                console.error('Error getting status:', chrome.runtime.lastError);
                updateUI(false, 'Error loading status'); // Default to disabled on error
                return;
            }
            
            if (response && response.enabled !== undefined) {
                updateUI(response.enabled, `Tab ${response.tabId || 'Unknown'}`);
            } else {
                updateUI(false, 'No active tab'); // Default to disabled
            }
        });
    }
    
    function toggleAutoConfirm() {
        console.log('Toggle clicked');
        chrome.runtime.sendMessage({ action: 'toggle' }, (response) => {
            console.log('Toggle response:', response);
            if (chrome.runtime.lastError) {
                console.error('Error toggling:', chrome.runtime.lastError);
                return;
            }
            
            if (response && response.enabled !== undefined) {
                updateUI(response.enabled, `Tab ${response.tabId || 'Unknown'}`);
            }
        });
    }
    
    function updateUI(enabled, tabInfo) {
        console.log('Updating UI, enabled:', enabled, 'tabInfo:', tabInfo);
        if (enabled) {
            toggleSwitch.classList.add('active');
            status.textContent = `✅ Auto confirm is enabled (${tabInfo})`;
        } else {
            toggleSwitch.classList.remove('active');
            status.textContent = `❌ Auto confirm is disabled (${tabInfo})`;
        }
    }
});
