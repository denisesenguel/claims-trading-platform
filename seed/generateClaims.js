require("./../db/index");
const axios = require("axios");
const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const Chance = require("chance");
const chance = new Chance();
const numberOfClaims = 10;

async function generateClaims() {
    const claims = [];
    let object = {};
    let numberOfSellers = await Seller.countDocuments();
    console.log("Number of sellers: ", numberOfSellers);
    for (let i = 0; i < numberOfClaims; i++) {
        let { type, debtor } = await getRandomTypeAndDebtor();
        object = {};
        object.seller = await getRandomSeller(numberOfSellers);
        object.debtor = debtor;
        object.debtorLocation = chance.country({full: true});
        // object.faceValue = ;
        object.currency = await getCurrency(object.debtorLocation) || "USD";
        object.type = type;
        // object.minimumPrice = ;
        // object.performance = ;
        // object.maturity = ;
        claims.push(object);
    }
    console.log("Claims: ", claims);
}

async function getRandomSeller(numberOfSellers) {
    const seller = await Seller.findOne().skip(Math.floor(Math.random()*numberOfSellers));
    return seller;
}   

// function getRandomDebtor() {
//     const random = Math.floor(Math.random()*2);
//     const debtor = (random === 0) ? chance.name() : chance.company();
//     return debtor;
// }

async function getRandomTypeAndDebtor(){
    const types = ['Corporate Loan', 'Consumer Debt', 'Retail Mortgage', 'Commercial Real Estate Loan', 'Trade Claim'];
    let type, debtor;
    const randomIndex = Math.floor(Math.random()*types.length);
    type = types[randomIndex];
    switch(type) {
        case "Corporate Loan":
        case "Commercial Real Estate Loan": 
        case "Trade Claim":
            debtor = chance.company();
            break;
        case "Consumer Debt":
        case "Retail Mortgage":
            debtor = chance.name();
    }
    return { type, debtor };
}

async function getCurrency (debtorCountry) {
    let currency;
    const response = await axios.get("https://gist.githubusercontent.com/tiagodealmeida/0b97ccf117252d742dddf098bc6cc58a/raw/f621703926fc13be4f618fb4a058d0454177cceb/countries.json");
    const countriesArray = response.data.countries.country;
    countriesArray.forEach(country => {
        if (country.countryName === debtorCountry) currency = country.currencyCode;
    })
    return currency;
}

generateClaims();



