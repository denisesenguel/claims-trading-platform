const router = require("express").Router();
const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const mongoose = require("mongoose");
const { format } = require("date-fns");
const { isLoggedInAsBuyer, isLoggedInAsSeller, isLoggedInAsEither } = require("./../middleware/isLoggedIn");
const { isLoggedOutAsBuyer, isLoggedOutAsSeller } = require("./../middleware/isLoggedOut");


router.get("/create", isLoggedInAsSeller, (req, res, next)=> {
    res.render("claims/claim-create");
});

router.post("/create", isLoggedInAsSeller, async (req, res, next)=> {
    try {
        // const { debtor, debtorLocation, faceValue, currency, type, minimumPrice, performance, maturity } = req.body;
        req.body.seller = mongoose.Types.ObjectId();
        const dbClaim = await Claim.create(req.body);
        res.redirect("/claims");
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const allClaims = await Claim.find();
        res.render("claims/claims-overview", {claims: allClaims});
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/details", isLoggedInAsEither, async (req, res, next) => {
    try {
        const oneClaim = await Claim.findById(req.params.claimId).lean();
        for (let key in oneClaim) {
            if (key.startsWith("_") || key == 'createdAt' || key == 'updatedAt') delete oneClaim[key]; 
        }
        res.render("claims/claim-details", {claim: oneClaim, id: req.params.claimId});
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/:sellerId/details", async (req, res, next) => {
    try {
        const dbSeller = await Seller.findById(req.params.sellerId).populate("listedClaims").lean();
        dbSeller.claimId = req.params.claimId;
        res.render("claims/claim-seller-details", {seller: dbSeller});
    } catch (error) {
        console.log(error);
    }
})

router.get("/:claimId/edit", isLoggedInAsSeller, async (req, res, next)=> {
    try {
        const dbClaim = await Claim.findById(req.params.claimId).lean();
        dbClaim[`${dbClaim.currency}`] = "selected";
        dbClaim[`${dbClaim.claimType}`] = "selected";
        dbClaim[`${dbClaim.performance}`] = "selected";
        dbClaim.maturity = format(dbClaim.maturity, "yyyy-MM-dd");
        console.log("dbClaim: ", dbClaim);
        res.render("claims/claim-edit", {claim: dbClaim});
    } catch (error) {
        console.log(error);
    }
});

router.post("/:claimId/edit", isLoggedInAsSeller, async (req, res, next)=> {
    try {
        const dbUpdated = await Claim.findByIdAndUpdate(req.params.claimId, req.body, {new: true});
        console.log("dbUpdated: ", dbUpdated);
        res.redirect("/claims");
    } catch (error) {
        console.log(error);
    }
});

router.get("/:claimId/delete", isLoggedInAsSeller, async (req, res, next) => {
    try {
        await Claim.findByIdAndDelete(req.params.claimId);
        res.redirect("/claims");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;