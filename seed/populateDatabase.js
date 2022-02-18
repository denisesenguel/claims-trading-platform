require("../db/index");
const Buyer = require("../models/Buyer.model");
const Seller = require("../models/Seller.model");
const Claim = require("../models/Claim.model");
const generateBuyers = require("./generateBuyers")
const generateSellers = require("./generateSellers");
const generateClaims = require("./generateClaims");
const mongoose = require("mongoose");

async function populateDatabase(numberOfBuyers, numberOfSellers, numberOfClaims){
    await Buyer.deleteMany({});
    await Claim.deleteMany({});
    await Seller.deleteMany({});
    const buyersArray = await generateBuyers(numberOfBuyers);
    const dbBuyers = await Buyer.create(buyersArray);
    const sellersArray = await generateSellers(numberOfSellers);
    const dbSellers = await Seller.create(sellersArray);
    const claimsArray = await generateClaims(numberOfClaims);
    let randomIndex;
    claimsArray.forEach(async (claim, index) => {
        randomIndex = Math.floor(Math.random()*dbSellers.length);
        claim.seller = dbSellers[randomIndex]._id.toString();
        const dbClaim = await Claim.create(claim);
        const updatedSeller = await Seller.findByIdAndUpdate(claim.seller, {$push : {listedClaims : dbClaim._id}}, {new: true});
        if (index === claimsArray.length - 1) {
            mongoose.connection.close(); 
    }});
}

populateDatabase(10, 50, 100);

