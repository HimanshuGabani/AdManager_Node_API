const express=require("express");
const router=express.Router();
const {purcheseAdvertise, getAllTransections}=require("../controllers/transectionController");


router.route("").get(getAllTransections);
router.route("/advertise").post(purcheseAdvertise);


module.exports=router;