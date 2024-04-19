import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

app.post('/upload-to-cloudinary', async (req, res) => {
  try {
    const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dnot4vk2i/image/upload', req.body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': req.headers.authorization 
      }
    });
    res.json(cloudinaryResponse.data);
  } catch (error) {
    console.error('Error while uploading to Cloudinary:', error);
    res.status(500).json({ error: 'An error occurred while uploading to Cloudinary' });
  }
});


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
