const Chance = require("chance");
const bcrypt = require("bcrypt");
const chance = new Chance();
const numberOfSellers = 10;
const saltRounds = 10;
let password, salt, object;

function generateSellers(){
    const sellers = [];
    for (let i = 0; i < numberOfSellers; i++) {
        object = {};
        object.firstName = chance.first();
        object.lastName = chance.last();
        object.email = chance.email();
        object.affliation = chance.company();

        password = chance.hash();
        salt = bcrypt.genSaltSync(saltRounds);
        object.passwordHash = bcrypt.hashSync(password, salt);

        sellers.push(object); 

        }
    console.log("Sellers: ", sellers);
}

generateSellers();

module.exports = generateSellers;