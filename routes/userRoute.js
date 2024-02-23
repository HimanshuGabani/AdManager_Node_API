const express=require("express");
const router=express.Router();
const {loginUser,registerUser,getAllUsers,getUserById,updateUser,forgetPassword,deleteUser}=require("../controllers/userController");


//-------- configure all apis ----------
router.route("/getall").get(getAllUsers);
router.route("/signup").post(registerUser);
router.post("/login",loginUser);
router.post("/resetpassword",forgetPassword);
router.route("/getby").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports=router;