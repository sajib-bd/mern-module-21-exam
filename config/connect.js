import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongodb connection");
  } catch (error) {
    console.log("Mongoose Connection Failed");
  }
};

export default connect;
