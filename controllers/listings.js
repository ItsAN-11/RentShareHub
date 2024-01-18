const Listing = require("../models/listing.js") ;

module.exports.index = async  (req, res) => {
    const allListings =  await  Listing.find({})
          // console.log(res);
         //res.render('listings/listings', { allListings });
          res.render('listings/listings.ejs',  { allListings});
  
          //res.render("/listings/listings.ejs", {allListings});
      };

module.exports.renderNewForm =  (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
};


module.exports.showListings =  (async (req, res, next) => {
      
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");

    if(!listing) {
      req.flash("error", "Listing you requested for doesn't exists");
      res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", {listing});


});


module.exports.createListing =  (async (req, res, next) => {
    //let {title, description, image, price, country, location } = req.body;
    //OR,
    //let listing = req.body.listing; // or directly parsing it 
   let url = req.file.path;
   let filename = req.file.filename;
   console.log(url, "..", filename);
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image = { url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    next();
});

module.exports.editListings =  (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exists");
        res.redirect("/listings");
    }
   let originalImageUrl = listing.image.url;
   changedImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250")
    res.render("listings/edit.ejs", {listing, changedImageUrl});

});

module.exports.updateListings =  (async (req, res) =>{
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send Valid data for listing")
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
    };
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
});


module.exports.destroyListings = ( async (req, res) =>{
    let { id } = req.params;
    let deletedListing = await  Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
});


