import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { errorHandler } from "@kkticketing01/common";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //because we are not encrypting the cookie
    secure: true,
  })
);


app.use(errorHandler); //this middleware applicable for each route

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    // tickets-mongo-srv is the service to connect to the tickets-mongo-depl deployment and then to docker file of mongo
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongodb");
  } catch (error) {
    console.log("Error connecting to Mongodb");
  }
  app.listen(3000, () => {
    console.log("Listening on 3000!");
  });
};
start();
