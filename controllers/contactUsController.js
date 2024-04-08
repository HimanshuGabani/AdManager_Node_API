const errorHandler = require("express-async-handler");
const contactUsModel = require("../models/ContactUsModel");

//-------- create new plan ----------
const createMessage=errorHandler(async(req,res)=>{
    try {
        const {userId, roll, title, detail, email, mobile}=req.body;

        if(!userId || !roll || !title || !detail || !email || !mobile){
            res.status(400).json({error_message:"all filds are requier !"});
        }else{
            const createOne=await contactUsModel.create({
                userId,
                roll,
                title,
                detail,
                email,
                mobile
            });
            if (createOne) {
                res.status(200).json({success_message: "New Report created successfully)"});
            }else{
                res.status(400).json({error_message:"Report data are invalid !"});
            }
        }
        }catch (err) {
            console.error('Error registering advertise:', err);
            res.status(500).json({ message: "Internal server error !" });
        }
},);



const approveMessage=errorHandler(async(req,res)=>{
    try {
        const {id}=req.body;

        if(!id){
            res.status(400).json({error_message:"messageId must requier !"});
        }else{
            
            const createOne = await contactUsModel.findById(id);
            if (createOne) {
                createOne.answer = true;
                const done = await createOne.save();
                res.status(200).json({ message: "Query solved successfully)" });
            }else{
                res.status(400).json({error_message:"Query not found on this id!"});
            }
        }
        }catch (err) {
            res.status(500).json({ message: "Internal server error !" });
        }
},);




const getAllMessage=errorHandler(async(req,res)=>{
    try {
        const createOne = await contactUsModel.find();
        if (createOne) {
            res.send(createOne);
        }else{
            res.status(400).json({error_message:"No data found!"});
        }
        
        }catch (err) {
            res.status(500).json({ message: "Internal server error !" });
        }
},);


const getPendingMessage=errorHandler(async(req,res)=>{
    try {
        const createOne = await contactUsModel.find({answer:false});
        if (createOne) {
            res.send(createOne);
        }else{
            res.status(400).json({error_message:"No data found!"});
        }
        
        }catch (err) {
            res.status(500).json({ message: "Internal server error !" });
        }
},);

module.exports={createMessage, approveMessage, getAllMessage, getPendingMessage};
