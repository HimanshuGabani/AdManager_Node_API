const errorHandler = require("express-async-handler");
const adv_plansModel = require("../models/adv_plansModel");

//-------- create new plan ----------
const createPlans=errorHandler(async(req,res)=>{
    try {
        const {name, views, price, type}=req.body;

        if(!name || !views || !price || !type){
            res.status(400).json({error_message:"all filds are requier !"});
        }else{
            const createOne=await adv_plansModel.create({
                name,
                views,
                price,
                type,
                status : "Active"
            });
            if (createOne) {
                res.status(200).json({success_message: "New plan added successfully :)"});
            }else{
                res.status(400).json({error_message:"Advertise plan data are invalid !"});
            }
        }
        }catch (err) {
            console.error('Error registering advertise:', err);
            res.status(500).json({ message: "Internal server error !" });
        }
},);

//-------- get all plans ----------
const getAllPlans=errorHandler(async(req,res,next)=>{
    try {
        const plans = await adv_plansModel.find();
        if (!plans) {
            res.status(404).json({error_message:"No Advertise plans Availabel !"});
        } else{
            res.send(plans);
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});

module.exports={createPlans, getAllPlans};


