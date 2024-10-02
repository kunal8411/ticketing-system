import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { errorHandler , currentUser} from "@kkticketing01/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
import { natsWrapper } from "./NatsWrapper";
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";
import { OrderCancelledListener } from "./events/listeners/OrderCancelledListener";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //because we are not encrypting the cookie
    secure: true,
  })
);

app.use(currentUser)


app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
// app.use(createTicketRouter)

app.use(errorHandler); //this middleware applicable for each route

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  try {

    //NATS STREAMING CONNECTION 
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());


    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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
