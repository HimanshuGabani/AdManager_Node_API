const applicationModel=require("../models/applicationRegisterModel");
const errorHandler=require("express-async-handler");


//-------- Register New Application ----------
const registerNewApplication=errorHandler(async(req,res)=>{
    try {
        const {name, publisherId, bundleId, catagory, redirect }=req.body;

        const isBundelExist = await applicationModel.findOne({bundleId});


        if(!name || !publisherId || !bundleId || !catagory){
            res.status(400).json({error_message:"Some fields are missing!"});
        }else if(isBundelExist){
            res.status(400).json({error_message:"This applicaiton is already registered!"});
        }else{
            const createOne=await applicationModel.create({
                name,
                publisherId,
                bundleId,
                catagory,
                redirect
            },);
            if (createOne) {
                res.status(200).json({createOne});
            }else{
                res.status(400).json({error_message:"Application Information data are invalid !"});
            }
        }
        } catch (err) {
            console.error('Error registering advertise:', err);
            res.status(500).json({ message: "Internal server error !" });
        }
});

module.exports={registerNewApplication};


