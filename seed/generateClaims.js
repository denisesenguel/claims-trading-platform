require("./../db/index");
const axios = require("axios");
const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const Chance = require("chance");
const isPast = require("date-fns/isPast");
const chance = new Chance();
const numberOfClaims = 10;
let maturityRangeStart, maturityRangeEnd;

async function generateClaims() {
    const claims = [];
    let object = {};
    let numberOfSellers = await Seller.countDocuments();
    console.log("Number of sellers: ", numberOfSellers);
    for (let i = 0; i < numberOfClaims; i++) {
        let { type, debtor } = await getRandomTypeAndDebtor();
        object = {};
        object.seller = await getRandomSeller(numberOfSellers);
        object.maturity = await getRandomDate(type);
        object.performance = getRandomPerformance(object.maturity);
        object.debtor = debtor;
        object.type = type;
        object.debtorLocation = chance.country({full: true});
        object.faceValue = getFaceValue(type);
        object.currency = await getCurrency(object.debtorLocation) || "USD";
        // object.minimumPrice = ;
        // object.performance = ;
        // console.log("MATURITY: ", object.maturity);
        console.log("performance: ", object.performance);
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

function getFaceValue(type) {

    // console.log("TYPE: ", type)

    let min, range, roundedTo;

    switch(type) {
        case "Corporate Loan":
            min = 10000;
            range = 50000000;
            break;
        case "Consumer Debt":
            min = 100;
            range = 10000;
            break;
        case "Retail Mortgage":
            min = 50000;
            range = 1000000;
            break;
        case "Commercial Real Estate Loan":
            min = 100000;
            range = 100000000;
            break;
        case "Trade Claim":
            min= 100;
            range = 1000000;
            break;
        default:
            min = 1000;
            range = 1000000;
            break;
    }
    // console.log("MIN, RANGE: ", min,range);

    const randomValue = (Math.random()*range) + min;

    // console.log("RANDOM VALUE: ", randomValue);

    if (randomValue < 1000) {
        roundedTo = 10;
    } else if (randomValue >= 1000 && randomValue < 10000) {
        roundedTo = 100;
    } else if (randomValue >= 10000 && randomValue < 100000) {
        roundedTo = 1000;
    } else if (randomValue >= 100000 && randomValue < 1000000) {
        roundedTo = 10000;
    } else if (randomValue >= 1000000 && randomValue < 10000000) {
        roundedTo = 100000;
    } else if (randomValue >= 10000000 && randomValue < 100000000) {
        roundedTo = 1000000;
    } else if (randomValue >= 100000000) {
        roundedTo = 10000000;
    }

    // console.log("ROUNDED TO: ", roundedTo);

    faceValue = (Math.floor((randomValue / roundedTo)))*roundedTo;

    // console.log("FACE VALUE: ", faceValue);

    return faceValue;
}

function getRandomDate(type) {

    switch(type) {
        case "Corporate Loan":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2032-12-31";
            break;
        case "Consumer Debt":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2027-12-31";
            break;
        case "Retail Mortgage":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2035-12-31";
            break;
        case "Commercial Real Estate Loan":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2045-12-31";
            break;
        case "Trade Claim":
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2025-12-31";
            break;
        default:
            maturityRangeStart = "2016-01-01";
            maturityRangeEnd = "2030-12-31";
            break;
    }

    maturityRangeStart = Date.parse(maturityRangeStart);
    maturityRangeEnd = Date.parse(maturityRangeEnd);
    return new Date(Math.floor(Math.random() * (maturityRangeEnd - maturityRangeStart + 1) + maturityRangeStart));
}

function getRandomPerformance(maturity) {
    console.log("in getPerformance, logging maturity: ", maturity);
    console.log("in getPerformance, logging isPast(maturity): ", isPast(maturity));
    if (isPast(maturity)) return "Defaulted";
    const performanceTypes = ['Performing', 'Defaulted', 'Stressed'];
    const randomIndex = Math.floor(Math.random()*performanceTypes.length);
    const performance = performanceTypes[randomIndex];
    console.log("in getPerformance, logging performance: ", performance);
    return performance;
}

generateClaims();



