const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");
const controllerReview = require("../controllers/review.js");



//Reviews
//Post ROUTE
router.post("/",isLoggedIn, validateReview, wrapAsync(controllerReview.postReviews));


//Review delete
router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAsync(controllerReview.destroyReview));

module.exports = router;
