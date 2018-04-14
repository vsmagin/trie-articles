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

    /**
   * Goes over the given text and updates the count of each company in the Tries tree 
   * 
   * @param {String} text 
   */
  searchForCompanyNames(text) {
    let node = this.root;
    let letter;
    let tempNode = this.root;
    for (let index = 0; index < text.length; index++) {
        if (node.completeWord) {
            tempNode = node;
        }
        letter = text[index];
        if (letter in node.children) {      //if letter in children
            node = node.children[letter];   //move to that letter

            if (node.completeWord) {
                node.count++;
                index--;
            }
            else if (tempNode != this.root) {
                tempNode.count++;
                index--;
            }
            // node = this.root;
            // tempNode = this.root;

        }
        else {
            // if (node.completeWord) {
            //     node.count++;
            //     index--;
            // }
            // else if (tempNode != this.root) {
            //     tempNode.count++;
            //     index--;
            // }
            node = this.root;
            tempNode = this.root;
        }
    }
}

      /**
     * Returns the number of times each company from the list was mentioned in the text
     * 
     * @param {String} word 
     */
    getCompaniesCount(word) {
      let node = this.root;
      for (let letter of word) {
          if (letter in node.children) {
              node = node.children[letter];
          }
      }
      return node.count;
  }
  
};
