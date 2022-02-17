const Chance = require("chance");
const bcrypt = require("bcrypt");
const chance = new Chance();
const saltRounds = 10;
const password = "123456Aa";
let salt, object;

async function generateBuyers(numberOfBuyers){
    const buyers = [];
    for (let i = 0; i < numberOfBuyers; i++) {
        object = {};
        object.firstName = await chance.first();
        object.lastName = await chance.last();
        object.email = await chance.email();
        object.affiliation = await chance.company();
        salt = bcrypt.genSaltSync(saltRounds);
        object.passwordHash = bcrypt.hashSync(password, salt);

        buyers.push(object); 
        }
    return buyers;
}

module.exports = generateBuyers;
