import mongoose from "mongoose";

const connectDb=async ()=>{
    try{
        await mongoose.connect(String(process.env.MONGO_URI));
        console.log("DB connected");
    }catch(err){
        console.log("DB connection failed: ",err);
    }
}

export default connectDb;