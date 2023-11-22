// tokenizer.js

function tokenize(text) {
    // This is a simple tokenizer. You can replace it with a more advanced one if needed.
    return text.split(/\s+/).filter(word => word.length > 0);
}
