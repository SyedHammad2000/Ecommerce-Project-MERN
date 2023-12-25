import color from "colors";


import mongoose from "mongoose";

const uri = "mongodb+srv://hammad:imran@hammad.cxhsbcc.mongodb.net/Ecommerce";

const ConnectDb = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`.bgMagenta);
  } catch (error) {
    console.log(`Error${error}`.bgMagenta);
  }
};




export default ConnectDb;
