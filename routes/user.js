const { format, parseISO } = require("date-fns");
const { isLoggedInAsBuyer, isLoggedInAsEither } = require("../middleware/isLoggedIn");

const router = require("express").Router();

router.get("/welcome", isLoggedInAsEither, (req, res, next) => {

    const currentUser = (req.session.seller) ? req.session.seller : req.session.buyer;
    if (req.session.seller) currentUser.isSeller = true;

    currentUser.createdDate = format(parseISO(currentUser.createdAt), 'dd.MM.yyyy');

    res.render("user/welcome", {user: currentUser});
});

router.get("/profile", isLoggedInAsEither, (req, res, next) => {

    (req.session.seller) ? res.render("user/seller-profile", {user: req.session.seller}) : res.render("user/buyer-profile", {user: req.session.buyer});
});


module.exports = router;