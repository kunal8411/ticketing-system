import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { OrderCancelledListener } from "./events/listeners/OrderCancelledListener";
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";
import { natsWrapper } from "./NatsWrapper";
import { errorHandler, currentUser } from "@kkticketing01/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //because we are not encrypting the cookie
    secure: true,
  })
);

app.use(currentUser);

app.use(createChargeRouter)
const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen(); 
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongodb");

  } catch (err) {
    console.log("Error connecting to Mongodb");
  }
  app.listen(3000, () => {
    console.log("Listening on 3000!");
  });
};

start();
