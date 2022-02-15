const { format, parseISO } = require("date-fns");
const { isLoggedInAsBuyer, isLoggedInAsEither } = require("../middleware/isLoggedIn");
const Buyer = require("../models/Buyer.model");
const Seller = require("../models/Seller.model");

const router = require("express").Router();

router.get("/:userId/welcome", isLoggedInAsEither, (req, res, next) => {

    const currentUser = (req.session.seller) ? req.session.seller : req.session.buyer;
    if (req.session.seller) currentUser.isSeller = true;

    currentUser.createdDate = format(parseISO(currentUser.createdAt), 'dd.MM.yyyy');

    res.render("user/welcome", {user: currentUser});
});

module.exports = router;