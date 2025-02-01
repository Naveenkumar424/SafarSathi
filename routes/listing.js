const express = require("express");

const multer  = require('multer')
const upload = multer({dest:"uploads/"});


const router = express.Router();
const mongoose = require("mongoose");
const placeList = require("../models/wonderLust.js");
const validateUserData = require("../joiSchema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const passport = require("passport");

const {isLogined,listOwner,UniqueUrl} = require("../AuthenticLogin.js");
const {validateData} =require("../AuthenticLogin.js");
const listingControllers = require("../controllers/listings.js");

//todo TESTING ROUTE
router.get("/api/TestListings",async(req,res)=>{
    place = [{
                title: "Cozy Beachfront Cottage111",
                description:
                    "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
                image: {
                    filename: "listingimage",
                    url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        price: 1500,
        location: "Malibu",
        country: "United States",
        }]
        let x = await placeList.insertMany(place);
        console.log(x);
});
router.route("/")
    .get(wrapAsync(listingControllers.index))//TODO INDEX ROUTE
    //.post(isLogined,validateData,wrapAsync(listingControllers.createList))//TODO CREATE ROUTE
    .post(upload.single('Listing[image]'),(req,res)=>{
        console.log(req.file);
    });
//TODO NEW ROUTE
router.get("/new",isLogined,wrapAsync(listingControllers.renderFrom));
router.route("/:id")
    .get(UniqueUrl,wrapAsync(listingControllers.getShow))//TODO SHOW ROUTE
    .put(isLogined,validateData,wrapAsync(listingControllers.updateList))//TODO UPDATE ROUTE
    .delete(isLogined,listOwner,wrapAsync(listingControllers.deleteList))//TODO DELETE ROUTE
//TODO EDIT ROUTE
router.get("/:id/edit",isLogined,listOwner,wrapAsync(listingControllers.editList));

module.exports = router;