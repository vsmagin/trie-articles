// Tries Assignment

const fs = require('fs');
const path = require("path");
const readline = require("readline");
const Table = require('cli-table');

const Company = require('./classes/company');
const Tries = require('./classes/tries');

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
    articleText = articleText.split('\n');
    let periodIndex = articleText.indexOf('.');

    articleText = articleText
        .slice(0, periodIndex)
        .join(' ')
        .split(' ')
        .filter(item => item !== '')
        .map(item => item.replace(REGEX, ''));

    ARTICLE_LENGTH = articleText.length;

    return articleText.filter(item => IGNORED_WORDS.indexOf(item) === -1);
}

/**
 * Reads the file with Company names
 * and calls the function to process the input article
 */
function readCompaniesFile() {
    let inputFileCompanies = path.join(__dirname, 'companies.dat');
    let inputFileArticle = path.join(__dirname, 'sample-article.txt');
    let articleText = fs.readFileSync(inputFileArticle).toString();

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

    // Search for word in Trie
    articleText.forEach(function (word) {
        let foundWord = trieCompanies.find(word);
        if (typeof foundWord === "string") {
            let elementPosition = allCompanies.map(function (company) { return company.name; }).indexOf(foundWord);
            allCompanies[elementPosition].mentions++;
        }
    });

    // console.log('Apple hfuewhfeiu: ', trieCompanies.find('Apple hfuewhfeiu'));
    // console.log('Apple:', trieCompanies.find('Apple'));

    printTable(allCompanies);
}

readCompaniesFile();
