import { ExpressValidator, ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";
export class BadRequestError extends CustomError {
  statusCode = 400;
  
  constructor(public message:string) {
    // will not send this to FE, just for backend logs

    super(message);

    // because we are exporting built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}