import mongoose from "mongoose";

const connect = async () => {
  try {
    //Mongodb Connection Established
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongodb connection");
  } catch (error) {
    //connection failed console message
    console.log("Mongoose Connection Failed");
  }
};

export default connect;
