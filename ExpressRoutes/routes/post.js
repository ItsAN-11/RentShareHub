const express = require("express");
const router = express.Router();

//POSTS

//Index Route   
router.get("/", (req, res) => {
    res.send("GET for posts");
})

//Show Route  
router.get("/:id", (req, res) => {
    res.send("GET for posts id");
})

//Post Route  
router.post("/", (req, res) => {
    res.send("POST for posts");
})

//Delete Route  
router.delete("/posts/:id", (req, res) => {
    res.send("Delete for posts id");
})

module.exports = router;