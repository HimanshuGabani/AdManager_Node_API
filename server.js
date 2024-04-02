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
app.use("/plans", require("./routes/adv_plansRouts"));
app.use("/advertise", require("./routes/advertiseRoute"));
app.use("/transaction", require("./routes/transectionRouts"));
app.use("/application", require("./routes/applicationRegisterRoute"));
app.use("/fire", require("./routes/fireRout"));

app.use("/images", require("./routes/imageuploadRouter"));



app.listen(port,()=>{
    console.log(`server running on port '${port}'`)
});