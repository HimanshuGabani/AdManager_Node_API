const mongoose=require("mongoose");



// const previous_Plans = mongoose.Schema({
//     price: {
//         type: Number,
//         required: true
//     },
//     views: {
//         type: Number,
//         required: true
//     },

//     transectionId: {
//         type: String,
//         required: true
//     },

//     date: {
//         type: String,
//         required: true
//     }

// });


const advertiseSchema=mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    advertiserId: {
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

    category: {
        type: String,
        required: true
    },

    transactionId: {
        type: String,
        default: ""
    },

    amount: {
        type: Number
    },

    remain_Views: {
        type: Number,
        default: 0,
        required: true
    },
    
    status: {
        type: String,
        enum: ['ongoing', 'pending', 'history'],
        default: 'pending'
    },

    approve: {
        type: Boolean,
        // required: true,
        default: true
    }
},
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("advertises",advertiseSchema);