// The company class

module.exports = class Company {
    constructor(companyName, synonyms) {
        this.name = companyName;
        this.synonyms = synonyms;
        this.mentions = 0;
    }
};
