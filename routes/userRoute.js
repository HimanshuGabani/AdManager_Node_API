const express=require("express");
const router=express.Router();
const {loginUser,registerUser,getAllUsers,getUserByemail,updateUser,forgetPassword,deleteUser,updatePassword}=require("../controllers/userController");


//-------- configure all apis ----------
router.route("").get(getAllUsers);
router.route("/signup").post(registerUser);
router.post("/login",loginUser);
// router.post("/resetpassword",forgetPassword);
router.post("/updatePassword",updatePassword);
router.route("/getby").post(getUserByemail).patch(updateUser);
router.route("").delete(deleteUser);


module.exports=router;