
// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

// Register formatting helper
const lodash = require("lodash");
hbs.registerHelper('startCase', function (string) { 
 return lodash.startCase(string);
});


// 👇 Start handling routes here
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// expose session data for handlebars
app.use((req, res, next)=>{
    res.locals.session = req.session;
    next();
});

// Mount route files
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const claimRoutes = require("./routes/claims");
app.use("/claims", claimRoutes);

app.use("/user", require("./routes/user"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

