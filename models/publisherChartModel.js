const mongoose=require("mongoose");



const publisherChartSchema=mongoose.Schema({
    
    publisherId: {
        type: String,
        required: true
    },
    platformId: {
        //Common :- Main 
        // or 
        // perticuler:- PlatformId
        
        type: String,
        required: true
    },

    earning: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        required: true
    }
});

module.exports=mongoose.model("publisherChart",publisherChartSchema);