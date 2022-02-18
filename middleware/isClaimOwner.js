const Claim = require("../models/Claim.model");

// allow only if id of logged in seller matches 
async function isClaimOwner(req, res, next) {

    const claimDB = await Claim.findById(req.params.claimId).lean();

    if (req.session.seller._id === claimDB.seller._id.toString()) {
        next();
    } else {
        res.status(401).render("not-authorized");
    }
}

module.exports = isClaimOwner;