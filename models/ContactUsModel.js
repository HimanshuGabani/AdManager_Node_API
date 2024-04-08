const mongoose=require("mongoose");



const contactusSchema=mongoose.Schema({
    
    userId: {
        type: String,
        required: true
    },

    roll: {
        type: String,
        enum: ['Publisher', 'Advertiser']
    },
    
    title: {
        type: String,
        required: true
    },
    
    detail: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    answer: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps:true,
    },
);


module.exports=mongoose.model("contactUs",contactusSchema);