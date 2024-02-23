const mongoose=require("mongoose");


const userSchema=mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: String
    },
    profileImg: {
        type: String
    },
    role: {
        type: String,
        enum: ['Publisher', 'Advertiser', 'Admin'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastSignIn: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Disable'],
        default: 'Active'
    },
    forgetPassword: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("Users",userSchema);