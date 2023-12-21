const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../AirbnbProject/models/listing");
const methodOverride = require("method-override")
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));




const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
} )


async function main() {
    await mongoose.connect(mongo_url)
}

app.get("/", (req, res) =>{
    res.send("hello welcome here");
});

const validateListing = (req, res, next) => {
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMessage);
    }else{
        next();
    };
};

// app.get("/testlisting",async (req, res) =>{
//     let sampletesting = new Listing({
//         title : "my Villa", 
//         description: "near the hills glacier lake",
//         price: 12000,
//         location: "Uttrakhand",
//         country: "india",
//     });
//     await sampletesting.save();
//     console.log("Sample was saved");
//     res.send("testing successful ");
// });




/// index route
app.get("/listings",wrapAsync ( async  (req, res) => {
  const allListings =  await  Listing.find({})
        // console.log(res);
       // res.render('listings/listings', { allListings });
        res.render('listings/listings.ejs',  { allListings});

        //res.render("/listings/listings.ejs", {allListings});
    }));


//For creating new listing 
app.get("/listings/new", wrapAsync ((req, res) => {
    res.render("listings/new.ejs");
}));



///show route
app.get("/listings/:id",wrapAsync (async (req, res, next) => {
    
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", {listing});


    
   
}) );  

//New List
app.post("/listings", validateListing, wrapAsync (async (req, res, next) => {
    //let {title, description, image, price, country, location } = req.body;
    //OR,
    //let listing = req.body.listing; // or directly parsing it 
   
   const newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings");
    
})
);

//edit route
app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

//update route
app.put("/listings/:id", validateListing, wrapAsync (async (req, res) =>{
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    res.redirect("/listings");
}));


//Deleting the list 
app.delete("/listings/:id", wrapAsync( async (req, res) =>{
    let { id } = req.params;
    let deletedListing = await  Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message});
    //res.status(statusCode).send(message);
    
} );

app.listen(8080, () =>{
    console.log("Server is listening to port 8080");    
});