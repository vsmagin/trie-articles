// Tries Assignment

const fs = require('fs');
const path = require("path");
const readline = require("readline");
const Table = require('cli-table');

const Company = require('./classes/company');
const Tries = require('./classes/tries');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Regex to remove non-alphabet characters
const REGEX = /[.,\/#!$%^&*;:{}=\-_`~()\n\r]+/g;
const IGNORED_WORDS = ['a', 'an', 'the', 'and', 'or', 'but'];
let ARTICLE_LENGTH = 0;

/**
 * Normalize article text data and return array of text to be searched
 *
 * @param {String[]} articleText
 */
function cleanArticleWords(articleText) {
    // articleText = articleText.split('\n');
    let periodIndex = articleText.indexOf('.');

    articleText = articleText
        .slice(0, periodIndex)
        .join(' ')
        .split(' ')
        .filter(item => item !== '')
        .map(item => item.replace(REGEX, ''));

    ARTICLE_LENGTH = articleText.length;

    return articleText.filter(item => IGNORED_WORDS.indexOf(item) === -1).join(' ');
}

/**
 * Reads the file with Company names
 * and calls the function to process the input article
 */
function readCompaniesFile(text) {
    let inputFileCompanies = path.join(__dirname, 'companies.dat');
    let inputFileArticle = path.join(__dirname, 'sample-article.txt');
    // let articleText = fs.readFileSync(inputFileArticle).toString();
    articleText = text;

    if (articleText === '') {
        throw 'The article text is blank';
    }
    articleText = cleanArticleWords(articleText);

    let lineReader = readline.createInterface({
        input: fs.createReadStream(inputFileCompanies)
    });

    let companyData = [];
    lineReader.on('line', function (line) {
        companyData.push(line);
    });

    lineReader.on('close', function () {
        processCompaniesList(companyData, articleText);
    })
}

/**
 * Pretty print results table
 *
 * @param {Company[]} allCompanies
 */
function printTable(allCompanies) {
    let totalHits = 0;
    let table = new Table({
        head: ['Company', 'Hit Count', 'Relevance']
    });

    allCompanies.forEach(function (company) {
        let relevance = Math.round(company.mentions / ARTICLE_LENGTH * 10000000) / 100000;
        totalHits += company.mentions;
        table.push([company.name, company.mentions, `${relevance}%`]);
    });

    let totalRelevance = Math.round((totalHits / ARTICLE_LENGTH) * 1000000) / 10000;
    table.push(['Total', totalHits, `${totalRelevance}%`]);
    table.push(['Total Words', ARTICLE_LENGTH]);

    console.log(table.toString());
}

/**
 * Checks how often the individual strings in article text exist in company data
 *
 * @param {Array} companyData
 * @param {Array} articleText Array of individual strings in the article
 */
function processCompaniesList(companyData, articleText) {
    // Removes spaces and punctuation from the string
    let trieCompanies = new Tries();
    let allCompanies = [];
    for (let line of companyData) {
        let companies = line.split('\t');
        companies = companies.map(company => company.replace(REGEX, ''));
        let company = new Company(companies[0], companies);
        for (let synonym of company.synonyms) {
            trieCompanies.insertString(synonym, company.name);
        }

        allCompanies.push(company);
    }

    console.log(articleText);
    trieCompanies.searchForCompanyNames(articleText);

    for (company of allCompanies) {
        for (synonym of company.synonyms) {
            company.mentions += trieCompanies.getCompaniesCount(synonym);
            console.log(synonym);
            console.log(trieCompanies.getCompaniesCount(synonym));
        }
    }



    // console.log('Count of the primary companies names on the list:');
    // for (let line of lines) {
    //     let companies = line.split('\t');
    //     let count = 0;
    //     for (let companie of companies) {
    //         count += trieCompanies.getCompaniesCount(companie);
    //     }
    //     console.log(`${companies[0]} - ${count}`);
    // }

    // Search for word in Trie
    // articleText.forEach(function (word) {
    //     if (word.trim() !== '') {
    //       let foundWord = trieCompanies.find(word);
    //       if (typeof foundWord === "string" && foundWord.trim()) {
    //         let elementPosition = allCompanies.map(function (company) {
    //           return company.name;
    //         }).indexOf(foundWord);
    //         allCompanies[elementPosition].mentions++;
    //       }
    //     }
    // });

    // console.log(`${articleText[articleText.length - 1]}: `, trieCompanies.find(articleText[articleText.length - 1]));
    // console.log('Apple:', trieCompanies.find('Apple'));

    printTable(allCompanies);
}

// readCompaniesFile();
let text = [];

function readNewsArticle() {
    console.log('Please enter your news article:');
    readLines();
}

function readLines() {
    rl.question('', (data) => {
        text.push(data);
        if (data == '.') {
            // text = text.join('');
            console.log(text);
            readCompaniesFile(text);
            return rl.close();
        }
        readLines();
    });
}



readNewsArticle();
 