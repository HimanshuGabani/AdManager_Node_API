const { application } = require("express");
const advertiseModel = require("../models/advertiseModel");
const applicationModel = require("../models/applicationRegisterModel");
const publisherChart = require("../models/publisherChartModel");
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
        const {id, title,category,redirect,image,type } = req.body;
        
        if (!id || !title || !category || !redirect || !image || !type) {
            res.status(400).json({ error_message: "All fields are required !" });
        }
        const advertise = await advertiseModel.findById(id);

        if (!advertise) {
            res.status(404).json({ error_message: "Advertise not found !" });
        }else{  
            advertise.title = title;
            advertise.category = category;
            advertise.redirect = redirect;
            advertise.image = image;
            advertise.type = type;
            advertise.status = "pending";

            const updatedAdvertise = await advertise.save();
            if (updatedAdvertise) {
                console.log(updatedAdvertise);
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

//-------- Change Status of Advertise ----------

const changeState=errorHandler(async(req,res,next)=>{
    
    try {    
        const {_id, status, approve} = req.body;
        const advertise = await advertiseModel.findById(_id);
        if(!advertise){
            res.status(404).json({ error_message: "Advertise not found !" });
        }
        
        advertise.status = status;
        advertise.approve = approve;


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
            console.log({remainViews: adv.remain_Views});

            if (adv.remain_Views <= 0) { 
                adv.status = "history";
            }

            // Save the updated document back to the database
            const updatedAdvertise = await advertiseModel.findByIdAndUpdate(adv._id, adv);
            if (!updatedAdvertise) {
                res.status(200).json({ message: "Advertise is not update" });
            } else {
                if (appID) {
                    const app = await applicationModel.findById(appID);
                    if (!app){
                        res.status(200).json({ message: "This application is not registered" }); 
                    }
                    const publisherId = app.publisherId;
                    const chartData = await publisherChart.findOne({ publisherId: publisherId, platformId: "Main" });
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleDateString('en-GB');
                    if (!chartData) {
                        const mainOne=await publisherChart.create({
                            publisherId,
                            platformId: "Main",
                            earning: 1,
                            date: formattedDate

                        });
                        
                        const createOne=await publisherChart.create({
                            publisherId,
                            platformId: app._id,
                            earning: 1,
                            date: formattedDate
                        });

                        if (!createOne || !mainOne) {
                            res.status(400).json({error_message:" Chart Data not create error !"});
                        }

                    }else{
                        const curretDayChart = await publisherChart.findOne({ publisherId: publisherId, platformId: app._id, date: formattedDate });
                        if (!curretDayChart) {
                            const createOne=await publisherChart.create({
                                publisherId,
                                platformId: app._id,
                                earning: 1,
                                date: formattedDate
                            });

                            if (!createOne) {
                                res.status(400).json({error_message:" Chart Data not create error !"});
                            }
                        }else{
                            curretDayChart.earning += 1;
                            await curretDayChart.save();
                        }
                        chartData.earning += 1;
                        await chartData.save();
                    }
                    app.total_Views += 1;
                    app.totalEarn += 1;
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
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('en-GB');

            const app = await applicationModel.findById(appID);
            app.totalClicks += 1;
            app.totalEarn += 2;
            const clicked = await app.save();


            const publisherId = app.publisherId;
            const chartData = await publisherChart.findOne({ publisherId: publisherId, platformId: "Main" });
            const curretDayChart = await publisherChart.findOne({ platformId: app._id, date: formattedDate });

            
            chartData.earning += 2;
            curretDayChart.earning += 2;

            await curretDayChart.save();
            await chartData.save();

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


