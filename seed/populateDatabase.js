require("../db/index");
const Seller = require("../models/Seller.model");
const Claim = require("../models/Claim.model");
const generateSellers = require("./generateSellers");
const generateClaims = require("./generateClaims");

async function populateDatabase(numberOfSellers, numberOfClaims){
    await Claim.deleteMany({});
    await Seller.deleteMany({});
    const sellersArray = await generateSellers(numberOfSellers);
    console.log("sellersArray: ", sellersArray);
    const dbSellers = await Seller.create(sellersArray);
    // const dbSellers = await Seller.find();
    console.log("dbSellers: ", dbSellers);
    const claimsArray = await generateClaims(numberOfClaims);
    let randomIndex;
    console.log("CLAIMS ARRAY: ", claimsArray);
    claimsArray.forEach(async (claim) => {
        randomIndex = Math.floor(Math.random()*dbSellers.length);
        claim.seller = dbSellers[randomIndex]._id.toString();
        const dbClaim = await Claim.create(claim);
        const updatedSeller = await Seller.findByIdAndUpdate(claim.seller, {$push : {listedClaims : dbClaim._id}}, {new: true});
        console.log("Updatedseller: ", updatedSeller);
    });
}

populateDatabase(50, 100);

