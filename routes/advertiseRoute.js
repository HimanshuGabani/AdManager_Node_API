const express=require("express");
const router=express.Router();
const {createAdvertise, getAllAdvertise, updateAdveritse, deleteAdvertise, watchAdvertise, getAdvertise, changeState, getRandomDocument}=require("../controllers/advertiseController");

// router.post("/createAdvertise",createAdvertise);


router.route("").get(getAllAdvertise);
router.route("/id").post(getAdvertise);
router.route("").post(createAdvertise);
router.route("").patch(updateAdveritse);
router.route("").delete(deleteAdvertise);
router.route("/watched").post(watchAdvertise);
router.route("/state").post(changeState);
router.route("/rand").get(getRandomDocument);

module.exports=router;
