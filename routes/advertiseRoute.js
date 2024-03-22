const express=require("express");
const router=express.Router();
const {createAdvertise, getAllAdvertise, updateAdveritse, deleteAdvertise, getAdvertise, changeState, getRandomDocument, advertiseClicked}=require("../controllers/advertiseController");

// router.post("/createAdvertise",createAdvertise);


router.route("").get(getAllAdvertise);
router.route("/id").post(getAdvertise);
router.route("").post(createAdvertise);
router.route("").patch(updateAdveritse);
router.route("").delete(deleteAdvertise);
router.route("/state").post(changeState);
router.route("/rand").get(getRandomDocument);
router.route("/click").post(advertiseClicked);

module.exports=router;
