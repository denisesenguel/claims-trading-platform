const { format, parseISO } = require("date-fns");
const { isLoggedInAsEither, isLoggedInAsSeller } = require("../middleware/isLoggedIn");
const Claim = require("../models/Claim.model");

const router = require("express").Router();

router.get("/welcome", isLoggedInAsEither, (req, res, next) => {

    const currentUser = (req.session.seller) ? req.session.seller : req.session.buyer;
    if (req.session.seller) currentUser.isSeller = true;

    currentUser.createdDate = format(parseISO(currentUser.createdAt), 'dd.MM.yyyy');

    res.render("user/welcome", {user: currentUser});
});

router.get("/profile", isLoggedInAsEither, async (req, res, next) => {

    try {
        if (req.session.seller) {
            const myClaims = await Claim.find({"seller": req.session.seller._id}).lean();
            myClaims.forEach(c => c.faceValue = c.faceValue.toLocaleString());
            res.render("user/seller-profile", {user: req.session.seller, claims: myClaims});
         } else {
             const allClaims = await Claim.find().lean();
             allClaims.forEach(c => c.faceValue = c.faceValue.toLocaleString());
             res.render("user/buyer-profile", {user: req.session.buyer, claims: allClaims});
         }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get("/my-claims", isLoggedInAsSeller, async (req, res, next) => {
    
    try {
        const myClaims = await Claim.find({"seller": req.session.seller._id});
        res.render("user/my-claims", {claims: myClaims});
    } catch (error) {
        console.log(error);
        next(error);
    }

});

module.exports = router;