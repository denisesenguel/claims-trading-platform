const router = require("express").Router();
const Seller = require("./../models/Seller.model");
const Claim = require("./../models/Claim.model");
const mongoose = require("mongoose");

router.get("/create", (req, res, next)=> {
    res.render("claims/claim-create");
});

router.post("/create", async (req, res, next)=> {
    try {
        // const { debtor, debtorLocation, faceValue, currency, type, minimumPrice, performance, maturity } = req.body;
        req.body.seller = mongoose.Types.ObjectId();
        const dbClaim = await Claim.create(req.body);
        res.redirect("/claims");
    } catch (error) {
        console.log(error);
    }
})
























module.exports = router;