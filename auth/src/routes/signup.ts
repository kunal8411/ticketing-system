import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidatorError } from "../errors/request-validator-error";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  // express-validator syntax
  [
    body("email").isEmail().withMessage("EMail must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be inbetween 4 to 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }
    // build method return new User()  for typescript check we have used this
    const user = User.build({ email, password });

    await user.save();

    //generate jwt
    // process.env.JWT_KEY!, !=> tells the TS that we are sure that we already checked the JWT_KEY in the index.ts so we are 100% confident that this will not be null.
    const jsonWebToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    //store in the cookie session , to use cookie session in the documents they mentioned to add in the req.session.['key]
    req.session = {
      jwt: jsonWebToken,
    };
    return res.status(200).send( user );
  }
);

export { router as signUpRouter };
