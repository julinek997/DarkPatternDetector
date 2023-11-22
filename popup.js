// popup.js
document.getElementById('detectButton').addEventListener('click', detectDarkPatterns);

function detectDarkPatterns() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'detectDarkPatterns' });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'showResult') {
        document.getElementById('result').innerText = request.result;
    }
});
