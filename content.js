function detectDarkPatterns(content, selectedCategories) {
    // Convert the content to lowercase for case-insensitive matching
    const lowerCaseContent = content.toLowerCase();


    const manipulativePhrases = {
        fakeScarcity: ['only left in stock', 'low stock', 'limited', 'black friday', 'only left'],
        fakeSocialProof: ['bestseller', 'top rated', 'highly recommended', 'trusted by', 'trending'],
        fakeUrgency: ['last chance', 'limited time', 'hurry', 'ending soon', 'today only'],
    };

    let allPhrases = [];

    selectedCategories.forEach(category => {
        allPhrases = allPhrases.concat(manipulativePhrases[category]);
    });

    const hasManipulativePhrases = allPhrases.some(phrase => lowerCaseContent.includes(phrase));

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

    const manipulativePhrases = {
        fakeScarcity: ['limited offer', 'only left in stock', 'low stock', 'limited', 'black friday', 'only left'],
        fakeSocialProof: ['bestseller', 'top rated', 'highly recommended', 'trusted by', 'trending'],
        fakeUrgency: ['last chance', 'limited time', 'hurry', 'ending soon', 'today only'],
    };


    Object.keys(manipulativePhrases).forEach(category => {
        const phrases = manipulativePhrases[category];
        phrases.forEach(phrase => {
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
    });
    
    const cookieButtons = document.querySelectorAll('button');

    cookieButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('accept') || buttonText.includes('allow') || buttonText.includes('agree')) {
            button.classList.add('accept-cookies'); 
            highlightButton(button);
        } else if (buttonText.includes('decline') || buttonText.includes('reject') || buttonText.includes('deny')) {
            button.classList.add('decline-cookies'); 
            highlightButton(button);
        }
    });

    function highlightButton(button) {
        button.style.backgroundColor = highlightColor; 
        if (highContrast) {
            button.style.color = 'white'; 
        }
    }

    for (let i = 0; i < cookieButtons.length - 1; i++) { 
        const button1 = cookieButtons[i];
        const button2 = cookieButtons[i + 1];

        const rect1 = button1.getBoundingClientRect(); 
        const rect2 = button2.getBoundingClientRect();

        const distance = Math.abs(rect1.right - rect2.left); 

        if (distance < 5) { 
            button1.classList.add('highlight'); 
            button2.classList.add('highlight'); 
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'detectDarkPatterns') {
        const content = document.body.innerText;
        const hasDarkPatterns = detectDarkPatterns(content, request.selectedCategories);

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