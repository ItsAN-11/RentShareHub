const Review = require("../models/review.js");
const listing = require("../models/listing.js")
module.exports.postReviews = ( async (req, res) => {
    let listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);

}) ;

module.exports.destroyReview = ( async (req, res) => {
    let {id, reviewId} = req.params;
 
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    await Review.findById(reviewId);
 
    req.flash("success", "Review Deleted!");
 
    res.redirect(`/listings/${id}`);
 } );