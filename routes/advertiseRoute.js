const express=require("express");
const router=express.Router();
const {createAdvertise, updateAdveritse, deleteAdvertise, watchAdvertise, getAdvertise}=require("../controllers/advertiseController");

// router.post("/createAdvertise",createAdvertise);
router.route("").get(getAdvertise);
router.route("").post(createAdvertise);
router.route("").patch(updateAdveritse);
router.route("").delete(deleteAdvertise);
router.route("/watched").post(watchAdvertise);

module.exports=router;
