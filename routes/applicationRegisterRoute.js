const express=require("express");
const router=express.Router();
const {registerNewApplication, getAllApplications, getMyApplications}=require("../controllers/applicationRegisterController");


router.route("").get(getAllApplications);
router.route("").post(registerNewApplication);
router.route("/myApplicaitons").post(getMyApplications);

module.exports=router;
