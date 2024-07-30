import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { RequestValidatorError } from "../errors/request-validator-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply password"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const isPassswordMatch = await Password.compare(
      existingUser.password,
      password
    );
    
    if (!isPassswordMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    //generate jwt
    // process.env.JWT_KEY!, !=> tells the TS that we are sure that we already checked the JWT_KEY in the index.ts so we are 100% confident that this will not be null.
    const jsonWebToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    //store in the cookie session , to use cookie session in the documents they mentioned to add in the req.session.['key]
    req.session = {
      jwt: jsonWebToken,
    };
    return res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
