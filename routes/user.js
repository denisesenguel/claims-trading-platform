const { format, parseISO } = require("date-fns");
const { isLoggedInAsBuyer, isLoggedInAsEither } = require("../middleware/isLoggedIn");
const Claim = require("../models/Claim.model");

const router = require("express").Router();

router.get("/welcome", isLoggedInAsEither, (req, res, next) => {

    const currentUser = (req.session.seller) ? req.session.seller : req.session.buyer;
    if (req.session.seller) currentUser.isSeller = true;

    currentUser.createdDate = format(parseISO(currentUser.createdAt), 'dd.MM.yyyy');

    res.render("user/welcome", {user: currentUser});
});

router.get("/profile", isLoggedInAsEither, async (req, res, next) => {

    if (req.session.seller) {
        const myClaims = await Claim.find({"seller": req.session.seller._id});
        res.render("user/seller-profile", {user: req.session.seller, claims: myClaims});
     } else {
         const allClaims = await Claim.find();
         res.render("user/buyer-profile", {user: req.session.buyer, claims: allClaims});
     }
});


module.exports = router;