function tokenize(text) {
    return text.split(/\s+/).filter(word => word.length > 0);
}
