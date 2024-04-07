const express=require("express");
const router=express.Router();
const {createPlans, getAllPlans, updatePlans}=require("../controllers/adv_plansController");

// router.route("").get(createPlans);
router.route("").get(getAllPlans);
router.route("").post(createPlans);
router.route("/goPending").post(updatePlans);


module.exports=router;