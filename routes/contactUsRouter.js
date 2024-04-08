const express=require("express");
const router=express.Router();
const {createMessage, approveMessage, getAllMessage, getPendingMessage}=require("../controllers/contactUsController");


router.route("").post(createMessage);
router.route("/repled").post(approveMessage);
router.route("").get(getAllMessage);
router.route("/pendings").get(getPendingMessage);

module.exports=router;