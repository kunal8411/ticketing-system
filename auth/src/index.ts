import express from "express";
import 'express-async-errors'
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
const app = express();

app.use(json());


// with async keyword we cant directly throw error we need to use next while throwing error
app.all("*", async (req,res,next) => {
   throw new NotFoundError();
});

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on 3000!!!!--");
});
