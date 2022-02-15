const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const Seller = require("../models/Seller.model");
const Buyer = require("../models/Buyer.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
// const isLoggedOut = require("../middleware/isLoggedOut");
// const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { role, firstName, lastName, affiliation, email, password } = req.body;

  if (!role || !firstName || !lastName || !email || !password) {
    res
      .status(400)
      .render("auth/signup", { errorMessage: "All fields are required." });
  }

  if (password.length < 8) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  try {

    const found = (role === 'Seller') ? await Seller.findOne({ email }) : await Buyer.findOne({ email });
  
    if (found) {
      res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already taken." });
    }
  
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newUser = {firstName, lastName, email, passwordHash};
    if (affiliation) newUser.affiliation = affiliation;
  
    if (role === 'Seller') {
  
      const seller = await Seller.create(newUser);
      req.session.seller = seller;
  
    } else {
  
      const buyer = await Buyer.create(newUser);
      req.session.buyer = buyer;
  
    }
  
    res.redirect("/");
    
  } catch (error) {
    
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(400)
        .render("auth/signup", { errorMessage: error.message });
    }
    res
      .status(500)
      .render("auth/signup", { errorMessage: error.message });
  }
});
  

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", (req, res) => {
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
