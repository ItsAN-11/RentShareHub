const express = require("express");
const router = express.Router();




//Index Route  --> for user
router.get("/", (req, res) => {
    res.send("GET for User");
})

//Show Route  --> for user
router.get("/:id", (req, res) => {
    res.send("GET for user id");
})

//Post Route  --> for user
router.post("/", (req, res) => {
    res.send("POST for Users to post");
})

//Delete Route  --> for user
router.delete("/:id", (req, res) => {
    res.send("Delete for Users");
})

module.exports = router;