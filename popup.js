// popup.js

document.getElementById('detectButton').addEventListener('click', detectDarkPatterns);

function detectDarkPatterns() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        if (activeTab.status === "complete") {
            chrome.tabs.sendMessage(activeTab.id, { action: 'detectDarkPatterns' });
        } else {
            console.error("Error: The active tab is not ready to receive messages.");
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'showResult') {
        document.getElementById('result').innerText = request.result;
    }
});
