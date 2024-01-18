const { listingSchema, reviewSchema} = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next ) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You don't own this!");
       return res.redirect(`/listings/${id}`);
    }
    next()
};

module.exports.validateListing = (req, res, next) => {
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMessage);
    }else{
        next();
    };
};

module.exports.validateReview = (req, res, next) => {
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMessage);
    }else{
        next();
    };
};

module.exports.isreviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You didn't created this review!");
       return res.redirect(`/listings/${id}`);
    }
    next()
};