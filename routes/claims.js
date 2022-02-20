const router = require("express").Router();
const lodash = require("lodash");

const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const {format} = require("date-fns");

const {claimTypeArray, performanceArray, getCountries} = require("./../utils/enum-configs");

const hbs = require("handlebars");
hbs.registerHelper('startCase', function (string) { 
 return lodash.startCase(string);
});

const { isLoggedInAsSeller, isLoggedInAsEither } = require("./../middleware/isLoggedIn");
const isClaimOwner = require("./../middleware/isClaimOwner");


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
        console.log("Error creating claim: ", error);
    }
});

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
        res.render("claims/claim-details", {claim: oneClaim, claimId: req.params.claimId});
    } catch (error) {
        console.log("Error retrieving claim details: ", error);
    }
});

router.get("/:claimId/:sellerId/details", async (req, res, next) => {
    try {
        const dbSeller = await Seller.findById(req.params.sellerId).populate("listedClaims");
        dbSeller.claimId = req.params.claimId;
        res.render("claims/claim-seller-details", {seller: dbSeller});
    } catch (error) {
        console.log("Error retrieving seller details: ", error);
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
        console.log("Error retrieving claim details: ", error);
    }
});

router.post("/:claimId/edit", isLoggedInAsSeller, isClaimOwner, async (req, res, next)=> {
    try {
        const dbUpdated = await Claim.findByIdAndUpdate(req.params.claimId, req.body, {new: true});
        console.log("dbUpdated: ", dbUpdated);
        res.redirect("/user/my-claims");
    } catch (error) {
        console.log("Error updating claim: ", error);
    }
});

router.get("/:claimId/delete", isLoggedInAsSeller, isClaimOwner, async (req, res, next) => {
    try {
        await Claim.findByIdAndDelete(req.params.claimId);
        res.redirect("/user/my-claims");
    } catch (error) {
        console.log("Error deleting claim: ", error);
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
        console.log("Error querying DB for search results: ", error);
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
    
    const dbResults = await Claim.find(filterQuery).sort(sortQuery).lean();
    return dbResults;

}

module.exports = router;