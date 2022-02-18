
const router = require("express").Router();
const axios = require("axios");
const lodash = require("lodash");
const mongoose = require("mongoose");

const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const {format} = require("date-fns");

const {claimTypeArray, performanceArray, getCountries} = require("./../utils/enum-configs");

const hbs = require("handlebars");
hbs.registerHelper('startCase', function (string) { 
 return lodash.startCase(string);
});

const { isLoggedInAsBuyer, isLoggedInAsSeller, isLoggedInAsEither } = require("./../middleware/isLoggedIn");
const { isLoggedOutAsBuyer, isLoggedOutAsSeller } = require("./../middleware/isLoggedOut");
const isClaimOwner = require("./../middleware/isClaimOwner");


router.get("/create", isLoggedInAsSeller, async (req, res, next)=> {
    const {countries, currencies} = await getCountries();
    res.render("claims/claim-create", {
        countries: countries, 
        currencies: currencies, 
        claimTypes: claimTypeArray, 
        performanceTypes: performanceArray
    }); 
});

router.post("/create", isLoggedInAsSeller, async (req, res, next)=> {
    try {
        req.body.seller = req.session.seller._id;
        const dbClaim = await Claim.create(req.body);
        const updatedSeller = await Seller.findByIdAndUpdate(req.session.seller._id, {$push: {listedClaims: dbClaim._id}}, {new: true});
        res.redirect("/user/my-claims");
    } catch (error) {
        console.log(error);
    }
});

