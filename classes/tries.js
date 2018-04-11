// Tries class

const TrieNode = require('./trie-node');

module.exports = class Tries {
  constructor() {
    this.root = new TrieNode('', '');
  }

  /**
   * Inserts Company name from the list into a Tries tree
   *
   * @param {String} word
   * @param {String} company
   */
  insertString(word, company) {
    this._insertLetter(word, 0, this.root, company);
  }

  /**
   * Helper function to insert Company name letter by letter into a Tries tree
   *
   * @param {String} word
   * @param {Number} index
   * @param {TrieNode} node
   * @param {String} company name
   */
  _insertLetter(word, index, node, company) {
    if (word[index] in node.children) {
      this._insertLetter(word, index + 1, node.children[word[index]], company);
    } else {
      node.children[word[index]] = new TrieNode(word[index], company);
      node = node.children[word[index]];

      if (index === word.length - 1) {
        node.completeWord = true;
        return;
      }
      this._insertLetter(word, index + 1, node, company);
    }
  }

  /**
   * Goes over the given text and updates the count of each company in the Tries tree
   *
   * @param {String} text
   */
  find(text) {
    let node = this.root;
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i);
      if (char in node.children) {
        node = node.children[char];
      } else {
        return false;
      }
    }

    return node.companyName;
  }
};
