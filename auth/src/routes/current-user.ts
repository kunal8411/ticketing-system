import express, { Request, Response } from "express";

const router = express.Router();

import { currentUser } from "@kkticketing01/common";

//check if current user is logged in or not i.e. authentication
router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
