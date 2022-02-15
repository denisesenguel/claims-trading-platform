isLoggedInAsBuyer = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.buyer) {
    return res.redirect("/auth/login");
  }
  req.buyer = req.session.buyer;
  next();
};

isLoggedInAsSeller = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.seller) {
    return res.redirect("/auth/login");
  }
  req.seller = req.session.seller;
  next();
};

isLoggedInAsEither = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (req.session.seller || req.session.buyer) {
    next();
  } else {
    req.session.previousRoute = req.originalUrl;
    res.redirect("/auth/login");
  }
  
};

module.exports = {isLoggedInAsBuyer, isLoggedInAsSeller, isLoggedInAsEither};