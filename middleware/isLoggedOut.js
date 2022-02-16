isLoggedOutAsBuyer = (req, res, next) => {
  if(!req.session.buyer) {
    next();
  } else {
    res.redirect("/claims");
  }
}

isLoggedOutAsSeller = (req, res, next) => {
  if(!req.session.seller) {
    next();
  } else {
    res.redirect("/claims/create");
  }
}

module.exports = {isLoggedOutAsBuyer, isLoggedOutAsSeller}
