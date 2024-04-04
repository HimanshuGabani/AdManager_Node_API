const express=require("express");
const router=express.Router();
const {getMainTotalEarning, getPlatformEarning}=require("../controllers/publisherChartController");



router.route("/main").post(getMainTotalEarning);
router.route("/platforms").post(getPlatformEarning);

module.exports=router;