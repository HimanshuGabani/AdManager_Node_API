const advertiseModel = require("../models/advertiseModel");
const errorHandler=require("express-async-handler");
const bcrypt=require("bcrypt");
const userModel = require("../models/userModel");



//-------- create Advertis ----------


const createAdvertise=errorHandler(async(req,res)=>{
    try {
        const {titel,advertiser_id,catagory,redirect,image,type,remain_Views,status}=req.body;


        if(!titel || !advertiser_id || !catagory || !image || !type || !remain_Views || !status){
            res.status(400).json({error_message:"Some fields are missing!"});
        }else{
            const createOne=await advertiseModel.create({
                titel,
                advertiser_id,
                catagory,
                redirect,
                image,
                type,
                remain_Views,
                status,
                approve: false
            },);
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

//-------- get All Advertise ----------
const getAllAdvertise=errorHandler(async(req,res,next)=>{
    try {
        const advertise = await advertiseModel.find();
        if (!advertise) {
            res.status(404).json({error_message:"No Advertise Availabel !"});
        } else{
            res.send(advertise);
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});





//-------- update Advertise ----------
const updateAdveritse = errorHandler(async (req, res, next) => {
    try {
        const {id, titel,catagory,redirect,image,type,remain_Views,status } = req.body;
        
        if (!id) {
            res.status(400).json({ error_message: "All fields are required !" });
        }
        const advertise = await advertiseModel.findById(id);

        if (!advertise) {
            res.status(404).json({ error_message: "Advertise not found !" });
        }else{  
            advertise.titel = titel;
            advertise.catagory = catagory;
            advertise.redirect = redirect;
            advertise.image = image;
            advertise.type = type;
            advertise.remain_Views = remain_Views;
            advertise.status = status;

            const updatedAdvertise = await advertise.save();
            if (updatedAdvertise) {
                res.status(200).json({ message: "Advertise updated successfully :)" });
            } else {
                res.status(400).json({ error_message: "Failed to update Advertise. Please try again." });
            }
        }
        
    } catch (err) {
        next(err);
        console.error('Error updating Advertise:', err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


//-------- delete Advertise ----------
const deleteAdvertise=errorHandler(async(req,res,next)=>{
    try {
        const {id} = req.body;
        const advertise = await advertiseModel.findOneAndDelete(id);

        if (!advertise) {
            res.status(404).json({error_message:"Advertise not found !"});
        }else{
            res.status(200).json({success_message:"Advertise deleted successfully :)"});
        }
    } catch (error) {
        next(error);
        res.status(500).json({ message: "Internal server error !" });
    }
});

//-------- find by id ----------
const getAdvertise=errorHandler(async(req,res,next)=>{
    try {
        const {id,advertiserId} = req.body;
        if (!id && !advertiserId){
            res.status(404).json({error_message:"Advertise ID or Advertiser id must requiered"});
        }

        const advertise = !id ? await advertiseModel.find({advertiserId:advertiserId}) : await advertiseModel.findById(id);

        if (!advertise) {
            res.status(404).json({error_message:"Advertise not found !"});
        } else{
            res.send(advertise);
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


//-------- Watch Minuse Advertise ----------
const watchAdvertise=errorHandler(async(req,res,next)=>{

    try {
        
        const {id} = req.body;
        const advertise = await advertiseModel.findById(id);

        if (advertise.remain_Views == 0) {
            advertise.approve = false;
            advertise.status = "Disable";
            res.status(200).json({ message: "This advertise is dissable" });
        } else {
            advertise.remain_Views -= 1;
            if (advertise.remain_Views == 0) {
                advertise.approve = false;
                advertise.status = "Disable";
                res.status(200).json({ message: "This advertise is dissable" });
            }
        }

        const updatedAdvertise = await advertise.save();
        if (updatedAdvertise) {
            res.status(200).json({ message: "current remain views :-  "+advertise.remain_Views });
        } else {
            res.status(400).json({ error_message: "Failed to decrise Advertise views. Please try again." });
        }       

    } catch (error) {
        next(error);
        res.status(500).json({ message: "Internal server error !" });
    }

});


module.exports={createAdvertise, getAllAdvertise, updateAdveritse, deleteAdvertise, getAdvertise, watchAdvertise};


