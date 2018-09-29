export function toTitleCase(string) {
    // noinspection JSUnresolvedFunction
    return string.toLowerCase().split(' ').map((word, index) => {
        if (index === 0) return word;
        const wordTitleCase = word.split('');
        wordTitleCase.splice(0, 1, wordTitleCase[0].toUpperCase());
        return wordTitleCase.join('');
    }).join('');
}

export function getFilteredUsers() {
    return this.state.users.slice(0).filter(user => {
        if (this.state.filterBy === "any") {
            return Object.values(user).join('|;|').toLowerCase().includes(this.state.filterText.toLowerCase());
        } else {
            return (user[this.state.filterBy] || this.state.filterText).toLowerCase().includes(this.state.filterText.toLowerCase());
        }
    });
}