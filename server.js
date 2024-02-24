const express=require("express");
const connectDb=require("./config/dbConnection");
require("dotenv").config();
const cors=require("cors");

const app=express();
connectDb();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/user",require("./routes/userRoute"));




app.listen(port,()=>{
    console.log(`server running on port '${port}'`)
});