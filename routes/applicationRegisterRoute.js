const express=require("express");
const router=express.Router();
const {registerNewApplication}=require("../controllers/applicationRegisterController");



router.route("").post(registerNewApplication);

module.exports=router;
