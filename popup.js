document.getElementById('detectButton').addEventListener('click', detectDarkPatterns);

function detectDarkPatterns() {
    const highlightColor = document.getElementById('highlightColor').value;
    const highContrast = document.getElementById('highContrast').checked;

    const fakeScarcityChecked = document.getElementById('fakeScarcityCheckbox').checked;
    const fakeSocialProofChecked = document.getElementById('fakeSocialProofCheckbox').checked;

    const selectedCategories = [];
    if (fakeScarcityChecked) selectedCategories.push('fakeScarcity');
    if (fakeSocialProofChecked) selectedCategories.push('fakeSocialProof');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        if (activeTab.status === "complete") {
            chrome.tabs.sendMessage(activeTab.id, { action: 'detectDarkPatterns', highlightColor, highContrast, selectedCategories });
        } else {
            console.error("Error: The active tab is not ready to receive messages.");
        }
    });
}

document.getElementById('submitFeedback').addEventListener('click', submitFeedback);

function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'submitFeedback', feedbackText });
    });
    
    document.getElementById('feedbackText').value = '';
}