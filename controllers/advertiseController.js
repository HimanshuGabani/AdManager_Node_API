const { application } = require("express");
const advertiseModel = require("../models/advertiseModel");
const applicationModel = require("../models/applicationRegisterModel")
const errorHandler=require("express-async-handler");
const { app } = require("firebase-admin");

//-------- create Advertis ----------
const createAdvertise=errorHandler(async(req,res)=>{
    try {
        const {title,advertiserId,category,redirect,image,type,remain_Views,status, transactionId, amount}=req.body;

        if(!title || !advertiserId || !category|| !image || !type || !status ){
            res.status(400).json({error_message:"Some fields are missing!"});
        }else{
            const createOne=await advertiseModel.create({
                title,
                advertiserId,
                category,
                redirect,
                image,
                type,
                remain_Views,
                transactionId,
                amount,
                status,
                approve: false
            },);
            if (createOne) {
                res.status(200).json({advertiserId:createOne['_id']});
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
        const {id, titel,category,redirect,image,type,remain_Views,status } = req.body;
        
        if (!id) {
            res.status(400).json({ error_message: "All fields are required !" });
        }
        const advertise = await advertiseModel.findById(id);

        if (!advertise) {
            res.status(404).json({ error_message: "Advertise not found !" });
        }else{  
            advertise.titel = titel;
            advertise.category = category;
            advertise.redirect = redirect;
            advertise.image = image;
            advertise.type = type;
            advertise.remain_Views = remain_Views;
            advertise.status = status;

            const updatedAdvertise = await advertise.save();
            if (updatedAdvertise) {
                res.status(200).json({ message: "Advertise updated successfully :)" });
            } else {
                db.collection

                res.status(400).json({ error_message: "Failed to update Advertise. Please try again." });
            }
        }
        
    } catch (err) {
        next(err);
        console.error('Error updating Advertise:', err);
        res.status(500).json({ message: "Internal server error !" });
    }
});

//-------- Change Status of Advertise ----------

const changeState=errorHandler(async(req,res,next)=>{
    
    try {    
        const {_id, status} = req.body;
        const advertise = await advertiseModel.findById(_id);
        if(!advertise){
            res.status(404).json({ error_message: "Advertise not found !" });
        }
        advertise.status = status;
        const updatedAdvertise = await advertise.save();
        if (updatedAdvertise) {
            res.status(200).json({ message: "Advertise state updated successfully :)" });
        } else {
            res.status(400).json({ error_message: "Failed to update Advertise state. Please try again." });
        }
        
    } catch (error) {
        next(error);
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
// const watchAdvertise=errorHandler(async(req,res,next)=>{
//     try {
//         const {id} = req.body;
//         const advertise = await advertiseModel.findById(id);

//         if (advertise.remain_Views == 0) {
//             advertise.approve = false;
//             advertise.status = "history";
//             await advertise.save();
//             res.status(200).json({ message: "This advertise is dissable" });
//         } else {
//             advertise.remain_Views -= 1;
//             if (advertise.remain_Views == 0) {
//                 advertise.transactionId = "";
//                 advertise.amount = 0;
//                 advertise.status = "history";
//                 await advertise.save();
//                 res.status(200).json({ message: "This advertise is dissable" });
//             }
//         }

//         const updatedAdvertise = await advertise.save();
//         if (updatedAdvertise) {
//             res.status(200).json({ message: "current remain views :-  "+advertise.remain_Views });
//         } else {
//             res.status(400).json({ error_message: "Failed to decrise Advertise views. Please try again." });
//         }       

//     } catch (error) {
//         next(error);
//         res.status(500).json({ message: "Internal server error !" });
//     }

// });

const getRandomDocument = errorHandler(async (req, res, next) => {
    try {
        const appID = req.headers["appid"];
        const randomDocument = await advertiseModel.aggregate([{ $match: { status: "ongoing" } }, { $sample: { size: 1 } }]);
        
        if (randomDocument.length === 0) {
            res.status(200).json({ message: "No Advertise Available" });
        } else {
            let adv = randomDocument[0];

            // Minus From Advertise
            adv.remain_Views -= 1;
            console.log(adv.remain_Views);

            if (adv.remain_Views === 0) { 
                adv.status = "history";
            }

            // Save the updated document back to the database
            const updatedAdvertise = await advertiseModel.findByIdAndUpdate(adv._id, adv);
            if (!updateAdveritse) {
                res.status(200).json({ message: "Advertise is not update" });
            } else {
                if (appID) {
                    const app = await applicationModel.findById(appID);
                    if (!app){
                        res.status(200).json({ message: "This application is not registered" }); 
                    }
                    app.total_Views += 1;
                    await app.save();
                    res.send(adv);
                }else{
                    res.status(200).json({ message: "Missing Headers Application Id" }); 
                }
                
            }
        }
    } catch (error) {
        next(error);
        res.status(500).json({ message: "Internal server error!" });
    }
});

const advertiseClicked = errorHandler(async (req, res, next) => {
    try {
        const appID = req.headers["appid"];
        if (!appID){
            res.status(200).json({ message: "Missing Headers Application Id" }); 
        }else{
            const app = await applicationModel.findById(appID);
            app.totalClicks += 1;

            const clicked = await app.save();
            if(clicked){
                res.status(200).json({ message: "Advertise Click Saved" }); 
            }else{
                res.status(200).json({ message: "Fail to save advertise click" }); 
            }


        }
    } catch (error) {
        next(error);
        res.status(500).json({ message: "Internal server error!" });
    }
});




module.exports={createAdvertise, getAllAdvertise, updateAdveritse, deleteAdvertise, getAdvertise, changeState, getRandomDocument, advertiseClicked};


