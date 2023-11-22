// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'detectDarkPatterns') {
        // Extract text content from the page
        var content = document.body.innerText;

        // Analyze the content for dark patterns
        var hasDarkPatterns = detectDarkPatterns(content);

        // Send the result back to the popup
        chrome.runtime.sendMessage({
            action: 'showResult',
            result: hasDarkPatterns ? 'Dark patterns detected!' : 'No dark patterns found.',
        });

        // Apply highlight styles to dark patterns
        if (hasDarkPatterns) {
            applyHighlightStyles();
        }
    }
});

function detectDarkPatterns(content) {
    // Convert the content to lowercase for case-insensitive matching
    const lowerCaseContent = content.toLowerCase();

    // Define a list of manipulative phrases to look for
    const manipulativePhrases = ['trick', 'deceive', 'mislead', 'manipulate', 'black friday', 'in demand'];

    // Check if any manipulative phrases are present in the content
    const hasManipulativePhrases = manipulativePhrases.some(phrase => lowerCaseContent.includes(phrase));

    return hasManipulativePhrases;
}

function applyHighlightStyles() {
    // Define a list of manipulative phrases to highlight
    const manipulativePhrases = ['trick', 'deceive', 'mislead', 'manipulate', 'black friday', 'in demand'];

    // Create a style element with CSS rules to highlight dark patterns
    var style = document.createElement('style');
    style.textContent = `
        /* Customize the styles to visually highlight dark patterns */
        .highlight {
            background-color: #FFD6D6 !important; /* Light red background for highlighted words */
            /* No padding adjustment to keep the original padding */
        }
    `;

    // Append the style element to the head of the document
    document.head.appendChild(style);

    // Apply styles directly to elements containing manipulative phrases
    manipulativePhrases.forEach(phrase => {
        const regex = new RegExp(`\\b(${phrase})\\b`, 'gi');

        // Find all text nodes and apply highlighting to the matched phrases
        walk(document.body);

        function walk(node) {
            if (node.nodeType == 3) { // Node.TEXT_NODE
                // Text node, apply highlighting to the content
                const parent = node.parentNode;
                const html = node.nodeValue.replace(regex, (match) => `<span class="highlight">${match}</span>`);
                const wrapper = document.createElement('span');
                wrapper.innerHTML = html;
                parent.replaceChild(wrapper, node);
            } else if (node.nodeType == 1) { // Node.ELEMENT_NODE
                // Element node, recursively process child nodes
                for (let i = 0; i < node.childNodes.length; i++) {
                    walk(node.childNodes[i]);
                }
            }
        }
    });
}

