import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/Auths.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to Database!");
    })
    .catch((error) => {
      throw error;
    });
};

app.use((request, response, next) =>{
  response.header("Access-Control-Allow-Credentials", true);
  next();
})


//Middlewares
app.use(cors({
  origin: "https://brainstormforce-app.netlify.app"
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);


//error handler middleware
app.use((error, request, response, next) =>{
    const status= error.status || 500;
    const message= error.message || "Something went wrong!";
    return response.status(status).json({
        success: false,
        status: status,
        message: message
    })
})

app.listen(8888, () => {
  connect();
  console.log("Connected to Server");
});
