
const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const Seller = require("../models/Seller.model");
const Buyer = require("../models/Buyer.model");
const { isLoggedOutAsBuyer, isLoggedOutAsSeller } = require("../middleware/isLoggedOut");
const { isLoggedInAsEither } =  require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOutAsBuyer, isLoggedOutAsSeller, (req, res) => {
  if (req.query.role === "buyer") {
    res.render("auth/signup", {buyer: "checked"});
  } else if (req.query.role === "seller"){
    res.render("auth/signup", {seller: "checked"});
  } else {
    res.render("auth/signup");
  }
});

router.post("/signup", async (req, res) => {
  const { role, firstName, lastName, affiliation, email, password } = req.body;

  if (!role || !firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .render("auth/signup", { errorMessage: "All fields are required." });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  try {

    const found = (role === 'Seller') ? await Seller.findOne({ email }) : await Buyer.findOne({ email });
  
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already taken." });
    }
  
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newUser = {firstName, lastName, email, passwordHash};
    if (affiliation) newUser.affiliation = affiliation;
  
    const user = (role === 'Seller') ? await Seller.create(newUser) : await Buyer.create(newUser);
    (role === 'Seller') ? req.session.seller = user : req.session.buyer = user;
  
    res.redirect("/user/welcome");
    
  } catch (error) {
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: error.message });
    }
    return res
      .status(500)
      .render("auth/signup", { errorMessage: error.message });
  }
});
  
router.get("/login", isLoggedOutAsBuyer, isLoggedOutAsSeller, (req, res) => {
  if (req.query.role === "buyer") {
    res.render("auth/login", {buyer: "checked"});
  } else if (req.query.role === "seller"){
    res.render("auth/login", {seller: "checked"});
  } else {
    res.render("auth/login");
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!role || !email || !password) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "All fields are required."});
  }

  try {
    const found = (role === 'Seller') ? await Seller.findOne({ email }) : await Buyer.findOne({ email });
    if (!found) {
      console.log("is if statement error triggered");
      return res.status(400).render("auth/login", {errorMessage: "Email not found. Please try again or signup"});
    }
  
    const isCorrectPassword = await bcrypt.compare(password, found.passwordHash);
    console.log("isCorrectPasword: ", isCorrectPassword);
    if (!isCorrectPassword) {
      console.log("is if statement error triggered");
      return res.status(400).render("auth/login", {errorMessage: "Incorrect password"});
    }

    if (role === "Seller") {
      req.session.seller = found;
      res.redirect("/user/profile");
    } else {
      req.session.buyer = found;
      if (req.session.previousRoute) {
        res.redirect(req.session.previousRoute);
      } else {
        res.redirect("/claims");
      }
    }
    
  } catch (error) {
    console.log(error);
    next(error);
  }        
});
 
router.get("/logout", isLoggedInAsEither, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;

