const mongoose=require("mongoose");



const previous_Plans = mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }

});


const advertiseSchema=mongoose.Schema({
    titel: {
        type: String,
        required: true
    },
    advertiser_id: {
        type: String,
        required: true
    },
    redirect: {
        type: String,

    },
    image: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },
    previous_plans: [ previous_Plans ],

    remain_Views: {
        type: Number,
        required: true
    },
    
    status: {
        type: String,
        enum: ['Active', 'Disable'],
        default: 'Active'
    },

    approve: {
        type: Boolean,
        required: true
    }
},
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("advertise",advertiseSchema);