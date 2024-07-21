import express, { Request, Response } from "express";

const router = express.Router();

import { body, validationResult } from "express-validator";

router.get(
  "/api/users/currentuser",

  (req: Request, res: Response) => {
    res.send({ Messate: "Hi There" });
  }
);

export { router as currentUserRouter };
