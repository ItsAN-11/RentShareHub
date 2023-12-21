const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{ 
        type: String,
        default: "https://i.pinimg.com/originals/a1/e0/4c/a1e04ce7c5f21421d62ff7b9cd06f227.jpg",
        // set: (v) => v ==="" ?"https://i.pinimg.com/originals/a1/e0/4c/a1e04ce7c5f21421d62ff7b9cd06f227.jpg": v,
        },
    location: String,
    price: Number,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;