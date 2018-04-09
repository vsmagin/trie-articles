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

let companies = 'Microsoft, Apple, Sony, Microsoft Corporation';
let sampleText = 'Microsoft Corporation Inc. released new products today. \
                This week, a Apple Bloomberg report surfaced that said Apple is planning major changes for its iPhone. \
                Apple will design an IPhone XX. \
                Sony has no big announcements.';

let regEx = /[.,\/#!$%\^&\*;:{}=\-_`~()\n\r]+/g;

class Tries {
    constructor() {
        this.root = new TrieNode('');
    }

    insertString(word) {
        this._insertLetter(word,0,this.root);
    }

    _insertLetter(word, index, node) {
        if (word[index] in node.children) {
            // console.log(word[index]);
            // console.log('old');
            this._insertLetter(word, index+1, node.children[word[index]]);
        }
        else {
            // console.log(word[index]);
            // console.log('new');
            node.letter = word[index];
            if (index === word.length-1) {
                node.completeWord = true;
                console.log(word);
                return;
            }
            node.children[word[index]] = new TrieNode(word[index]);
            this._insertLetter(word, index+1, node.children[word[index]]);
        }
    }

    updateStringByLetter(text) {
        let node = this.root;
        let letter;
        for (let index = 0; index < text.length; index++) {
            letter = text[index];
            if (letter.match(regEx)) {
                continue;
            }
            else {
                if (letter in node.children) {      //if letter in children
                    // console.log('contains letter :', letter);
                    node = node.children[letter];   //move to that letter
                }
                else {
                    if (node.completeWord) {
                        console.log(node.letter);
                        node.count++;
                        // console.log(node.count);
                    }
                    node = this.root;
                }
            }
        }
    }

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


function readCompaniesFile() {
    let inputFilePath = path.join(__dirname, 'companies.dat');
    fs.readFile(inputFilePath, 'utf8', function (error, data) {
        if (error) {
            throw error;
        }
        processCompaniesList(data);
    });
}

function processCompaniesList(data) {
    // Removes spaces and punctuation from the string
    let trieCompanies = new Tries();
    data = data.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\r]+/g, '');
    let lines = data.split('\n');
    // console.log(lines);
    for (let line of lines) {
        let companies = line.split('\t');
        // console.log(companies);
        for (let companie of companies) {
            console.log(companie);
            trieCompanies.insertString(companie);
        }
    }

    trieCompanies.updateStringByLetter(sampleText);
    console.log();
    for (let line of lines) {
        let companies = line.split('\t');
        let count = 0;
        for (let companie of companies) {
            // count += trieCompanies.getCompaniesCount(companie);
            console.log(`${companie} - ${trieCompanies.getCompaniesCount(companie)}`);
        }
        // console.log(`${companies[0]} - ${count}`);
    }
}

// readCompaniesFile();

let trie = new Tries();
words = companies.split(', ');
console.log(words);
for (let word of words) {
    console.log(word);
    trie.insertString(word);
}

trie.updateStringByLetter(sampleText);
console.log();
for (let word of words) {
    console.log(`${word} - ${trie.getCompaniesCount(word)}`);
}



