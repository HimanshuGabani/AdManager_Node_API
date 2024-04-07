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

//-------- update Advertise ----------
const updatePlans = errorHandler(async (req, res, next) => {
    try {
        const {id} = req.body;
        
        if (!id) {
            res.status(400).json({ error_message: "Id Must required !" });
        }
        const Plan = await adv_plansModel.findById(id);

        if (!Plan) {
            res.status(404).json({ error_message: "Advertise not found !" });
        }else{ 
            Plan.status = "Inactive";

            const updatedAdvertise = await Plan.save();
            if (updatedAdvertise) {
                res.status(200).json({ message: "Plan updated successfully :)" });
            } else {
                res.status(400).json({ error_message: "Failed to update Plan. Please try again." });
            }
        }
        
    } catch (err) {
        next(err);
        console.error('Error updating Advertise:', err);
        res.status(500).json({ message: "Internal server error !" });
    }
});



module.exports={createPlans, getAllPlans, updatePlans};


