const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

const { storage } = require("../cloudConfig.js");
// const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const upload = multer({ storage });




router
  .route("/")
      .get( wrapAsync(ListingController.index))
      .post( isLoggedIn, 
             upload.single("listing[image]"),
             validateListing, 
             wrapAsync(ListingController.createListing));
      
      
// New Route 
router.get("/new", isLoggedIn, ListingController.renderNewForm); 

router
  .route("/:id")
      .get(wrapAsync(ListingController.showListings))
      .put(isLoggedIn, 
           isOwner,
           upload.single("listing[image]"),  
           validateListing, 
           wrapAsync(ListingController.updateListings)) 
      .delete( isLoggedIn, isOwner, wrapAsync(ListingController.destroyListings))


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.editListings))




module.exports = router;


