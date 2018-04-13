// Trie Node class

module.exports = class TrieNode {
  constructor(letter, companyName) {
    this.letter = letter;
    this.completeWord = false;
    this.count = 0;
    this.children = {};
    this.companyName = companyName;
  }
};
