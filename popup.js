// popup.js

document.getElementById('detectButton').addEventListener('click', detectDarkPatterns);

function detectDarkPatterns() {
    const highlightColor = document.getElementById('highlightColor').value;
    const highContrast = document.getElementById('highContrast').checked;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        if (activeTab.status === "complete") {
            chrome.tabs.sendMessage(activeTab.id, { action: 'detectDarkPatterns', highlightColor, highContrast });
        } else {
            console.error("Error: The active tab is not ready to receive messages.");
        }
    });
}
