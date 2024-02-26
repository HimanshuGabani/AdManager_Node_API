const advertiseModel = require("../models/advertiseModel");
const errorHandler=require("express-async-handler");
const bcrypt=require("bcrypt");



//-------- create Advertis ----------


const createAdvertise=errorHandler(async(req,res)=>{
    try {
        const {titel,advertiser,catagory,redirect,image,type,remain_Views,status}=req.body;

        if(!titel || !advertiser || !catagory || !image || !type || !remain_Views || !status){
            res.status(400).json({error_message:"Some fields are missing!"});
        }else{
            const createOne=await advertiseModel.create({
                titel,
                advertiser,
                catagory,
                redirect,
                image,
                type,
                previous_plans,
                remain_Views,
                status,
                approve
            });
            if (createOne) {
                res.status(200).json({success_message:"Advertise created successfully :)"});
            }else{
                res.status(400).json({error_message:"Advertise data are invalid !"});
            }
        }
        }catch (err) {
            console.error('Error registering advertise:', err);
            res.status(500).json({ message: "Internal server error !" });
        }
});