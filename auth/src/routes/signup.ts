import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidatorError } from "../errors/request-validator-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("EMail must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be inbetween 4 to 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array())
    }
    const { email, password } = req.body;
    console.log("CREATING THE USER");

    throw new DatabaseConnectionError();

    // throw new NotFoundError()

    res.send({});
  }
);

export { router as signUpRouter };
