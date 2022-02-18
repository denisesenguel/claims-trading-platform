const axios = require('axios');

async function getCountries() {

    const response = await axios.get("https://gist.githubusercontent.com/tiagodealmeida/0b97ccf117252d742dddf098bc6cc58a/raw/f621703926fc13be4f618fb4a058d0454177cceb/countries.json");
    const countriesArray = response.data.countries.country;
    const currencyArray = [];
    countriesArray.forEach((country) => {
        if (country.currencyCode != '' && !currencyArray.includes(country.currencyCode)) {
            currencyArray.push(country.currencyCode);
        }
    });
    return {currencies: currencyArray, countries: countriesArray};
}

module.exports = getCountries;
