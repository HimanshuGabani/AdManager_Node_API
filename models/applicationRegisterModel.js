const mongoose=require("mongoose");



const applicaitonSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    publisherId: {
        type: String,
        required: true
    },
    bundleId: {
        type: String,
        required: true
    },

    redirect: {
        type: String,
        default: ""
    },

    catagory: {
        type: String,
        required: true
    },
    
    total_Views: {
        type: Number,
        default: 0,
        required: true
    },

    totalClicks: {
        type: Number,
        default: 0,
        required: true
    },

    totalEarn: {
        type: Number,
        default: 0,
        required: true
    }


},
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("applicationsRegister",applicaitonSchema);