// router.get("/", async (req, res, next) => {
//     try {
//         const allClaims = await Claim.find().lean();
//         allClaims.forEach(c => c.faceValue = c.faceValue.toLocaleString());
//         res.render("claims/claim-search", {claims: allClaims});
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get("/:claimId/details", isLoggedInAsEither, async (req, res, next) => {
    try {
        let oneClaim = await Claim.findById(req.params.claimId).populate("seller").lean();
        for (let key in oneClaim) {
            if (key.startsWith("_") || key == 'createdAt' || key == 'updatedAt') delete oneClaim[key]; 
        }
        if (req.session.seller) {
            oneClaim.isEditable = (oneClaim.seller._id.toString() === req.session.seller._id) || null;
        }
        oneClaim.maturity = format(oneClaim.maturity, "L LLLL yyyy");
        console.log("claim: ", {claim: oneClaim, claimId: req.params.claimId}, "req.session: ", req.session)
        res.render("claims/claim-details", {claim: oneClaim, claimId: req.params.claimId});
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/:sellerId/details", async (req, res, next) => {
    try {
        console.log("REQ PARAMS: ", req.params.sellerId);
        const dbSeller = await Seller.findById(req.params.sellerId).populate("listedClaims");
        dbSeller.claimId = req.params.claimId;
        res.render("claims/claim-seller-details", {seller: dbSeller});
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/edit", isLoggedInAsSeller, isClaimOwner, async (req, res, next)=> {
    try {
        const dbClaim = await Claim.findById(req.params.claimId).lean();
        
        dbClaim.maturity = format(dbClaim.maturity, 'yyyy-MM-dd');
        
        const {countries, currencies} = await getCountries();

        const countriesDistinction = {
            selected: dbClaim.debtorLocation,
            other: countries.filter(country => country != dbClaim.debtorLocation)
        };
        const currenciesDistinction = {
            selected: dbClaim.currency,
            other: currencies.filter(code => code != dbClaim.currency)
        };

        res.render("claims/claim-edit", {
            claim: dbClaim, 
            currencies: currenciesDistinction, 
            countries: countriesDistinction,
            claimTypes: {
                selected: dbClaim.claimType,
                other: claimTypeArray.filter(type => type !== dbClaim.claimType)
            }, 
            performanceTypes: {
                selected: dbClaim.performance,
                other: performanceArray.filter(type => type !== dbClaim.performance)
            }
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/:claimId/edit", isLoggedInAsSeller, isClaimOwner, async (req, res, next)=> {
    try {
        const dbUpdated = await Claim.findByIdAndUpdate(req.params.claimId, req.body, {new: true});
        console.log("dbUpdated: ", dbUpdated);
        res.redirect("/user/my-claims");
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/delete", isLoggedInAsSeller, isClaimOwner, async (req, res, next) => {
    try {
        await Claim.findByIdAndDelete(req.params.claimId);
        res.redirect("/user/my-claims");
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req, res, next) => {
    try {

        const {currencies, countries} = await getCountries();
        const dbResults = await Claim.find({}).lean();
        dbResults.forEach(c => c.faceValue = c.faceValue.toLocaleString());
        res.render("claims/claim-search", { 
            results: dbResults,
            dropDowns: {
                performance: performanceArray,
                claimType: claimTypeArray,
                currency: currencies,
                location: countries
            }
        });
    } catch (error) {
        console.log("Error getting claims from DB: ", error);
    }
});

router.post("/search", async (req, res, next)=> {
    try {
        const {currencies, countries} = await getCountries();
        dbResults = await queryDatabase(req.body);
        dbResults.forEach(c => c.faceValue = c.faceValue.toLocaleString());
        res.render("claims/claim-search", { 
            results: dbResults,
            dropDowns: {
                performance: performanceArray,
                claimType: claimTypeArray,
                currency: currencies,
                location: countries
            },
            searched: true
        });
    } catch (error) {
        console.log(error);
    }
});

async function queryDatabase(reqBody){

   let sortQuery = {};

    if (reqBody.sortBy && reqBody.sortOrder) {
        sortQuery[`${reqBody.sortBy}`] = reqBody.sortOrder;
    }

    let queryArray = [];
    
    let faceValueQuery = {};
    let debtorQuery = {};
    let debtorLocationQuery = {};
    let claimTypeQuery = {};
    let performanceQuery = {};
    let currencyQuery = {};

    if (reqBody.currency) {
        currencyQuery = {currency: reqBody.currency};
        queryArray.push(currencyQuery);
    }

    if (reqBody.faceValueStart) {
        faceValueQuery = {faceValue: {$gte: reqBody.faceValueStart}};
    }
    if (reqBody.faceValueEnd) {
        faceValueQuery = {faceValue: {$gte: reqBody.faceValueStart, $lte: reqBody.faceValueEnd}};
    }

    if (reqBody.faceValueStart || reqBody.faceValueEnd) {
            queryArray.push(faceValueQuery);
    }
    if (reqBody.debtor) {
        debtorQuery = {debtor: reqBody.debtor};
        queryArray.push(debtorQuery);
    }
    if (reqBody.debtorLocation) {
        debtorLocationQuery = {debtorLocation: reqBody.debtorLocation};
        queryArray.push(debtorLocationQuery);
    }
    if (reqBody.claimType) {
        claimTypeQuery = {claimType: reqBody.claimType};
        queryArray.push(claimTypeQuery);
    }
    if (reqBody.performance) {
        performanceQuery = {performance: reqBody.performance};
        queryArray.push(performanceQuery);
    }
    if (queryArray.length === 0) {
        filterQuery = {};
    } else if (queryArray.length === 1) {
        filterQuery = queryArray[0];
    } else {
        filterQuery = {$and: queryArray}
    }
    console.log("filterQuery: ", filterQuery);
    console.log("sortQuery: ", sortQuery);
    
    const dbResults = await Claim.find(filterQuery).sort(sortQuery).lean();
    return dbResults;

}



// async function queryDatabase(reqBody){
//     let query = {};
//     queryObject = {};
//     sortObject = {};
//     let sortObjectKey;

//     let queryArray = [];
//     for (let key in reqBody) {
//         queryObject = {};
//         if (reqBody[`${key}`]) {
//             if (key === "sortBy") {
//                 sortObject[reqBody[`${key}`]] = 1;
//                 sortObjectKey = [reqBody[`${key}`]];
//             } else if (key === "sortOrder") {
//                 sortObject[sortObjectKey] = Number(reqBody[`${key}`]);
//             } else if (key !== "sortBy" && key !== "sortOrder") {
//                 queryObject[`${key}`] = reqBody[`${key}`];
//                 queryArray.push(queryObject);
//             }
//         }
//     }
//     if (queryArray.length === 0) {
//         query = {};
//     } else if (queryArray.length === 1) {
//         query = queryArray[0];
//     } else {
//         query = {$and: queryArray}
//     }
   
//     const dbResults = await Claim.find(query).sort(sortObject);
//     return dbResults;
// } 

module.exports = router;