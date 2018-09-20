export function toTitleCase(string) {
    // noinspection JSUnresolvedFunction
    return string.toLowerCase().split(' ').map((word, index) => {
        if (index === 0) return word;
        const wordTitleCase = word.split('');
        wordTitleCase.splice(0, 1, wordTitleCase[0].toUpperCase());
        return wordTitleCase.join('');
    }).join('');
}