const Chance = require("chance");
const bcrypt = require("bcrypt");
const chance = new Chance();
const saltRounds = 10;
const password = "123456Aa";
let salt, object;

async function generateSellers(numberOfSellers){
    const sellers = [];
    for (let i = 0; i < numberOfSellers; i++) {
        object = {};
        object.firstName = await chance.first();
        object.lastName = await chance.last();
        object.email = await chance.email();
        object.affiliation = await chance.company();
        salt = bcrypt.genSaltSync(saltRounds);
        object.passwordHash = bcrypt.hashSync(password, salt);

        sellers.push(object); 
        }
    return sellers;
}

module.exports = generateSellers;