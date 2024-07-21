import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

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
      if(!errors.isEmpty()){
          return res.status(400).send(errors.array())
      }
      const {email, password} = req.body;
      console.log("CREATING THE USER")
     
  
      res.send({});
    }
  );

export {router as signUpRouter}