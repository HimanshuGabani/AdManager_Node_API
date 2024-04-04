const transectionModel=require("../models/transectionModel");
const advertiseModel = require("../models/advertiseModel");
const applicationModel=require("../models/applicationRegisterModel");
const crypto = require("crypto");
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
            if (isAdvertisExist.status === "history" || isAdvertisExist.status === "ongoing"){
                isAdvertisExist.status = "ongoing"    
            }else{
                isAdvertisExist.status = "pending"
            }

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


const totalExpense=errorHandler(async(req,res,next)=>{

    try {
        const {advertiserId}=req.body;   


        const totalExpense = await transectionModel.aggregate([
            {
                $match: {
                    advertiserId: advertiserId
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$amount" }
                }
            }
        ]);

        if (!totalExpense) {
            res.status(404).json({error_message:"No Transections Availabel !"});
        } else{
            res.send(totalExpense);
        }

    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});



const totalEarning = errorHandler(async(req,res,next)=>{

    try {
        const {publisherId}=req.body;   
        const totalEarning = await applicationModel.aggregate([
            {
                $match: {
                    publisherId: publisherId
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarning: { $sum: "$totalEarn" }
                }
            }
        ]);

        if (!totalEarning) {
            res.status(404).json({error_message:"No Earning !"});
        } else{
            res.send(totalEarning);
        }

    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


const currentBalance = errorHandler(async(req,res,next)=>{

    try {
        const {publisherId}=req.body;   

        if (!publisherId) {
            res.status(500).json({ message: "All fileds requiered!" });
        }

        const totalEarning = await applicationModel.aggregate([
            {
                $match: {
                    publisherId: publisherId
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarning: { $sum: "$totalEarn" }
                }
            }
        ]);
        const totalwithdrawal = await transectionModel.aggregate([
            {
                $match: {
                    publisherId: publisherId
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarning: { $sum: "$amount" }
                }
            }
        ]);

        if (totalEarning == []) {
            totalEarning = 0;
            res.send(totalEarning);
        }

        var currentBalance = {balance:0};
        if(totalwithdrawal.length === 0) {
            currentBalance.balance = totalEarning[0].totalEarning - 0;
        }else{
            currentBalance.balance = totalEarning[0].totalEarning - totalwithdrawal[0].totalEarning;
        }

        res.send(currentBalance);


    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});

const withdrawal=errorHandler(async(req,res,next)=>{
    try {
        const {publisherId, amount}=req.body;   

        if (!publisherId || !amount) {
            res.status(500).json({ message: "All fileds requiered!" });
        }

        const totalEarning = await applicationModel.aggregate([
            {
                $match: {
                    publisherId: publisherId
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarning: { $sum: "$totalEarn" }
                }
            }
        ]);
        const totalwithdrawal = await transectionModel.aggregate([
            {
                $match: {
                    publisherId: publisherId
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarning: { $sum: "$amount" }
                }
            }
        ]);

        if (totalEarning == []) {
            totalEarning = 0;
            res.send(totalEarning);
        }

        var currentBalance = {balance:0};
        if(totalwithdrawal.length === 0) {
            currentBalance.balance = totalEarning[0].totalEarning - 0;
        }else{
            currentBalance.balance = totalEarning[0].totalEarning - totalwithdrawal[0].totalEarning;
        }

        // console.log(totalEarning[0].totalEarning, totalwithdrawal ,currentBalance, amount);

        if (currentBalance.balance<amount) {
            res.status(500).json({ message: "You have no enough amount" });
        }else{
            const transactionId = crypto.randomBytes(16).toString("hex")
            const createOne=await transectionModel.create({

                publisherId,
                transactionId,
                amount,
                type: "Debit"
            },);
            if(!createOne){
                res.status(500).json({ message: "Fail to withdrawal" });
            }else{
                res.status(500).json({ message: "Withdrawal Successfully", transaction_id: transactionId, currentBalance: currentBalance.balance-amount });
            }
        }


    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});


module.exports={purcheseAdvertise, getAllTransections, totalExpense, totalEarning, currentBalance, withdrawal};


