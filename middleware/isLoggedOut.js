isLoggedOutAsBuyer = (req, res, next) => {
  if(!req.session.buyer) {
    next();
  } else {
    res.redirect("/");
  }
}

isLoggedOutAsSeller = (req, res, next) => {
  if(!req.session.seller) {
    next();
  } else {
    res.redirect("/");
  }
}


module.exports = {isLoggedOutAsBuyer, isLoggedOutAsSeller}
