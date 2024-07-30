import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
    //as per cookie-session documentation we just need to add null in req.session and that will work for us
  req.session = null;
  res.send({});
});

export { router as signOutRouter };
