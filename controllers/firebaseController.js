const userModel=require("../models/userModel");
const db = require("../config/firebaseConnection");
const { getFirestore, collection, getDocs }=require('firebase/firestore/lite');
const errorHandler=require("express-async-handler");




const getAllAdvertisers=errorHandler(async(req,res,next)=>{
    try {
        console.log("Jami ***")
        const myCollection = collection(db, 'Advertisers');
        const snapShot = await getDocs(myCollection);
        const datalist = snapShot.docs.map(doc => doc.data());
       
        if (datalist.length>0) {
            res.send(datalist);
        }
        else{
            res.status(404).json({error_message:"No data found !"});
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});
const getAllPublishers=errorHandler(async(req,res,next)=>{
    try {
        console.log("Jami ***")
        const myCollection = collection(db, 'Publishers');
        const snapShot = await getDocs(myCollection);
        const datalist = snapShot.docs.map(doc => doc.data());
       
        if (datalist.length>0) {
            res.send(datalist);
        }
        else{
            res.status(404).json({error_message:"No data found !"});
        }
    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error !" });
    }
});

module.exports={getAllAdvertisers, getAllPublishers};

