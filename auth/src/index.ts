import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler,NotFoundError } from "@kkticketing01/common";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //because we are not encrypting the cookie
    secure: true,
  })
);

// with async keyword we cant directly throw error we need to use next while throwing error
// app.all("*", async (req, res, next) => {
//   throw new NotFoundError();
// });

console.log("TESING GITHUB ACTION")

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.use(errorHandler); //this middleware applicable for each route

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    // auth-mongo-srv is the service to connect to the auth-mongo-depl deployment and then to docker file of mongo
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
