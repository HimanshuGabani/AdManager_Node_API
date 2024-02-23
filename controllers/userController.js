const userModel=require("../models/userModel");
const errorHandler=require("express-async-handler");
const bcrypt=require("bcrypt");




//-------- create user profile ----------
const registerUser=errorHandler(async(req,res,next)=>{
    try {
        const {name,email,contactNo,role,password}=req.body;
        const userExistsByEmail = await userModel.findOne({ email });
        const userExistsByContactNo = await userModel.findOne({ contactNo });
        const bcryptPassword=await bcrypt.hash(password,10);

        if(!name || !email || !contactNo || !role || !password){
            res.status(400).json({error_message:"all fields are required !"});
        }else if (userExistsByEmail && userExistsByContactNo) {
            res.status(400).json({ error_message: `User with email ${email} and contact number ${contactNo} already exists !` });
        }else if (userExistsByEmail) {
            res.status(400).json({ error_message: `User with email ${email} already exists !` });
        }else if (userExistsByContactNo) {
            res.status(400).json({ error_message: `User with contact number ${contactNo} already exists !` });
        }else if (!email.match("^[a-z0-9+_.-]+@(.)+[a-z]$")) {
            res.status(400).json({ error_message: "Invalid email format !" });
        }else if (contactNo.length !== 10) {
            return res.status(400).json({ error_message: "Invalid contact number format! It should be 10 digits." });
        }else{
            const createdUser=await userModel.create({
                name,
                email,
                contactNo,
                role,
                password:bcryptPassword,
            },);
            if (createdUser) {
                res.status(200).json({success_message:"User created successfully :)"});
            }else{
                res.status(400).json({error_message:"User data are invalid !"});
            }
        }
        }catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ message: "Internal server error !" });
        }
});




//-------- login user ----------
const loginUser = errorHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await userModel.findOne({ email });
        if (!email || !password) {
            return res.status(400).json({ error_message: "email and password are required !" });
        }
        if (userExists && (await bcrypt.compare(password, userExists.password))) {
            return res.status(200).json({
                _id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                contactNo: userExists.contactNo,
                role: userExists.role,
                password: userExists.password,
                lastSignIn: userExists.lastSignIn,
                status: userExists.status
            });
        } else {
            return res.status(403).json({ error_message: "invalid credentials !" });
        }
    } catch (err) {
        next(err);
        console.error('Error logging in:', err);
        res.status(500).json({ message: "Internal server error !" });
    }
});



//-------- reset password ----------
const forgetPassword = errorHandler(async (req, res) => {
    try {
        const userEmail = req.query.email;
        const user = await userModel.findOne({ email: userEmail });
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (!newPassword) {
            res.status(400).json({ error_message: "New password is required!" });
        }
        else if (!user) {
            res.status(404).json({ error_message: "User not found!" });
        }
        else{
            user.password = hashedPassword;
            user.forgetPassword = true;

            const updatedUser = await user.save();
            if (updatedUser) {
                res.status(200).json({ message: "Password reset successfully :)" });
            } else {
                res.status(400).json({ error_message: "Failed to update profile. Please try again." });
            }
        }
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//-------- update user profile ----------
const updateUser = errorHandler(async (req, res, next) => {
    try {
        const { name, email, contactNo, password, role, profileUrl } = req.body;
        const userId = req.query.id; 
        const user = await userModel.findById(userId);

        if (!name || !email || !contactNo ||!role || !password || !profileUrl) {
            res.status(400).json({ error_message: "All fields are required !" });
        }
        else if (!user) {
            res.status(404).json({ error_message: "User not found !" });
        }else if (!email.match("^[a-z0-9+_.-]+@(.)+[a-z]$")) {
            res.status(400).json({ error_message: "Invalid email format !" });
        }else if (contactNo.length !== 10) {
            res.status(400).json({ error_message: "Invalid contact number format! It should be 10 digits." });
        }else{
            user.name = name;
            user.email = email;
            user.contactNo = contactNo;
            user.role = role;
            user.password = password;
            user.profileImg = profileUrl;

            const updatedUser = await user.save();
            if (updatedUser) {
                res.status(200).json({ message: "User updated successfully :)" });
            } else {
                res.status(400).json({ error_message: "Failed to update profile. Please try again." });
            }
        }
    } catch (err) {
        next(err);
        console.error('Error updating profile:', err);
        res.status(500).json({ message: "Internal server error !" });
    }
});



//-------- get all user profiles ----------
const getAllUsers=errorHandler(async(req,res,next)=>{
    try {
        const allUsers=await userModel.find();
        if (allUsers.length>0) {
            res.send(allUsers);
        }
        else{
            res.status(404).json({error_message:"No data found !"});
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});



//-------- find by id ----------
const getUserById=errorHandler(async(req,res,next)=>{
    try {
         const userId = req.query.id; 
        const user = await userModel.findById(userId);
        // const user=await userModel.findById(req.params.id)
        if (!user) {
            res.status(404).json({error_message:"User not found !"});
        }
        else{
            res.send(user);
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});



//-------- delete user profile ----------
const deleteUser=errorHandler(async(req,res,next)=>{
    try {
        
        const userId = req.query.id; 
        const user = await userModel.findOneAndDelete({_id: userId});
        // const user=await userModel.findOneAndDelete({_id:req.query.id});
        if (!user) {
            res.status(404).json({error_message:"User not found !"});
        }else{
            res.status(200).json({success_message:"User deleted successfully :)"});
        }
    } catch (error) {
        next(error);
        res.status(500).json({ message: "Internal server error !" });
    }
});


module.exports={loginUser,registerUser,getAllUsers,getUserById,updateUser,forgetPassword,deleteUser};










