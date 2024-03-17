const express=require("express");
const router=express.Router();
const {createPlans, getAllPlans}=require("../controllers/adv_plansController");

// router.route("").get(createPlans);
router.route("").get(getAllPlans);
router.route("").post(createPlans);


module.exports=router;