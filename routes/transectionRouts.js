const express=require("express");
const router=express.Router();
const {purcheseAdvertise, getAllTransections, totalExpense, totalEarning, currentBalance, withdrawal}=require("../controllers/transectionController");


router.route("").get(getAllTransections);
router.route("/advertise").post(purcheseAdvertise);


// router.route("/sum").get(doSome);
router.route("/myTotalExpense").post(totalExpense);
router.route("/myTotalEarning").post(totalEarning);
router.route("/currentBalance").post(currentBalance);
router.route("/withdrawal").post(withdrawal);

module.exports=router;