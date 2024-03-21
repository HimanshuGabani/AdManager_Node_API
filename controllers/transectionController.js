const transectionModel=require("../models/transectionModel");
const advertiseModel = require("../models/advertiseModel");
const errorHandler=require("express-async-handler");

//-------- create Advertis ----------
const purcheseAdvertise=errorHandler(async(req,res)=>{
    try {
        const {advertisId, advertiserId,transactionId,amount,type,views}=req.body;    

        const transExistalredy = await transectionModel.findOne({ transactionId });
        const isAdvertisExist = await advertiseModel.findById(advertisId);

        if(!advertisId || !advertiserId || !transactionId || !amount || !type || !views){
            res.status(400).json({error_message:"Some fields are missing!"});
        }else if(transExistalredy){
            res.status(400).json({error_message:"This transection id already used!"});
        }else if(!isAdvertisExist){
            res.status(400).json({error_message:"No Advertise found with this Ads Id!"});
        }else{
            const createOne=await transectionModel.create({
                advertisId,
                transactionId,
                advertiserId,
                amount,
                type
            },);

            isAdvertisExist.transactionId = transactionId;
            isAdvertisExist.remain_Views += views;
            isAdvertisExist.amount = amount;
            isAdvertisExist.status = "ongoing"

            const adUpdated = await isAdvertisExist.save();
            if (!adUpdated){
                res.status(200).json({success_message:"Advertise not update"});
            }

            if (createOne) {
                res.status(200).json({success_message:"transection made successfully :)"});
            }else{
                res.status(400).json({error_message:"transection fail !"});
            }
        }
        }catch (err) {
            console.error('Error registering advertise:', err);
            res.status(500).json({ message: "Internal server error !" });
        }
});


//-------- get all Transections ----------
const getAllTransections=errorHandler(async(req,res,next)=>{
    try {
        const trans = await transectionModel.find();
        if (!trans) {
            res.status(404).json({error_message:"No Transections Availabel !"});
        } else{
            res.send(trans);
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


module.exports={purcheseAdvertise, getAllTransections};


