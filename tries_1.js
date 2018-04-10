const fs = require('fs');
const path = require("path");
const readline = require("readline");

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

class TrieNode {
    constructor(letter) {
        this.letter = letter;
        this.completeWord = false;
        this.count = 0;
        this.children = {};
    }
}

// let companies = 'Microsoft, Apple, Sony, Microsoft Corporation, Sony Corporation';
// let companies = 'Microsoft, Microsoft Corporation Inc., Sony, Sony Corporation, Apple, Panasonic, Dell, Dell Technologies Inc., Dell Client Solutions Group';
let sampleText = 'Microsoft Corporation Inc. released new products today. \
                This week, a Apple Bloomberg report surfaced that said Apple is planning major changes for its iPhone. \
                Apple will design an IPhone XX. \
                Sony has no big announcements. Dell Technologies Inc. and Panasonic will work together. \
                Dell will come up with a new computer, Dell Technologies Inc. will come up with a new tablet PC. \
                Dell Technotechnologies Inc is not real company. Microsoft came up with HoloLens. \
                Microsoft Corp is not a real name, but Microsoft is!';

let regEx = /[.,\/#!$%\^&\*;:{}=\-_`~()\n\r]+/g;

class Tries {
    constructor() {
        this.root = new TrieNode('');
    }

    /**
     * Inserts Company name from the list into a Tries tree
     * 
     * @param {String} word 
     */
    insertString(word) {
        this._insertLetter(word,0,this.root);
    }

    /**
     * Helper function to insert Company name letter by letter into a Tries tree
     * 
     * @param {String} word 
     * @param {Number} index 
     * @param {TrieNode} node 
     */
    _insertLetter(word, index, node) {
        if (word[index] in node.children) {
            this._insertLetter(word, index+1, node.children[word[index]]);
        }
        else {
            // console.log(index);
            // console.log('Old node: ', node);
            node.children[word[index]] = new TrieNode(word[index]);
            node = node.children[word[index]];
            // console.log('New node: ', node);
            if (index === word.length-1) {
                node.completeWord = true;
                // console.log(word);
                return;
            }
            this._insertLetter(word, index+1, node);
        }
    }

    /**
     * Goes over the given text and updates the count of each company in the Tries tree 
     * 
     * @param {String} text 
     */
    updateStringByLetter(text) {
        let node = this.root;
        let letter;
        let tempNode = this.root;
        for (let index = 0; index < text.length; index++) {
            if (node.completeWord) {
                tempNode = node;
            }
            letter = text[index];
            if (letter.match(regEx)) {
                continue;
            }
            else {
                if (letter in node.children) {      //if letter in children
                    node = node.children[letter];   //move to that letter
                }
                else {
                    if (node.completeWord) {
                        node.count++;
                    }
                    else if (tempNode != this.root) {
                        tempNode.count++;
                    }
                    node = this.root;
                    tempNode = this.root;
                }
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
            if (letter.match(regEx)) {
                continue;
            }
            if (letter in node.children) {
                node = node.children[letter];
            }
        }
        return node.count;
    }


}

/**
 * Reads the file with Company names
 * and calls the fucntion to process the input article
 */
function readCompaniesFile() {
    let inputFilePath = path.join(__dirname, 'companies.dat');
    fs.readFile(inputFilePath, 'utf8', function (error, data) {
        if (error) {
            throw error;
        }
        processCompaniesList(data);
    });
}

/**
 * Gets array of Companies names
 * processes the input article
 * 
 * @param {Array} data 
 */
function processCompaniesList(data) {
    // Removes spaces and punctuation from the string
    let trieCompanies = new Tries();
    data = data.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\r]+/g, '');
    let lines = data.split('\n');
    console.log(lines);
    for (let line of lines) {
        let companies = line.split('\t');
        console.log(companies);
        for (let companie of companies) {
            console.log(companie);
            trieCompanies.insertString(companie);
        }
    }

    trieCompanies.updateStringByLetter(sampleText);

    console.log();
    console.log('Count of all the companies names on the list:');
    for (let line of lines) {
        let companies = line.split('\t');
        let count = 0;
        for (let companie of companies) {
            // count += trieCompanies.getCompaniesCount(companie);
            console.log(`${companie} - ${trieCompanies.getCompaniesCount(companie)}`);
        }
        // console.log(`${companies[0]} - ${count}`);
    }

    console.log();
    console.log('Count of the primary companies names on the list:');
    for (let line of lines) {
        let companies = line.split('\t');
        let count = 0;
        for (let companie of companies) {
            count += trieCompanies.getCompaniesCount(companie);
        }
        console.log(`${companies[0]} - ${count}`);
    }
}

readCompaniesFile();

// let trie = new Tries();
// words = companies.split(', ');
// console.log(words);
// for (let word of words) {
//     word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\r]+/g, '');
//     trie.insertString(word);
// }

// trie.updateStringByLetter(sampleText);
// console.log();
// for (let word of words) {
//     console.log(`${word} - ${trie.getCompaniesCount(word)}`);
// }


