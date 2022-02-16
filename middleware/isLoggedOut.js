isLoggedOutAsBuyer = (req, res, next) => {
  if(!req.session.buyer) {
    next();
  } else {
    if (req.query.role === "seller") {
      res.render("index", {errorMessage: "You are still logged in as buyer. You need to logout first before you can login or signup as seller"});
    } else if (req.query.role === "buyer") {
      res.redirect("/claims");
      return;
    } else {
      res.redirect("/claims");
    }
  }
}

isLoggedOutAsSeller = (req, res, next) => {
  if(!req.session.seller) {
    next();
  } else {
      if (req.query.role === "buyer") {
        res.render("index", {errorMessage: "You are still logged in as seller. You need to logout first before you can login or signup as buyer"});
      } else if (req.query.role === "seller") {
        res.redirect("/claims/create");
        return;
    } else {
      res.redirect("/claims");
    }
  }
}

module.exports = {isLoggedOutAsBuyer, isLoggedOutAsSeller}
