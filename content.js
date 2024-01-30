function detectDarkPatterns(content) {

    // Convert the content to lowercase for case-insensitive matching
    const lowerCaseContent = content.toLowerCase();

    const manipulativePhrases = ['trick', 'deceive', 'mislead', 'manipulate', 'black friday', 'in demand', 'selling fast'];

    // Check if any manipulative phrases are present
    const hasManipulativePhrases = manipulativePhrases.some(phrase => lowerCaseContent.includes(phrase));

    return hasManipulativePhrases;
}

function applyHighlightStyles(highlightColor, highContrast) {
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            background-color: ${highlightColor} !important;
            ${highContrast ? 'color: white !important;' : ''}
        }
    `;

    document.head.appendChild(style);

    const manipulativePhrases = ['trick', 'deceive', 'mislead', 'manipulate', 'black friday', 'in demand', 'selling fast'];

    manipulativePhrases.forEach(phrase => {
        const regex = new RegExp(`\\b(${phrase})\\b`, 'gi');

        walk(document.body);

        function walk(node) {
            if (node.nodeType == 3) {
                const parent = node.parentNode;
                const html = node.nodeValue.replace(regex, (match) => `<span class="highlight">${match}</span>`);
                const wrapper = document.createElement('span');
                wrapper.innerHTML = html;
                parent.replaceChild(wrapper, node);
            } else if (node.nodeType == 1) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    walk(node.childNodes[i]);
                }
            }
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'detectDarkPatterns') {
        const content = document.body.innerText;
        const hasDarkPatterns = detectDarkPatterns(content);

        chrome.runtime.sendMessage({
            action: 'showResult',
            result: hasDarkPatterns ? 'Dark patterns detected!' : 'No dark patterns found.',
            highlightColor: request.highlightColor,
            highContrast: request.highContrast,
        }, function(response) {
            console.log('Message sent to popup:', response);
        });

        if (hasDarkPatterns) {
            applyHighlightStyles(request.highlightColor, request.highContrast);
        }
    }
    
    if (request.action === 'submitFeedback') {
        const feedbackText = request.feedbackText;
    
        // Send feedback to the server
        fetch('http://localhost:3000/submit-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedbackText }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Server response:', data);
    
          })
      }
    
      sendResponse({ status: 'Message received in content script!' });
   
    });
