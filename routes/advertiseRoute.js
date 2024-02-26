const express=require("express");
const router=express.Router();
const {createAdvertise}=require("../controllers/advertiseController");

// router.post("/createAdvertise",createAdvertise);
router.route("/createAdvertise").post(createAdvertise);

module.exports=router;
