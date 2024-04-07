const mongoose=require("mongoose");

const adv_plansModel=mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    views: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
},
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("adv_plans",adv_plansModel);


