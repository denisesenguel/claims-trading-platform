const axios = require('axios');

const claimTypeArray = ['Corporate Loan', 'Consumer Debt', 'Retail Mortgage', 'Commercial Real Estate Loan', 'Trade Claim'];

const performanceArray = ['Performing', 'Defaulted', 'Stressed'];

// call this only once and save to json!
async function getCountries() {

    const response = await axios.get("https://gist.githubusercontent.com/tiagodealmeida/0b97ccf117252d742dddf098bc6cc58a/raw/f621703926fc13be4f618fb4a058d0454177cceb/countries.json");
    const countriesArray = response.data.countries.country;
    const currencyArray = [];
    countriesArray.forEach((country) => {
        if (country.currencyCode != '' && !currencyArray.includes(country.currencyCode)) {
            currencyArray.push(country.currencyCode);
        }
    });
    return {currencies: currencyArray, countries: countriesArray.map(country => country.countryName)};
}

// takes value 'selection' out of 'array'
// returns reduced array and selection in one object
function splitSelected(selection, array) {
    return {
        selected: selection,
        other: array.filter(elm => elm != selection)
    };
}

module.exports = {claimTypeArray, performanceArray, getCountries, splitSelected};