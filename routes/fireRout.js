
const express=require("express");
const router=express.Router();
const {getAllAdvertisers, getAllPublishers}=require("../controllers/firebaseController");


router.route("/advertisers").get(getAllAdvertisers);
router.route("/publishers").get(getAllPublishers);

module.exports=router;







