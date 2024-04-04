const errorHandler = require("express-async-handler");
const publisherChartModel = require("../models/publisherChartModel");

//-------- get all plans ----------
const getMainTotalEarning=errorHandler(async(req,res,next)=>{
    try {
        const {id}=req.body;

        const mainEarning = await publisherChartModel.findOne({publisherId: id, platformId: "Main"});

        if (!mainEarning) {
            res.status(404).json({error_message:"No Earning data available !"});
        } else{
            res.send(mainEarning);
        }

    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


//-------- get all plans ----------
const getPlatformEarning=errorHandler(async(req,res,next)=>{
    try {
        const {id}=req.body;
        const plans = await publisherChartModel.find({ publisherId: id, platformId: { $ne: "Main" } });
        if (!plans) {
            res.status(404).json({error_message:"No Earning data available !"});
        } else{
            res.send(plans);
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


module.exports={getMainTotalEarning, getPlatformEarning};
