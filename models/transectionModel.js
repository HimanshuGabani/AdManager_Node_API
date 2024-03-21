const mongoose=require("mongoose");

const transectionSchema=mongoose.Schema({
    publisherId: {
        type: String

    },

    advertisId: {
        type: String
    },

    advertiserId: {
        type: String
    },

    transactionId: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ['Credit', 'Debit']
    }

},
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("transections",transectionSchema);