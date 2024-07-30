import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

import { body, validationResult } from "express-validator";

//check if current user is logged in or not i.e. authentication
router.get(
  "/api/users/currentuser",

  (req: Request, res: Response) => {
    // we have used cookie-session, thats why the cookie will be inside req.session
    if (!req.session?.jwt) {
      return res.send({ currentUser: null });
    }
    try {
      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
      res.send({ currentUser: payload });
    } catch (error) {
      return res.send({ currentUser: null });
    }
  }
);

export { router as currentUserRouter };
