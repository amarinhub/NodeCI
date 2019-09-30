const { clearHash } = require('../services/cache');

/** Middleware  => Normally runs before Route Handler */
module.exports = async ( req, res, next) => {
    /** this will wait Route Handler to Execute */
    await next();

    // Route Handler is complete => Then will Execute this next Middleware
    console.log("IM CLEANING THE CACHE");
    clearHash(req.user.id);
}